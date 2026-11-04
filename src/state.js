import { ingredients, medals, recipes, steps } from './data.js';

// Keep the V1 key so existing browser data can be migrated in place.
export const STORAGE_KEY = 'cozinha-xp-prototipo-v1';
const equipmentKeys = ['stove', 'fryer', 'oven', 'microwave', 'electricPot'];

export function initialState() {
  return {
    version: 2,
    screen: 'equipment',
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

export function compatibleRecipes(equipment, search = '') {
  const query = search.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
  return recipes.filter((recipe) =>
    (!recipe.equipment || equipment[recipe.equipment]) &&
    recipe.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').includes(query),
  );
}

function newPrep(xp, now) {
  return {
    stage: 'ingredients',
    checked: ingredients.map(() => false),
    stepIndex: 0,
    validated: steps.map(() => false),
    stepXp: steps.map(() => 0),
    hintOpen: false,
    tipUsed: false,
    tipDeduction: 0,
    pendingTipDeduction: 0,
    enteredAt: now,
    xpAtOpen: xp,
  };
}

function normalizePrep(prep, xp, now) {
  if (!prep || !['ingredients', 'step'].includes(prep.stage)) return null;
  const validated = steps.map((_, index) => Boolean(prep.validated?.[index]));
  const stepXp = steps.map((_, index) => validated[index] ? (prep.stepXp?.[index] ?? 5) : 0);
  return {
    stage: prep.stage,
    checked: ingredients.map((_, index) => Boolean(prep.checked?.[index])),
    stepIndex: Math.max(0, Math.min(steps.length - 1, Number.isInteger(prep.stepIndex) ? prep.stepIndex : 0)),
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
  if (![1, 2].includes(saved?.version) || !saved.equipment || !Number.isInteger(saved.xp) || !Number.isInteger(saved.completed)) return initialState();
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
  let screen = ['equipment', 'recipes', 'ingredients', 'step', 'complete', 'records', 'profile'].includes(saved.screen)
    ? saved.screen : 'equipment';
  // Effects are transient. Reloading during a completion effect opens stable records.
  if (screen === 'complete') screen = 'records';
  if (['ingredients', 'step'].includes(screen) && !prep) screen = selectedEquipment(equipment) ? 'recipes' : 'equipment';
  return {
    ...base,
    screen,
    equipment,
    prep,
    pauseOpen: ['ingredients', 'step'].includes(screen) && Boolean(saved.pauseOpen),
    xp: Math.max(0, saved.xp),
    completed,
    achievements: { wrap: Math.max(0, saved.achievements?.wrap ?? completed) },
    latestCompletion: saved.latestCompletion ?? null,
    records: saved.version === 1 ? legacyRecords : (Array.isArray(saved.records) ? saved.records : legacyRecords),
    profileName: saved.version === 2 && typeof saved.profileName === 'string' && saved.profileName.trim() ? saved.profileName : base.profileName,
    search: saved.version === 2 && typeof saved.search === 'string' ? saved.search : '',
  };
}

export function loadState() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    return migrateState(saved);
  } catch {
    return initialState();
  }
}

export function reducer(state, action) {
  switch (action.type) {
    case 'NAVIGATE': {
      if (!['equipment', 'recipes', 'records', 'profile'].includes(state.screen) || !['recipes', 'records', 'profile'].includes(action.tab)) return state;
      const screen = action.tab === 'recipes' ? (selectedEquipment(state.equipment) ? 'recipes' : 'equipment') : action.tab;
      return { ...state, screen };
    }
    case 'SET_PROFILE_NAME': {
      if (state.screen !== 'profile' || typeof action.name !== 'string') return state;
      const name = action.name.trim();
      if (!name || name.length > 30) return state;
      return { ...state, profileName: name };
    }
    case 'SET_SEARCH':
      return state.screen === 'recipes' ? { ...state, search: action.value } : state;
    case 'TOGGLE_EQUIPMENT': {
      if (state.screen !== 'equipment' || ![...equipmentKeys, 'none'].includes(action.key)) return state;
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
      if (state.screen !== 'equipment' || state.prep || state.completed !== 0 || state.xp !== 0) return state;
      const records = Array.from({ length: 9 }, (_, index) => ({
        id: `demo-${index + 1}`, recipe: 'Wrap frio', completedAt: null, durationMs: 300000, xpEarned: 120, kind: 'demo',
      }));
      return { ...state, xp: 1080, completed: 9, achievements: { wrap: 9 }, records };
    }
    case 'VIEW_RECIPES':
      if (state.screen === 'equipment' && !selectedEquipment(state.equipment)) return state;
      return { ...state, screen: 'recipes', pauseOpen: false };
    case 'CHANGE_EQUIPMENT':
      return state.screen === 'recipes' ? { ...state, screen: 'equipment', search: '' } : state;
    case 'OPEN_WRAP': {
      if (state.screen !== 'recipes') return state;
      const prep = state.prep ?? newPrep(state.xp, action.now ?? Date.now());
      return { ...state, prep, screen: prep.stage, latestCompletion: null };
    }
    case 'TOGGLE_INGREDIENT': {
      if (state.screen !== 'ingredients' || !state.prep || state.pauseOpen) return state;
      if (!Number.isInteger(action.index) || action.index < 0 || action.index >= ingredients.length) return state;
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
      return state.pauseOpen ? { ...state, screen: 'recipes', pauseOpen: false } : state;
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
      const index = state.prep.stepIndex;
      if (state.prep.validated[index]) return state;
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
      if (state.screen !== 'step' || state.pauseOpen || !state.prep || !state.prep.validated[state.prep.stepIndex] || state.prep.stepIndex >= steps.length - 1) return state;
      return { ...state, prep: { ...state.prep, stepIndex: state.prep.stepIndex + 1, hintOpen: false } };
    case 'FINISH_RECIPE': {
      if (state.screen !== 'step' || state.pauseOpen || !state.prep || state.prep.stepIndex !== steps.length - 1 || !state.prep.validated.every(Boolean)) return state;
      const completed = state.completed + 1;
      const newMedal = medals.find((medal) => medal.threshold === completed) ?? null;
      const xp = state.xp + 100;
      const endedAt = action.now ?? Date.now();
      const stepTotal = state.prep.stepXp.reduce((sum, value) => sum + value, 0);
      const xpEarned = xp - state.prep.xpAtOpen;
      const record = {
        id: `wrap-${endedAt}-${completed}`,
        recipe: 'Wrap frio',
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
        achievements: { ...state.achievements, wrap: state.achievements.wrap + 1 },
        records: [record, ...state.records],
        latestCompletion: { newMedal: newMedal?.name ?? null, medalThreshold: newMedal?.threshold ?? null, stepTotal, tipDeduction: state.prep.tipDeduction, xpEarned },
      };
    }
    case 'ANIMATIONS_DONE':
      return state.screen === 'complete' ? { ...state, screen: 'records' } : state;
    default:
      return state;
  }
}
