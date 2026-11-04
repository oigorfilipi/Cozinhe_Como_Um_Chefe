# Cozinha em Missões — especificação de design V2

Este documento define **somente as mudanças da V2** sobre o protótipo em `src/App.jsx`, `src/data.js`, `src/state.js` e `src/styles.css`. O percurso do Wrap frio, seus quatro ingredientes, instruções, dicas, botões de validação, pausa, pontuação por etapa e por conclusão e os cinco limiares de medalha continuam como estão. Não criar login, backend, novas receitas jogáveis ou outras funções.

## 1. Base visual e layout

### Celular (320–767 px)

Manter a identidade e as proporções atuais: fundo `#f7f8f3`, texto `#183027`, verde principal `#286b49`, borda `#dce5dc`, cartões brancos, dicas `#fff4db`, cabeçalho de 72 px, conteúdo de até 480 px com margens de 16 px, títulos de 28 px, cartões arredondados e botões principais de 56 px e secundários de 52 px. Preservar os ícones lineares, a pílula amarela de XP no cabeçalho e a disposição das telas já existentes. Registros e Perfil usam os mesmos títulos, cartões, espaçamentos e estados selecionados do protótipo.

### PC e tablet

Em `768–1023 px`, retirar o limite de 480 px: conteúdo com largura máxima de 960 px, margens de 24 px e abas em linha abaixo do cabeçalho. Usar duas colunas iguais para equipamentos e receitas. Em `≥1024 px`, cabeçalho em toda a largura, navegação lateral de 224 px à esquerda e área principal com largura máxima de 1200 px e margens de 32 px. Equipamentos e receitas ficam em grade de três colunas iguais; Registros vira uma tabela; Perfil usa duas colunas iguais (identidade/nível à esquerda, medalhas/conquistas à direita). Durante o preparo, ocultar a navegação lateral: instrução e progresso ocupam 7 das 12 colunas; pergunta, dica e ações ocupam as outras 5. Na conclusão, resumo à esquerda e medalhas à direita, também em 7/5 colunas. No PC, os botões de ação ficam no painel de conteúdo, abaixo da pergunta ou do resumo, sem barra fixa inferior. Não esticar textos ou cartões para ocupar toda a largura de monitores grandes.

## 2. Mapa de telas e navegação

| Local | Conteúdo e destino |
|---|---|
| **Receitas — primeira visita** | A tela atual de equipamentos recebe o cartão de nível descrito abaixo. Após a escolha, o botão fixo **Ver receitas** abre o catálogo. |
| **Receitas — catálogo** | A tela atual de receitas recebe o cartão de nível, a busca e o filtro ampliado. Abre Wrap frio ou **Alterar equipamentos**. |
| **Ingredientes → Etapa → Conclusão** | Mantêm o fluxo atual. A conclusão ganha a sequência visual definida na seção 6; **Ver receitas** retorna ao catálogo. |
| **Registros** | Lista de todos os preparos concluídos, mais recente primeiro. |
| **Perfil** | Nome editável, nível, XP total, medalhas e conquistas. |

As três abas principais são **Receitas**, **Registros** e **Perfil**, com ícones lineares de livro, relógio e pessoa. No celular, aparecem apenas nas telas de equipamentos, catálogo, Registros e Perfil. A barra de abas fica fixa no rodapé, tem 64 px mais `safe-area-inset-bottom`, ícones de 20 px e rótulos de 11 px; a aba ativa usa verde `#286b49`, negrito e um traço verde de 2 px no topo. A barra de ação fixa de **Ver receitas** na tela de equipamentos fica **imediatamente acima** das abas, com a mesma largura e estilo atuais. Reservar no conteúdo a altura somada das duas barras para não encobrir cartões. Catálogo, Registros e Perfil não têm barra de ação fixa. No tablet, as abas ocupam uma linha horizontal abaixo do cabeçalho; no PC, são três itens verticais na lateral. Marcar a aba ativa com `aria-current="page"`.

Durante Ingredientes, Etapa, janela de pausa, animações e Conclusão, ocultar as abas e manter os botões fixos atuais na borda inferior do celular. **Pausar → Ir para receitas** salva o ponto e volta ao catálogo, onde as abas reaparecem e o cartão do Wrap frio mostra **Retomar receita**. Trocar de aba fora do preparo não modifica a receita pausada. Se ainda não houver equipamento selecionado, voltar à aba Receitas mostra a seleção; caso contrário, mostra o catálogo. Manter a busca ao trocar de aba; limpá-la ao alterar equipamentos ou concluir uma receita.

