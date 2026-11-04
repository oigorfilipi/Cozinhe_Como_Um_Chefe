import { noHeatRecipes } from './catalog/none.js';
import { stoveRecipes } from './catalog/stove.js';
import { fryerRecipes } from './catalog/fryer.js';
import { ovenRecipes } from './catalog/oven.js';
import { microwaveRecipes } from './catalog/microwave.js';
import { electricPotRecipes } from './catalog/electric-pot.js';

export const medals = [
  { name: 'Iniciante', threshold: 10 },
  { name: 'Intermediária', threshold: 20 },
  { name: 'Avançada', threshold: 30 },
  { name: 'Chefe', threshold: 40 },
  { name: 'Alquimista da Cozinha', threshold: 50 },
];

export const recipes = [
  ...noHeatRecipes,
  ...stoveRecipes,
  ...fryerRecipes,
  ...ovenRecipes,
  ...microwaveRecipes,
  ...electricPotRecipes,
];

const recipeMap = new Map(recipes.map((recipe) => [recipe.id, recipe]));
export const recipeById = (id) => recipeMap.get(id) ?? null;

// Keep the original wrap as fallback when restoring a V1/V2 preparation.
export const ingredients = recipeById('wrap').ingredients;
export const steps = recipeById('wrap').steps;
