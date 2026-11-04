import { defineRecipes } from './define.js';

export const fryerRecipes = [
  ...defineRecipes('fryer', 'simple', [
    ['batata-rustica', 'Batata rústica crocante', '🥔', 30, 2, 'air fryer, faca e tigela',
      ['2 batatas médias lavadas', '1 colher de sopa de azeite', '½ colher de chá de páprica', '1 pitada de sal'], [
        ['Corte as batatas em gomos parecidos e seque bem.', 'Os gomos estão secos e de tamanho semelhante?', 'Use pano limpo ou papel para retirar a água.'],
        ['Misture azeite, páprica e sal aos gomos.', 'Todos os gomos ficaram temperados?', 'Mexa com as mãos limpas na tigela.'],
        ['Asse a 200 °C por cerca de 20 minutos, sacudindo na metade.', 'As batatas estão macias dentro e douradas fora?', 'Asse mais 3 a 5 minutos, sem lotar o cesto.'],
      ]],
    ['pao-queijo-fryer', 'Pão de queijo na air fryer', '🧀', 15, 2, 'air fryer e pinça',
      ['8 pães de queijo congelados prontos para assar'], [
        ['Aqueça a air fryer conforme o manual e a embalagem.', 'O aparelho está pronto para assar?', 'Siga a temperatura indicada na embalagem se diferir da sugerida.'],
        ['Distribua os pães congelados sem empilhar.', 'Há espaço entre eles?', 'Asse em duas levas se o cesto for pequeno.'],
        ['Asse a 180 °C por cerca de 10 minutos ou conforme a embalagem.', 'Eles cresceram e ficaram dourados?', 'Acrescente 2 minutos se ainda estiverem pálidos.'],
      ]],
    ['brocolis-fryer', 'Brócolis crocante', '🥦', 18, 2, 'air fryer e tigela',
      ['2 xícaras de floretes de brócolis lavados', '1 colher de sopa de azeite', '1 pitada de sal', '1 pitada de alho em pó'], [
        ['Seque os floretes e corte os maiores ao meio.', 'Os pedaços têm tamanho parecido?', 'Seque bem para dourar em vez de cozinhar no vapor.'],
        ['Misture azeite, sal e alho em pó.', 'O tempero cobriu os floretes?', 'Mexa delicadamente para não quebrar.'],
        ['Asse a 180 °C por 8 a 12 minutos, mexendo uma vez.', 'As pontas douraram sem queimar?', 'Reduza o tempo se os floretes forem pequenos.'],
      ]],
    ['banana-canela-fryer', 'Banana assada com canela', '🍌', 12, 1, 'air fryer e recipiente próprio para forno',
      ['1 banana madura', '1 pitada de canela', '1 colher de chá de mel'], [
        ['Descasque a banana e corte ao meio no sentido do comprimento.', 'As duas metades estão inteiras?', 'Use banana firme para não desmanchar.'],
        ['Ponha no recipiente e polvilhe canela.', 'A canela ficou distribuída?', 'Use só uma pitada e acrescente mais depois de provar.'],
        ['Asse a 180 °C por 6 a 8 minutos e finalize com mel.', 'A banana está quente e macia?', 'Aqueça mais 2 minutos se ainda estiver firme.'],
      ]],
    ['frango-fryer', 'Filé de frango temperado', '🍗', 25, 2, 'air fryer, pinça e termômetro culinário',
      ['2 filés de peito de frango (cerca de 300 g)', '1 colher de sopa de azeite', '½ colher de chá de páprica', '1 pitada de sal'], [
        ['Seque e tempere os filés com azeite, páprica e sal.', 'Os filés ficaram cobertos pelo tempero?', 'Não lave o frango; higienize mãos e utensílios depois.'],
        ['Asse a 190 °C por cerca de 15 minutos, virando na metade.', 'Os filés douraram por fora?', 'O tempo varia com a espessura; não confie só na cor.'],
        ['Meça o centro da parte mais grossa: 74 °C antes de servir.', 'O frango chegou a pelo menos 74 °C?', 'Asse mais alguns minutos e meça de novo.'],
      ], 'Use termômetro: frango deve atingir 74 °C no centro.'],
  ]),
  ...defineRecipes('fryer', 'elaborate', [
    ['bolinho-arroz-fryer', 'Bolinho de arroz com queijo', '🧆', 30, 3, 'air fryer, tigela e colher',
      ['2 xícaras de arroz cozido refrigerado', '1 ovo', '½ xícara de queijo ralado', '2 colheres de sopa de farinha de trigo', '1 colher de sopa de salsinha picada', '1 colher de chá de azeite'], [
        ['Misture arroz, ovo, queijo e salsinha.', 'A mistura está bem distribuída?', 'Solte o arroz com um garfo antes de misturar.'],
        ['Adicione farinha aos poucos até dar liga.', 'A massa forma bolinhas sem se desfazer?', 'Acrescente mais uma colher de farinha se necessário.'],
        ['Modele bolinhos pequenos e pincele azeite.', 'Todos têm tamanho parecido?', 'Molhe levemente as mãos para modelar.'],
        ['Asse a 190 °C por cerca de 15 minutos, virando na metade.', 'Os bolinhos estão dourados dos dois lados?', 'Asse em uma camada para circular ar.'],
        ['Confira o centro bem quente, pelo menos 74 °C se usar arroz guardado.', 'O centro atingiu 74 °C?', 'Volte ao aparelho em levas curtas e meça outra vez.'],
      ], 'Use arroz previamente refrigerado e reaqueça o centro a 74 °C.'],
    ['falafel-fryer', 'Falafel de grão-de-bico cozido', '🧆', 35, 3, 'air fryer, garfo e tigela',
      ['1 lata de grão-de-bico cozido', '¼ de cebola picada', '2 colheres de sopa de salsinha', '2 colheres de sopa de farinha de trigo', '½ colher de chá de cominho', '1 colher de sopa de azeite'], [
        ['Escorra e seque o grão-de-bico.', 'Os grãos não estão ensopados?', 'Pressione com papel limpo; muita água impede a liga.'],
        ['Amasse com garfo até virar uma pasta com pedacinhos.', 'A massa se junta ao apertar?', 'Amasse mais alguns grãos, mas deixe textura.'],
        ['Misture cebola, salsinha, cominho e farinha.', 'O tempero ficou distribuído?', 'Pique a cebola bem miúda para não soltar peças.'],
        ['Modele discos pequenos e pincele azeite.', 'Os discos mantêm a forma?', 'Se estiver mole, descanse 10 minutos na geladeira.'],
        ['Asse a 190 °C por 15 a 18 minutos, virando na metade.', 'As bordas estão firmes e douradas?', 'Asse mais 3 minutos se ainda estiver muito macio.'],
      ]],
    ['lasanha-berinjela-fryer', 'Lasanha de berinjela individual', '🍆', 40, 2, 'air fryer e dois refratários pequenos próprios para forno',
      ['1 berinjela pequena', '1 xícara de molho de tomate', '100 g de muçarela', '2 colheres de sopa de queijo ralado', '1 colher de chá de azeite'], [
        ['Corte a berinjela em fatias finas e pincele azeite.', 'As fatias têm espessura parecida?', 'Apoie a berinjela na tábua antes de fatiar.'],
        ['Pré-asse as fatias a 180 °C por 8 minutos.', 'Elas estão macias e menos úmidas?', 'Asse mais alguns minutos se ainda estiverem rígidas.'],
        ['Monte camadas de molho, berinjela e queijo nos refratários.', 'As camadas cabem sem transbordar?', 'Use pouco molho por camada.'],
        ['Finalize com queijo ralado.', 'A superfície está coberta?', 'Distribua mais nas bordas, que secam primeiro.'],
        ['Asse a 180 °C por 10 a 15 minutos, até borbulhar.', 'O centro está bem quente e o queijo derretido?', 'Asse mais 3 minutos se o molho ainda estiver frio.'],
      ], 'Use somente refratário indicado para forno/air fryer.'],
    ['peixe-empanado-fryer', 'Peixe empanado crocante', '🐟', 30, 2, 'air fryer, três pratos e termômetro culinário',
      ['2 filés de peixe branco (cerca de 300 g)', '¼ de xícara de farinha de trigo', '1 ovo', '½ xícara de farinha de rosca', '1 colher de sopa de azeite', '1 pitada de sal'], [
        ['Seque os filés e tempere com sal.', 'Os filés estão secos na superfície?', 'Papel limpo ajuda o empanado a aderir.'],
        ['Passe em farinha, ovo batido e farinha de rosca.', 'A cobertura ficou uniforme?', 'Pressione suavemente a farinha de rosca.'],
        ['Pincele azeite e coloque no cesto sem sobrepor.', 'Há espaço ao redor dos filés?', 'Faça em duas levas se necessário.'],
        ['Asse a 190 °C por 12 a 16 minutos, virando com cuidado.', 'O empanado está dourado?', 'Use espátula para não quebrar o peixe.'],
        ['Confirme centro a 63 °C ou peixe opaco que se separa com garfo.', 'O peixe está cozido por inteiro?', 'Asse mais alguns minutos e confira.'],
      ], 'Evite contato entre peixe cru e alimentos prontos.'],
    ['tortinha-legumes-fryer', 'Tortinha integral de legumes', '🥧', 35, 3, 'air fryer, tigela e formas pequenas próprias para forno',
      ['2 ovos', '½ xícara de leite', '½ xícara de farinha de trigo integral', '½ xícara de cenoura ralada', '½ xícara de abobrinha ralada', '1 colher de chá de fermento químico', '1 pitada de sal'], [
        ['Bata ovos, leite e sal na tigela.', 'O líquido está uniforme?', 'Use garfo e bata até não haver clara separada.'],
        ['Acrescente farinha e misture até ficar liso.', 'A massa está sem bolinhas grandes de farinha?', 'Adicione farinha aos poucos.'],
        ['Esprema a abobrinha e misture os legumes.', 'A massa não ficou aguada?', 'Retire a água da abobrinha com pano limpo.'],
        ['Junte o fermento e divida nas formas até dois terços.', 'Há espaço para crescer?', 'Não encha até a borda.'],
        ['Asse a 170 °C por 18 a 22 minutos.', 'O centro está firme e o palito sai sem massa crua?', 'Asse mais 3 minutos e teste de novo.'],
      ], 'As tortinhas com ovos devem ficar firmes por dentro.'],
  ]),
];
