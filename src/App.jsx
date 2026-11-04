import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import {
  ArrowLeft, ArrowRight, BookOpen, Check, ChefHat, CircleCheck, CircleSlash,
  Clock3, CookingPot, Flame, Leaf, Lightbulb, LockKeyhole, Medal, Microwave,
  Pause, Pencil, Search, Settings2, Sparkles, Square, UserRound, Wind, X, Zap,
} from 'lucide-react';
import { medals, recipeById, recipes } from './data.js';
import {
  compatibleRecipes, formatDate, formatDuration, levelProgress, loadState,
  nextMedal, prepRecipe, reducer, selectedEquipment, STORAGE_KEY,
} from './state.js';
import { HomePage } from './HomePage.jsx';
import { MineScreen, RecipeEditor, SettingsScreen } from './PersonalPages.jsx';
import { themeColors } from './theme.js';

const dispatchType = (dispatch, type, extra = {}) => () => dispatch({ type, ...extra });

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
  useEffect(() => {
    const query = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!query) return undefined;
    const update = () => setReduced(query.matches);
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);
  return reduced;
}

function ActionBar({ children }) {
  return <div className="action-bar"><div className="action-bar-inner">{children}</div></div>;
}

function PrimaryButton({ children, onClick, disabled = false, icon = true, nextAction = false }) {
  return (
    <button className="primary-action" type="button" onClick={onClick} disabled={disabled} data-next-action={nextAction || undefined}>
      <span>{children}</span>{icon && <ArrowRight aria-hidden="true" size={20} strokeWidth={2.4} />}
    </button>
  );
}

function Header({ xp, canPause, onPause, onBack }) {
  return (
    <header className="app-header">
      <div className="header-inner flex items-center justify-between gap-2.5">
        {canPause && <button className="header-back" type="button" onClick={onBack}><ArrowLeft size={18} aria-hidden="true" /> Voltar</button>}
        <div className="brand flex items-center gap-2" aria-label="Cozinhe como um Chefe">
          <img className="brand-mark" src={`${import.meta.env.BASE_URL}logo.svg`} alt="" aria-hidden="true" />
          <span className="brand-name">Cozinhe <strong>como um Chefe</strong></span>
        </div>
        <div className="header-actions flex items-center gap-2">
          {canPause && <button className="pause-button" type="button" onClick={onPause}><Pause size={16} fill="currentColor" aria-hidden="true" /> Pausar</button>}
          <div className="xp-pill" aria-label={`Saldo de XP: ${xp}`}><Sparkles size={16} aria-hidden="true" /> <strong>{xp}</strong> XP</div>
        </div>
      </div>
    </header>
  );
}

function MainNav({ screen, dispatch }) {
  const active = ['equipment', 'recipes'].includes(screen) ? 'recipes' : screen;
  const tabs = [
    { key: 'recipes', label: 'Receitas', Icon: BookOpen },
    { key: 'mine', label: 'Minhas Receitas', Icon: Pencil },
    { key: 'records', label: 'Registros', Icon: Clock3 },
    { key: 'profile', label: 'Perfil', Icon: UserRound },
  ];
  return (
    <nav className="main-nav" aria-label="Navegação principal">
      {tabs.map(({ key, label, Icon }) => (
        <button
          key={key}
          type="button"
          className={`nav-tab ${active === key ? 'active' : ''}`}
          aria-label={label}
          aria-current={active === key ? 'page' : undefined}
          onClick={dispatchType(dispatch, 'NAVIGATE', { tab: key })}
        >
          <Icon size={20} strokeWidth={2} aria-hidden="true" /><span className={key === 'mine' ? 'nav-mine-short' : undefined}>{key === 'mine' ? 'Minhas' : label}</span>{key === 'mine' && <span className="nav-mine-wide">Minhas Receitas</span>}
        </button>
      ))}
    </nav>
  );
}

function ScreenIntro({ eyebrow, title, description, headingRef, after }) {
  return (
    <div className="screen-intro">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 ref={headingRef} tabIndex={-1}>{title}</h1>
      {description && <p className="intro-copy">{description}</p>}
      {after}
    </div>
  );
}

