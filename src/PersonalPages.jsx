import { useMemo, useState } from 'react';
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Camera, Check, CircleCheck,
  Copy, Download, Lightbulb, Pencil, Plus, Sparkles, Star, Trash2, Upload, UserRound,
} from 'lucide-react';
import { createBackup, parseBackup } from './state.js';
import { copyStandardRecipe, emptyPersonalRecipe, EQUIPMENT_OPTIONS, normalizePersonalRecipe, personalStatusText, playablePersonalRecipe, validatePersonalRecipe } from './personal.js';
import { resizeProfilePhoto } from './photo.js';
import { themeColors } from './theme.js';

const statusNames = { draft: 'Rascunho', tested: 'Testada', improved: 'Aprimorada' };

function PageIntro({ eyebrow, title, description, headingRef }) {
  return <div className="screen-intro"><p className="eyebrow">{eyebrow}</p><h1 ref={headingRef} tabIndex={-1}>{title}</h1><p className="intro-copy">{description}</p></div>;
}

function personalEquipmentText(recipe) {
  return recipe.equipmentKeys.map((key) => EQUIPMENT_OPTIONS.find(([id]) => id === key)?.[1]).filter(Boolean).join(' + ') || 'Equipamento não definido';
}

export function MineScreen({ state, dispatch, headingRef }) {
  const [filter, setFilter] = useState('all');
  const [message, setMessage] = useState('');
  const shown = state.personalRecipes.filter((recipe) => filter === 'all' || recipe.status === filter);
  const counts = { all: state.personalRecipes.length, draft: 0, tested: 0, improved: 0 };
  for (const recipe of state.personalRecipes) counts[recipe.status] += 1;
  const create = () => dispatch({ type: 'OPEN_EDITOR', context: { mode: 'new' } });
  const adapt = () => { dispatch({ type: 'NAVIGATE', tab: 'recipes' }); window.setTimeout(() => document.getElementById('catalog-list')?.scrollIntoView({ behavior: 'smooth' }), 0); };
  const exportData = () => {
    const blob = new Blob([createBackup(state)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cozinhe-como-um-chefe-backup.json';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage('Backup exportado. Guarde o arquivo em um lugar seguro.');
  };
  const importData = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      if (file.size > 20 * 1024 * 1024) throw new Error('O arquivo deve ter até 20 MB.');
      const restored = parseBackup(await file.text());
      if (!window.confirm('Importar este backup substituirá os dados locais atuais. Continuar?')) return;
      dispatch({ type: 'RESTORE_BACKUP', state: restored });
      setMessage('Backup importado. Seus dados foram restaurados.');
    } catch (error) { setMessage(error.message || 'Não foi possível importar o arquivo.'); }
  };
  const prepare = (recipe) => {
    if (Object.keys(validatePersonalRecipe(recipe, true)).length) {
      setMessage('Complete a receita no editor antes de testar.');
      dispatch({ type: 'OPEN_EDITOR', context: { mode: 'edit', id: recipe.id } });
      return;
    }
    const replace = Boolean(state.prep && state.prep.recipeId !== recipe.id);
    if (replace && !window.confirm('Começar outro preparo substituirá o preparo pausado. Continuar?')) return;
    dispatch({ type: 'OPEN_PERSONAL', id: recipe.id, replace, now: Date.now() });
  };
  return <main className="page-content mine-page">
    <PageIntro eyebrow="SUA COZINHA" title="Minhas Receitas" description="Crie, teste e melhore suas receitas." headingRef={headingRef} />
    <div className="mine-actions"><button type="button" className="primary-action" onClick={create}><Plus size={20} aria-hidden="true" /> Criar do zero</button><button type="button" className="secondary-action" onClick={adapt}><Copy size={18} aria-hidden="true" /> Adaptar receita padrão</button></div>
    <div className="backup-actions"><button type="button" onClick={exportData}><Download size={18} aria-hidden="true" /> Exportar backup</button><label htmlFor="import-backup"><Upload size={18} aria-hidden="true" /> Importar backup</label><input id="import-backup" type="file" accept="application/json,.json" onChange={importData} aria-label="Importar backup" /></div>
    {message && <p className="inline-message" role="status">{message}</p>}
    {state.personalRecipes.length ? <>
      <div className="status-filters" role="group" aria-label="Filtrar minhas receitas">
        {[['all', 'Todas'], ['draft', 'Rascunhos'], ['tested', 'Testadas'], ['improved', 'Aprimoradas']].map(([value, label]) => <button key={value} type="button" aria-pressed={filter === value} className={filter === value ? 'selected' : ''} onClick={() => setFilter(value)}>{label} ({counts[value]})</button>)}
      </div>
      {shown.length ? <div className="personal-list">{shown.map((recipe) => <article key={recipe.id} className="personal-card">
        <div className="personal-card-top"><span className="personal-emoji" aria-hidden="true">{recipe.emoji}</span><div><h2>{recipe.name}</h2><p>~{recipe.minutes || '—'} min · {personalEquipmentText(recipe)} · {recipe.difficulty === 'elaborate' ? 'Elaborada' : 'Simples'}</p></div></div>
        {recipe.origin && <p className="origin-label">Cópia de {recipe.origin.name}</p>}
        <span className={`personal-status status-${recipe.status}`}>{recipe.status === 'draft' ? <Pencil size={16} /> : recipe.status === 'tested' ? <CircleCheck size={16} /> : <Star size={16} />} {statusNames[recipe.status]}</span>
        <p className="status-note">{personalStatusText(recipe)}</p>
        <div className="personal-card-actions"><button type="button" onClick={() => dispatch({ type: 'OPEN_EDITOR', context: { mode: 'edit', id: recipe.id } })}>Editar</button><button type="button" onClick={() => prepare(recipe)}>{recipe.hasBeenTested ? 'Preparar novamente' : 'Testar receita'}</button><button type="button" aria-label={`Excluir ${recipe.name}`} onClick={() => { if (window.confirm(`Excluir ${recipe.name}? Os Registros anteriores serão mantidos.`)) dispatch({ type: 'DELETE_PERSONAL', id: recipe.id }); }}><Trash2 size={18} aria-hidden="true" /> Excluir</button></div>
      </article>)}</div> : <div className="empty-card"><strong>Nenhuma receita neste estado.</strong><p>Escolha outro filtro para ver suas receitas.</p></div>}
    </> : <div className="empty-card mine-empty"><Lightbulb size={26} aria-hidden="true" /><strong>Sua cozinha, suas ideias.</strong><p>Crie uma receita ou adapte uma do catálogo para começar.</p><div className="mine-actions"><button type="button" className="primary-action" onClick={create}>Criar do zero</button><button type="button" className="secondary-action" onClick={adapt}>Adaptar receita padrão</button></div></div>}
  </main>;
}

