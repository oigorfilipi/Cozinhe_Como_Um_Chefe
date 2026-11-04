import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App.jsx';
import { recipeById, recipes } from './data.js';
import { copyStandardRecipe, emptyPersonalRecipe, normalizePersonalRecipe, validatePersonalRecipe } from './personal.js';
import { createBackup, initialState, loadState, migrateState, parseBackup, reducer, STORAGE_KEY } from './state.js';
import { contrastRatio, themeColors } from './theme.js';

beforeEach(() => {
  window.localStorage.clear();
  window.history.replaceState(null, '', '#/receitas');
  window.matchMedia = (query) => ({ matches: false, media: query, addEventListener() {}, removeEventListener() {} });
});
afterEach(() => cleanup());

function send(state, type, extra = {}) { return reducer(state, { type, ...extra }); }

describe('receitas pessoais e dados locais', () => {
  it('abre Minhas Receitas por endereço direto no GitHub Pages e preserva V3', () => {
    const old = {
      ...initialState(), version: 3, screen: 'recipes', xp: 345, completed: 3,
      achievements: { wrap: 2, 'omelete-queijo': 1 },
      records: [{ id: 'old', recipeId: 'wrap', recipe: 'Wrap frio', completedAt: 1000, durationMs: 2000, xpEarned: 120 }],
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(old));
    window.history.replaceState(null, '', '#/minhas-receitas');
    const state = loadState();
    expect(state).toMatchObject({ version: 4, screen: 'mine', xp: 345, completed: 3 });
    expect(state.records).toEqual(old.records);
    expect(state.achievements).toMatchObject(old.achievements);
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Minhas Receitas' })).toBeInTheDocument();
  });

  it('cria rascunho sem XP, testa e aprimora após nova versão; registro mantém o nome antigo', () => {
    let state = send(initialState(), 'NAVIGATE', { tab: 'mine' });
    state = send(state, 'OPEN_EDITOR', { context: { mode: 'new' } });
    const draft = normalizePersonalRecipe({ ...emptyPersonalRecipe(), id: 'mine-one', name: 'Meu prato' });
    state = send(state, 'SAVE_PERSONAL', { recipe: draft, test: false, changed: true });
    expect(state).toMatchObject({ xp: 0, completed: 0, screen: 'mine' });
    expect(state.personalRecipes[0].status).toBe('draft');
    expect(validatePersonalRecipe(draft, true)).toHaveProperty('steps');
    const ready = normalizePersonalRecipe({ ...draft, minutes: 8, portions: 1, equipmentKeys: ['none'], utensils: 'Prato', ingredients: ['Pão'], steps: [{ instruction: 'Abra o pão.', question: 'Está aberto?', tip: 'Abra com cuidado.' }] });
    state = send(state, 'OPEN_EDITOR', { context: { mode: 'edit', id: ready.id } });
    state = send(state, 'SAVE_PERSONAL', { recipe: ready, test: true, changed: true, now: 1000 });
    expect(state.prep.recipeSnapshot.name).toBe('Meu prato');
    state = send(state, 'TOGGLE_INGREDIENT', { index: 0 });
    state = send(state, 'START_RECIPE');
    state = send(state, 'VALIDATE_STEP');
    state = send(state, 'FINISH_RECIPE', { now: 61000 });
    expect(state).toMatchObject({ xp: 105, completed: 1 });
    expect(state.personalRecipes[0].status).toBe('tested');
    expect(state.records[0]).toMatchObject({ recipe: 'Meu prato', source: 'personal', durationMs: 60000, xpEarned: 105 });
    state = send(state, 'ANIMATIONS_DONE');
    state = send(state, 'NAVIGATE', { tab: 'mine' });
    state = send(state, 'OPEN_EDITOR', { context: { mode: 'edit', id: ready.id } });
    state = send(state, 'SAVE_PERSONAL', { recipe: { ...ready, name: 'Meu prato revisado' }, test: false, changed: true });
    expect(state.personalRecipes[0].status).toBe('draft');
    state = send(state, 'OPEN_PERSONAL', { id: ready.id, now: 70000 });
    state = send(state, 'TOGGLE_INGREDIENT', { index: 0 });
    state = send(state, 'START_RECIPE');
    state = send(state, 'REQUEST_ADJUSTMENT');
    state = send(state, 'VALIDATE_STEP');
    state = send(state, 'FINISH_RECIPE', { now: 80000 });
    expect(state.personalRecipes[0].status).toBe('improved');
    expect(state.records[0]).toMatchObject({ recipe: 'Meu prato revisado', xpEarned: 103 });
    expect(state.records[1].recipe).toBe('Meu prato');
    expect(state.xp).toBe(208);
  });

  it('copia sem alterar o catálogo, salva favorito e restaura backup', () => {
    const copy = copyStandardRecipe(recipeById('wrap'));
    expect(copy).toMatchObject({ name: 'Wrap frio', origin: { id: 'wrap' }, status: 'draft' });
    copy.steps[0].instruction = 'Instrução própria';
    expect(recipeById('wrap').steps[0].instruction).not.toBe('Instrução própria');
    let state = send(initialState(), 'TOGGLE_FAVORITE', { id: 'wrap' });
    expect(state.favoriteIds).toEqual(['wrap']);
    state = send(state, 'NAVIGATE', { tab: 'mine' });
    state = send(state, 'OPEN_EDITOR', { context: { mode: 'copy', source: recipeById('wrap') } });
    state = send(state, 'SAVE_PERSONAL', { recipe: { ...copy, id: 'mine-copy' }, test: false, changed: true });
    const restored = parseBackup(createBackup(state));
    expect(restored.personalRecipes[0].origin.name).toBe('Wrap frio');
    expect(restored.favoriteIds).toEqual(['wrap']);
    expect(recipes).toHaveLength(62);
    expect(() => parseBackup('{"format":"wrong"}')).toThrow('Arquivo de backup inválido.');
    expect(migrateState(restored).personalRecipes).toHaveLength(1);
  });
});