function LevelCard({ xp }) {
  const { level, current, required } = levelProgress(xp);
  return (
    <section className="level-card" aria-label="Progresso de nível">
      <div className="level-card-top"><strong>Nível {level}</strong><span>XP total: {xp}</span></div>
      <div className="progress-track" role="progressbar" aria-label="Progresso para o próximo nível" aria-valuenow={current} aria-valuemin={0} aria-valuemax={required}>
        <div style={{ width: `${(current / required) * 100}%` }} />
      </div>
      <p>{current} de {required} XP para o próximo nível</p>
    </section>
  );
}

const equipmentOptions = [
  { key: 'stove', label: 'Fogão', sub: 'Para receitas na panela', Icon: Flame, color: 'peach' },
  { key: 'fryer', label: 'Air fryer', sub: 'Para receitas crocantes', Icon: Wind, color: 'mint' },
  { key: 'oven', label: 'Forno', sub: 'Para receitas assadas', Icon: Square, color: 'peach' },
  { key: 'microwave', label: 'Micro-ondas', sub: 'Para receitas rápidas', Icon: Microwave, color: 'mint' },
  { key: 'electricPot', label: 'Panela elétrica', sub: 'Arroz e multicooker, sem pressão', Icon: Zap, color: 'peach' },
  { key: 'none', label: 'Sem equipamento', sub: 'Receitas sem aquecimento', Icon: CircleSlash, color: 'cream' },
];

function EquipmentScreen({ state, dispatch, headingRef }) {
  return (
    <>
      <main className="page-content equipment-page">
        <LevelCard xp={state.xp} />
        <ScreenIntro eyebrow="SUA COZINHA, SUAS MISSÕES" title="O que você tem para cozinhar?" description="Escolha uma opção ou combine equipamentos." headingRef={headingRef} />
        <div className="equipment-list grid gap-2.5" role="group" aria-label="Equipamentos disponíveis">
          {equipmentOptions.map(({ key, label, sub, Icon, color }) => (
            <button key={key} type="button" className={`equipment-option ${state.equipment[key] ? 'is-selected' : ''}`}
              aria-label={label} aria-pressed={state.equipment[key]} onClick={dispatchType(dispatch, 'TOGGLE_EQUIPMENT', { key })}>
              <span className={`equipment-icon ${color}`}><Icon size={25} strokeWidth={1.9} aria-hidden="true" /></span>
              <span className="equipment-labels"><strong>{label}</strong><small>{sub}</small></span>
              <span className="option-check" aria-hidden="true">{state.equipment[key] && <Check size={16} strokeWidth={3} />}</span>
            </button>
          ))}
        </div>
        {state.completed === 0 && state.xp === 0 && !state.prep && (
          <div className="demo-card">
            <div className="demo-icon"><Medal size={20} aria-hidden="true" /></div>
            <div><strong>Quer ver uma medalha?</strong><p>Comece com 9 preparos concluídos. O próximo wrap libera a medalha Iniciante.</p>
              <button type="button" onClick={dispatchType(dispatch, 'SEED_DEMO')}>Iniciar demonstração com 9 preparos <ArrowRight size={16} aria-hidden="true" /></button>
            </div>
          </div>
        )}
        {state.completed === 9 && state.achievements.wrap === 9 && (
          <p className="demo-active" role="status"><CircleCheck size={17} aria-hidden="true" /> Demonstração pronta: 9 receitas concluídas.</p>
        )}
      </main>
      <ActionBar><PrimaryButton disabled={!selectedEquipment(state.equipment)} onClick={dispatchType(dispatch, 'VIEW_RECIPES')}>Ver receitas</PrimaryButton></ActionBar>
    </>
  );
}

function RecipeCard({ recipe, resumed, onClick }) {
  return (
    <article className="recipe-card" aria-label={recipe.name}>
      <div className="recipe-visual" aria-hidden="true"><span>{recipe.emoji}</span></div>
      <div className="recipe-details">
        <div className="recipe-title-row"><h2>{recipe.name}</h2><span className={`difficulty-badge ${recipe.difficulty}`}>{recipe.difficulty === 'simple' ? 'Simples' : 'Elaborada'}</span></div>
        <p>{recipe.meta}</p>
        <button type="button" className="recipe-link" onClick={onClick}>{resumed ? 'Retomar receita' : 'Ver ingredientes'} <ArrowRight size={18} aria-hidden="true" /></button>
      </div>
    </article>
  );
}