function defaultDraft(context, personalRecipes) {
  if (context?.mode === 'copy') return copyStandardRecipe(context.source);
  if (context?.mode === 'edit') return personalRecipes.find((item) => item.id === context.id) ?? emptyPersonalRecipe();
  return emptyPersonalRecipe();
}

export function RecipeEditor({ state, dispatch, context, headingRef }) {
  const original = useMemo(() => defaultDraft(context, state.personalRecipes), [context, state.personalRecipes]);
  const [draft, setDraft] = useState(original);
  const [errors, setErrors] = useState({});
  const existing = context?.mode === 'edit';
  const dirty = context?.mode === 'copy' || (!existing ? JSON.stringify(draft) !== JSON.stringify(emptyPersonalRecipe()) : JSON.stringify(draft) !== JSON.stringify(original));
  const set = (field, value) => { setDraft((current) => ({ ...current, [field]: value })); setErrors((current) => ({ ...current, [field]: undefined })); };
  const cancel = () => {
    if (dirty && !window.confirm('Descartar alterações não salvas?')) return;
    dispatch({ type: 'CANCEL_EDITOR' });
  };
  const submit = (forTest) => {
    const candidate = { ...draft, id: draft.id || `mine-${crypto.randomUUID()}` };
    const normalized = normalizePersonalRecipe(candidate);
    const nextErrors = validatePersonalRecipe(normalized, forTest);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      window.setTimeout(() => document.querySelector(`[data-error-field="${Object.keys(nextErrors)[0]}"]`)?.focus(), 0);
      return;
    }
    const replace = Boolean(forTest && state.prep && state.prep.recipeId !== normalized.id);
    if (replace && !window.confirm('Começar este teste substituirá o preparo pausado. Continuar?')) return;
    dispatch({ type: 'SAVE_PERSONAL', recipe: normalized, test: forTest, changed: !existing || dirty, replace, now: Date.now() });
  };
  const toggleEquipment = (key) => {
    const next = key === 'none' ? (draft.equipmentKeys.includes('none') ? [] : ['none'])
      : draft.equipmentKeys.includes(key) ? draft.equipmentKeys.filter((item) => item !== key)
        : [...draft.equipmentKeys.filter((item) => item !== 'none'), key];
    set('equipmentKeys', next);
  };
  const setIngredient = (index, value) => set('ingredients', draft.ingredients.map((item, position) => position === index ? value : item));
  const setStep = (index, field, value) => set('steps', draft.steps.map((step, position) => position === index ? { ...step, [field]: value } : step));
  const moveStep = (index, by) => {
    const next = [...draft.steps];
    [next[index], next[index + by]] = [next[index + by], next[index]];
    set('steps', next);
  };
  return <main className="page-content editor-page">
    <button type="button" className="text-back" onClick={cancel}><ArrowLeft size={18} aria-hidden="true" /> Voltar</button>
    <PageIntro eyebrow="SUA CRIAÇÃO" title="Editor de receita"
      description="Monte a receita no seu ritmo. Salvar rascunho não concede XP." headingRef={headingRef} />
    {draft.origin && <p className="origin-label editor-origin">Cópia de {draft.origin.name}</p>}
    <div className="editor-layout"><form className="recipe-form" onSubmit={(event) => event.preventDefault()}>
      <fieldset className="editor-section"><legend>Dados básicos</legend>
        <label>Nome<input data-error-field="name" value={draft.name} maxLength={80} onChange={(event) => set('name', event.target.value)} />{errors.name && <small role="alert">{errors.name}</small>}</label>
        <div className="form-pair"><label>Dificuldade<select data-error-field="difficulty" value={draft.difficulty} onChange={(event) => set('difficulty', event.target.value)}><option value="simple">Simples</option><option value="elaborate">Elaborada</option></select>{errors.difficulty && <small role="alert">{errors.difficulty}</small>}</label>
          <label>Tempo aproximado (min)<input data-error-field="minutes" type="number" min="1" value={draft.minutes} onChange={(event) => set('minutes', event.target.value)} />{errors.minutes && <small role="alert">{errors.minutes}</small>}</label></div>
        <label>Porções<input data-error-field="portions" type="number" min="1" value={draft.portions} onChange={(event) => set('portions', event.target.value)} />{errors.portions && <small role="alert">{errors.portions}</small>}</label>
        <div className="form-equipment"><span>Equipamentos necessários</span><div role="group" aria-label="Equipamentos necessários">{EQUIPMENT_OPTIONS.map(([key, label]) => <button key={key} type="button" data-error-field={key === 'stove' ? 'equipment' : undefined} aria-pressed={draft.equipmentKeys.includes(key)} className={draft.equipmentKeys.includes(key) ? 'selected' : ''} onClick={() => toggleEquipment(key)}>{label}</button>)}</div>{errors.equipment && <small role="alert">{errors.equipment}</small>}</div>
        <label>Utensílios<input data-error-field="utensils" value={draft.utensils} onChange={(event) => set('utensils', event.target.value)} />{errors.utensils && <small role="alert">{errors.utensils}</small>}</label>
        <label>Orientação de segurança (opcional)<textarea value={draft.safety} onChange={(event) => set('safety', event.target.value)} rows={2} /></label>
      </fieldset>
      <fieldset className="editor-section"><legend>Ingredientes</legend>
        {draft.ingredients.map((item, index) => <div className="editable-row" key={index}><label>Ingrediente {index + 1}<input data-error-field={index === 0 ? 'ingredients' : undefined} value={item} onChange={(event) => setIngredient(index, event.target.value)} />{errors.ingredients && index === 0 && <small role="alert">{errors.ingredients}</small>}</label><button type="button" aria-label={`Remover ingrediente ${index + 1}`} onClick={() => set('ingredients', draft.ingredients.filter((_, position) => position !== index))}><Trash2 size={18} aria-hidden="true" /> Remover</button></div>)}
        {errors.ingredients && !draft.ingredients.length && <small role="alert">{errors.ingredients}</small>}<button type="button" data-error-field={draft.ingredients.length === 0 ? 'ingredients' : undefined} className="add-row" onClick={() => set('ingredients', [...draft.ingredients, ''])}><Plus size={18} aria-hidden="true" /> Adicionar ingrediente</button>
      </fieldset>
      <fieldset className="editor-section"><legend>Etapas</legend>
        {draft.steps.map((step, index) => <div className="step-editor" key={index}><h3>Etapa {index + 1}</h3>
          <label>Instrução<textarea data-error-field={errors.steps && !step.instruction && !draft.steps.slice(0, index).some((item) => !item.instruction || !item.question || !item.tip) ? 'steps' : undefined} value={step.instruction} onChange={(event) => setStep(index, 'instruction', event.target.value)} rows={2} />{errors.steps && !step.instruction && <small role="alert">Informe a instrução.</small>}</label>
          <label>Confira o resultado<textarea data-error-field={errors.steps && !step.question && step.instruction && !draft.steps.slice(0, index).some((item) => !item.instruction || !item.question || !item.tip) ? 'steps' : undefined} value={step.question} onChange={(event) => setStep(index, 'question', event.target.value)} rows={2} />{errors.steps && !step.question && <small role="alert">Informe a conferência do resultado.</small>}</label>
          <label>Dica<textarea data-error-field={errors.steps && !step.tip && step.instruction && step.question && !draft.steps.slice(0, index).some((item) => !item.instruction || !item.question || !item.tip) ? 'steps' : undefined} value={step.tip} onChange={(event) => setStep(index, 'tip', event.target.value)} rows={2} />{errors.steps && !step.tip && <small role="alert">Informe a Dica.</small>}</label>
          <div className="step-editor-actions"><button type="button" disabled={index === 0} onClick={() => moveStep(index, -1)}><ArrowUp size={17} aria-hidden="true" /> Mover para cima</button><button type="button" disabled={index === draft.steps.length - 1} onClick={() => moveStep(index, 1)}><ArrowDown size={17} aria-hidden="true" /> Mover para baixo</button><button type="button" onClick={() => set('steps', draft.steps.filter((_, position) => position !== index))}><Trash2 size={17} aria-hidden="true" /> Remover</button></div>
        </div>)}
        {errors.steps && <small role="alert">{errors.steps}</small>}<button type="button" data-error-field={draft.steps.length === 0 ? 'steps' : undefined} className="add-row" onClick={() => set('steps', [...draft.steps, { instruction: '', question: '', tip: '' }])}><Plus size={18} aria-hidden="true" /> Adicionar etapa</button>
      </fieldset>
      <div className="editor-actions"><button type="button" className="secondary-action" onClick={() => submit(false)}>Salvar rascunho</button><button type="button" className="primary-action" onClick={() => submit(true)}>Salvar e testar</button>
        <button type="button" className="secondary-action" onClick={cancel}>Cancelar</button></div>
    </form>
    <aside className="editor-summary"><span className="personal-emoji" aria-hidden="true">{draft.emoji}</span><h2>{draft.name || 'Sua nova receita'}</h2><p>{draft.minutes || '—'} min · {draft.portions || '—'} porções</p><p>{draft.ingredients.filter(Boolean).length} ingredientes · {draft.steps.filter((step) => step.instruction).length} etapas</p><span className="personal-status status-draft"><Pencil size={16} /> Rascunho</span></aside>
    </div>
  </main>;
}

