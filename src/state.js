import { medals, recipeById, recipes } from './data.js';
import { normalizePersonalRecipe, playablePersonalRecipe, validatePersonalRecipe } from './personal.js';

// Keep the V1 key so existing browser data can be migrated in place.
export const STORAGE_KEY = 'cozinha-xp-prototipo-v1';
const equipmentKeys = ['stove', 'fryer', 'oven', 'microwave', 'electricPot'];

export function initialState() {
  return {
    version: 4,
    screen: 'recipes',
    equipment: { stove: false, fryer: false, oven: false, microwave: false, electricPot: false, none: false },
    prep: null,
    pauseOpen: false,
    xp: 0,
    completed: 0,
    achievements: { wrap: 0 },
    latestCompletion: null,
    records: [],
    profileName: 'Pessoa cozinheira',
    search: '',
    favoriteIds: [],
    personalRecipes: [],
    editorContext: null,
    theme: 'light',
    accent: '#286B49',
    profilePhoto: null,
  };
}

export function levelProgress(xp) {
  const total = Math.max(0, Math.floor(xp));
  let level = 1;
  let threshold = 0;
  while (total >= threshold + 100 * level) {
    threshold += 100 * level;
    level += 1;
  }
  return { level, current: total - threshold, required: 100 * level, threshold };
}

export function formatDate(timestamp) {
  if (!Number.isFinite(timestamp)) return 'Data não registrada';
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return 'Data não registrada';
  const two = (number) => String(number).padStart(2, '0');
  return `${two(date.getDate())}/${two(date.getMonth() + 1)}/${date.getFullYear()} · ${two(date.getHours())}:${two(date.getMinutes())}`;
}

export function formatDuration(durationMs) {
  if (!Number.isFinite(durationMs)) return 'Duração não registrada';
  const seconds = Math.max(0, Math.floor(durationMs / 1000));
  const two = (number) => String(number).padStart(2, '0');
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remaining = seconds % 60;
  return hours ? `${hours}:${two(minutes)}:${two(remaining)}` : `${minutes}:${two(remaining)}`;
}

export function selectedEquipment(equipment) {
  return Object.values(equipment).some(Boolean);
}

export function nextMedal(completed) {
  return medals.find((medal) => completed < medal.threshold) ?? null;
}

export function compatibleRecipes(equipment, search = '', catalog = recipes) {
  const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
  const query = normalize(search.trim());
  return catalog.filter((recipe) =>
    (!recipe.equipment || equipment[recipe.equipment]) &&
    (normalize(recipe.name).includes(query) || recipe.ingredients.some((item) => normalize(item).includes(query))),
  );
}

function newPrep(recipe, xp, now) {
  return {
    recipeId: recipe.id,
    recipeSnapshot: recipe,
    stage: 'ingredients',
    checked: recipe.ingredients.map(() => false),
    stepIndex: 0,
    validated: recipe.steps.map(() => false),
    stepXp: recipe.steps.map(() => 0),
    hintOpen: false,
    tipUsed: false,
    tipDeduction: 0,
    pendingTipDeduction: 0,
    enteredAt: now,
    xpAtOpen: xp,
  };
}

export function prepRecipe(prep) {
  return prep?.recipeSnapshot ?? recipeById(prep?.recipeId);
}

function normalizePrep(prep, xp, now) {
  if (!prep || !['ingredients', 'step'].includes(prep.stage)) return null;
  const recipe = prepRecipe(prep) ?? recipeById('wrap');
  const validated = recipe.steps.map((_, index) => Boolean(prep.validated?.[index]));
  const stepXp = recipe.steps.map((_, index) => validated[index] ? (prep.stepXp?.[index] ?? 5) : 0);
  return {
    recipeId: recipe.id,
    recipeSnapshot: prep.recipeSnapshot ?? null,
    stage: prep.stage,
    checked: recipe.ingredients.map((_, index) => Boolean(prep.checked?.[index])),
    stepIndex: Math.max(0, Math.min(recipe.steps.length - 1, Number.isInteger(prep.stepIndex) ? prep.stepIndex : 0)),
    validated,
    stepXp,
    hintOpen: Boolean(prep.hintOpen),
    tipUsed: Boolean(prep.tipUsed),
    tipDeduction: prep.tipUsed ? 1 : 0,
    pendingTipDeduction: Number.isInteger(prep.pendingTipDeduction)
      ? Math.max(0, Math.min(1, prep.pendingTipDeduction))
      : (prep.tipUsed && !prep.tipDeduction ? 1 : 0),
    // A V1 in-progress recipe has no timestamp. Timing starts at first V2 load.
    enteredAt: Number.isFinite(prep.enteredAt) ? prep.enteredAt : now,
    xpAtOpen: Number.isInteger(prep.xpAtOpen) ? prep.xpAtOpen : xp - stepXp.reduce((sum, points) => sum + points, 0),
  };
}

