import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ManualEditor from '../../tools/catalog-editor/main.jsx';

vi.mock('./manual.json', () => ({ default: { version: 1, upserts: [], removedIds: [] } }));

beforeEach(() => {
  window.localStorage.clear();
  vi.stubGlobal('confirm', () => true);
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

function exportedCatalog() {
  return JSON.parse(screen.getByRole('textbox', { name: 'Conteúdo do arquivo' }).value);
}

describe('editor local do catálogo', () => {
  it('salva uma edição no rascunho e a inclui no arquivo para GitHub', async () => {
    const user = userEvent.setup();
    render(<ManualEditor />);
    expect(screen.getByRole('heading', { name: 'Edite receitas sem mexer no código' })).toBeInTheDocument();
    await user.clear(screen.getByRole('textbox', { name: 'Nome' }));
    await user.type(screen.getByRole('textbox', { name: 'Nome' }), 'Wrap revisado');
    await user.click(screen.getByRole('button', { name: 'Salvar receita no editor' }));
    expect(exportedCatalog().upserts).toEqual([expect.objectContaining({ id: 'wrap', name: 'Wrap revisado' })]);
    expect(screen.getByRole('button', { name: 'Baixar manual.json' })).toBeEnabled();
    expect(JSON.parse(window.localStorage.getItem('cozinhe-catalog-editor-v1')).changes.upserts[0].name).toBe('Wrap revisado');
  });

  it('cria uma receita completa e gera ID sem pedir código ao usuário', async () => {
    const user = userEvent.setup();
    render(<ManualEditor />);
    await user.click(screen.getByRole('button', { name: '+ Criar receita' }));
    await user.type(screen.getByRole('textbox', { name: 'Nome' }), 'Sopa Caseira de Teste');
    await user.selectOptions(screen.getByLabelText('Equipamento'), 'stove');
    await user.type(screen.getByRole('textbox', { name: 'Utensílios' }), 'Panela e colher');
    await user.type(screen.getByRole('textbox', { name: 'Ingrediente 1' }), '1 xícara de água');
    await user.type(screen.getByRole('textbox', { name: 'O que fazer' }), 'Aqueça a água.');
    await user.type(screen.getByRole('textbox', { name: 'Como conferir se deu certo?' }), 'Está quente?');
    await user.type(screen.getByRole('textbox', { name: 'Dica caso não dê certo' }), 'Espere mais.');
    await user.click(screen.getByRole('button', { name: 'Salvar receita no editor' }));
    expect(exportedCatalog().upserts[0]).toMatchObject({ id: 'sopa-caseira-de-teste', equipment: 'stove' });
    expect(screen.getByText('ID permanente: sopa-caseira-de-teste')).toBeInTheDocument();
  });

  it('exclui e restaura uma receita padrão, sem afetar a publicada', async () => {
    const user = userEvent.setup();
    render(<ManualEditor />);
    await user.selectOptions(screen.getByLabelText('Escolha uma receita'), 'salada-caprese');
    await user.click(screen.getByRole('button', { name: 'Excluir receita' }));
    expect(exportedCatalog().removedIds).toContain('salada-caprese');
    expect(screen.getByText('Excluída da próxima versão')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Restaurar original' }));
    expect(exportedCatalog().removedIds).not.toContain('salada-caprese');
    expect(screen.getByRole('button', { name: 'Baixar manual.json' })).toBeDisabled();
  });
});