function RecipesScreen({ state, dispatch, headingRef }) {
  const [difficulty, setDifficulty] = useState('all');
  const selected = state.equipment.none ? 'Sem equipamento' : equipmentOptions.filter((item) => item.key !== 'none' && state.equipment[item.key]).map((item) => item.label).join(' + ');
  const matched = compatibleRecipes(state.equipment, state.search);
  const shown = difficulty === 'all' ? matched : matched.filter((recipe) => recipe.difficulty === difficulty);
  const openRecipe = (recipe) => {
    const replace = Boolean(state.prep && state.prep.recipeId !== recipe.id);
    if (replace && !window.confirm(`Você tem ${recipeById(state.prep.recipeId)?.name ?? 'outra receita'} em andamento. Começar ${recipe.name} apaga as etapas desse preparo. Continuar?`)) return;
    dispatch({ type: 'OPEN_RECIPE', recipeId: recipe.id, replace, now: Date.now() });
  };
  return (
    <main className="page-content recipes-page">
      <LevelCard xp={state.xp} />
      <button className="text-back" type="button" onClick={dispatchType(dispatch, 'CHANGE_EQUIPMENT')}><ArrowLeft size={18} aria-hidden="true" /> Alterar equipamentos</button>
      <ScreenIntro eyebrow="PRÓXIMA MISSÃO" title="Escolha sua receita" description="Mostrando receitas para os equipamentos selecionados." headingRef={headingRef}
        after={<span className="filter-pill"><CookingPot size={16} aria-hidden="true" /> {selected}</span>} />
      <div className="search-field">
        <Search size={20} aria-hidden="true" />
        <input type="search" aria-label="Buscar receitas" placeholder="Buscar receita" value={state.search}
          onChange={(event) => dispatch({ type: 'SET_SEARCH', value: event.target.value })} />
        {state.search && <button type="button" aria-label="Limpar busca" onClick={dispatchType(dispatch, 'SET_SEARCH', { value: '' })}><X size={19} aria-hidden="true" /></button>}
      </div>
      <div className="difficulty-filters" role="group" aria-label="Dificuldade das receitas">
        {[['all', 'Todas'], ['simple', 'Simples'], ['elaborate', 'Elaboradas']].map(([value, label]) =>
          <button key={value} type="button" aria-pressed={difficulty === value} className={difficulty === value ? 'selected' : ''} onClick={() => setDifficulty(value)}>{label}</button>)}
      </div>
      <p className="recipe-count" role="status">{shown.length} {shown.length === 1 ? 'receita encontrada' : 'receitas encontradas'}</p>
      {shown.length ? (
        <div className="recipe-list grid gap-3">
          {shown.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} resumed={state.prep?.recipeId === recipe.id}
            onClick={() => openRecipe(recipe)} />)}
        </div>
      ) : <div className="empty-card" role="status"><Search size={26} aria-hidden="true" /><strong>Nenhuma receita encontrada.</strong><p>Tente outro nome ou altere os equipamentos.</p></div>}
      <p className="recipe-footnote"><Leaf size={17} aria-hidden="true" /> Receitas sem aquecimento funcionam com qualquer seleção de equipamentos.</p>
    </main>
  );
}

function IngredientsScreen({ state, dispatch, headingRef }) {
  const recipe = prepRecipe(state.prep);
  const checkedCount = state.prep.checked.filter(Boolean).length;
  return (
    <main className="page-content prep-layout ingredients-page">
      <section className="prep-primary">
        <ScreenIntro eyebrow="ANTES DE COMEÇAR" title="Separe tudo antes de começar" description={`${recipe.name} · ${recipe.portions} ${recipe.portions === 1 ? 'porção' : 'porções'} · Use ${recipe.utensils}.`} headingRef={headingRef} />
        <div className="section-heading"><h2>Ingredientes</h2><span>{checkedCount} de {recipe.ingredients.length} separados</span></div>
        <div className="ingredient-list grid gap-2">
          {recipe.ingredients.map((ingredient, index) => <label className={`ingredient-item ${state.prep.checked[index] ? 'checked' : ''}`} key={`${recipe.id}-${index}`}>
            <input type="checkbox" checked={state.prep.checked[index]} onChange={() => dispatch({ type: 'TOGGLE_INGREDIENT', index })} /><span>{ingredient}</span>
          </label>)}
        </div>
      </section>
      <section className="prep-secondary">
        <div className="note-card"><Lightbulb size={19} aria-hidden="true" /><p>Deixe os ingredientes ao alcance antes de iniciar. Separá-los não concede XP.</p></div>
        {recipe.safety && <div className="note-card safety-note"><Lightbulb size={19} aria-hidden="true" /><p>{recipe.safety}</p></div>}
        <ActionBar><PrimaryButton disabled={checkedCount !== recipe.ingredients.length} onClick={dispatchType(dispatch, 'START_RECIPE')}>Começar receita</PrimaryButton><p className="action-hint">Marque os {recipe.ingredients.length} ingredientes para continuar.</p></ActionBar>
      </section>
    </main>
  );
}