## 3. Nível e XP na tela inicial

No topo da área de conteúdo de ambas as vistas da aba Receitas, antes do título atual, inserir um cartão branco de borda e raio atuais:

- Linha superior: **Nível N** à esquerda e **XP total: X** à direita.
- Barra verde de 9 px de altura, com trilho `#e5eee6`.
- Linha inferior: **Y de 500 XP para o próximo nível**.

Regra fechada: cada nível exige 500 XP; `N = floor(X / 500) + 1` e `Y = X % 500`. Por exemplo, 0 XP mostra nível 1 e 0/500; 1.080 XP mostra nível 3 e 80/500. O nível não altera receitas, XP ou medalhas. A pílula de XP existente no cabeçalho continua exibindo o total. A barra deve expor seu valor a leitores de tela.

## 4. Equipamentos, filtro e busca

Substituir **Nenhum dos dois** por **Sem equipamento**. As opções Fogão, Air fryer, Forno, Micro-ondas e Panela elétrica são multisseleção; **Sem equipamento** é exclusiva e desmarca todas as outras. Marcar qualquer equipamento desmarca **Sem equipamento**. Sem seleção, **Ver receitas** continua desativado. Cada opção nova usa o cartão atual de 84 px, ícone linear em quadrado colorido e marca de seleção à direita.

| Opção | Texto de apoio | Receita exibida no catálogo |
|---|---|---|
| Fogão | Para receitas na panela | Omelete simples · 10 min · Fogão |
| Air fryer | Para receitas crocantes | Batata crocante · 20 min · Air fryer |
| Forno | Para receitas assadas | Legumes assados · 25 min · Forno |
| Micro-ondas | Para receitas rápidas | Bolo de caneca · 5 min · Micro-ondas |
| Panela elétrica | Para preparos na panela elétrica | Arroz simples · 30 min · Panela elétrica |
| Sem equipamento | Receitas sem aquecimento | Apenas Wrap frio |

O **Wrap frio · 5 min · Sem aquecimento** aparece para qualquer seleção e continua sendo a única receita navegável. As outras cinco têm selo **Em breve**, sem botão ou abertura. Ordenar os cartões como na tabela, sempre depois do Wrap frio. O filtro mostra somente receitas compatíveis com ao menos um equipamento marcado. A pílula atual de filtro mostra os nomes selecionados separados por ` + ` e pode quebrar linha no celular.

No catálogo, inserir acima dos cartões um campo com ícone de lupa, rótulo acessível **Buscar receitas** e placeholder **Buscar receita**. A busca filtra o resultado já compatível por nome, ignorando maiúsculas, acentos e espaços nas pontas. Com texto, mostrar um botão **Limpar busca** dentro do campo. Sem correspondência, exibir um cartão: **Nenhuma receita encontrada.** / **Tente outro nome ou altere os equipamentos.** Não criar busca global nem abrir receitas **Em breve**.

## 5. Registros e Perfil

### Registros

Título **Seus registros**; apoio **Cada receita concluída fica guardada aqui.** Cada preparo concluído gera uma linha própria, em ordem da conclusão mais recente, com **Wrap frio**, data/hora local em `dd/mm/aaaa · HH:mm`, **Duração: m:ss** (ou `h:mm:ss` após 59:59) e **XP ganho: 120 XP**. No celular, usar cartões brancos de altura variável com esses quatro dados; no PC, tabela com colunas Receita, Concluído em, Duração e XP ganho. Não oferecer edição, exclusão ou detalhes. Estado vazio: **Nenhum preparo concluído ainda.** / **Prepare o Wrap frio para criar seu primeiro registro.** / botão **Explorar receitas**, que abre a aba Receitas.

A duração começa em **Começar receita**, termina em **Concluir receita** e exclui o tempo entre **Pausar** e **Continuar/Retomar receita**, além do tempo com a página fechada. O checklist anterior ao início não entra na duração. Conceder XP e gravar o registro antes de iniciar as animações de conclusão; um clique repetido não cria outro registro.

### Perfil

