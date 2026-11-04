<p align="center">
  <img src="public/logo.svg" width="96" alt="Logo do Cozinhe como um Chefe: chapéu de chef branco com brilho dourado em fundo verde" />
</p>

# Cozinhe como um Chefe

**Um guia gamificado para aprender receitas enquanto a comida é preparada de verdade.** A pessoa escolhe seus equipamentos, separa ingredientes, segue uma etapa por vez, confere o resultado e recebe orientação quando precisa.

Este é um protótipo acadêmico da VT de Gamificação Aplicada. Foi feito em React, JavaScript, HTML semântico, Tailwind CSS e CSS complementar. O layout se adapta ao celular e ao PC.

## Demonstração

O endereço público do protótipo será adicionado aqui após a ativação do GitHub Pages. O endereço do repositório mostra os arquivos, mas a atividade exige também um **link navegável** para o professor.

**Percurso completo disponível:** Wrap frio, com quatro ingredientes e quatro etapas. As outras cinco receitas aparecem como **Em breve** para mostrar o filtro por equipamentos e a busca; elas ainda não podem ser preparadas no app.

## Como funciona

1. Escolha Fogão, Air fryer, Forno, Micro-ondas, Panela elétrica ou Sem equipamento.
2. Procure uma receita, abra o wrap e marque os quatro ingredientes.
3. Faça a etapa na cozinha e toque em **Deu certo** depois de conferir o resultado.
4. Se precisar, toque em **Dica**. Ela orienta sem avançar a etapa.
5. Após as quatro validações, conclua a receita e veja o preparo em **Registros**.

| Regra | Resultado |
| --- | --- |
| Etapa validada | 5 XP, uma vez por etapa e por preparo |
| Primeira Dica do preparo | Custa 1 XP e faz a etapa atual e as seguintes valerem 4 XP cada; com saldo zero, o custo sai do próximo ganho |
| Outras Dicas no mesmo preparo | Não cobram outro XP e não avançam a etapa |
| Receita concluída | 100 XP, uma conquista e um Registro com duração e XP líquido |
| Próximo nível | Exige `100 × nível atual` XP adicionais; nível 2 aos 100 XP acumulados, nível 3 aos 300, nível 4 aos 600 |
| Medalhas | Aos 10, 20, 30, 40 e 50 preparos concluídos |

As animações de etapa, conquista e medalha podem ser puladas com toque, clique ou **Esc**. A preferência por movimento reduzido é respeitada. O preparo pode ser pausado e retomado.

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

Há 20 testes automatizados. Eles cobrem XP, Dica com saldo zero, níveis, busca, retomada, Registros, medalha e animações. O PDF da VT registra os percursos de conclusão e exceção com resultados esperados e observados.

## Demonstração da medalha

Na tela inicial, toque em **Iniciar demonstração com 9 preparos**. Esses nove registros são **simulados**, sem datas inventadas. Ao concluir mais um wrap, o app mostra a medalha Iniciante do décimo preparo. Para testar a Dica com saldo zero, use uma janela privada nova ou limpe os dados locais antes de iniciar.

## Limites e privacidade

- O app guarda progresso apenas no `localStorage` do navegador. Não há conta, banco de dados nem sincronização entre dispositivos.
- O tempo do Registro vai da entrada no wrap até **Concluir receita**, incluindo checklist, pausa e tempo com a página fechada.
- Confirmar uma etapa não comprova que a pessoa cozinhou. O protótipo não registra todas as tentativas abandonadas; a avaliação de impacto descrita no PDF é um **plano futuro**, com meta hipotética de 50% para 70% em quatro semanas.
- A V2 não tem recursos sociais. O tom de apoio e a possibilidade de cozinhar acompanhado são o vínculo atual com pertencimento.

## Materiais da VT

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
