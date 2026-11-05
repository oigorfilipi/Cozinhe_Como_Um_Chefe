import { describe, expect, it } from 'vitest';
import { baseRecipes } from '../data.js';
import manualCatalog from './manual.json';
import {
  applyManualCatalog, editableCatalogRecipe, serializeManualCatalog,
  validateCatalogRecipe, validateManualCatalog,
} from './manual.js';

const empty = () => ({ version: 1, upserts: [], removedIds: [] });

describe('catálogo manual', () => {
  it('aceita o arquivo atualmente usado na publicação', () => {
    expect(validateManualCatalog(manualCatalog, baseRecipes)).toEqual([]);
    expect(applyManualCatalog(baseRecipes, manualCatalog).some((recipe) => recipe.id === 'wrap')).toBe(true);
  });
  it('edita uma receita existente sem mudar o ID nem a base', () => {
    const original = baseRecipes.find((recipe) => recipe.id === 'wrap');
    const edited = editableCatalogRecipe(original);
    edited.name = 'Wrap revisado';
    edited.steps[0].instruction = 'Abra a tortilla com cuidado.';
    const catalog = applyManualCatalog(baseRecipes, { ...empty(), upserts: [edited] });
    expect(catalog).toHaveLength(baseRecipes.length);
    expect(catalog.find((recipe) => recipe.id === 'wrap')).toMatchObject({ name: 'Wrap revisado', meta: '~5 min · Sem equipamento · 1 porção' });
    expect(original.name).toBe('Wrap frio');
    expect(original.steps[0].instruction).not.toBe(edited.steps[0].instruction);
  });

  it('cria e exclui receitas por arquivo, preservando os demais preparos', () => {
    const added = { ...editableCatalogRecipe(baseRecipes[0]), id: 'sopa-da-casa', name: 'Sopa da casa', equipment: 'stove' };
    const removedId = 'salada-caprese';
    const changes = { ...empty(), upserts: [added], removedIds: [removedId] };
    const catalog = applyManualCatalog(baseRecipes, changes);
    expect(catalog).toHaveLength(baseRecipes.length);
    expect(catalog.find((recipe) => recipe.id === added.id)).toMatchObject({ name: added.name, equipment: 'stove' });
    expect(catalog.some((recipe) => recipe.id === removedId)).toBe(false);
    expect(catalog.some((recipe) => recipe.id === 'wrap')).toBe(true);
    expect(JSON.parse(serializeManualCatalog(changes, baseRecipes))).toEqual(changes);
  });

  it('recusa arquivos inválidos e protege o wrap da demonstração', () => {
    expect(validateManualCatalog({ ...empty(), removedIds: ['wrap'] }, baseRecipes)).toContain('O wrap da demonstração não pode ser excluído.');
    expect(validateCatalogRecipe({ ...editableCatalogRecipe(baseRecipes[0]), steps: [{ instruction: '', question: '', tip: '' }] })).toHaveProperty('steps');
    expect(() => applyManualCatalog(baseRecipes, { ...empty(), upserts: [editableCatalogRecipe(baseRecipes[0])], removedIds: [baseRecipes[0].id] })).toThrow('editada e excluída');
    expect(() => applyManualCatalog(baseRecipes, { version: 2, upserts: [], removedIds: [] })).toThrow('version 1');
  });
});
