import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import manualCatalog from '../../src/catalog/manual.json';
import {
  EQUIPMENT_NAMES, applyManualCatalog, editableCatalogRecipe,
  serializeManualCatalog, validateCatalogRecipe, validateManualCatalog,
} from '../../src/catalog/manual.js';
import { baseRecipes } from '../../src/data.js';
import './style.css';

const DRAFT_KEY = 'cozinhe-catalog-editor-v1';
const SOURCE_TAG = JSON.stringify(manualCatalog);
const GITHUB_FILE = 'https://github.com/oigorfilipi/Cozinhe_Como_Um_Chefe/blob/main/src/catalog/manual.json';

function loadWorkingCopy() {
  try {
    const saved = JSON.parse(localStorage.getItem(DRAFT_KEY));
    if (saved?.source === SOURCE_TAG && !validateManualCatalog(saved.changes, baseRecipes).length) return saved.changes;
  } catch { /* The published file remains the safe starting point. */ }
  return structuredClone(manualCatalog);
}

function newRecipe() {
  return {
    id: '', name: '', emoji: '🍽️', minutes: 15, portions: 1, equipment: null,
    difficulty: 'simple', utensils: '', safety: '', ingredients: [''],
    steps: [{ instruction: '', question: '', tip: '' }],
  };
}

function slugFor(name, usedIds) {
  const stem = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'receita';
  const safeStem = stem.startsWith('mine-') ? `receita-${stem}` : stem;
  let id = safeStem;
  let suffix = 2;
  while (usedIds.has(id)) id = `${safeStem}-${suffix++}`;
  return id;
}