export function migrateState(saved, now = Date.now()) {
  if (![1, 2, 3, 4].includes(saved?.version) || !saved.equipment || !Number.isInteger(saved.xp) || !Number.isInteger(saved.completed)) return initialState();
  const base = initialState();
  const equipment = Object.fromEntries(Object.keys(base.equipment).map((key) => [key, Boolean(saved.equipment[key])]));
  const completed = Math.max(0, saved.completed);
  const legacyRecords = Array.from({ length: completed }, (_, index) => ({
    id: `legacy-${index + 1}`,
    recipe: 'Wrap frio',
    completedAt: null,
    durationMs: null,
    xpEarned: 120,
    kind: 'legacy',
  }));
  const prep = normalizePrep(saved.prep, saved.xp, now);
  let screen = ['equipment', 'recipes', 'ingredients', 'step', 'complete', 'records', 'profile', 'mine', 'settings'].includes(saved.screen)
    ? saved.screen : 'equipment';
  // Effects are transient. Reloading during a completion effect opens stable records.
  if (screen === 'complete') screen = 'records';
  if (screen === 'equipment') screen = 'recipes';
  if (['ingredients', 'step'].includes(screen) && !prep) screen = 'recipes';
  return {
    ...base,
    screen,
    equipment,
    prep,
    pauseOpen: ['ingredients', 'step'].includes(screen) && Boolean(saved.pauseOpen),
    xp: Math.max(0, saved.xp),
    completed,
    achievements: saved.version >= 3 && saved.achievements && typeof saved.achievements === 'object'
      ? { ...saved.achievements, wrap: Math.max(0, saved.achievements.wrap ?? 0) }
      : { wrap: Math.max(0, saved.achievements?.wrap ?? completed) },
    latestCompletion: saved.latestCompletion ?? null,
    records: saved.version === 1 ? legacyRecords : (Array.isArray(saved.records) ? saved.records : legacyRecords),
    profileName: saved.version >= 2 && typeof saved.profileName === 'string' && saved.profileName.trim() ? saved.profileName : base.profileName,
    search: saved.version >= 2 && typeof saved.search === 'string' ? saved.search : '',
    favoriteIds: saved.version === 4 && Array.isArray(saved.favoriteIds) ? [...new Set(saved.favoriteIds.filter((id) => typeof id === 'string'))] : [],
    personalRecipes: saved.version === 4 && Array.isArray(saved.personalRecipes)
      ? saved.personalRecipes.map(normalizePersonalRecipe).filter((item) => item?.id?.startsWith('mine-')) : [],
    theme: saved.version === 4 && saved.theme === 'dark' ? 'dark' : 'light',
    accent: saved.version === 4 && /^#[0-9a-f]{6}$/i.test(saved.accent) ? saved.accent.toUpperCase() : '#286B49',
    profilePhoto: saved.version === 4 && typeof saved.profilePhoto === 'string' && /^data:image\/(png|jpeg|webp);base64,/.test(saved.profilePhoto) ? saved.profilePhoto : null,
  };
}

export function loadState() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    const state = migrateState(saved);
    const route = window.location.hash;
    if (route === '#/minhas-receitas') return { ...state, screen: 'mine' };
    if (route === '#/registros') return { ...state, screen: 'records' };
    if (route === '#/perfil') return { ...state, screen: 'profile' };
    return state;
  } catch {
    return initialState();
  }
}

export function createBackup(state) {
  return JSON.stringify({ format: 'cozinhe-como-um-chefe-backup', version: 1, exportedAt: new Date().toISOString(),
    appState: { ...state, screen: 'mine', pauseOpen: false, editorContext: null } }, null, 2);
}