export function SettingsScreen({ state, dispatch, headingRef }) {
  const [color, setColor] = useState(state.accent);
  const [colorError, setColorError] = useState('');
  const [photoError, setPhotoError] = useState('');
  const choosePhoto = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try { dispatch({ type: 'SET_PHOTO', photo: await resizeProfilePhoto(file) }); setPhotoError(''); }
    catch (error) { setPhotoError(error.message); }
  };
  const applyColor = () => {
    if (!/^#[0-9a-f]{6}$/i.test(color)) { setColorError('Digite uma cor no formato #RRGGBB.'); return; }
    dispatch({ type: 'SET_ACCENT', accent: color }); setColorError('');
  };
  const preview = themeColors(/^#[0-9a-f]{6}$/i.test(color) ? color : state.accent, state.theme);
  return <main className="page-content settings-page"><button type="button" className="text-back" onClick={() => dispatch({ type: 'CLOSE_SETTINGS' })}><ArrowLeft size={18} aria-hidden="true" /> Voltar</button>
    <PageIntro eyebrow="DO SEU JEITO" title="Configurações" description="Personalize sua cozinha no dispositivo." headingRef={headingRef} />
    <section className="settings-card"><h2>Foto de perfil</h2><div className="photo-row"><span className="settings-avatar">{state.profilePhoto ? <img src={state.profilePhoto} alt="Foto de perfil atual" /> : <UserRound size={32} aria-hidden="true" />}</span><div><label className="settings-file-button" htmlFor="profile-photo"><Camera size={18} aria-hidden="true" /> Escolher foto</label><input id="profile-photo" type="file" accept="image/png,image/jpeg,image/webp" onChange={choosePhoto} aria-label="Escolher foto" />{state.profilePhoto && <button type="button" className="text-button" onClick={() => dispatch({ type: 'SET_PHOTO', photo: null })}>Remover foto</button>}</div></div><p>PNG, JPG ou WebP de até 5 MB. A imagem é enquadrada e reduzida no dispositivo.</p>{photoError && <p role="alert" className="field-error">{photoError}</p>}</section>
    <section className="settings-card"><h2>Tema</h2><div className="theme-options" role="group" aria-label="Tema">{[['light', 'Claro'], ['dark', 'Escuro']].map(([value, label]) => <button key={value} type="button" aria-pressed={state.theme === value} className={state.theme === value ? 'selected' : ''} onClick={() => dispatch({ type: 'SET_THEME', theme: value })}>{label}</button>)}</div></section>
    <section className="settings-card"><h2>Cor principal</h2><div className="color-inputs"><input type="color" aria-label="Selecionar cor principal" value={/^#[0-9a-f]{6}$/i.test(color) ? color : state.accent} onChange={(event) => { setColor(event.target.value); setColorError(''); }} /><label>Hexadecimal<input value={color} onChange={(event) => { setColor(event.target.value); setColorError(''); }} /></label></div>{colorError && <p role="alert" className="field-error">{colorError}</p>}<div className="color-preview"><span>Prévia</span><span className="color-preview-bar" style={{ backgroundColor: preview.accent }} /><span className="color-preview-button" style={{ backgroundColor: preview.accent, color: preview.buttonText }}>Botão de missão</span></div><div className="settings-actions"><button type="button" className="primary-action" onClick={applyColor}>Aplicar cor</button><button type="button" className="secondary-action" onClick={() => { setColor('#286B49'); setColorError(''); dispatch({ type: 'SET_ACCENT', accent: '#286B49' }); }}>Restaurar verde padrão</button></div></section>
  </main>;
}
