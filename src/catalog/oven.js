import { defineRecipes } from './define.js';

export const ovenRecipes = [
  ...defineRecipes('oven', 'simple', [
    ['legumes-assados', 'Legumes assados', '🥦', 35, 3, 'forno, assadeira e faca',
      ['1 cenoura', '1 abobrinha', '1 cebola', '2 colheres de sopa de azeite', '1 pitada de sal'], [
        ['Aqueça o forno a 200 °C e corte os legumes em pedaços parecidos.', 'Os pedaços têm tamanho semelhante?', 'Corte a cenoura um pouco menor que a abobrinha.'],
        ['Espalhe na assadeira e misture azeite e sal.', 'Os legumes estão em uma camada?', 'Use duas assadeiras se estiver tudo empilhado.'],
        ['Asse por 25 minutos, virando na metade.', 'Os legumes estão macios e levemente dourados?', 'Asse mais 5 minutos se a cenoura ainda estiver dura.'],
      ]],
    ['batata-doce-forno', 'Batata-doce assada', '🍠', 40, 2, 'forno, assadeira e faca',
      ['2 batatas-doces médias lavadas', '1 colher de sopa de azeite', '1 pitada de sal'], [
        ['Aqueça o forno a 200 °C e corte as batatas em rodelas grossas.', 'As rodelas têm espessura semelhante?', 'Rodelas finas queimam antes das grossas ficarem macias.'],
        ['Espalhe na assadeira com azeite e sal.', 'As rodelas não estão sobrepostas?', 'Deixe espaço entre elas para dourar.'],
        ['Asse cerca de 30 minutos, virando na metade.', 'O garfo entra fácil e as bordas douraram?', 'Asse mais 5 minutos se o centro estiver firme.'],
      ]],
    ['torradas-alho', 'Torradas de alho', '🥖', 15, 2, 'forno, assadeira e tigela',
      ['4 fatias de pão', '1 colher de sopa de manteiga', '1 dente pequeno de alho', '1 pitada de orégano'], [
        ['Aqueça o forno a 180 °C e misture manteiga, alho amassado e orégano.', 'O alho ficou distribuído na manteiga?', 'Amasse o alho bem pequeno.'],
        ['Espalhe uma camada fina em cada fatia.', 'Todas as fatias receberam a mistura?', 'Evite excesso para o pão não ficar encharcado.'],
        ['Asse por 8 a 10 minutos, observando as bordas.', 'As torradas ficaram douradas sem queimar?', 'Retire assim que dourarem; pão passa do ponto rápido.'],
      ]],
    ['tomate-assado', 'Tomates assados com ervas', '🍅', 30, 2, 'forno e assadeira pequena',
      ['3 tomates lavados', '1 colher de sopa de azeite', '1 colher de chá de orégano', '1 pitada de sal'], [
        ['Aqueça o forno a 200 °C e corte os tomates ao meio.', 'As metades estão estáveis na assadeira?', 'Apoie a parte cortada para cima.'],
        ['Regue com azeite, orégano e sal.', 'O tempero chegou a todos os tomates?', 'Distribua com uma colher.'],
        ['Asse por 20 a 25 minutos.', 'Os tomates estão macios e levemente enrugados?', 'Asse mais alguns minutos se ainda estiverem firmes.'],
      ]],
    ['biscoito-aveia', 'Biscoito de aveia e banana', '🍪', 25, 3, 'forno, assadeira e garfo',
      ['2 bananas maduras', '1 xícara de aveia em flocos', '1 pitada de canela'], [
        ['Aqueça o forno a 180 °C e amasse as bananas.', 'A banana virou uma pasta?', 'Bananas bem maduras são mais fáceis de amassar.'],
        ['Misture aveia e canela; forme discos na assadeira.', 'Os discos mantêm a forma?', 'Espere 2 minutos para a aveia absorver a umidade.'],
        ['Asse 15 a 18 minutos, até firmar nas bordas.', 'Os biscoitos saem da assadeira sem desmanchar?', 'Deixe esfriar alguns minutos antes de retirar.'],
      ]],
  ]),
  ...defineRecipes('oven', 'elaborate', [
    ['lasanha-abobrinha', 'Lasanha de abobrinha', '🥒', 55, 3, 'forno, refratário, faca e tábua',
      ['2 abobrinhas', '2 xícaras de molho de tomate', '200 g de ricota', '150 g de muçarela', '1 colher de sopa de azeite', '1 pitada de sal'], [
        ['Aqueça o forno a 200 °C e corte as abobrinhas em lâminas finas.', 'As lâminas têm espessura parecida?', 'Use faca afiada e mantenha a base apoiada.'],
        ['Pincele azeite e pré-asse as lâminas por 10 minutos.', 'Elas perderam parte da água?', 'Se ainda estiverem muito úmidas, seque com papel.'],
        ['Espalhe molho no fundo do refratário.', 'O fundo ficou coberto?', 'Uma camada fina evita que grude.'],
        ['Alterne abobrinha, ricota, molho e muçarela.', 'As camadas ficaram distribuídas?', 'Deixe um pouco de molho para a última camada.'],
        ['Cubra com queijo e asse por 25 a 30 minutos.', 'O molho borbulha e o centro está quente?', 'Asse mais 5 minutos se o meio ainda estiver morno.'],
      ]],
    ['quiche-legumes', 'Quiche de legumes', '🥧', 65, 6, 'forno, forma de torta, tigela e fouet',
      ['1 disco de massa para torta pronta', '3 ovos', '200 ml de leite', '1 xícara de brócolis picado', '½ cenoura ralada', '100 g de queijo ralado', '1 pitada de sal'], [
        ['Aqueça o forno a 180 °C e forre a forma com a massa.', 'A massa cobre fundo e laterais?', 'Aperte as emendas e fure o fundo com garfo.'],
        ['Pré-asse a massa por 10 minutos.', 'A base ficou levemente firme?', 'Se inflar, pressione de leve com a espátula.'],
        ['Bata ovos, leite, queijo e sal.', 'O recheio líquido ficou uniforme?', 'Bata até não haver clara separada.'],
        ['Distribua os legumes sobre a massa e despeje o recheio.', 'Os legumes estão cobertos sem transbordar?', 'Despeje devagar e deixe uma borda livre.'],
        ['Asse por 30 a 35 minutos até o centro firmar.', 'O centro está firme, sem ovo líquido?', 'Asse mais 5 minutos e teste com uma faca limpa.'],
      ], 'Cozinhe o recheio com ovos até o centro ficar firme.'],
    ['frango-assado-batatas', 'Frango assado com batatas', '🍗', 60, 3, 'forno, assadeira, pinça e termômetro culinário',
      ['500 g de coxas de frango', '3 batatas', '1 cebola', '2 colheres de sopa de azeite', '1 colher de chá de páprica', '1 pitada de sal'], [
        ['Aqueça o forno a 200 °C; corte batatas e cebola em gomos.', 'Os gomos têm tamanho parecido?', 'Gomos muito grandes demoram mais que o frango.'],
        ['Tempere o frango com azeite, páprica e sal.', 'Todos os pedaços estão cobertos?', 'Não lave o frango; higienize mãos e superfície depois.'],
        ['Disponha frango e batatas em uma camada na assadeira.', 'Há espaço para o ar circular?', 'Use assadeira maior se estiver tudo empilhado.'],
        ['Asse cerca de 40 minutos, virando as batatas uma vez.', 'A pele dourou e as batatas amaciaram?', 'Cubra a pele com papel-alumínio se escurecer cedo.'],
        ['Meça a parte mais grossa do frango sem tocar o osso: 74 °C.', 'O centro chegou a pelo menos 74 °C?', 'Volte ao forno por 5 minutos e meça novamente.'],
      ], 'Use termômetro: frango deve atingir 74 °C no centro.'],
    ['pao-caseiro', 'Pão caseiro simples', '🍞', 110, 8, 'forno, tigela, forma e pano limpo',
      ['3 xícaras de farinha de trigo', '1 xícara de água morna', '1 colher de sopa de fermento biológico seco', '1 colher de sopa de açúcar', '1 colher de chá de sal', '2 colheres de sopa de óleo'], [
        ['Misture água morna, açúcar e fermento; espere 10 minutos.', 'Apareceu espuma na superfície?', 'Água quente demais pode matar o fermento; use morna ao toque.'],
        ['Junte farinha, sal e óleo; misture até formar massa.', 'A massa se junta em uma bola?', 'Acrescente farinha aos poucos, só até parar de grudar demais.'],
        ['Sove por 8 minutos até ficar lisa.', 'A massa está mais elástica?', 'Dobre e empurre com a base da mão repetidamente.'],
        ['Cubra e espere crescer cerca de 45 minutos; modele na forma.', 'A massa quase dobrou de volume?', 'Deixe em lugar sem corrente de ar e dê mais tempo se necessário.'],
        ['Asse a 190 °C por 30 a 35 minutos.', 'O pão dourou e soa oco ao bater na base?', 'Asse mais 5 minutos se a base estiver pálida.'],
      ]],
    ['torta-maca', 'Torta rústica de maçã', '🥧', 55, 6, 'forno, assadeira, faca e tigela',
      ['1 disco de massa folhada pronta', '3 maçãs lavadas', '2 colheres de sopa de açúcar', '1 colher de chá de canela', '1 colher de sopa de farinha de trigo', '1 colher de chá de manteiga'], [
        ['Aqueça o forno a 200 °C e fatie as maçãs finas.', 'As fatias têm espessura parecida?', 'Mantenha a maçã apoiada na tábua.'],
        ['Misture maçã, açúcar, canela e farinha.', 'Todas as fatias ficaram envolvidas?', 'A farinha ajuda a segurar o suco da fruta.'],
        ['Abra a massa na assadeira e ponha o recheio no centro.', 'Há uma borda livre de cerca de 3 cm?', 'Retire recheio excessivo antes de dobrar.'],
        ['Dobre as bordas sobre as maçãs e espalhe pedacinhos de manteiga.', 'As bordas seguram o recheio?', 'Aperte as dobras com os dedos.'],
        ['Asse 30 a 35 minutos até a massa dourar.', 'A massa está crocante e as maçãs macias?', 'Se as bordas dourarem cedo, cubra só as bordas com papel-alumínio.'],
      ]],
  ]),
];