export function parseBackup(text) {
  const backup = JSON.parse(text);
  if (backup?.format !== 'cozinhe-como-um-chefe-backup' || backup.version !== 1 || backup.appState?.version !== 4 ||
    !Array.isArray(backup.appState.personalRecipes) || !Array.isArray(backup.appState.records) ||
    !Number.isInteger(backup.appState.xp) || !Number.isInteger(backup.appState.completed)) {
    throw new Error('Arquivo de backup inválido.');
  }
  return migrateState(backup.appState);
}

export function reducer(state, action) {
  switch (action.type) {
    case 'NAVIGATE': {
      if (!['equipment', 'recipes', 'mine', 'records', 'profile'].includes(state.screen) || !['recipes', 'mine', 'records', 'profile'].includes(action.tab)) return state;
      return { ...state, screen: action.tab };
    }
    case 'ROUTE_TO':
      return ['recipes', 'mine', 'records', 'profile'].includes(action.tab)
        ? { ...state, screen: action.tab, pauseOpen: false, editorContext: null } : state;
    case 'OPEN_SETTINGS':
      return state.screen === 'profile' ? { ...state, screen: 'settings' } : state;
    case 'CLOSE_SETTINGS':
      return state.screen === 'settings' ? { ...state, screen: 'profile' } : state;
    case 'SET_THEME':
      return ['light', 'dark'].includes(action.theme) ? { ...state, theme: action.theme } : state;
    case 'SET_ACCENT':
      return /^#[0-9a-f]{6}$/i.test(action.accent) ? { ...state, accent: action.accent.toUpperCase() } : state;
    case 'SET_PHOTO':
      return action.photo === null || (typeof action.photo === 'string' && /^data:image\/(png|jpeg|webp);base64,/.test(action.photo))
        ? { ...state, profilePhoto: action.photo } : state;
    case 'TOGGLE_FAVORITE': {
      if (typeof action.id !== 'string' || action.id.startsWith('mine-')) return state;
      const favoriteIds = state.favoriteIds.includes(action.id)
        ? state.favoriteIds.filter((id) => id !== action.id) : [...state.favoriteIds, action.id];
      return { ...state, favoriteIds };
    }
    case 'OPEN_EDITOR':
      if (!['recipes', 'mine'].includes(state.screen)) return state;
      return { ...state, screen: 'editor', editorContext: action.context };
    case 'CANCEL_EDITOR':
      return state.screen === 'editor' ? { ...state, screen: 'mine', editorContext: null } : state;
    case 'SAVE_PERSONAL': {
      if (state.screen !== 'editor' || !action.recipe?.id?.startsWith('mine-')) return state;
      const recipe = normalizePersonalRecipe(action.recipe);
      if (Object.keys(validatePersonalRecipe(recipe, Boolean(action.test))).length) return state;
      const previous = state.personalRecipes.find((item) => item.id === recipe.id);
      if (action.test && state.prep && state.prep.recipeId !== recipe.id && !action.replace) return state;
      const status = previous && !action.changed ? previous.status : 'draft';
      const saved = { ...recipe, status, hasBeenTested: previous?.hasBeenTested ?? false };
      const personalRecipes = previous
        ? state.personalRecipes.map((item) => item.id === saved.id ? saved : item)
        : [saved, ...state.personalRecipes];
      const prep = action.test ? newPrep(playablePersonalRecipe(saved), state.xp, action.now ?? Date.now()) : state.prep;
      return { ...state, personalRecipes, screen: action.test ? 'ingredients' : 'mine', editorContext: null, prep, latestCompletion: null };
    }
    case 'DELETE_PERSONAL':
      return state.screen === 'mine' ? { ...state, personalRecipes: state.personalRecipes.filter((item) => item.id !== action.id) } : state;
    case 'OPEN_PERSONAL': {
      if (state.screen !== 'mine') return state;
      const recipe = state.personalRecipes.find((item) => item.id === action.id);
      if (!recipe || Object.keys(validatePersonalRecipe(recipe, true)).length) return state;
      if (state.prep && state.prep.recipeId !== recipe.id && !action.replace) return state;
      const prep = state.prep?.recipeId === recipe.id ? state.prep : newPrep(playablePersonalRecipe(recipe), state.xp, action.now ?? Date.now());
      return { ...state, prep, screen: prep.stage, latestCompletion: null };
    }
    case 'RESTORE_BACKUP':
      return action.state?.version === 4 ? { ...action.state, screen: 'mine', editorContext: null, pauseOpen: false } : state;
    case 'SET_PROFILE_NAME': {
      if (state.screen !== 'profile' || typeof action.name !== 'string') return state;
      const name = action.name.trim();
      if (!name || name.length > 30) return state;
      return { ...state, profileName: name };
    }
    case 'SET_SEARCH':
      return state.screen === 'recipes' ? { ...state, search: action.value } : state;
    case 'TOGGLE_EQUIPMENT': {
      if (!['equipment', 'recipes'].includes(state.screen) || ![...equipmentKeys, 'none'].includes(action.key)) return state;
      const equipment = { ...state.equipment };
      if (action.key === 'none') {
        const turnOn = !equipment.none;
        for (const key of equipmentKeys) equipment[key] = false;
        equipment.none = turnOn;
      } else {
        equipment[action.key] = !equipment[action.key];
        equipment.none = false;
      }
      return { ...state, equipment };
    }
    case 'SEED_DEMO': {
      if (!['equipment', 'recipes'].includes(state.screen) || state.prep || state.completed !== 0 || state.xp !== 0) return state;
      const records = Array.from({ length: 9 }, (_, index) => ({
        id: `demo-${index + 1}`, recipe: 'Wrap frio', completedAt: null, durationMs: 300000, xpEarned: 120, kind: 'demo',
      }));
      return { ...state, xp: 1080, completed: 9, achievements: { wrap: 9 }, records };
    }
    case 'VIEW_RECIPES':
      if (state.screen === 'equipment' && !selectedEquipment(state.equipment)) return state;
      return { ...state, screen: 'recipes', pauseOpen: false };
    case 'RESUME_PREP':
      return state.screen === 'recipes' && state.prep ? { ...state, screen: state.prep.stage, pauseOpen: false } : state;
    case 'CHANGE_EQUIPMENT':
      return state.screen === 'recipes' ? { ...state, screen: 'equipment', search: '' } : state;
    case 'OPEN_WRAP':
    case 'OPEN_RECIPE': {
      if (state.screen !== 'recipes') return state;
      const recipe = action.recipe ?? recipeById(action.type === 'OPEN_WRAP' ? 'wrap' : action.recipeId);
      if (!recipe || (recipe.equipment && !state.equipment[recipe.equipment])) return state;
      if (state.prep && state.prep.recipeId !== recipe.id && !action.replace) return state;
      const prep = state.prep?.recipeId === recipe.id ? state.prep : newPrep(recipe, state.xp, action.now ?? Date.now());
      return { ...state, prep, screen: prep.stage, latestCompletion: null };
    }
    case 'TOGGLE_INGREDIENT': {
      if (state.screen !== 'ingredients' || !state.prep || state.pauseOpen) return state;
      const recipe = prepRecipe(state.prep);
      if (!recipe || !Number.isInteger(action.index) || action.index < 0 || action.index >= recipe.ingredients.length) return state;
      const checked = [...state.prep.checked];
      checked[action.index] = !checked[action.index];
      return { ...state, prep: { ...state.prep, checked } };
    }
    case 'START_RECIPE':
      if (state.screen !== 'ingredients' || state.pauseOpen || !state.prep?.checked.every(Boolean)) return state;
      return { ...state, screen: 'step', prep: { ...state.prep, stage: 'step' } };
    case 'OPEN_PAUSE':
      return ['ingredients', 'step'].includes(state.screen) && state.prep ? { ...state, pauseOpen: true } : state;
    case 'CLOSE_PAUSE':
      return { ...state, pauseOpen: false };
    case 'LEAVE_FOR_RECIPES':
      return state.pauseOpen ? { ...state, screen: state.prep?.recipeSnapshot?.personal ? 'mine' : 'recipes', pauseOpen: false } : state;
    case 'LEAVE_PREP':
      return ['ingredients', 'step'].includes(state.screen) && state.prep
        ? { ...state, screen: state.prep.recipeSnapshot?.personal ? 'mine' : 'recipes', pauseOpen: false } : state;
    case 'REQUEST_ADJUSTMENT': {
      if (state.screen !== 'step' || state.pauseOpen || !state.prep || state.prep.validated[state.prep.stepIndex]) return state;
      const firstTip = !state.prep.tipUsed;
      const deduction = firstTip ? Math.min(1, state.xp) : 0;
      return {
        ...state,
        xp: state.xp - deduction,
        prep: {
          ...state.prep,
          hintOpen: true,
          tipUsed: true,
          tipDeduction: firstTip ? 1 : state.prep.tipDeduction,
          pendingTipDeduction: state.prep.pendingTipDeduction + (firstTip ? 1 - deduction : 0),
        },
      };
    }
    case 'CLOSE_ADJUSTMENT':
      if (state.screen !== 'step' || !state.prep || state.prep.validated[state.prep.stepIndex]) return state;
      return { ...state, prep: { ...state.prep, hintOpen: false } };
    case 'VALIDATE_STEP': {
      if (state.screen !== 'step' || state.pauseOpen || !state.prep) return state;
      const recipe = prepRecipe(state.prep);
      if (!recipe) return state;
      const index = state.prep.stepIndex;
      if (index >= recipe.steps.length || state.prep.validated[index]) return state;
      const points = state.prep.tipUsed ? 4 : 5;
      const validated = [...state.prep.validated];
      const stepXp = [...state.prep.stepXp];
      validated[index] = true;
      stepXp[index] = points;
      const pendingTipDeduction = Math.min(points, state.prep.pendingTipDeduction);
      return {
        ...state,
        xp: state.xp + points - pendingTipDeduction,
        prep: { ...state.prep, validated, stepXp, hintOpen: false, pendingTipDeduction: state.prep.pendingTipDeduction - pendingTipDeduction },
      };
    }
    case 'NEXT_STEP':
      if (state.screen !== 'step' || state.pauseOpen || !state.prep || !state.prep.validated[state.prep.stepIndex] || state.prep.stepIndex >= (prepRecipe(state.prep)?.steps.length ?? 0) - 1) return state;
      return { ...state, prep: { ...state.prep, stepIndex: state.prep.stepIndex + 1, hintOpen: false } };
    case 'FINISH_RECIPE': {
      const recipe = prepRecipe(state.prep);
      if (state.screen !== 'step' || state.pauseOpen || !state.prep || !recipe || state.prep.stepIndex !== recipe.steps.length - 1 || !state.prep.validated.every(Boolean)) return state;
      const completed = state.completed + 1;
      const newMedal = medals.find((medal) => medal.threshold === completed) ?? null;
      const xp = state.xp + 100;
      const endedAt = action.now ?? Date.now();
      const stepTotal = state.prep.stepXp.reduce((sum, value) => sum + value, 0);
      const xpEarned = xp - state.prep.xpAtOpen;
      const record = {
        id: `${recipe.id}-${endedAt}-${completed}`,
        recipeId: recipe.id,
        recipe: recipe.name,
        emoji: recipe.emoji,
        source: recipe.personal ? 'personal' : 'standard',
        completedAt: endedAt,
        durationMs: Math.max(0, endedAt - state.prep.enteredAt),
        xpEarned,
        kind: 'new',
      };
      return {
        ...state,
        screen: 'complete',
        search: '',
        prep: null,
        xp,
        completed,
        achievements: { ...state.achievements, [recipe.id]: (state.achievements[recipe.id] ?? 0) + 1 },
        personalRecipes: recipe.personal ? state.personalRecipes.map((item) => item.id === recipe.id
          ? { ...item, status: item.hasBeenTested ? (item.status === 'draft' ? 'improved' : item.status) : 'tested', hasBeenTested: true }
          : item) : state.personalRecipes,
        records: [record, ...state.records],
        latestCompletion: { recipeId: recipe.id, recipeName: recipe.name, recipeEmoji: recipe.emoji, personal: Boolean(recipe.personal), newMedal: newMedal?.name ?? null, medalThreshold: newMedal?.threshold ?? null, stepTotal, tipDeduction: state.prep.tipDeduction, xpEarned },
      };
    }
    case 'ANIMATIONS_DONE':
      return state.screen === 'complete' ? { ...state, screen: 'records' } : state;
    default:
      return state;
  }
}
