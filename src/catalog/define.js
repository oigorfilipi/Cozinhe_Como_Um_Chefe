const equipmentNames = {
  stove: 'Fogão',
  fryer: 'Air fryer',
  oven: 'Forno',
  microwave: 'Micro-ondas',
  electricPot: 'Panela elétrica',
  none: 'Sem equipamento',
};

// Compact source format: id, name, emoji, minutes, portions, utensils,
// ingredients, [instruction, check, help] stages, and optional safety note.
export function defineRecipes(equipment, difficulty, entries) {
  return entries.map(([id, name, emoji, minutes, portions, utensils, ingredients, stages, safety]) => ({
    id, name, emoji, minutes, portions, utensils, ingredients,
    equipment: equipment === 'none' ? null : equipment,
    difficulty,
    meta: `~${minutes} min · ${equipmentNames[equipment]} · ${portions} ${portions === 1 ? 'porção' : 'porções'}`,
    steps: stages.map(([instruction, question, tip]) => ({ instruction, question, tip })),
    safety: safety ?? '',
    available: true,
  }));
}