function StepScreen({ state, dispatch, headingRef, onValidate, onFinish }) {
  const { prep } = state;
  const recipe = prepRecipe(prep);
  const stepCount = recipe.steps.length;
  const step = recipe.steps[prep.stepIndex];
  const validated = prep.validated[prep.stepIndex];
  const validatedCount = prep.validated.filter(Boolean).length;
  return (
    <main className="page-content step-page prep-layout">
      <section className="prep-primary">
        <div className="step-progress" aria-label={`${validatedCount} de ${stepCount} etapas validadas`}>
          <div className="step-progress-top"><span>Etapa {prep.stepIndex + 1} de {stepCount}</span><strong>{Math.round((validatedCount / stepCount) * 100)}%</strong></div>
          <div className="progress-track" role="progressbar" aria-valuenow={validatedCount} aria-valuemin={0} aria-valuemax={stepCount} aria-label="Etapas validadas"><div style={{ width: `${(validatedCount / stepCount) * 100}%` }} /></div>
        </div>
        <ScreenIntro eyebrow="HORA DE PREPARAR" title={step.instruction} description="Faça esta parte no seu ritmo. Depois, confirme o resultado." headingRef={headingRef} />
      </section>
      <section className="prep-secondary">
        <div className="question-card"><div className="question-icon"><ChefHat size={24} aria-hidden="true" /></div><div><span>CONFIRA O RESULTADO</span><h2>{step.question}</h2></div></div>
        {prep.hintOpen && !validated && <div className="tip-card" role="status" aria-live="polite"><Lightbulb size={21} aria-hidden="true" /><div><strong>Vamos ajustar juntos</strong><p>{step.tip}</p><p className="tip-cost">{prep.pendingTipDeduction > 0 ? 'A primeira Dica custa 1 XP, que será descontado no próximo ganho. ' : 'A primeira Dica descontou 1 XP. '}As etapas restantes valem 4 XP cada.</p></div></div>}
        {validated && <div className="success-card" role="status" aria-live="polite"><CircleCheck size={23} aria-hidden="true" /><div><strong>Etapa validada! +{prep.stepXp[prep.stepIndex]} XP</strong><p>Boa! Você já pode seguir para a próxima parte.</p></div></div>}
        <ActionBar>
          {validated ? <PrimaryButton nextAction onClick={prep.stepIndex === stepCount - 1 ? onFinish : dispatchType(dispatch, 'NEXT_STEP')}>{prep.stepIndex === stepCount - 1 ? 'Concluir receita' : 'Próxima etapa'}</PrimaryButton>
            : prep.hintOpen ? <><PrimaryButton onClick={onValidate}>Deu certo agora</PrimaryButton><button className="secondary-action" type="button" onClick={dispatchType(dispatch, 'CLOSE_ADJUSTMENT')}>Continuar nesta etapa</button></>
              : <><PrimaryButton onClick={onValidate}>Deu certo</PrimaryButton><button className="secondary-action" type="button" onClick={dispatchType(dispatch, 'REQUEST_ADJUSTMENT')}>Dica</button></>}
        </ActionBar>
      </section>
    </main>
  );
}

