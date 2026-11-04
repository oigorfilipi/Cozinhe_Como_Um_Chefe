import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App.jsx';
import { ingredients, recipeById, recipes } from './data.js';
import {
  compatibleRecipes, formatDate, formatDuration, initialState, levelProgress,
  loadState, migrateState, reducer, STORAGE_KEY,
} from './state.js';

beforeEach(() => {
  window.localStorage.clear();
  window.matchMedia = (query) => ({ matches: false, media: query, addEventListener() {}, removeEventListener() {} });
});
afterEach(() => cleanup());

function flowState({ openingXp = 0, openedAt = 1000 } = {}) {
  let state = { ...initialState(), xp: openingXp };
  const send = (type, extra = {}) => { state = reducer(state, { type, ...extra }); return state; };
  send('TOGGLE_EQUIPMENT', { key: 'none' });
  send('VIEW_RECIPES');
  send('OPEN_WRAP', { now: openedAt });
  ingredients.forEach((_, index) => send('TOGGLE_INGREDIENT', { index }));
  send('START_RECIPE');
  return { get state() { return state; }, send };
}

async function startUiPrep(user, { seed = false } = {}) {
  if (seed) await user.click(screen.getByRole('button', { name: /Iniciar demonstração com 9 preparos/ }));
  await user.click(screen.getByRole('button', { name: 'Sem equipamento' }));
  await user.click(screen.getByRole('button', { name: 'Ver receitas' }));
  await user.click(within(screen.getByRole('article', { name: 'Wrap frio' })).getByRole('button', { name: 'Ver ingredientes' }));
  for (const ingredient of ingredients) await user.click(screen.getByRole('checkbox', { name: ingredient }));
  await user.click(screen.getByRole('button', { name: 'Começar receita' }));
}

describe('níveis, filtro e formatação', () => {
  it('oferece dez receitas por aparelho e mais de dez sem aquecimento', () => {
    for (const equipment of ['stove', 'fryer', 'oven', 'microwave', 'electricPot']) {
      const group = recipes.filter((recipe) => recipe.equipment === equipment);
      expect(group).toHaveLength(10);
      expect(group.filter((recipe) => recipe.difficulty === 'simple')).toHaveLength(5);
      expect(group.filter((recipe) => recipe.difficulty === 'elaborate')).toHaveLength(5);
    }
    expect(recipes.filter((recipe) => recipe.equipment === null).length).toBeGreaterThan(10);
    expect(new Set(recipes.map((recipe) => recipe.id)).size).toBe(recipes.length);
  });

  it.each([
    [0, 1, 0, 100], [99, 1, 99, 100], [100, 2, 0, 200],
    [299, 2, 199, 200], [300, 3, 0, 300], [599, 3, 299, 300],
    [600, 4, 0, 400], [999, 4, 399, 400], [1000, 5, 0, 500],
    [1080, 5, 80, 500], [1500, 6, 0, 600],
  ])('XP %i resulta em nível %i, progresso %i/%i', (xp, level, current, required) => {
    expect(levelProgress(xp)).toMatchObject({ level, current, required });
  });

  it('combina busca por nome e filtro de equipamentos, ignorando acentos e espaços', () => {
    const equipment = { ...initialState().equipment, microwave: true, oven: true };
    expect(compatibleRecipes(equipment)).toHaveLength(32);
    expect(compatibleRecipes(equipment, '  BÓLO DE CANECA  ').map((item) => item.name)).toEqual(['Bolo de caneca de chocolate']);
    expect(compatibleRecipes(equipment, 'omelete')).toEqual([]);
    expect(formatDuration(300000)).toBe('5:00');
    expect(formatDuration(3600000)).toBe('1:00:00');
    expect(formatDate(null)).toBe('Data não registrada');
  });
});

