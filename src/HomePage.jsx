import { useEffect, useState } from 'react';
import {
  ArrowRight, Check, ChefHat, CircleSlash, CookingPot,
  Flame, Heart, Leaf, Medal, Microwave, Search, Sparkles, Square, Wind, X, Zap,
} from 'lucide-react';
import { recipes } from './data.js';
import { compatibleRecipes, levelProgress, nextMedal, selectedEquipment } from './state.js';
import { EQUIPMENT_OPTIONS } from './personal.js';

const equipmentIcons = { stove: Flame, fryer: Wind, oven: Square, microwave: Microwave, electricPot: Zap, none: CircleSlash };
const equipmentHelp = {
  stove: 'Para receitas na panela', fryer: 'Para receitas crocantes', oven: 'Para receitas assadas',
  microwave: 'Para receitas rápidas', electricPot: 'Arroz e multicooker, sem pressão', none: 'Receitas sem aquecimento',
};

function MissionPanel({ state, dispatch, onChoose }) {
  const { level, current, required } = levelProgress(state.xp);
  const medal = nextMedal(state.completed);
  const resume = () => dispatch({ type: 'RESUME_PREP' });
  return <section className="mission-panel" aria-label="Painel de missão">
    <div className="mission-glint" aria-hidden="true"><Sparkles size={23} /></div>
    <div className="mission-identity"><span className="mission-avatar">{state.profilePhoto ? <img src={state.profilePhoto} alt="" /> : <ChefHat size={25} aria-hidden="true" />}</span><div><p>OLÁ, {state.profileName.toLocaleUpperCase('pt-BR')}</p><h2>Nível {level} · {state.xp} XP</h2></div></div>
    <div className="mission-level"><div className="mission-level-line"><span>Próximo nível</span><strong>{current}/{required} XP</strong></div><div role="progressbar" aria-label="Progresso para o próximo nível" aria-valuenow={current} aria-valuemin={0} aria-valuemax={required}><span style={{ width: `${(current / required) * 100}%` }} /></div></div>
    <p className="mission-medal"><Medal size={18} aria-hidden="true" /> {medal ? `${state.completed} de ${medal.threshold} preparos para ${medal.name}` : 'Todas as medalhas conquistadas!'}</p>
    <div className="mission-next">{!selectedEquipment(state.equipment) ? <><strong>Monte sua cozinha</strong><button type="button" onClick={onChoose}>Escolher equipamentos <ArrowRight size={17} aria-hidden="true" /></button></>
      : state.prep ? <><strong>Missão em andamento: {state.prep.recipeSnapshot?.name ?? 'Receita'} · Etapa {state.prep.stepIndex + 1} de {state.prep.recipeSnapshot?.steps?.length ?? 4}</strong><button type="button" onClick={resume}>Retomar preparo <ArrowRight size={17} aria-hidden="true" /></button></>
        : <><strong>Próxima missão: escolha uma receita</strong><button type="button" onClick={() => document.getElementById('catalog-list')?.scrollIntoView({ behavior: 'smooth' })}>Explorar receitas <ArrowRight size={17} aria-hidden="true" /></button></>}</div>
  </section>;
}

function EquipmentPanel({ state, dispatch, open, setOpen }) {
  const selected = EQUIPMENT_OPTIONS.filter(([key]) => state.equipment[key]).map(([, label]) => label).join(' + ');
  return <section className="equipment-panel" aria-label="Escolha de equipamentos">
    {selected && !open && <div className="equipment-summary"><span>Equipamentos: <strong>{selected}</strong></span><button type="button" onClick={() => setOpen(true)}>Alterar</button></div>}
    {open && <><div className="section-heading"><h2>Seus equipamentos</h2><span>Escolha um ou mais</span></div><div className="equipment-list v4-equipment-list">
      {EQUIPMENT_OPTIONS.map(([key, label]) => {
        const Icon = equipmentIcons[key];
        return <button key={key} type="button" className={`equipment-option ${state.equipment[key] ? 'is-selected' : ''}`} aria-label={label} aria-pressed={state.equipment[key]} onClick={() => dispatch({ type: 'TOGGLE_EQUIPMENT', key })}>
          <span className={`equipment-icon ${key === 'none' ? 'cream' : ['fryer', 'microwave'].includes(key) ? 'mint' : 'peach'}`}><Icon size={25} strokeWidth={1.9} aria-hidden="true" /></span><span className="equipment-labels"><strong>{label}</strong><small>{equipmentHelp[key]}</small></span><span className="option-check" aria-hidden="true">{state.equipment[key] && <Check size={16} strokeWidth={3} />}</span>
        </button>;
      })}
    </div><button type="button" className="equipment-done" onClick={() => setOpen(false)}>Concluir seleção</button></>}
  </section>;
}

function StandardCard({ recipe, favorite, onFavorite, onOpen, onCopy }) {
  return <article className="recipe-card v4-recipe-card" aria-label={recipe.name}>
    <div className="recipe-visual" aria-hidden="true"><span>{recipe.emoji}</span></div>
    <div className="recipe-details"><div className="recipe-title-row"><h2>{recipe.name}</h2><span className={`difficulty-badge ${recipe.difficulty}`}>{recipe.difficulty === 'simple' ? 'Simples' : 'Elaborada'}</span></div>
      <p>{recipe.meta}</p>
      <div className="standard-actions"><button type="button" className="recipe-link" onClick={onOpen}>Ver ingredientes <ArrowRight size={18} aria-hidden="true" /></button>
        <button type="button" className="favorite-button" aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'} aria-pressed={favorite} onClick={onFavorite}><Heart size={22} fill={favorite ? 'currentColor' : 'none'} aria-hidden="true" /></button>
        <button type="button" className="copy-button" onClick={onCopy}>Criar cópia</button></div>
    </div>
  </article>;
}