function MedalList({ completed }) {
  const upcoming = nextMedal(completed);
  return <>
    <div className="medal-list">{medals.map((medal) => {
      const earned = completed >= medal.threshold;
      return <div className={`medal-item ${earned ? 'earned' : ''}`} key={medal.name}>
        <span className="medal-icon">{earned ? <Medal size={22} aria-hidden="true" /> : <LockKeyhole size={20} aria-hidden="true" />}</span>
        <div><strong>{medal.name}</strong><small>{medal.threshold} receitas</small></div>
        <span className="medal-state">{earned ? 'Conquistada' : 'Bloqueada'}</span>
      </div>;
    })}</div>
    <p className="next-medal" role="status">{upcoming ? `${completed} de ${upcoming.threshold} receitas para ${upcoming.name}` : 'Todas as medalhas conquistadas!'}</p>
  </>;
}

function CompletionScreen({ state, dispatch, headingRef }) {
  const summary = state.latestCompletion;
  const recipe = { id: summary?.recipeId, name: summary?.recipeName ?? recipeById(summary?.recipeId)?.name ?? 'Receita', emoji: summary?.recipeEmoji ?? '🍽️', steps: [] };
  const earnedCount = state.achievements[recipe.id] ?? 0;
  return <main className="page-content completion-page completion-layout">
    <section className="summary-primary">
      <div className="completion-hero" aria-hidden="true"><span>{recipe.emoji}</span><Sparkles size={23} /></div>
      <ScreenIntro eyebrow="MISSÃO CUMPRIDA" title={`${recipe.name} pronto!`} description={`Você ganhou ${summary?.stepTotal ?? 0} XP pelas etapas e 100 XP pela receita.`} headingRef={headingRef} />
      <div className="total-card"><div><span>Total deste preparo</span><strong>+{summary?.xpEarned ?? 120} XP</strong></div><p>Saldo acumulado: <strong>{state.xp} XP</strong></p></div>
      {summary?.tipDeduction > 0 && <p className="deduction-note">A Dica descontou {summary.tipDeduction} XP neste preparo.</p>}
      <div className="achievement-card"><span className="achievement-icon"><CircleCheck size={22} aria-hidden="true" /></span><div><strong>Conquista recebida: {recipe.name} preparado</strong><p>Recebida {earnedCount} {earnedCount === 1 ? 'vez' : 'vezes'}.</p></div></div>
    </section>
    <section className="summary-secondary">
      <div className="medal-section"><div className="section-heading"><h2>Suas medalhas</h2><span>{state.completed} preparos</span></div><p className="completed-count">Receitas concluídas: <strong>{state.completed}</strong></p>
        {summary?.newMedal && <div className="new-medal" role="status"><Sparkles size={20} aria-hidden="true" /> Nova medalha: {summary.newMedal}!</div>}
        <MedalList completed={state.completed} />
      </div>
      <ActionBar><PrimaryButton onClick={dispatchType(dispatch, 'VIEW_RECIPES')}>Ver receitas</PrimaryButton></ActionBar>
    </section>
  </main>;
}

function recordDate(record) {
  return record.kind === 'demo' ? 'Demonstração' : formatDate(record.completedAt);
}

function RecordsScreen({ state, dispatch, headingRef }) {
  return <main className="page-content records-page">
    <ScreenIntro eyebrow="SEU HISTÓRICO" title="Seus registros" description="Cada receita concluída fica guardada aqui." headingRef={headingRef} />
    <div className="records-total"><Sparkles size={20} aria-hidden="true" /><span>XP total acumulado</span><strong>{state.xp} XP</strong></div>
    {state.records.length ? <>
      <div className="record-cards">{state.records.map((record) => <article className="record-card" key={record.id}>
        <div className="record-card-title"><span aria-hidden="true">{record.emoji ?? recipeById(record.recipeId)?.emoji ?? '🌯'}</span><strong>{record.recipe}</strong>{record.source === 'personal' && <span className="personal-record-badge">Minha receita</span>}<b>+{record.xpEarned} XP</b></div>
        <p>{recordDate(record)}</p><p>{record.durationMs === null ? 'Duração não registrada' : `Duração: ${formatDuration(record.durationMs)}`}</p><p>XP ganho: {record.xpEarned} XP</p>
      </article>)}</div>
      <table className="records-table"><caption>Preparos concluídos, do mais recente ao mais antigo</caption><thead><tr><th scope="col">Receita</th><th scope="col">Concluído em</th><th scope="col">Duração</th><th scope="col">XP ganho</th></tr></thead>
        <tbody>{state.records.map((record) => <tr key={record.id}><th scope="row">{record.recipe}{record.source === 'personal' && <span className="personal-record-badge">Minha receita</span>}</th><td>{recordDate(record)}</td><td>{formatDuration(record.durationMs)}</td><td>{record.xpEarned} XP</td></tr>)}</tbody>
      </table>
    </> : <div className="empty-card record-empty"><BookOpen size={26} aria-hidden="true" /><strong>Nenhum preparo concluído ainda.</strong><p>Escolha uma receita para criar seu primeiro registro.</p>
      <button type="button" className="secondary-action" onClick={dispatchType(dispatch, 'NAVIGATE', { tab: 'recipes' })}>Explorar receitas</button></div>}
  </main>;
}