describe('interface V4 e permissões', () => {
  it('combina busca, equipamentos e favoritas, e cria cópia pelo catálogo', async () => {
    const user = userEvent.setup();
    render(<App />);
    const search = screen.getByRole('searchbox', { name: 'Buscar por nome ou ingrediente' });
    await user.type(search, 'wrap');
    const card = screen.getByRole('article', { name: 'Wrap frio' });
    await user.click(within(card).getByRole('button', { name: 'Adicionar aos favoritos' }));
    await user.click(screen.getByRole('button', { name: 'Favoritas' }));
    expect(screen.getByRole('article', { name: 'Wrap frio' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Sem equipamento' }));
    await user.click(within(card).getByRole('button', { name: 'Criar cópia' }));
    expect(screen.getByText('Cópia de Wrap frio')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Salvar rascunho' }));
    expect(screen.getByRole('heading', { name: 'Minhas Receitas' })).toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY)).xp).toBe(0);
  });

  it('abre a personalização direto da página inicial e retorna a ela', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Personalizar o site' }));
    expect(screen.getByRole('heading', { name: 'Configurações' })).toBeInTheDocument();
    expect(screen.getByText('Escolher foto')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Escuro' }));
    await user.clear(screen.getByRole('textbox', { name: 'Hexadecimal' }));
    await user.type(screen.getByRole('textbox', { name: 'Hexadecimal' }), '#8000FF');
    await user.click(screen.getByRole('button', { name: 'Aplicar cor' }));
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(document.documentElement.style.getPropertyValue('--accent')).toBe('#8000FF');
    await user.click(screen.getByRole('button', { name: 'Voltar' }));
    expect(screen.getByRole('heading', { name: 'Receitas' })).toBeInTheDocument();
  });

  it('mantém receitas padrão apenas para preparo ou cópia e não abre administração', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Sem equipamento' }));
    const card = screen.getByRole('article', { name: 'Wrap frio' });
    expect(within(card).getByRole('button', { name: 'Ver ingredientes' })).toBeInTheDocument();
    expect(within(card).getByRole('button', { name: 'Criar cópia' })).toBeInTheDocument();
    expect(within(card).queryByRole('button', { name: /editar|excluir|ocultar|gerenciar/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Nova receita padrão' })).not.toBeInTheDocument();
    window.history.replaceState(null, '', '#/admin');
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    expect(screen.getByRole('heading', { name: 'Receitas' })).toBeInTheDocument();
    expect(window.location.hash).toBe('#/receitas');
  });

  it('mantém contraste de texto e botões para cores livres nos dois temas', () => {
    for (const theme of ['light', 'dark']) for (const color of ['#000000', '#FFFFFF', '#FFFF00', '#0000FF', '#286B49']) {
      const result = themeColors(color, theme);
      expect(contrastRatio(result.accent, result.buttonText)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(result.accentInk, theme === 'dark' ? '#1D2B23' : '#FFFFFF')).toBeGreaterThanOrEqual(4.5);
    }
  });
});
