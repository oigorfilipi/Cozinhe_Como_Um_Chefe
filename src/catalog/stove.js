import { defineRecipes } from './define.js';

export const stoveRecipes = [
  ...defineRecipes('stove', 'simple', [
    ['omelete-queijo', 'Omelete de queijo', '🍳', 12, 1, 'frigideira antiaderente, tigela e espátula',
      ['2 ovos', '2 colheres de sopa de queijo ralado', '1 colher de chá de óleo', '1 pitada de sal'], [
        ['Quebre os ovos na tigela e bata com sal e queijo.', 'A mistura ficou uniforme?', 'Bata mais um pouco até não haver faixas separadas de clara.'],
        ['Aqueça a frigideira em fogo baixo com o óleo e despeje os ovos.', 'A borda começou a firmar sem queimar?', 'Se escurecer rápido, reduza o fogo.'],
        ['Dobre com a espátula e cozinhe até o centro firmar.', 'O ovo está firme, sem parte líquida?', 'Tampe por um minuto em fogo baixo se o centro ainda estiver mole.'],
      ], 'Cozinhe os ovos até não haver parte líquida.'],
    ['arroz-branco-fogao', 'Arroz branco soltinho', '🍚', 25, 3, 'panela com tampa e colher',
      ['1 xícara de arroz', '2 xícaras de água potável', '1 colher de sopa de óleo', '½ colher de chá de sal'], [
        ['Aqueça óleo e mexa o arroz por um minuto.', 'Os grãos ficaram envolvidos pelo óleo?', 'Mexa de baixo para cima sem deixar dourar demais.'],
        ['Adicione água e sal, misture e espere ferver.', 'A água começou a borbulhar?', 'Aumente um pouco o fogo até ferver e então reduza.'],
        ['Tampe parcialmente, cozinhe em fogo baixo até a água secar e descanse 5 minutos.', 'O arroz está macio e sem água no fundo?', 'Se estiver duro, acrescente 2 colheres de água e cozinhe mais alguns minutos.'],
      ]],
    ['macarrao-alho-oleo', 'Macarrão alho e óleo', '🍝', 18, 2, 'panela, frigideira e escorredor',
      ['160 g de macarrão seco', '2 dentes de alho', '2 colheres de sopa de azeite', '1 colher de chá de sal', '2 litros de água potável'], [
        ['Ferva a água com sal e cozinhe o macarrão pelo tempo da embalagem.', 'O macarrão está macio, mas ainda firme?', 'Prove um fio; cozinhe mais um minuto se o centro estiver duro.'],
        ['Doure o alho picado no azeite em fogo baixo.', 'O alho está levemente dourado, sem partes pretas?', 'Se escurecer rápido, tire a frigideira do fogo.'],
        ['Escorra o macarrão, misture ao alho e sirva.', 'O azeite cobriu os fios?', 'Reserve uma colher da água do cozimento para ajudar a misturar.'],
      ]],
    ['panqueca-banana', 'Panqueca de banana', '🥞', 15, 1, 'tigela, garfo, frigideira e espátula',
      ['1 banana madura', '1 ovo', '3 colheres de sopa de aveia', '1 colher de chá de óleo'], [
        ['Amasse a banana e misture com ovo e aveia.', 'A massa está espessa e sem pedaços grandes?', 'Amasse mais a banana antes de adicionar outros ingredientes.'],
        ['Coloque pequenas porções na frigideira untada em fogo baixo.', 'As bordas firmaram e surgiram bolhas?', 'Faça panquecas pequenas para virar sem quebrar.'],
        ['Vire e cozinhe o outro lado até firmar.', 'O centro não está líquido?', 'Cozinhe mais um pouco em fogo baixo se estiver úmido.'],
      ], 'Cozinhe o ovo até a massa ficar firme por dentro.'],
    ['sopa-legumes', 'Sopa simples de legumes', '🍲', 30, 3, 'panela, faca e tábua',
      ['1 batata', '1 cenoura', '1 abobrinha pequena', '½ cebola', '3 xícaras de água potável', '1 colher de sopa de óleo', '1 pitada de sal'], [
        ['Lave e corte os legumes em cubos parecidos.', 'Os pedaços têm tamanho semelhante?', 'Pedaços menores cozinham mais rápido.'],
        ['Refogue a cebola no óleo e acrescente os legumes.', 'A cebola amoleceu sem queimar?', 'Use fogo médio e mexa sempre.'],
        ['Cubra com água, cozinhe até os legumes ficarem macios e acerte o sal.', 'O garfo entra facilmente nos legumes?', 'Se algum cubo estiver duro, cozinhe mais 5 minutos.'],
      ]],
  ]),
  ...defineRecipes('stove', 'elaborate', [
    ['frango-frito', 'Frango frito na frigideira', '🍗', 35, 2, 'frigideira funda, pinça e termômetro culinário',
      ['300 g de tiras de peito de frango', '½ xícara de farinha de trigo', '1 ovo', '½ xícara de farinha de rosca', 'óleo suficiente para uma camada rasa', '1 pitada de sal'], [
        ['Lave as mãos, seque as tiras de frango com papel e tempere com sal.', 'O frango está em tiras de espessura parecida?', 'Não lave o frango cru; use tábua separada e higienize tudo depois.'],
        ['Passe cada tira na farinha, no ovo batido e na farinha de rosca.', 'As tiras estão empanadas por todos os lados?', 'Pressione a farinha de rosca com as mãos limpas.'],
        ['Aqueça uma camada rasa de óleo em fogo médio; coloque poucas tiras por vez.', 'O óleo borbulha de leve sem soltar fumaça?', 'Se soltar fumaça, desligue e deixe esfriar; nunca coloque água no óleo.'],
        ['Frite dos dois lados até dourar; retire com pinça para papel absorvente.', 'A cobertura está dourada sem queimar?', 'Reduza o fogo se dourar antes de cozinhar o centro.'],
        ['Meça o centro da tira mais grossa: precisa chegar a 74 °C antes de servir.', 'O termômetro marcou pelo menos 74 °C?', 'Se marcou menos, volte ao fogo e meça de novo.'],
      ], 'Use termômetro: frango deve atingir 74 °C no centro. Nunca deixe óleo quente sem supervisão.'],
    ['risoto-cogumelos', 'Risoto de cogumelos', '🍄', 40, 2, 'panela, frigideira e colher',
      ['1 xícara de arroz arbóreo', '150 g de cogumelos lavados e fatiados', '½ cebola', '3 xícaras de caldo de legumes quente', '1 colher de sopa de azeite', '2 colheres de sopa de queijo ralado'], [
        ['Aqueça o caldo em uma panela sem deixar ferver forte.', 'O caldo está quente para adicionar aos poucos?', 'Mantenha em fogo baixo; caldo frio interrompe o cozimento.'],
        ['Refogue cebola e cogumelos no azeite até murcharem.', 'Os cogumelos perderam parte da água?', 'Não amontoe; mexa até o líquido reduzir.'],
        ['Junte o arroz e mexa por um minuto.', 'Os grãos estão brilhantes?', 'Mexa sempre para não grudar.'],
        ['Adicione uma concha de caldo por vez, mexendo até quase secar.', 'O arroz absorveu a maior parte do caldo anterior?', 'Espere antes da próxima concha; ajuste o fogo para fervura suave.'],
        ['Prove o arroz, desligue quando estiver macio com leve firmeza e misture o queijo.', 'O risoto está cremoso e o arroz cozido?', 'Se estiver duro, adicione mais caldo quente e cozinhe alguns minutos.'],
      ]],
    ['nhoque-tomate', 'Nhoque de batata ao tomate', '🍅', 55, 3, 'panela, garfo, tábua e escumadeira',
      ['400 g de batata', '¾ de xícara de farinha de trigo', '1 ovo', '1 xícara de molho de tomate pronto', '1 colher de chá de sal', 'água potável para cozinhar'], [
        ['Cozinhe as batatas sem casca em água até o garfo entrar facilmente.', 'As batatas estão bem macias?', 'Corte em cubos semelhantes para cozinharem por igual.'],
        ['Escorra, amasse e deixe o vapor sair até ficarem mornas.', 'O purê está sem pedaços grandes e menos úmido?', 'Espalhe no prato por alguns minutos para perder vapor.'],
        ['Misture ovo, sal e farinha aos poucos; forme rolinhos e corte pedaços.', 'A massa dá para modelar sem grudar demais?', 'Adicione só a farinha necessária; excesso deixa o nhoque pesado.'],
        ['Cozinhe poucos nhoques por vez em água fervente; retire quando subirem.', 'Os nhoques flutuaram e estão firmes?', 'Espere mais alguns segundos antes de retirar com escumadeira.'],
        ['Aqueça o molho de tomate até ferver e misture ao nhoque.', 'O molho cobriu todos os pedaços?', 'Aqueça em fogo baixo e mexa com cuidado para não desmanchar.'],
      ], 'Cozinhe bem a massa que contém ovo cru.'],
    ['moqueca-peixe', 'Moqueca simples de peixe', '🐟', 40, 3, 'panela larga com tampa, faca e termômetro culinário',
      ['400 g de filé de peixe branco', '1 tomate', '½ cebola', '½ pimentão', '150 ml de leite de coco', '1 colher de sopa de azeite', '½ limão', '1 pitada de sal'], [
        ['Tempere o peixe com sal e algumas gotas de limão.', 'Os filés estão temperados dos dois lados?', 'Tempere com mãos limpas e lave os utensílios que tocaram peixe cru.'],
        ['Fatie tomate, cebola e pimentão.', 'As fatias têm espessura parecida?', 'Cortes finos amolecem antes de o peixe passar do ponto.'],
        ['Refogue a cebola no azeite e faça camadas com vegetais e peixe.', 'O peixe está apoiado sobre os vegetais?', 'Use panela larga para evitar empilhar os filés.'],
        ['Adicione leite de coco, tampe e cozinhe em fogo baixo.', 'O molho borbulha suavemente?', 'Fervura forte pode quebrar o peixe; reduza o fogo.'],
        ['Confira o centro do peixe: 63 °C ou carne opaca que se separa facilmente.', 'O peixe está cozido por inteiro?', 'Cozinhe mais alguns minutos e confira novamente.'],
      ], 'Mantenha peixe cru refrigerado até usar e evite contato com alimentos prontos.'],
    ['curry-grao-de-bico', 'Curry de grão-de-bico e abóbora', '🍛', 40, 3, 'panela com tampa, faca e colher',
      ['1 lata de grão-de-bico cozido', '250 g de abóbora em cubos', '½ cebola', '1 tomate', '150 ml de leite de coco', '1 colher de chá de curry em pó', '1 colher de sopa de óleo'], [
        ['Pique cebola e tomate; corte a abóbora em cubos pequenos.', 'Os cubos de abóbora têm tamanho parecido?', 'Corte menor para cozinhar mais rápido.'],
        ['Refogue a cebola no óleo e acrescente curry e tomate.', 'O tomate começou a formar um molho?', 'Mexa em fogo médio para o tempero não queimar.'],
        ['Junte abóbora e meia xícara de água, tampe e cozinhe.', 'A abóbora está macia ao espetar?', 'Se secar antes de amaciar, adicione água aos poucos.'],
        ['Escorra o grão-de-bico e misture ao molho.', 'Os grãos aqueceram por completo?', 'Cozinhe em fervura suave por alguns minutos.'],
        ['Adicione leite de coco e cozinhe até ficar cremoso.', 'O molho envolve a abóbora e os grãos?', 'Se estiver ralo, cozinhe destampado por mais alguns minutos.'],
      ]],
  ]),
];