function App() {
  const [working, setWorking] = useState(loadWorkingCopy);
  const [selectedId, setSelectedId] = useState('wrap');
  const [form, setForm] = useState(() => editableCatalogRecipe(
    working.upserts.find((item) => item.id === 'wrap') ?? baseRecipes.find((item) => item.id === 'wrap'),
  ));
  const [dirtyForm, setDirtyForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [showJson, setShowJson] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ source: SOURCE_TAG, changes: working }));
    } catch { /* Export remains available if this browser restricts file storage. */ }
  }, [working]);

  useEffect(() => {
    const beforeClose = (event) => {
      if (!dirtyForm) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', beforeClose);
    return () => window.removeEventListener('beforeunload', beforeClose);
  }, [dirtyForm]);

  const allChoices = useMemo(() => {
    const baseIds = new Set(baseRecipes.map((item) => item.id));
    return [...baseRecipes, ...working.upserts.filter((item) => !baseIds.has(item.id))]
      .map((item) => working.upserts.find((change) => change.id === item.id) ?? item)
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  }, [working]);
  const publishedPreview = useMemo(() => applyManualCatalog(baseRecipes, working), [working]);
  const baseRecipe = baseRecipes.find((item) => item.id === selectedId);
  const isRemoved = working.removedIds.includes(selectedId);
  const hasChanges = SOURCE_TAG !== JSON.stringify(working);
  const jsonText = useMemo(() => serializeManualCatalog(working, baseRecipes), [working]);

  function setField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
    setDirtyForm(true);
    setErrors({});
    setMessage('');
  }

  function pick(id) {
    if (dirtyForm && !window.confirm('Descartar alterações não salvas desta receita?')) return;
    const item = working.upserts.find((recipe) => recipe.id === id) ?? baseRecipes.find((recipe) => recipe.id === id);
    setSelectedId(id);
    setForm(editableCatalogRecipe(item));
    setDirtyForm(false);
    setErrors({});
    setMessage('');
  }

  function startNew() {
    if (dirtyForm && !window.confirm('Descartar alterações não salvas desta receita?')) return;
    setSelectedId(null);
    setForm(newRecipe());
    setDirtyForm(false);
    setErrors({});
    setMessage('Preencha a receita e clique em Salvar receita.');
  }

  function saveRecipe(event) {
    event.preventDefault();
    const id = selectedId ?? slugFor(form.name, new Set(allChoices.map((item) => item.id)));
    const recipe = { ...form, id, equipment: form.equipment === 'none' ? null : form.equipment };
    const found = validateCatalogRecipe(recipe);
    if (Object.keys(found).length) {
      setErrors(found);
      setMessage('Revise os campos destacados antes de salvar.');
      return;
    }
    const next = {
      version: 1,
      upserts: [...working.upserts.filter((item) => item.id !== id), editableCatalogRecipe(recipe)],
      removedIds: working.removedIds.filter((item) => item !== id),
    };
    const problems = validateManualCatalog(next, baseRecipes);
    if (problems.length) { setMessage(problems.join(' ')); return; }
    setWorking(next);
    setSelectedId(id);
    setForm(editableCatalogRecipe(recipe));
    setDirtyForm(false);
    setErrors({});
    setMessage('Receita salva neste editor. Gere o arquivo e confirme a alteração no GitHub para publicar.');
  }

  function removeRecipe() {
    if (!selectedId || !window.confirm(`Excluir “${form.name}” do catálogo público após a próxima publicação?`)) return;
    if (selectedId === 'wrap') { setMessage('O wrap é usado na demonstração da VT e não pode ser excluído.'); return; }
    const next = {
      version: 1,
      upserts: working.upserts.filter((item) => item.id !== selectedId),
      removedIds: baseRecipe ? [...new Set([...working.removedIds, selectedId])] : working.removedIds,
    };
    setWorking(next);
    if (!baseRecipe) {
      setSelectedId('wrap');
      setForm(editableCatalogRecipe(working.upserts.find((item) => item.id === 'wrap') ?? baseRecipes.find((item) => item.id === 'wrap')));
    }
    setDirtyForm(false);
    setErrors({});
    setMessage('Exclusão preparada. Gere o arquivo e confirme no GitHub para publicar.');
  }

  function restoreRecipe() {
    if (!baseRecipe) return;
    setWorking({
      version: 1,
      upserts: working.upserts.filter((item) => item.id !== selectedId),
      removedIds: working.removedIds.filter((id) => id !== selectedId),
    });
    setForm(editableCatalogRecipe(baseRecipe));
    setDirtyForm(false);
    setErrors({});
    setMessage('Receita original restaurada no editor.');
  }

  function updateIngredient(index, value) {
    setField('ingredients', form.ingredients.map((item, position) => position === index ? value : item));
  }

  function updateStep(index, key, value) {
    setField('steps', form.steps.map((step, position) => position === index ? { ...step, [key]: value } : step));
  }

  function download() {
    if (dirtyForm) { setMessage('Clique em Salvar receita antes de gerar o arquivo.'); return; }
    const objectUrl = URL.createObjectURL(new Blob([jsonText], { type: 'application/json;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = 'manual.json';
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    setMessage('Arquivo baixado. O site público ainda não mudou: confirme manual.json no GitHub.');
  }

  async function copyJson() {
    if (dirtyForm) { setMessage('Clique em Salvar receita antes de copiar o arquivo.'); return; }
    try {
      await navigator.clipboard.writeText(jsonText);
      setMessage('Conteúdo copiado. Abra manual.json no GitHub, clique no lápis, substitua o conteúdo e confirme.');
    } catch {
      setShowJson(true);
      setMessage('Não foi possível copiar automaticamente. Use o campo “Conteúdo do arquivo” abaixo.');
    }
  }

  async function importFile(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if ((dirtyForm || hasChanges) && !window.confirm('Substituir as alterações locais pelo conteúdo deste arquivo?')) return;
    try {
      const parsed = JSON.parse(await file.text());
      const problems = validateManualCatalog(parsed, baseRecipes);
      if (problems.length) throw new Error(problems.join(' '));
      setWorking(parsed);
      const wrap = parsed.upserts.find((item) => item.id === 'wrap') ?? baseRecipes.find((item) => item.id === 'wrap');
      setSelectedId('wrap');
      setForm(editableCatalogRecipe(wrap));
      setDirtyForm(false);
      setErrors({});
      setMessage('Arquivo carregado. Suas próximas alterações serão acrescentadas a ele.');
    } catch (error) {
      setMessage(`Arquivo inválido: ${error.message}`);
    }
  }

  function resetToGit() {
    if (!window.confirm('Descartar todas as alterações locais e voltar ao catálogo desta cópia do projeto?')) return;
    setWorking(structuredClone(manualCatalog));
    setSelectedId('wrap');
    setForm(editableCatalogRecipe(baseRecipes.find((item) => item.id === 'wrap')));
    setDirtyForm(false);
    setErrors({});
    setMessage('Editor restaurado para o arquivo incluído nesta cópia do projeto.');
  }

  return <div className="editor-shell">
    <header className="topbar"><div className="brand"><span className="brand-mark" aria-hidden="true">👨‍🍳</span><div><strong>Cozinhe como um Chefe</strong><span>Editor local de receitas padrão</span></div></div><span className="local-badge">Só no seu computador</span></header>
    <main>
      <section className="intro"><div><p className="eyebrow">CATÁLOGO PADRÃO</p><h1>Edite receitas sem mexer no código</h1><p>Este editor prepara um arquivo. O site que o professor acessa só muda depois que você confirmar esse arquivo no GitHub.</p></div><div className="count-card"><strong>{publishedPreview.length}</strong><span>receitas na próxima versão</span><small>{working.upserts.length} criadas ou editadas · {working.removedIds.length} excluídas</small></div></section>
      <div className="workspace">
        <aside className="sidebar"><h2>Receitas</h2><label className="field">Escolha uma receita<select value={selectedId ?? ''} onChange={(event) => pick(event.target.value)}><option value="" disabled>Nova receita</option>{allChoices.map((item) => <option key={item.id} value={item.id}>{working.removedIds.includes(item.id) ? '✕ ' : ''}{item.name}</option>)}</select></label><button type="button" className="secondary full" onClick={startNew}>+ Criar receita</button><p>As receitas excluídas continuam nesta lista para que você possa restaurá-las antes de publicar.</p><div className="sidebar-divider" /><h2>Seu arquivo</h2><label className="secondary file-button">Carregar manual.json<input type="file" accept=".json,application/json" onChange={importFile} /></label><p>Depois de publicar mudanças no GitHub, carregue aqui o manual.json mais recente antes de editar novamente.</p><button type="button" className="subtle full" onClick={resetToGit}>Descartar alterações locais</button></aside>
        <div className="main-column">
          <form className="recipe-form" onSubmit={saveRecipe} noValidate><div className="form-heading"><div><p className="eyebrow">{selectedId ? 'EDITAR RECEITA' : 'NOVA RECEITA'}</p><h2>{form.name || 'Sua nova receita'}</h2>{selectedId && <small>ID permanente: {selectedId}</small>}</div><span className={isRemoved ? 'status removed' : 'status'}>{isRemoved ? 'Excluída da próxima versão' : dirtyForm ? 'Alterações não salvas' : 'Pronta para editar'}</span></div>
            <div className="form-grid"><label className="field wide">Nome<input value={form.name} onChange={(event) => setField('name', event.target.value)} maxLength={80} />{errors.name && <small className="error">{errors.name}</small>}</label><label className="field">Emoji<input value={form.emoji} onChange={(event) => setField('emoji', event.target.value)} />{errors.emoji && <small className="error">{errors.emoji}</small>}</label><label className="field">Equipamento<select value={form.equipment ?? 'none'} onChange={(event) => setField('equipment', event.target.value === 'none' ? null : event.target.value)}>{Object.entries(EQUIPMENT_NAMES).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select>{errors.equipment && <small className="error">{errors.equipment}</small>}</label><label className="field">Dificuldade<select value={form.difficulty} onChange={(event) => setField('difficulty', event.target.value)}><option value="simple">Simples</option><option value="elaborate">Elaborada</option></select></label><label className="field">Tempo aproximado (min)<input type="number" min="1" max="1440" value={form.minutes} onChange={(event) => setField('minutes', event.target.value)} />{errors.minutes && <small className="error">{errors.minutes}</small>}</label><label className="field">Porções<input type="number" min="1" max="100" value={form.portions} onChange={(event) => setField('portions', event.target.value)} />{errors.portions && <small className="error">{errors.portions}</small>}</label><label className="field wide">Utensílios<input value={form.utensils} onChange={(event) => setField('utensils', event.target.value)} />{errors.utensils && <small className="error">{errors.utensils}</small>}</label></div>
            <section className="form-section"><div className="section-heading"><div><h3>Ingredientes</h3><p>Separe os itens que a pessoa deve marcar antes de começar.</p></div><button type="button" className="secondary" onClick={() => setField('ingredients', [...form.ingredients, ''])}>+ Ingrediente</button></div>{form.ingredients.map((item, index) => <label key={index} className="row-field"><span>{index + 1}.</span><input aria-label={`Ingrediente ${index + 1}`} value={item} onChange={(event) => updateIngredient(index, event.target.value)} /><button type="button" aria-label={`Remover ingrediente ${index + 1}`} disabled={form.ingredients.length === 1} onClick={() => setField('ingredients', form.ingredients.filter((_, position) => position !== index))}>Remover</button></label>)}{errors.ingredients && <small className="error">{errors.ingredients}</small>}</section>
            <section className="form-section"><div className="section-heading"><div><h3>Modo de preparo</h3><p>Cada etapa precisa de ação, conferência do resultado e Dica.</p></div><button type="button" className="secondary" onClick={() => setField('steps', [...form.steps, { instruction: '', question: '', tip: '' }])}>+ Etapa</button></div>{form.steps.map((step, index) => <div className="step-card" key={index}><div className="step-heading"><strong>Etapa {index + 1}</strong><button type="button" disabled={form.steps.length === 1} onClick={() => setField('steps', form.steps.filter((_, position) => position !== index))}>Remover etapa</button></div><label className="field">O que fazer<textarea value={step.instruction} onChange={(event) => updateStep(index, 'instruction', event.target.value)} rows={2} /></label><label className="field">Como conferir se deu certo?<textarea value={step.question} onChange={(event) => updateStep(index, 'question', event.target.value)} rows={2} /></label><label className="field">Dica caso não dê certo<textarea value={step.tip} onChange={(event) => updateStep(index, 'tip', event.target.value)} rows={2} /></label></div>)}{errors.steps && <small className="error">{errors.steps}</small>}</section>
            <label className="field safety-field">Orientação final ou de segurança (opcional)<textarea value={form.safety} onChange={(event) => setField('safety', event.target.value)} rows={2} /></label>
            <div className="form-actions"><button type="submit" className="primary">Salvar receita no editor</button>{selectedId && <button type="button" className="danger" onClick={removeRecipe}>{baseRecipe ? 'Excluir receita' : 'Remover receita nova'}</button>}{baseRecipe && (isRemoved || working.upserts.some((item) => item.id === selectedId)) && <button type="button" className="subtle" onClick={restoreRecipe}>Restaurar original</button>}</div>
          </form>
          <section className="preview"><div><p className="eyebrow">PRÉVIA</p><h2>{form.emoji} {form.name || 'Sua receita'}</h2><p>{form.minutes || '—'} min · {EQUIPMENT_NAMES[form.equipment ?? 'none']} · {form.portions || '—'} porções</p></div><div><strong>Ingredientes</strong><ul>{form.ingredients.filter(Boolean).map((item, index) => <li key={index}>{item}</li>)}</ul><strong>Etapas</strong><ol>{form.steps.filter((step) => step.instruction).map((step, index) => <li key={index}>{step.instruction}<small>{step.question}</small></li>)}</ol></div></section>
        </div>
      </div>
      <section className="publish"><p className="eyebrow">PUBLICAÇÃO MANUAL</p><h2>Leve as alterações ao GitHub</h2><p>O arquivo gerado reúne <strong>todas</strong> as alterações preparadas neste editor. O catálogo público permanece igual até você confirmar a mudança no repositório.</p><div className="publish-actions"><button type="button" className="primary" onClick={copyJson} disabled={!hasChanges}>Copiar conteúdo</button><button type="button" className="secondary" onClick={download} disabled={!hasChanges}>Baixar manual.json</button><a className="secondary" href={GITHUB_FILE} target="_blank" rel="noreferrer">Abrir arquivo no GitHub ↗</a></div><ol><li>Salve as receitas e clique em <strong>Copiar conteúdo</strong>. Se preferir, baixe o arquivo como backup.</li><li>No GitHub, abra <strong>src/catalog/manual.json</strong>, clique no lápis, selecione todo o conteúdo e cole o que foi copiado.</li><li>Clique em <strong>Commit changes</strong> diretamente no ramo <strong>main</strong>. Se o GitHub criar outra branch, abra e mescle a pull request para publicar.</li></ol><details open={showJson} onToggle={(event) => setShowJson(event.currentTarget.open)}><summary>Conteúdo do arquivo para copiar manualmente</summary><textarea readOnly aria-label="Conteúdo do arquivo" value={jsonText} onFocus={(event) => event.target.select()} rows={8} /></details></section>
      {message && <div className="toast" role="status">{message}</div>}
    </main>
  </div>;
}

const root = document.getElementById('root');
if (root) createRoot(root).render(<App />);

export default App;