function ProfileScreen({ state, dispatch, headingRef, catalog }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(state.profileName);
  const [error, setError] = useState('');
  const earnedRecipes = Object.entries(state.achievements).filter(([, count]) => count > 0).map(([id, count]) => ({
    id, count,
    name: state.personalRecipes.find((item) => item.id === id)?.name
      ?? state.records.find((item) => item.recipeId === id)?.recipe
      ?? catalog.find((item) => item.id === id)?.name
      ?? recipeById(id)?.name ?? 'Receita',
    emoji: state.personalRecipes.find((item) => item.id === id)?.emoji
      ?? state.records.find((item) => item.recipeId === id)?.emoji
      ?? catalog.find((item) => item.id === id)?.emoji ?? '🍽️',
  }));
  const saveName = () => {
    const name = draft.trim();
    if (!name) { setError('Digite um nome para continuar.'); return; }
    dispatch({ type: 'SET_PROFILE_NAME', name });
    setError('');
    setEditing(false);
  };
  return <main className="page-content profile-page">
    <button type="button" className="profile-settings-button" onClick={() => dispatch({ type: 'OPEN_SETTINGS' })}><Settings2 size={20} aria-hidden="true" /> Configurações</button>
    <ScreenIntro eyebrow="SUA JORNADA" title="Seu perfil" headingRef={headingRef} />
    <div className="profile-layout">
      <section className="profile-primary">
        <div className="identity-card">
          <span className="avatar">{state.profilePhoto ? <img src={state.profilePhoto} alt="Foto de perfil" /> : <UserRound size={27} aria-hidden="true" />}</span>
          {editing ? <div className="name-editor"><label htmlFor="profile-name">Nome</label><input id="profile-name" autoFocus maxLength={30} value={draft} onChange={(event) => { setDraft(event.target.value); setError(''); }} />
            {error && <p role="alert">{error}</p>}<div className="name-actions"><button type="button" onClick={saveName}>Salvar</button><button type="button" onClick={() => { setDraft(state.profileName); setError(''); setEditing(false); }}>Cancelar</button></div>
          </div> : <div className="identity-name"><strong>{state.profileName}</strong><button type="button" onClick={() => { setDraft(state.profileName); setEditing(true); }}>Editar nome</button></div>}
        </div>
        <LevelCard xp={state.xp} />
        <div className="profile-stat">Receitas concluídas: <strong>{state.completed}</strong></div>
      </section>
      <section className="profile-secondary">
        <div className="section-heading"><h2>Medalhas</h2></div><MedalList completed={state.completed} />
        <div className="profile-achievements"><div className="section-heading"><h2>Conquistas</h2></div>
          {earnedRecipes.length ? earnedRecipes.map((recipe) => <div className="achievement-card" key={recipe.id}><span className="achievement-icon" aria-hidden="true">{recipe.emoji}</span><div><strong>{recipe.name} preparado</strong><p>Recebida {recipe.count} {recipe.count === 1 ? 'vez' : 'vezes'}</p></div></div>)
            : <div className="empty-card"><p>Você ainda não recebeu conquistas.</p></div>}
        </div>
      </section>
    </div>
  </main>;
}