describe('persistência e pontuação', () => {
  it('migra V1 com progresso pausado e registros sem datas inventadas', () => {
    const old = {
      version: 1, screen: 'recipes', equipment: { stove: true, fryer: false, none: false },
      prep: { stage: 'step', checked: [true, true, true, true], stepIndex: 1, validated: [true, false, false, false], hintOpen: true },
      pauseOpen: false, xp: 245, completed: 2, achievements: { wrap: 2 }, latestCompletion: null,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(old));
    const migrated = loadState();
    expect(migrated.version).toBe(3);
    expect(migrated.xp).toBe(245);
    expect(migrated.completed).toBe(2);
    expect(migrated.achievements.wrap).toBe(2);
    expect(migrated.equipment.stove).toBe(true);
    expect(migrated.equipment.oven).toBe(false);
    expect(migrated.prep).toMatchObject({ recipeId: 'wrap', stage: 'step', stepIndex: 1, hintOpen: true, stepXp: [5, 0, 0, 0], xpAtOpen: 240 });
    expect(migrated.records).toHaveLength(2);
    expect(migrated.records.every((record) => record.kind === 'legacy' && record.completedAt === null && record.durationMs === null && record.xpEarned === 120)).toBe(true);
    expect(migrateState({ ...migrated, screen: 'complete' }).screen).toBe('records');
  });

  it('desconta a primeira Dica uma vez, reduz etapas atuais e futuras, e reinicia no novo preparo', () => {
    const flow = flowState();
    flow.send('VALIDATE_STEP');
    flow.send('NEXT_STEP');
    expect(flow.state.xp).toBe(5);
    flow.send('REQUEST_ADJUSTMENT');
    expect(flow.state.xp).toBe(4);
    flow.send('CLOSE_ADJUSTMENT');
    flow.send('REQUEST_ADJUSTMENT');
    expect(flow.state.xp).toBe(4);
    for (let index = 1; index < 4; index += 1) {
      flow.send('VALIDATE_STEP');
      flow.send('VALIDATE_STEP');
      if (index < 3) flow.send('NEXT_STEP');
    }
    expect(flow.state.prep.stepXp).toEqual([5, 4, 4, 4]);
    expect(flow.state.xp).toBe(16);
    flow.send('FINISH_RECIPE', { now: 61000 });
    flow.send('FINISH_RECIPE', { now: 62000 });
    expect(flow.state.xp).toBe(116);
    expect(flow.state.completed).toBe(1);
    expect(flow.state.records).toHaveLength(1);
    expect(flow.state.records[0]).toMatchObject({ completedAt: 61000, durationMs: 60000, xpEarned: 116 });
    expect(formatDate(flow.state.records[0].completedAt)).toMatch(/^\d{2}\/\d{2}\/\d{4} · \d{2}:\d{2}$/);
    expect(flow.state.latestCompletion).toMatchObject({ stepTotal: 17, tipDeduction: 1, xpEarned: 116 });
    flow.send('ANIMATIONS_DONE');
    flow.send('NAVIGATE', { tab: 'recipes' });
    flow.send('OPEN_WRAP', { now: 70000 });
    expect(flow.state.prep.tipUsed).toBe(false);
    expect(flow.state.prep.stepXp).toEqual([0, 0, 0, 0]);
  });

  it('não deixa XP negativo e mede da entrada até a conclusão, inclusive pausa e página fechada', () => {
    const flow = flowState({ openedAt: 1000 });
    flow.send('REQUEST_ADJUSTMENT');
    expect(flow.state.xp).toBe(0);
    expect(flow.state.prep.tipUsed).toBe(true);
    expect(flow.state.prep.pendingTipDeduction).toBe(1);
    flow.send('OPEN_PAUSE');
    flow.send('LEAVE_FOR_RECIPES');
    const restored = migrateState(flow.state, 30000);
    expect(restored.prep.enteredAt).toBe(1000);
    let state = reducer(restored, { type: 'OPEN_WRAP', now: 40000 });
    for (let index = 0; index < 4; index += 1) {
      state = reducer(state, { type: 'VALIDATE_STEP' });
      if (index < 3) state = reducer(state, { type: 'NEXT_STEP' });
    }
    state = reducer(state, { type: 'FINISH_RECIPE', now: 91000 });
    expect(state.records[0]).toMatchObject({ durationMs: 90000, xpEarned: 115 });
    expect(state.xp).toBe(115);
    expect(formatDuration(state.records[0].durationMs)).toBe('1:30');
  });

  it('registra o ganho líquido de 115 XP quando a Dica desconta de um saldo prévio', () => {
    const flow = flowState({ openingXp: 10 });
    flow.send('REQUEST_ADJUSTMENT');
    expect(flow.state.xp).toBe(9);
    for (let index = 0; index < 4; index += 1) {
      flow.send('VALIDATE_STEP');
      if (index < 3) flow.send('NEXT_STEP');
    }
    flow.send('FINISH_RECIPE', { now: 20000 });
    expect(flow.state.xp).toBe(125);
    expect(flow.state.records[0].xpEarned).toBe(115);
  });

  it('cria nove registros simulados na V2, sem data, e preserva o nível e o limiar de medalha', () => {
    let state = reducer(initialState(), { type: 'SEED_DEMO' });
    expect(state).toMatchObject({ xp: 1080, completed: 9, achievements: { wrap: 9 } });
    expect(levelProgress(state.xp).level).toBe(5);
    expect(state.records).toHaveLength(9);
    expect(state.records.every((record) => record.kind === 'demo' && record.completedAt === null && record.durationMs === 300000 && record.xpEarned === 120)).toBe(true);
  });

  it('prepara uma receita elaborada de fogão com cinco etapas, registro e conquista próprios', () => {
    const recipe = recipeById('frango-frito');
    let state = reducer(initialState(), { type: 'TOGGLE_EQUIPMENT', key: 'stove' });
    state = reducer(state, { type: 'VIEW_RECIPES' });
    state = reducer(state, { type: 'OPEN_RECIPE', recipeId: recipe.id, now: 1000 });
    expect(state.prep.recipeId).toBe(recipe.id);
    expect(state.prep.checked).toHaveLength(recipe.ingredients.length);
    for (let index = 0; index < recipe.ingredients.length; index += 1) state = reducer(state, { type: 'TOGGLE_INGREDIENT', index });
    state = reducer(state, { type: 'START_RECIPE' });
    for (let index = 0; index < recipe.steps.length; index += 1) {
      state = reducer(state, { type: 'VALIDATE_STEP' });
      if (index < recipe.steps.length - 1) state = reducer(state, { type: 'NEXT_STEP' });
    }
    state = reducer(state, { type: 'FINISH_RECIPE', now: 61000 });
    expect(state.xp).toBe(125);
    expect(state.records[0]).toMatchObject({ recipeId: recipe.id, recipe: recipe.name, durationMs: 60000, xpEarned: 125 });
    expect(state.achievements[recipe.id]).toBe(1);
    expect(state.latestCompletion.recipeId).toBe(recipe.id);
  });

  it('preserva preparo antigo e exige substituição explícita ao trocar de receita', () => {
    let state = reducer(initialState(), { type: 'TOGGLE_EQUIPMENT', key: 'stove' });
    state = reducer(state, { type: 'VIEW_RECIPES' });
    state = reducer(state, { type: 'OPEN_RECIPE', recipeId: 'omelete-queijo', now: 1000 });
    state = reducer(state, { type: 'OPEN_PAUSE' });
    state = reducer(state, { type: 'LEAVE_FOR_RECIPES' });
    const same = reducer(state, { type: 'OPEN_RECIPE', recipeId: 'frango-frito', now: 3000 });
    expect(same).toBe(state);
    const restored = migrateState(state, 5000);
    expect(restored.prep.recipeId).toBe('omelete-queijo');
    expect(restored.prep.enteredAt).toBe(1000);
    const switched = reducer(restored, { type: 'OPEN_RECIPE', recipeId: 'frango-frito', replace: true, now: 6000 });
    expect(switched.prep.recipeId).toBe('frango-frito');
    expect(switched.prep.enteredAt).toBe(6000);
  });
});

