<p align="center">
  <img src="public/logo.svg" width="96" alt="Logo do Cozinhe como um Chefe: chapéu de chef branco com brilho dourado em fundo verde" />
</p>

# Cozinhe como um Chefe

**Um guia gamificado para aprender receitas enquanto a comida é preparada de verdade.** A pessoa escolhe seus equipamentos, separa ingredientes, segue uma etapa por vez, confere o resultado e recebe orientação quando precisa.

Este é um protótipo acadêmico da VT de Gamificação Aplicada. Foi feito em React, JavaScript, HTML semântico, Tailwind CSS e CSS complementar. O layout se adapta ao celular e ao PC.

## Demonstração

**[Abrir o site no GitHub Pages](https://oigorfilipi.github.io/Cozinhe_Como_Um_Chefe/)**. O mesmo endereço funciona no celular e no computador.

O catálogo tem **62 receitas jogáveis**: 10 para cada um dos cinco aparelhos e 12 sem aquecimento. Em cada aparelho há cinco receitas simples e cinco elaboradas; no grupo sem equipamento, seis de cada tipo. O wrap original continua disponível.

## Como funciona

1. No painel inicial, acompanhe nível, XP e próxima medalha. Escolha Fogão, Air fryer, Forno, Micro-ondas, Panela elétrica ou Sem equipamento.
2. Na página inicial, busque pelo nome ou ingrediente e marque receitas padrão como favoritas, mesmo antes de escolher os equipamentos. Depois, filtre por dificuldade, abra uma receita e marque seus ingredientes.
3. Faça a etapa na cozinha e toque em **Deu certo** depois de conferir o resultado.
4. Se precisar, toque em **Dica**. Ela orienta sem avançar a etapa.
5. Após validar todas as etapas, conclua a receita e veja o preparo em **Registros**.

| Regra | Resultado |
| --- | --- |
| Etapa validada | 5 XP, uma vez por etapa e por preparo |
| Primeira Dica do preparo | Custa 1 XP e faz a etapa atual e as seguintes valerem 4 XP cada; com saldo zero, o custo sai do próximo ganho |
| Outras Dicas no mesmo preparo | Não cobram outro XP e não avançam a etapa |
| Receita concluída | 100 XP, uma conquista e um Registro com duração e XP líquido |
| Próximo nível | Exige `100 × nível atual` XP adicionais; nível 2 aos 100 XP acumulados, nível 3 aos 300, nível 4 aos 600 |
| Medalhas | Aos 10, 20, 30, 40 e 50 preparos concluídos |

As animações de etapa, conquista e medalha podem ser puladas com toque, clique ou **Esc**. A preferência por movimento reduzido é respeitada. O preparo pode ser pausado e retomado.

## Minhas Receitas e personalização

A página **Minhas Receitas** abre diretamente em `#/minhas-receitas`, inclusive no GitHub Pages. É possível criar uma receita, copiar uma das 62 padrão, editar, excluir e preparar. Cada etapa própria exige instrução, conferência do resultado e Dica. **Salvar rascunho não dá XP.** O primeiro preparo completo da versão própria deixa a receita **Testada**; uma versão editada volta a **Rascunho** e, após novo preparo, fica **Aprimorada**. Os Registros guardam o nome usado em cada preparo, mesmo após renomear ou excluir a receita.

Os botões **Exportar backup** e **Importar backup** em Minhas Receitas permitem guardar e restaurar receitas próprias e o restante dos dados locais. A importação substitui o estado local depois de confirmação. O botão **Visual** no topo abre diretamente as configurações de foto de perfil, tema claro/escuro e cor geral livre. As áreas principais, os botões, os detalhes e o painel de missão acompanham a cor escolhida, com texto adaptado para manter contraste legível.

## Catálogo padrão no Git

A base contém **62 receitas padrão**, e o arquivo de alterações pode mudar o total publicado. O catálogo é igual para todos que abrem a mesma versão do site. Ele não pode ser editado nem excluído pela interface pública. Correções, novas receitas e exclusões podem ser preparadas no **editor local**, sem escrever código, e publicadas pelo GitHub. O wrap da demonstração pode ser editado, mas não excluído. Se suas alterações mudarem as regras ou os números da apresentação, atualize também o PDF da VT.

### Editor manual de receitas padrão

No Windows, depois de instalar as dependências com `pnpm install --frozen-lockfile`, abra [Abrir Editor de Receitas.cmd](Abrir%20Editor%20de%20Receitas.cmd) com dois cliques. Como alternativa, execute `pnpm editor`. O navegador abrirá o formulário local. **Ele não faz parte do site publicado** e não pede senha nem chave de acesso ao GitHub.

1. Escolha uma receita para editar ou clique em **Criar receita**. Preencha equipamento, dificuldade, tempo, porções, utensílios, ingredientes, instruções, conferências e Dicas. É possível excluir receitas, exceto o wrap usado na demonstração.
2. Clique em **Salvar receita no editor**. Essa ação guarda o rascunho neste navegador, sem alterar o site público. Use **Baixar manual.json** ou **Copiar conteúdo** para preparar o arquivo com todas as mudanças.
3. Entre na sua conta GitHub, abra [src/catalog/manual.json](src/catalog/manual.json), clique no lápis, selecione todo o conteúdo e cole o texto copiado do editor. Escolha **Commit changes**. Os testes e a publicação automática do GitHub Pages executarão depois do commit. Só quem tem permissão de escrita no repositório pode confirmar a alteração.

O editor permite **Carregar manual.json** para continuar a partir de um arquivo mais recente. Antes de editar novamente em outro computador, carregue o arquivo atualizado do GitHub. O rascunho local não é um backup: guarde o arquivo baixado até confirmar a publicação. O site público continua usando a versão anterior se o teste ou a publicação falhar.

As receitas criadas ou copiadas em **Minhas Receitas** pertencem apenas ao navegador da pessoa. Elas podem ser editadas e excluídas pela interface. O aplicativo não tem conta nem banco de dados; por isso, use **Exportar backup** para guardar seus dados antes de limpar o navegador ou trocar de aparelho.

## Testar no computador

Use Node.js 24 e pnpm 11, versões usadas no projeto. Na pasta do repositório:

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Abra o endereço local exibido no terminal. Para verificar as regras e compilar:

```bash
pnpm test
pnpm build
```

Os testes automatizados cobrem XP, Dica com saldo zero, níveis, catálogo por equipamento, alterações manuais do catálogo, receitas próprias, busca, favoritas, retomada, Registros, medalha, animações, migração, backup, contraste e ausência de controles para editar ou excluir receitas padrão no site público.

## Demonstração da medalha

Na tela inicial, toque em **Iniciar demonstração com 9 preparos**. Esses nove registros são **simulados**, sem datas inventadas. Ao concluir qualquer receita, o app mostra a medalha Iniciante do décimo preparo. Para testar a Dica com saldo zero, use uma janela privada nova ou limpe os dados locais antes de iniciar.

## Limites e privacidade

- Progresso, receitas próprias, fotos, preferências e favoritos ficam no `localStorage` do navegador. O catálogo padrão vem do código publicado no GitHub Pages.
- O tempo do Registro vai da entrada na receita até **Concluir receita**, incluindo checklist, pausa e tempo com a página fechada.
- Confirmar uma etapa não comprova que a pessoa cozinhou. O protótipo não registra todas as tentativas abandonadas; a avaliação de impacto descrita no PDF é um **plano futuro**, com meta hipotética de 50% para 70% em quatro semanas.
- O app não tem recursos sociais. O tom de apoio e a possibilidade de cozinhar acompanhado são o vínculo atual com pertencimento.

## Segurança ao cozinhar

Os tempos são aproximados e variam conforme o aparelho. Use recipientes indicados para micro-ondas, respeite o manual da panela elétrica e confirme o centro de carnes com termômetro culinário. As etapas com frango pedem **74 °C**; peixe pede **63 °C** ou carne opaca que se separa com garfo. Higienize as mãos e utensílios após contato com alimentos crus. Essas orientações seguem a [tabela de temperaturas do FoodSafety.gov](https://www.foodsafety.gov/food-safety-charts/safe-minimum-internal-temperatures), as [quatro etapas de segurança alimentar](https://www.foodsafety.gov/keep-food-safe/4-steps-to-food-safety) e a [cartilha de boas práticas da Anvisa](https://www.gov.br/anvisa/pt-br/arquivos-noticias-anvisa/812json-file-1/%40%40download/file).

## Materiais da VT

Os arquivos abaixo documentam a V4 e reúnem diagnóstico, regras, fluxo, cenários verificados, referências e roteiro de apresentação exigidos na VT.

- [Apresentação principal em PDF](output/pdf/Cozinhe_como_um_Chefe_Projeto.pdf)
- [Memorial técnico em DOCX](output/docx/Memorial_Tecnico_Cozinhe_como_um_Chefe.docx)
- [Guia de estudo em DOCX](output/docx/Guia_de_Estudo_Cozinhe_como_um_Chefe.docx)

O material relaciona as decisões à **Aula 7 Gamificação**, do Prof. Me. Gabriel Fernandes Cyrino: distinção entre gamificação e jogos sérios, Autodeterminação, motivação intrínseca e extrínseca, Bartle, MDA, ciclo de engajamento, métricas e desenho ético. O PDF também cita o enunciado da VT, o Guia Alimentar do Ministério da Saúde e as referências conceituais utilizadas. O arquivo da aula não foi incluído neste repositório.

O chapéu da logo foi adaptado do conjunto [Lucide Icons](https://lucide.dev/), sob licença ISC. O aviso de licença acompanha o arquivo SVG.

## Participantes no GitHub

- [@oigorfilipi](https://github.com/oigorfilipi)
- [@heloisl](https://github.com/heloisl)
- [@Gorgommel](https://github.com/Gorgommel)

Equipe do projeto: Igor Filipi, Heloisa Silva, Isaac Silva e Amanda Lima.