function PauseDialog({ open, dispatch }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      if (dialog.showModal) dialog.showModal(); else dialog.setAttribute('open', '');
    } else if (!open && dialog.open) {
      if (dialog.close) dialog.close(); else dialog.removeAttribute('open');
    }
  }, [open]);
  return <dialog ref={dialogRef} className="pause-dialog" aria-labelledby="pause-title" aria-describedby="pause-description"
    onCancel={(event) => { event.preventDefault(); dispatch({ type: 'CLOSE_PAUSE' }); }}>
    <div className="dialog-icon"><Pause size={24} fill="currentColor" aria-hidden="true" /></div><h2 id="pause-title">Receita pausada.</h2><p id="pause-description">Seu progresso está salvo.</p>
    <div className="dialog-actions"><PrimaryButton onClick={dispatchType(dispatch, 'CLOSE_PAUSE')} icon={false}>Continuar</PrimaryButton><button className="secondary-action" type="button" onClick={dispatchType(dispatch, 'LEAVE_FOR_RECIPES')}>Ir para receitas</button></div>
  </dialog>;
}

const animationDurations = { step: 2000, completion: 5000, achievement: 1500, medal: 3000 };

function AnimationLayer({ phase, onAdvance }) {
  const skipRef = useRef(null);
  const advancedRef = useRef(false);
  const advanceOnce = () => { if (advancedRef.current) return; advancedRef.current = true; onAdvance(); };
  useEffect(() => {
    advancedRef.current = false;
    skipRef.current?.focus();
    const timer = window.setTimeout(advanceOnce, animationDurations[phase.kind]);
    const onKeyDown = (event) => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); advanceOnce(); }
    };
    document.addEventListener('keydown', onKeyDown, true);
    return () => { window.clearTimeout(timer); document.removeEventListener('keydown', onKeyDown, true); };
  }, [phase, onAdvance]);
  const isMedal = phase.kind === 'medal';
  const content = {
    step: { title: 'Etapa validada!', detail: `+${phase.points} XP`, icon: <CircleCheck size={48} aria-hidden="true" /> },
    completion: { title: `${phase.recipeName} pronto!`, detail: '+100 XP pela receita', icon: <span className="animation-wrap" aria-hidden="true">{phase.recipeEmoji}</span> },
    achievement: { title: 'Conquista recebida', detail: `${phase.recipeName} preparado`, icon: <CircleCheck size={48} aria-hidden="true" /> },
    medal: { title: `Nova medalha: ${phase.medalName}!`, detail: `${phase.medalThreshold} receitas concluídas`, icon: <Medal size={96} aria-hidden="true" /> },
  }[phase.kind];
  return <div className="animation-layer" onClick={advanceOnce}>
    <div className={`animation-card animation-${phase.kind} ${isMedal ? 'animation-card-wide' : ''}`} role="dialog" aria-modal="true" aria-labelledby="animation-title">
      <div className="animation-icon">{content.icon}</div><h2 id="animation-title">{content.title}</h2><p>{content.detail}</p>
      <button ref={skipRef} type="button" className="skip-button" onClick={(event) => { event.stopPropagation(); advanceOnce(); }}>Pular</button>
    </div>
  </div>;
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);
  const [animation, setAnimation] = useState(null);
  const reducedMotion = useReducedMotion();
  const headingRef = useRef(null);
  const showTabs = ['recipes', 'mine', 'records', 'profile'].includes(state.screen);

  useEffect(() => {
    const colors = themeColors(state.accent, state.theme);
    const root = document.documentElement;
    root.dataset.theme = state.theme;
    root.style.setProperty('--accent', colors.accent);
    root.style.setProperty('--accent-ink', colors.accentInk);
    root.style.setProperty('--accent-mission', colors.accentMission);
    root.style.setProperty('--accent-foreground', colors.buttonText);
  }, [state.accent, state.theme]);

  useEffect(() => {
    const route = { recipes: '#/receitas', mine: '#/minhas-receitas', records: '#/registros', profile: '#/perfil' }[state.screen];
    if (route && window.location.hash !== route) window.history.replaceState(null, '', route);
  }, [state.screen]);
  useEffect(() => {
    const onHashChange = () => {
      const route = { '#/receitas': 'recipes', '#/minhas-receitas': 'mine', '#/registros': 'records', '#/perfil': 'profile' }[window.location.hash];
      if (route) dispatch({ type: 'ROUTE_TO', tab: route });
      else {
        window.history.replaceState(null, '', '#/receitas');
        dispatch({ type: 'ROUTE_TO', tab: 'recipes' });
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => { try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* Storage can be unavailable. */ } }, [state]);
  useEffect(() => { if (!animation) headingRef.current?.focus(); }, [state.screen, state.prep?.stepIndex, animation]);

  const advanceAnimation = useCallback(() => {
    if (!animation) return;
    if (animation.kind === 'step') {
      setAnimation(null);
      window.setTimeout(() => document.querySelector('[data-next-action]')?.focus(), 0);
    } else if (animation.kind === 'completion') setAnimation({ ...animation, kind: 'achievement' });
    else if (animation.kind === 'achievement' && animation.medalName) setAnimation({ ...animation, kind: 'medal' });
    else { setAnimation(null); dispatch({ type: 'ANIMATIONS_DONE' }); }
  }, [animation]);

  useEffect(() => {
    if (reducedMotion && animation) {
      if (animation.kind !== 'step') dispatch({ type: 'ANIMATIONS_DONE' });
      setAnimation(null);
    }
  }, [reducedMotion, animation]);

  const validateStep = () => {
    if (state.screen !== 'step' || state.prep?.validated[state.prep.stepIndex]) return;
    const points = state.prep.tipUsed ? 4 : 5;
    dispatch({ type: 'VALIDATE_STEP' });
    if (!reducedMotion) setAnimation({ kind: 'step', points });
  };

  const finishRecipe = () => {
    if (state.screen !== 'step' || !state.prep?.validated.every(Boolean)) return;
    const action = { type: 'FINISH_RECIPE', now: Date.now() };
    const next = reducer(state, action);
    if (next === state) return;
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* The UI still works for this session. */ }
    dispatch(action);
    if (reducedMotion) dispatch({ type: 'ANIMATIONS_DONE' });
    else {
      setAnimation({ kind: 'completion', recipeName: next.latestCompletion.recipeName, recipeEmoji: next.latestCompletion.recipeEmoji, medalName: next.latestCompletion.newMedal, medalThreshold: next.latestCompletion.medalThreshold });
    }
  };

  return <div className={`app-shell ${showTabs ? 'has-tabs' : 'is-preparing'}`}>
    <div className="app-base" inert={Boolean(animation)}>
      <Header xp={state.xp} canPause={['ingredients', 'step'].includes(state.screen)} onPause={dispatchType(dispatch, 'OPEN_PAUSE')} onBack={dispatchType(dispatch, 'LEAVE_PREP')} />
      <div className={`app-layout ${showTabs ? 'with-nav' : 'flow-layout'}`}>
        {showTabs && <MainNav screen={state.screen} dispatch={dispatch} />}
        <div className="app-content">
          {state.screen === 'recipes' && <HomePage state={state} dispatch={dispatch} headingRef={headingRef} />}
          {state.screen === 'mine' && <MineScreen state={state} dispatch={dispatch} headingRef={headingRef} />}
          {state.screen === 'editor' && <RecipeEditor key={state.editorContext?.id ?? state.editorContext?.source?.id ?? 'new'} state={state} dispatch={dispatch} context={state.editorContext} headingRef={headingRef} />}
          {state.screen === 'ingredients' && <IngredientsScreen state={state} dispatch={dispatch} headingRef={headingRef} />}
          {state.screen === 'step' && <StepScreen state={state} dispatch={dispatch} headingRef={headingRef} onValidate={validateStep} onFinish={finishRecipe} />}
          {state.screen === 'complete' && <CompletionScreen state={state} dispatch={dispatch} headingRef={headingRef} />}
          {state.screen === 'records' && <RecordsScreen state={state} dispatch={dispatch} headingRef={headingRef} />}
          {state.screen === 'profile' && <ProfileScreen state={state} dispatch={dispatch} headingRef={headingRef} catalog={recipes} />}
          {state.screen === 'settings' && <SettingsScreen state={state} dispatch={dispatch} headingRef={headingRef} />}
        </div>
      </div>
      <PauseDialog open={state.pauseOpen} dispatch={dispatch} />
    </div>
    {animation && <AnimationLayer phase={animation} onAdvance={advanceAnimation} />}
  </div>;
}