describe('interface e animações', () => {
  it('conclui uma receita elaborada pelo fluxo de tela e cria o registro correto', async () => {
    window.matchMedia = (query) => ({ matches: query.includes('prefers-reduced-motion'), addEventListener() {}, removeEventListener() {} });
    const user = userEvent.setup();
    const recipe = recipeById('frango-frito');
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Fogão' }));
    await user.click(screen.getByRole('button', { name: 'Ver receitas' }));
    await user.type(screen.getByRole('searchbox', { name: 'Buscar receitas' }), 'frango frito');
    await user.click(within(screen.getByRole('article', { name: recipe.name })).getByRole('button', { name: 'Ver ingredientes' }));
    expect(screen.getByText(/frango deve atingir 74 °C no centro/i)).toBeInTheDocument();
    for (const ingredient of recipe.ingredients) await user.click(screen.getByRole('checkbox', { name: ingredient }));
    await user.click(screen.getByRole('button', { name: 'Começar receita' }));
    expect(screen.getByText('Etapa 1 de 5')).toBeInTheDocument();
    for (let index = 0; index < recipe.steps.length; index += 1) {
      await user.click(screen.getByRole('button', { name: 'Deu certo' }));
      await user.click(screen.getByRole('button', { name: index === recipe.steps.length - 1 ? 'Concluir receita' : 'Próxima etapa' }));
    }
    expect(screen.getByRole('heading', { name: 'Seus registros' })).toBeInTheDocument();
    expect(screen.getByRole('article')).toHaveTextContent('Frango frito na frigideira');
    expect(screen.getByRole('article')).toHaveTextContent('125 XP');
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY)).achievements[recipe.id]).toBe(1);
  });

  it('mantém busca ao trocar de aba, limpa ao alterar equipamentos e permite editar o perfil', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Sem equipamento' }));
    await user.click(screen.getByRole('button', { name: 'Ver receitas' }));
    await user.type(screen.getByRole('searchbox', { name: 'Buscar receitas' }), 'bolo');
    expect(screen.getByText('Nenhuma receita encontrada.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Perfil' }));
    expect(screen.getByRole('heading', { name: 'Seu perfil' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Editar nome' }));
    const input = screen.getByRole('textbox', { name: 'Nome' });
    await user.clear(input);
    await user.click(screen.getByRole('button', { name: 'Salvar' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Digite um nome para continuar.');
    await user.type(input, '  Ana  ');
    await user.click(screen.getByRole('button', { name: 'Salvar' }));
    expect(screen.getByText('Ana')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Receitas' }));
    expect(screen.getByRole('searchbox', { name: 'Buscar receitas' })).toHaveValue('bolo');
    await user.click(screen.getByRole('button', { name: 'Alterar equipamentos' }));
    await user.click(screen.getByRole('button', { name: 'Micro-ondas' }));
    await user.click(screen.getByRole('button', { name: 'Ver receitas' }));
    expect(screen.getByRole('searchbox', { name: 'Buscar receitas' })).toHaveValue('');
    expect(screen.getByRole('heading', { name: 'Bolo de caneca de chocolate' })).toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY)).profileName).toBe('Ana');
  });

  it('pula uma animação por gesto, cria um só registro e abre Registros após a medalha', async () => {
    const user = userEvent.setup();
    render(<App />);
    await startUiPrep(user, { seed: true });
    for (let index = 0; index < 4; index += 1) {
      await user.click(screen.getByRole('button', { name: 'Deu certo' }));
      expect(screen.getByRole('dialog', { name: 'Etapa validada!' })).toBeInTheDocument();
      await user.click(screen.getByRole('button', { name: 'Pular' }));
      expect(screen.queryByRole('dialog', { name: 'Etapa validada!' })).not.toBeInTheDocument();
      await user.click(screen.getByRole('button', { name: index === 3 ? 'Concluir receita' : 'Próxima etapa' }));
    }
    expect(screen.getByRole('dialog', { name: 'Wrap frio pronto!' })).toBeInTheDocument();
    await user.click(screen.getByRole('dialog', { name: 'Wrap frio pronto!' }));
    expect(screen.getByRole('dialog', { name: 'Conquista recebida' })).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.getByRole('dialog', { name: 'Nova medalha: Iniciante!' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Pular' }));
    expect(screen.getByRole('heading', { name: 'Seus registros' })).toBeInTheDocument();
    expect(screen.getByLabelText('Saldo de XP: 1200')).toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY)).records).toHaveLength(10);
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY)).records[0].xpEarned).toBe(120);
  });

  it('preserva dica e entrada da receita ao pausar e recarregar, com animação reduzida sem espera', async () => {
    window.matchMedia = (query) => ({ matches: query.includes('prefers-reduced-motion'), addEventListener() {}, removeEventListener() {} });
    const user = userEvent.setup();
    const view = render(<App />);
    await startUiPrep(user);
    await user.click(screen.getByRole('button', { name: 'Dica' }));
    expect(screen.getByText('Vamos ajustar juntos')).toBeInTheDocument();
    expect(screen.getByLabelText('Saldo de XP: 0')).toBeInTheDocument();
    expect(screen.getByText(/será descontado no próximo ganho/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Pausar' }));
    await user.click(within(screen.getByRole('dialog', { name: 'Receita pausada.' })).getByRole('button', { name: 'Ir para receitas' }));
    const enteredAt = JSON.parse(window.localStorage.getItem(STORAGE_KEY)).prep.enteredAt;
    view.unmount();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Retomar receita' }));
    expect(screen.getByText('Vamos ajustar juntos')).toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY)).prep.enteredAt).toBe(enteredAt);
    await user.click(screen.getByRole('button', { name: 'Deu certo agora' }));
    expect(screen.queryByRole('dialog', { name: 'Etapa validada!' })).not.toBeInTheDocument();
    expect(screen.getByText('Etapa validada! +4 XP')).toBeInTheDocument();
    for (let index = 1; index < 4; index += 1) {
      await user.click(screen.getByRole('button', { name: 'Próxima etapa' }));
      await user.click(screen.getByRole('button', { name: 'Deu certo' }));
    }
    await user.click(screen.getByRole('button', { name: 'Concluir receita' }));
    expect(screen.getByRole('heading', { name: 'Seus registros' })).toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY)).records[0].xpEarned).toBe(115);
  });
});