Título **Seu perfil**. O cartão de identidade mostra o nome inicial **Pessoa cozinheira** e botão **Editar nome**. Ao tocar, substituir o nome por campo de texto com limite de 30 caracteres e botões **Salvar** e **Cancelar**. Salvar remove espaços das pontas; nome vazio mantém o campo aberto e mostra **Digite um nome para continuar.** Cancelar restaura o nome anterior. O nome é salvo localmente.

Logo abaixo, mostrar **Nível N**, **XP total: X**, a mesma barra de 500 XP e **Receitas concluídas: N**. A seção **Medalhas** reutiliza as cinco medalhas, limiares e estados **Conquistada/Bloqueada** atuais, com a mensagem de progresso até a próxima. A seção **Conquistas** mostra **Wrap frio preparado · Recebida N vezes** quando N > 0; caso contrário, **Você ainda não recebeu conquistas.** Não acrescentar outras conquistas ou tipos de perfil.

## 6. Estados visuais das animações

As animações usam uma camada que cobre toda a tela, bloqueia as ações atrás dela e desfoca o conteúdo (`backdrop-filter: blur(6px)`, com véu `rgba(24,48,39,.42)`; sem suporte a desfoque, usar apenas o véu). O cartão central tem fundo branco, borda `#dce5dc`, raio de 20 px, largura `min(380px, calc(100vw - 32px))` no celular e 440 px no PC; o de medalha tem até 420 px no celular e 520 px no PC. Ícone de etapa e conquista: 48 px; de conclusão: 72 px; de medalha: 96 px. Cada estado tem botão **Pular** visível no canto inferior direito do cartão, com área de toque de pelo menos 48 px. Um toque ou clique **em qualquer ponto da camada**, inclusive no cartão, pula somente o estado atual; o mesmo gesto não aciona o conteúdo atrás. A tecla Esc também pula. Focar o botão **Pular** ao abrir o estado e devolver o foco à ação adequada ao fechar.

| Gatilho/estado | Visual e texto essencial | Duração e destino |
|---|---|---|
| **Etapa validada** | Ícone verde de confirmação, título **Etapa validada!**, valor **+5 XP**, breve aumento de escala do cartão. | Cerca de **2 s**; volta à etapa validada, com o cartão e o botão **Próxima etapa** ou **Concluir receita** já existentes. Nunca avança a etapa automaticamente. |
| **Conclusão** | Cartão maior com ícone do wrap e brilho dourado: **Wrap frio pronto!** / **+100 XP pela receita**. | **5 s**; segue para Conquista. |
| **Conquista** | Cartão compacto verde claro: **Conquista recebida** / **Wrap frio preparado**. | **1,5 s**; segue para Medalha, se houve novo limiar, ou para a tela de Conclusão. |
| **Medalha** | Cartão de maior destaque, fundo amarelo claro, medalha central maior e brilho: **Nova medalha: [nome]!** / **[limiar] receitas concluídas**. | **3 s**; segue para a tela de Conclusão. Aparece somente ao atingir exatamente 10, 20, 30, 40 ou 50 preparos. |

Sequência completa: validar a quarta etapa → animação de etapa → botão **Concluir receita** → Conclusão → Conquista → Medalha, quando aplicável → tela de Conclusão existente. A tela final preserva seus cartões de XP, conquista e medalhas; as animações não substituem essas informações. Se a página for recarregada durante uma animação, abrir diretamente o estado estável já salvo, sem repetir o efeito nem a recompensa.

Com `prefers-reduced-motion: reduce`, não executar escala, desfoque animado nem esperas automáticas: apresentar imediatamente o cartão de etapa validada ou a tela final, com conquista e eventual medalha nos cartões estáticos existentes. Nos demais casos, usar transições suaves de opacidade e escala de até 200 ms, sem som ou partículas.

## 7. Persistência dos dados atuais

Migrar o estado local V1 sem perder XP, preparos concluídos, conquistas, medalhas ou receita pausada. Acrescentar nome, novos equipamentos e registros; equipamentos novos começam desmarcados. Os preparos V1 não têm duração nem data individual: criar uma linha por preparo anterior com **Data não registrada**, **Duração não registrada** e **120 XP**, sem inventar horários. A demonstração existente de nove preparos, quando iniciada já na V2, deve criar nove registros rotulados **Demonstração**, cada um com **5:00** e **120 XP**; eles continuam contando para nível e medalhas. Novos preparos têm data e duração medidas conforme a seção 5. Os estados de animação são temporários e não precisam ser persistidos.
