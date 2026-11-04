export const EQUIPMENT_OPTIONS = [
  ['stove', 'Fogão'], ['fryer', 'Air fryer'], ['oven', 'Forno'],
  ['microwave', 'Micro-ondas'], ['electricPot', 'Panela elétrica'], ['none', 'Sem equipamento'],
];

export function emptyPersonalRecipe() {
  return {
    id: '', name: '', difficulty: 'simple', minutes: '', portions: 1,
    equipmentKeys: [], utensils: '', safety: '', ingredients: [''],
    steps: [{ instruction: '', question: '', tip: '' }],
    origin: null, status: 'draft', hasBeenTested: false, emoji: '🍽️',
  };
}

export function copyStandardRecipe(recipe) {
  return {
    ...emptyPersonalRecipe(),
    name: recipe.name,
    difficulty: recipe.difficulty,
    minutes: recipe.minutes,
    portions: recipe.portions,
    equipmentKeys: [recipe.equipment ?? 'none'],
    utensils: recipe.utensils,
    safety: recipe.safety ?? '',
    ingredients: [...recipe.ingredients],
    steps: recipe.steps.map((step) => ({ ...step })),
    emoji: recipe.emoji,
    origin: { id: recipe.id, name: recipe.name },
  };
}

export function normalizePersonalRecipe(value) {
  if (!value || typeof value !== 'object') return null;
  const base = emptyPersonalRecipe();
  const equipmentKeys = Array.isArray(value.equipmentKeys)
    ? value.equipmentKeys.filter((key) => EQUIPMENT_OPTIONS.some(([id]) => id === key)) : [];
  return {
    ...base,
    id: typeof value.id === 'string' ? value.id : '',
    name: typeof value.name === 'string' ? value.name.trim().slice(0, 80) : '',
    difficulty: ['simple', 'elaborate'].includes(value.difficulty) ? value.difficulty : 'simple',
    minutes: value.minutes === '' ? '' : Number(value.minutes),
    portions: value.portions === '' ? '' : Number(value.portions),
    equipmentKeys: equipmentKeys.includes('none') ? ['none'] : [...new Set(equipmentKeys)],
    utensils: typeof value.utensils === 'string' ? value.utensils.trim() : '',
    safety: typeof value.safety === 'string' ? value.safety.trim() : '',
    ingredients: Array.isArray(value.ingredients) ? value.ingredients.map((item) => String(item).trim()) : [''],
    steps: Array.isArray(value.steps) ? value.steps.map((step) => ({
      instruction: String(step?.instruction ?? '').trim(),
      question: String(step?.question ?? '').trim(),
      tip: String(step?.tip ?? '').trim(),
    })) : [{ instruction: '', question: '', tip: '' }],
    origin: value.origin && typeof value.origin.id === 'string' ? { id: value.origin.id, name: String(value.origin.name ?? '') } : null,
    status: ['draft', 'tested', 'improved'].includes(value.status) ? value.status : 'draft',
    hasBeenTested: Boolean(value.hasBeenTested),
    emoji: typeof value.emoji === 'string' ? value.emoji : '🍽️',
  };
}

export function validatePersonalRecipe(recipe, forTest = false) {
  const errors = {};
  const name = String(recipe.name ?? '').trim();
  if (name.length < 3 || name.length > 80) errors.name = 'Use um nome de 3 a 80 caracteres.';
  if (!forTest) return errors;
  if (!['simple', 'elaborate'].includes(recipe.difficulty)) errors.difficulty = 'Escolha a dificuldade.';
  if (!Number.isInteger(Number(recipe.minutes)) || Number(recipe.minutes) <= 0) errors.minutes = 'Informe o tempo em minutos.';
  if (!Number.isInteger(Number(recipe.portions)) || Number(recipe.portions) <= 0) errors.portions = 'Informe as porções.';
  if (!Array.isArray(recipe.equipmentKeys) || recipe.equipmentKeys.length === 0) errors.equipment = 'Escolha ao menos um equipamento.';
  if (!String(recipe.utensils ?? '').trim()) errors.utensils = 'Informe os utensílios.';
  if (!recipe.ingredients?.some((item) => String(item).trim())) errors.ingredients = 'Adicione ao menos um ingrediente.';
  if (!recipe.steps?.length || recipe.steps.some((step) => !String(step.instruction ?? '').trim() || !String(step.question ?? '').trim() || !String(step.tip ?? '').trim())) {
    errors.steps = 'Preencha instrução, conferência e Dica de cada etapa.';
  }
  return errors;
}

export function playablePersonalRecipe(recipe) {
  const item = normalizePersonalRecipe(recipe);
  return {
    ...item,
    personal: true,
    equipment: item.equipmentKeys.includes('none') ? null : item.equipmentKeys[0] ?? null,
    meta: `~${item.minutes} min · ${item.equipmentKeys.map((key) => EQUIPMENT_OPTIONS.find(([id]) => id === key)?.[1]).join(' + ')} · ${item.portions} ${item.portions === 1 ? 'porção' : 'porções'}`,
    ingredients: item.ingredients.filter(Boolean),
    steps: item.steps.filter((step) => step.instruction && step.question && step.tip),
  };
}

export function personalStatusText(recipe) {
  if (recipe.status === 'improved') return 'Revisada e testada novamente';
  if (recipe.status === 'tested') return 'Você concluiu um preparo desta versão';
  return recipe.hasBeenTested ? 'Alterações aguardam teste' : 'Ainda não testada';
}
