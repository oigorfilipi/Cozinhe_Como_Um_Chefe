import { defineRecipes } from './define.js';

// These use the normal cook/keep-warm cycle of a rice cooker or multicooker;
// no pressure-cooking functions are assumed.
export const electricPotRecipes = [
  ...defineRecipes('electricPot', 'simple', [
    ['arroz-branco-eletrico', 'Arroz branco na panela elétrica', '🍚', 30, 3, 'panela elétrica de arroz e colher',
      ['1 xícara de arroz', '2 xícaras de água potável', '1 colher de chá de óleo', '½ colher de chá de sal'], [
        ['Coloque arroz, água, óleo e sal na cuba.', 'A água cobre o arroz e está abaixo da marca máxima?', 'Siga a capacidade indicada no manual da panela.'],
        ['Feche a tampa e acione o ciclo normal de cozinhar.', 'O ciclo começou normalmente?', 'Confirme que a cuba está bem encaixada.'],
        ['Quando passar para aquecer, descanse 5 minutos e solte com garfo.', 'O arroz está macio e sem água no fundo?', 'Se ainda estiver duro, acrescente água e ligue outro ciclo curto.'],
      ], 'Siga as instruções e o limite de volume do fabricante.'],
    ['arroz-integral-eletrico', 'Arroz integral na panela elétrica', '🍚', 45, 3, 'panela elétrica de arroz e colher',
      ['1 xícara de arroz integral', '2½ xícaras de água potável', '1 colher de chá de óleo', '½ colher de chá de sal'], [
        ['Coloque arroz, água, óleo e sal na cuba.', 'O volume está abaixo da marca máxima?', 'Arroz integral absorve mais água que arroz branco.'],
        ['Feche e inicie o ciclo para arroz integral, se houver; senão, o normal.', 'A panela iniciou o cozimento?', 'Use a função indicada pelo manual do seu modelo.'],
        ['Ao fim, descanse 10 minutos e prove.', 'Os grãos estão macios?', 'Se estiverem duros, adicione água e inicie mais um ciclo.'],
      ], 'Não abra nem ultrapasse a marca máxima durante o cozimento.'],
    ['quinoa-eletrica', 'Quinoa soltinha', '🌾', 25, 3, 'panela elétrica de arroz e peneira fina',
      ['1 xícara de quinoa', '2 xícaras de água potável', '1 colher de chá de azeite', '1 pitada de sal'], [
        ['Lave a quinoa na peneira até a água sair mais clara.', 'Os grãos foram enxaguados?', 'Use peneira fina para não perder os grãos.'],
        ['Coloque quinoa, água, azeite e sal na cuba e ligue.', 'O líquido cobre os grãos?', 'Respeite a capacidade mínima e máxima do aparelho.'],
        ['Após o ciclo, descanse 5 minutos e solte com garfo.', 'Os grãos abriram e não há água solta?', 'Se ainda houver água, deixe mais alguns minutos em cozinhar.'],
      ]],
    ['lentilha-eletrica', 'Lentilha simples', '🫘', 40, 3, 'panela elétrica de arroz e peneira',
      ['1 xícara de lentilha seca', '3 xícaras de água potável', '½ cebola picada', '1 folha de louro', '1 pitada de sal'], [
        ['Escolha e lave as lentilhas na peneira.', 'Não há pedrinhas nem grãos danificados?', 'Espalhe em prato claro para conferir antes de lavar.'],
        ['Coloque lentilha, água, cebola e louro na cuba; ligue.', 'O líquido está abaixo da marca máxima?', 'Leguminosas fazem espuma; não encha a panela.'],
        ['Ao terminar, prove; ajuste sal e repita um ciclo se necessário.', 'A lentilha está macia, sem centro duro?', 'Adicione água quente se secou antes de amaciar.'],
      ], 'Use apenas a função comum de cozinhar, sem pressão, e observe a espuma.'],
    ['mingau-eletrico', 'Mingau de aveia na panela elétrica', '🥣', 20, 2, 'panela elétrica de arroz e colher de silicone',
      ['½ xícara de aveia', '2 xícaras de leite', '1 banana madura', '1 pitada de canela'], [
        ['Misture aveia e leite na cuba, deixando bastante espaço livre.', 'A mistura ficou bem abaixo da marca máxima?', 'Leite pode espumar; prepare pequena quantidade.'],
        ['Ligue a função cozinhar e mexa a cada poucos minutos.', 'O fundo não está grudando?', 'Reduza o tempo ou desligue por instantes se borbulhar forte.'],
        ['Desligue quando engrossar; misture banana amassada e canela.', 'O mingau está cremoso?', 'Se engrossar demais, junte um pouco de leite.'],
      ], 'Não deixe a panela sem supervisão: leite pode espumar e transbordar.'],
  ]),
  ...defineRecipes('electricPot', 'elaborate', [
    ['arroz-legumes-eletrico', 'Arroz de brócolis e cenoura', '🥦', 35, 3, 'panela elétrica de arroz, faca e tábua',
      ['1 xícara de arroz', '2 xícaras de água potável', '½ cenoura ralada', '½ xícara de brócolis picado', '1 colher de sopa de azeite', '½ colher de chá de sal'], [
        ['Lave e pique o brócolis em floretes pequenos.', 'Os floretes têm tamanho parecido?', 'Tamanho pequeno cozinha junto com o arroz.'],
        ['Coloque arroz, água, azeite e sal na cuba.', 'O arroz está coberto e abaixo da marca máxima?', 'Mexa uma vez para distribuir o sal.'],
        ['Espalhe cenoura e brócolis por cima, sem pressionar.', 'Os vegetais ficaram distribuídos?', 'Não faça camada muito espessa.'],
        ['Feche e acione o ciclo normal.', 'A panela concluiu o ciclo?', 'Se desligar cedo, confira se a cuba está encaixada.'],
        ['Descanse 5 minutos e misture com garfo.', 'Arroz e legumes estão macios?', 'Se algum legume estiver duro, adicione água e cozinhe mais alguns minutos.'],
      ]],
    ['risoto-abobora-eletrico', 'Risoto de abóbora na panela elétrica', '🎃', 40, 3, 'panela elétrica de arroz, faca e colher de silicone',
      ['1 xícara de arroz arbóreo', '1 xícara de abóbora em cubos pequenos', '2½ xícaras de caldo de legumes', '½ cebola picada', '2 colheres de sopa de queijo ralado', '1 colher de sopa de azeite'], [
        ['Corte a abóbora em cubos pequenos e pique a cebola.', 'Os cubos têm tamanho semelhante?', 'Corte menores para amaciar no mesmo ciclo do arroz.'],
        ['Coloque arroz, abóbora, cebola, azeite e caldo na cuba.', 'O líquido cobre tudo sem ultrapassar a marca?', 'Misture uma vez antes de fechar.'],
        ['Inicie o ciclo normal e mexa na metade se o manual permitir.', 'O arroz começou a absorver o caldo?', 'Não abra se o manual do seu modelo proibir.'],
        ['Ao fim, prove o arroz e a abóbora.', 'Ambos estão macios?', 'Se ainda estiverem firmes, acrescente caldo quente e ligue outro ciclo.'],
        ['Desligue, misture queijo e descanse 3 minutos.', 'O risoto está úmido e cremoso?', 'Adicione um pouco de caldo quente se secou demais.'],
      ]],
    ['canja-vegetariana', 'Canja vegetariana de legumes', '🍲', 45, 3, 'panela elétrica de arroz, faca e concha',
      ['½ xícara de arroz', '1 cenoura', '1 batata', '½ abobrinha', '4 xícaras de água potável', '½ cebola', '1 pitada de sal'], [
        ['Lave e corte os legumes em cubos pequenos.', 'Os cubos têm tamanho parecido?', 'Corte a batata menor que a abobrinha.'],
        ['Ponha arroz, legumes, cebola e água na cuba.', 'O volume ficou abaixo da marca máxima?', 'Sopas espumam; deixe espaço livre.'],
        ['Acione cozinhar e mexa quando o manual permitir.', 'O caldo está quente e os ingredientes começaram a amaciar?', 'Use colher de silicone para não riscar a cuba.'],
        ['Ao fim do ciclo, prove batata e arroz.', 'Ambos estão bem cozidos?', 'Acrescente água e repita o ciclo se ainda estiverem firmes.'],
        ['Acerte o sal e deixe repousar 5 minutos.', 'A sopa está pronta para servir?', 'Se engrossou demais, misture água quente aos poucos.'],
      ], 'Siga o limite de líquidos indicado no manual.'],
    ['chili-vegetariano', 'Chili vegetariano rápido', '🫘', 35, 3, 'panela elétrica de arroz, peneira e colher',
      ['1 lata de feijão vermelho cozido', '1 lata de milho cozido', '1 xícara de molho de tomate', '½ cebola picada', '½ pimentão picado', '½ colher de chá de cominho', '1 pitada de sal'], [
        ['Escorra e enxágue feijão e milho.', 'Os dois estão sem o líquido da lata?', 'Deixe escorrer na peneira por um minuto.'],
        ['Pique cebola e pimentão em cubos pequenos.', 'Os pedaços têm tamanho parecido?', 'Cubos pequenos amolecem mais rápido.'],
        ['Coloque tudo com o molho e ½ xícara de água na cuba.', 'A mistura está abaixo da marca máxima?', 'Mexa bem para soltar o molho.'],
        ['Acione cozinhar e mexa na metade, se permitido.', 'O chili está borbulhando de modo suave?', 'Se secar cedo, acrescente algumas colheres de água.'],
        ['Continue até os vegetais amaciarem; prove e acerte sal.', 'O feijão está quente por inteiro?', 'Se usar sobra refrigerada, confirme 74 °C no centro.'],
      ], 'Use feijão já cozido, enlatado; não coloque feijão cru nesta receita.'],
    ['arroz-doce-coco', 'Arroz doce com coco', '🥥', 50, 4, 'panela elétrica de arroz e colher de silicone',
      ['½ xícara de arroz branco', '1 xícara de água potável', '2 xícaras de leite', '½ xícara de leite de coco', '3 colheres de sopa de açúcar', '1 pitada de canela'], [
        ['Coloque arroz e água na cuba e inicie o ciclo.', 'O arroz começou a amaciar?', 'Se secou e ainda está duro, adicione água.'],
        ['Quando o arroz estiver quase cozido, junte leite.', 'A mistura ficou abaixo da marca máxima?', 'Leite espuma; prepare pequena quantidade.'],
        ['Mexa frequentemente enquanto engrossa.', 'O fundo está livre de grumos grudados?', 'Se ferver forte, desligue por instantes e mexa.'],
        ['Adicione leite de coco e açúcar.', 'A mistura ficou homogênea?', 'Misture até o açúcar dissolver.'],
        ['Desligue quando cremoso; descanse e polvilhe canela.', 'O arroz está macio e o creme encorpado?', 'O doce engrossa ao esfriar; desligue antes de secar demais.'],
      ], 'Não deixe a panela sem supervisão quando houver leite; pode transbordar.'],
  ]),
];
