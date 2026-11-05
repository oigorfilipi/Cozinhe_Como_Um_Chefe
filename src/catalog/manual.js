export const EQUIPMENT_NAMES = {
  stove: 'Fogão',
  fryer: 'Air fryer',
  oven: 'Forno',
  microwave: 'Micro-ondas',
  electricPot: 'Panela elétrica',
  none: 'Sem equipamento',
};

const allowedEquipment = new Set(Object.keys(EQUIPMENT_NAMES));
const hasText = (value) => typeof value === 'string' && value.trim().length > 0;

export function editableCatalogRecipe(recipe) {
  return {
    id: recipe.id,
    name: recipe.name,
    emoji: recipe.emoji,
    minutes: recipe.minutes,
    portions: recipe.portions,
    equipment: recipe.equipment ?? null,
    difficulty: recipe.difficulty,
    utensils: recipe.utensils,
    safety: recipe.safety ?? '',
    ingredients: [...recipe.ingredients],
    steps: recipe.steps.map(({ instruction, question, tip }) => ({ instruction, question, tip })),
  };
}

export function validateCatalogRecipe(recipe) {
  const errors = {};
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(recipe?.id ?? '') || recipe.id.startsWith('mine-')) errors.id = 'Use um ID com letras minúsculas, números e hífens.';
  if (!hasText(recipe?.name) || recipe.name.trim().length < 3 || recipe.name.trim().length > 80) errors.name = 'Informe um nome de 3 a 80 caracteres.';
  if (!hasText(recipe?.emoji) || recipe.emoji.length > 12) errors.emoji = 'Escolha um emoji curto.';
  if (!Number.isInteger(Number(recipe?.minutes)) || Number(recipe.minutes) < 1 || Number(recipe.minutes) > 1440) errors.minutes = 'Informe de 1 a 1440 minutos.';
  if (!Number.isInteger(Number(recipe?.portions)) || Number(recipe.portions) < 1 || Number(recipe.portions) > 100) errors.portions = 'Informe de 1 a 100 porções.';
  if (recipe?.equipment !== null && !allowedEquipment.has(recipe?.equipment)) errors.equipment = 'Escolha um equipamento.';
  if (!['simple', 'elaborate'].includes(recipe?.difficulty)) errors.difficulty = 'Escolha a dificuldade.';
  if (!hasText(recipe?.utensils)) errors.utensils = 'Informe os utensílios.';
  if (typeof recipe?.safety !== 'string') errors.safety = 'A orientação final deve ser texto.';
  if (!Array.isArray(recipe?.ingredients) || !recipe.ingredients.length || recipe.ingredients.some((item) => !hasText(item))) errors.ingredients = 'Preencha todos os ingredientes.';
  if (!Array.isArray(recipe?.steps) || !recipe.steps.length || recipe.steps.some((step) =>
    !hasText(step?.instruction) || !hasText(step?.question) || !hasText(step?.tip))) {
    errors.steps = 'Cada etapa precisa de instrução, conferência e Dica.';
  }
  return errors;
}

function normalizeCatalogRecipe(recipe) {
  const equipment = recipe.equipment ?? null;
  const key = equipment ?? 'none';
  const portions = Number(recipe.portions);
  const minutes = Number(recipe.minutes);
  return {
    id: recipe.id.trim(),
    name: recipe.name.trim(),
    emoji: recipe.emoji.trim(),
    minutes,
    portions,
    equipment,
    difficulty: recipe.difficulty,
    utensils: recipe.utensils.trim(),
    safety: recipe.safety.trim(),
    ingredients: recipe.ingredients.map((item) => item.trim()),
    steps: recipe.steps.map((step) => ({
      instruction: step.instruction.trim(), question: step.question.trim(), tip: step.tip.trim(),
    })),
    meta: `~${minutes} min · ${EQUIPMENT_NAMES[key]} · ${portions} ${portions === 1 ? 'porção' : 'porções'}`,
    available: true,
  };
}

export function validateManualCatalog(changes, baseRecipes) {
  const errors = [];
  if (!changes || changes.version !== 1 || !Array.isArray(changes.upserts) || !Array.isArray(changes.removedIds)) {
    return ['O arquivo precisa ter version 1, upserts e removedIds.'];
  }
  const baseIds = new Set(baseRecipes.map((recipe) => recipe.id));
  const upsertIds = new Set();
  for (const recipe of changes.upserts) {
    const fields = validateCatalogRecipe(recipe);
    if (Object.keys(fields).length) errors.push(`Receita ${recipe?.id ?? '(sem ID)'}: ${Object.values(fields).join(' ')}`);
    if (upsertIds.has(recipe?.id)) errors.push(`ID repetido: ${recipe.id}.`);
    upsertIds.add(recipe?.id);
  }
  const removed = new Set();
  for (const id of changes.removedIds) {
    if (typeof id !== 'string' || !baseIds.has(id)) errors.push(`ID excluído desconhecido: ${String(id)}.`);
    if (id === 'wrap') errors.push('O wrap da demonstração não pode ser excluído.');
    if (removed.has(id)) errors.push(`ID excluído repetido: ${id}.`);
    if (upsertIds.has(id)) errors.push(`A receita ${id} não pode estar editada e excluída ao mesmo tempo.`);
    removed.add(id);
  }
  return errors;
}

export function applyManualCatalog(baseRecipes, changes) {
  const errors = validateManualCatalog(changes, baseRecipes);
  if (errors.length) throw new Error(errors.join('\n'));
  const edited = new Map(changes.upserts.map((recipe) => [recipe.id, normalizeCatalogRecipe(recipe)]));
  const removed = new Set(changes.removedIds);
  const baseIds = new Set(baseRecipes.map((recipe) => recipe.id));
  return [
    ...baseRecipes.filter((recipe) => !removed.has(recipe.id)).map((recipe) => edited.get(recipe.id) ?? recipe),
    ...changes.upserts.filter((recipe) => !baseIds.has(recipe.id)).map((recipe) => edited.get(recipe.id)),
  ];
}

export function serializeManualCatalog(changes, baseRecipes) {
  const errors = validateManualCatalog(changes, baseRecipes);
  if (errors.length) throw new Error(errors.join('\n'));
  return `${JSON.stringify(changes, null, 2)}\n`;
}