export function HomePage({ state, dispatch, headingRef }) {
  const [equipmentOpen, setEquipmentOpen] = useState(!selectedEquipment(state.equipment));
  const [difficulty, setDifficulty] = useState('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  useEffect(() => { if (!selectedEquipment(state.equipment)) setEquipmentOpen(true); }, [state.equipment]);
  const matched = selectedEquipment(state.equipment) ? compatibleRecipes(state.equipment, state.search, recipes) : [];
  const shown = matched.filter((recipe) => (difficulty === 'all' || recipe.difficulty === difficulty) && (!favoritesOnly || state.favoriteIds.includes(recipe.id)));
  const clearFilters = () => { setDifficulty('all'); setFavoritesOnly(false); dispatch({ type: 'SET_SEARCH', value: '' }); };
  const openRecipe = (recipe) => {
    const replace = Boolean(state.prep && state.prep.recipeId !== recipe.id);
    if (replace && !window.confirm('Começar outra receita substituirá o preparo pausado. Continuar?')) return;
    dispatch({ type: 'OPEN_RECIPE', recipeId: recipe.id, recipe, replace, now: Date.now() });
  };
  return <main className="page-content recipes-page v4-home">
    <MissionPanel state={state} dispatch={dispatch} onChoose={() => { setEquipmentOpen(true); document.getElementById('equipment-panel')?.scrollIntoView({ behavior: 'smooth' }); }} />
    <div className="search-field"><Search size={20} aria-hidden="true" /><input type="search" aria-label="Buscar por nome ou ingrediente" placeholder="Buscar por nome ou ingrediente" value={state.search} onChange={(event) => dispatch({ type: 'SET_SEARCH', value: event.target.value })} />{state.search && <button type="button" aria-label="Limpar busca" onClick={() => dispatch({ type: 'SET_SEARCH', value: '' })}><X size={19} aria-hidden="true" /></button>}</div>
    <div className="screen-intro"><p className="eyebrow">CATÁLOGO DE MISSÕES</p><h1 ref={headingRef} tabIndex={-1}>Receitas</h1><p className="intro-copy">Encontre uma receita para a sua cozinha.</p></div>
    {state.completed === 0 && state.xp === 0 && !state.prep && <div className="demo-card"><span className="demo-icon"><Medal size={20} aria-hidden="true" /></span><div><strong>Experimente a medalha Iniciante</strong><p>Comece com 9 preparos simulados e conclua mais uma receita.</p><button type="button" onClick={() => dispatch({ type: 'SEED_DEMO' })}>Iniciar demonstração com 9 preparos <ArrowRight size={16} aria-hidden="true" /></button></div></div>}
    <div id="equipment-panel"><EquipmentPanel state={state} dispatch={dispatch} open={equipmentOpen} setOpen={setEquipmentOpen} /></div>
    <section id="catalog-list" className="catalog-section"><div className="section-heading"><h2>Escolha sua próxima receita</h2></div>
      <div className="difficulty-filters" role="group" aria-label="Filtros do catálogo">{[['all', 'Todas'], ['simple', 'Simples'], ['elaborate', 'Elaboradas']].map(([value, label]) => <button key={value} type="button" aria-pressed={difficulty === value} className={difficulty === value ? 'selected' : ''} onClick={() => setDifficulty(value)}>{label}</button>)}<button type="button" aria-pressed={favoritesOnly} className={favoritesOnly ? 'selected' : ''} onClick={() => setFavoritesOnly(!favoritesOnly)}><Heart size={16} aria-hidden="true" /> Favoritas</button></div>
      <p className="recipe-count" role="status">{shown.length} {shown.length === 1 ? 'receita visível' : 'receitas visíveis'}</p>
      {!selectedEquipment(state.equipment) ? <div className="empty-card"><CookingPot size={26} aria-hidden="true" /><strong>Escolha seus equipamentos para ver receitas.</strong></div>
        : shown.length ? <div className="recipe-list v4-recipe-list">{shown.map((recipe) => <StandardCard key={recipe.id} recipe={recipe} favorite={state.favoriteIds.includes(recipe.id)}
              onFavorite={() => dispatch({ type: 'TOGGLE_FAVORITE', id: recipe.id })} onOpen={() => openRecipe(recipe)} onCopy={() => dispatch({ type: 'OPEN_EDITOR', context: { mode: 'copy', source: recipe } })}
              />)}</div>
          : <div className="empty-card"><Search size={26} aria-hidden="true" /><strong>{favoritesOnly ? 'Nenhuma favorita com estes filtros.' : 'Nenhuma receita encontrada.'}</strong><p>{favoritesOnly ? 'Marque receitas com o coração ou ajuste os filtros.' : 'Tente outro nome ou altere os equipamentos.'}</p>{favoritesOnly && <button type="button" className="secondary-action" onClick={clearFilters}>Limpar filtros</button>}</div>}
      <p className="recipe-footnote"><Leaf size={17} aria-hidden="true" /> Receitas sem aquecimento funcionam com qualquer seleção de equipamentos.</p>
    </section>
  </main>;
}
