import { defineRecipes } from './define.js';

export const noHeatRecipes = [
  ...defineRecipes('none', 'simple', [
    ['wrap', 'Wrap frio', '🌯', 5, 1, 'prato e colher',
      ['1 tortilla ou pão para wrap', '1 colher de sopa de requeijão', '2 folhas de alface lavadas e secas', '2 colheres de sopa de cenoura ralada pronta'], [
        ['Abra a tortilla sobre o prato.', 'Ela está aberta e sem rasgos grandes?', 'Se rasgou, sobreponha as bordas ou use outra tortilla. Deixe o centro livre.'],
        ['Espalhe o requeijão no centro com as costas da colher. Deixe uma borda livre.', 'O requeijão ficou espalhado no centro?', 'Comece pelo meio e espalhe aos poucos, sem chegar à borda.'],
        ['Coloque a alface e a cenoura no centro da tortilla.', 'O recheio ficou no centro, sem transbordar?', 'Retire um pouco do recheio e deixe as laterais livres.'],
        ['Dobre as laterais e enrole a tortilla, apertando de leve.', 'O wrap ficou fechado e dá para segurar?', 'Dobre as laterais outra vez e enrole um pouco mais firme.'],
      ], 'Lave e seque bem as folhas antes de usar.'],
    ['salada-caprese', 'Salada caprese', '🍅', 8, 2, 'faca, tábua e prato',
      ['2 tomates lavados', '120 g de muçarela', '6 folhas de manjericão lavadas', '1 colher de sopa de azeite', '1 pitada de sal'], [
        ['Corte os tomates e a muçarela em fatias.', 'As fatias têm espessura parecida?', 'Apoie o tomate na tábua e corte devagar com a faca afiada.'],
        ['Intercale tomate, queijo e manjericão no prato.', 'As camadas estão distribuídas pelo prato?', 'Use uma fatia de queijo entre duas de tomate.'],
        ['Regue com azeite e finalize com sal.', 'A salada ficou temperada sem excesso de líquido?', 'Comece com pouco azeite e ajuste depois de provar.'],
      ]],
    ['sanduiche-ricota', 'Sanduíche de ricota e pepino', '🥪', 8, 1, 'faca, tábua e colher',
      ['2 fatias de pão', '3 colheres de sopa de ricota', '¼ de pepino lavado', '1 pitada de sal', '1 colher de chá de azeite'], [
        ['Amasse a ricota com azeite e sal.', 'A pasta espalha sem cair em pedaços?', 'Amasse mais com o garfo ou ponha algumas gotas de água.'],
        ['Fatie o pepino e espalhe a pasta no pão.', 'O recheio cobre o pão sem chegar às bordas?', 'Faça fatias finas para o sanduíche fechar melhor.'],
        ['Distribua o pepino e feche o sanduíche.', 'As fatias ficaram presas entre os pães?', 'Retire o excesso de recheio e pressione de leve.'],
      ]],
    ['iogurte-frutas', 'Taça de iogurte e frutas', '🥣', 5, 1, 'tigela e colher',
      ['1 pote de iogurte natural pasteurizado', '1 banana', '4 morangos lavados', '2 colheres de sopa de aveia'], [
        ['Descasque a banana e corte as frutas em pedaços.', 'As frutas estão prontas para comer?', 'Lave os morangos antes de retirar as folhas.'],
        ['Coloque o iogurte na tigela e acrescente as frutas.', 'As frutas ficaram distribuídas?', 'Misture com cuidado para não amassar tudo.'],
        ['Espalhe a aveia por cima.', 'A cobertura ficou por toda a taça?', 'Acrescente a aveia só na hora de comer para manter textura.'],
      ]],
    ['vinagrete', 'Vinagrete rápido', '🧅', 10, 4, 'faca, tábua e tigela',
      ['2 tomates lavados', '½ cebola', '½ pimentão lavado', '2 colheres de sopa de vinagre', '1 colher de sopa de azeite', '1 pitada de sal'], [
        ['Pique tomate, cebola e pimentão em cubos pequenos.', 'Os pedaços têm tamanho parecido?', 'Corte em tiras primeiro e depois em cubos.'],
        ['Misture os vegetais na tigela.', 'Os ingredientes estão bem distribuídos?', 'Use uma colher grande e mexa desde o fundo.'],
        ['Adicione vinagre, azeite e sal; prove.', 'O sabor está equilibrado para você?', 'Se ficou ácido, acrescente mais tomate; se suave, algumas gotas de vinagre.'],
      ]],
    ['guacamole', 'Guacamole simples', '🥑', 10, 2, 'faca, garfo e tigela',
      ['1 abacate pequeno maduro', '½ tomate lavado', '¼ de cebola', '½ limão', '1 pitada de sal'], [
        ['Abra o abacate, retire o caroço com uma colher e amasse a polpa.', 'A polpa ficou cremosa com alguns pedaços?', 'Use o garfo; não precisa virar purê liso.'],
        ['Pique tomate e cebola; misture ao abacate.', 'Os pedaços estão espalhados na mistura?', 'Pique pequeno para caber em cada colherada.'],
        ['Esprema o limão e adicione sal; prove.', 'O tempero ficou agradável?', 'Acrescente limão aos poucos para não dominar.'],
      ]],
  ]),
  ...defineRecipes('none', 'elaborate', [
    ['molho-branco-frio', 'Molho branco frio de iogurte', '🥛', 12, 4, 'tigela, colher e ralador',
      ['1 pote de iogurte natural pasteurizado', '2 colheres de sopa de cream cheese', '½ limão', '1 dente pequeno de alho', '1 colher de chá de azeite', '1 pitada de sal'], [
        ['Lave o limão e rale um pouco da casca, sem pegar a parte branca.', 'Você tem só a parte colorida da casca?', 'Rale com pouca pressão; a parte branca amarga.'],
        ['Amasse o alho e misture ao iogurte e ao cream cheese.', 'A base ficou homogênea?', 'Amasse o alho muito bem para não deixar pedaços grandes.'],
        ['Acrescente raspas, algumas gotas de limão e azeite.', 'O molho ficou cremoso e levemente ácido?', 'Adicione limão aos poucos; mais cream cheese encorpa.'],
        ['Tempere com sal e mexa de novo.', 'O sal ficou distribuído?', 'Prove com uma colher limpa antes de acrescentar mais.'],
        ['Leve à geladeira por 10 minutos antes de servir.', 'O molho está frio e mais firme?', 'Deixe coberto na geladeira; este molho é frio, não é béchamel.'],
      ], 'Use laticínios pasteurizados e mantenha o molho refrigerado.'],
    ['barbecue-frio', 'Molho barbecue caseiro frio', '🍖', 10, 6, 'tigela e colher',
      ['5 colheres de sopa de ketchup', '1 colher de sopa de vinagre de maçã', '1 colher de sopa de mel', '1 colher de chá de páprica defumada', '½ colher de chá de mostarda', '1 pitada de sal'], [
        ['Coloque ketchup e vinagre na tigela.', 'A base ficou lisa depois de misturar?', 'Mexa com a colher encostando no fundo da tigela.'],
        ['Misture o mel até desaparecerem os fios.', 'O mel foi incorporado?', 'Se o mel estiver grosso, mexa por mais um minuto.'],
        ['Junte páprica e mostarda.', 'A cor ficou uniforme?', 'Acrescente páprica aos poucos para controlar o sabor defumado.'],
        ['Prove e corrija com sal ou gotas de vinagre.', 'Doce e ácido estão equilibrados?', 'Se ficou ácido, um pouco de mel; se doce, gotas de vinagre.'],
        ['Cubra e resfrie por 10 minutos.', 'O molho está pronto para servir frio?', 'Guarde em pote limpo na geladeira e use colher limpa.'],
      ], 'É uma versão fria feita com ketchup, sem cozimento. Mantenha refrigerada.'],
    ['tabule', 'Tabule de trigo e ervas', '🥗', 25, 4, 'tigela, peneira, faca e tábua',
      ['½ xícara de trigo para quibe', '½ xícara de água potável fria', '1 tomate lavado', '½ pepino lavado', '½ maço de salsinha lavada', '½ limão', '1 colher de sopa de azeite'], [
        ['Cubra o trigo com água e espere 15 minutos.', 'Os grãos ficaram macios?', 'Se ainda estiverem firmes, espere mais 5 minutos.'],
        ['Escorra e aperte o trigo na peneira para retirar a água.', 'O trigo está úmido, mas sem água sobrando?', 'Pressione com uma colher ou com mãos limpas.'],
        ['Pique tomate, pepino e salsinha bem pequenos.', 'Os vegetais cabem em uma colherada?', 'Corte em tiras antes de picar miúdo.'],
        ['Misture o trigo e os vegetais.', 'A salada ficou bem distribuída?', 'Solte os grãos com um garfo antes de misturar.'],
        ['Tempere com limão e azeite; prove.', 'O tabule ficou fresco e sem excesso de líquido?', 'Adicione limão aos poucos e escorra o tomate se necessário.'],
      ], 'Use trigo próprio para hidratação em água fria; confira a embalagem.'],
    ['salada-grao-de-bico', 'Salada de grão-de-bico colorida', '🫘', 20, 3, 'peneira, faca, tábua e tigela',
      ['1 lata de grão-de-bico cozido', '1 tomate lavado', '½ pepino lavado', '¼ de cebola', '½ limão', '1 colher de sopa de azeite', '1 pitada de sal'], [
        ['Escorra e enxágue o grão-de-bico cozido.', 'Os grãos estão sem líquido da lata?', 'Deixe alguns segundos na peneira e balance de leve.'],
        ['Pique tomate, pepino e cebola em cubos.', 'Os pedaços têm tamanho parecido?', 'Pique a cebola menor para espalhar melhor o sabor.'],
        ['Misture os vegetais aos grãos.', 'Cada colherada tem um pouco de tudo?', 'Mexa de baixo para cima sem esmagar os grãos.'],
        ['Bata limão, azeite e sal com uma colher.', 'O tempero ficou uniforme?', 'Comece com pouco sal; o grão enlatado pode já conter sal.'],
        ['Regue a salada e prove.', 'A salada está úmida, mas sem poça no fundo?', 'Se houver líquido demais, escorra antes de servir.'],
      ]],
    ['sanduiche-pesto', 'Sanduíche caprese com pesto de folhas', '🥪', 20, 2, 'pilão ou garfo, faca, tábua e prato',
      ['4 fatias de pão', '1 tomate lavado', '100 g de muçarela', '1 xícara de manjericão lavado', '2 colheres de sopa de azeite', '1 colher de sopa de castanhas picadas', '1 pitada de sal'], [
        ['Pique as folhas e as castanhas em pedaços bem pequenos.', 'Não há pedaços grandes de castanha?', 'Pique aos poucos em tábua firme.'],
        ['Amasse folhas e castanhas com azeite e sal.', 'Formou uma pasta que espalha?', 'Continue amassando; adicione gotas de azeite se estiver seca.'],
        ['Fatie tomate e muçarela.', 'As fatias cabem no pão?', 'Retire as pontas grandes ou corte as fatias ao meio.'],
        ['Espalhe o pesto em duas fatias de pão.', 'A pasta ficou distribuída?', 'Passe uma camada fina para não escorrer.'],
        ['Monte com tomate e queijo e feche.', 'Os recheios estão estáveis?', 'Se escorregar, use menos pesto ou fatias mais finas.'],
      ], 'Contém castanhas e laticínios.'],
    ['pate-feijao-branco', 'Patê de feijão branco com limão', '🫘', 15, 4, 'peneira, garfo e tigela',
      ['1 lata de feijão branco cozido', '½ limão', '1 colher de sopa de azeite', '½ dente de alho', '1 colher de sopa de água potável', '1 pitada de sal'], [
        ['Escorra e enxágue o feijão branco.', 'Os grãos estão sem o líquido da lata?', 'Sacuda a peneira e espere escorrer.'],
        ['Amasse os grãos com um garfo.', 'A maior parte virou pasta?', 'Amasse contra a lateral da tigela.'],
        ['Amasse o alho e misture com azeite.', 'O alho ficou bem distribuído?', 'Use só metade do dente para começar.'],
        ['Junte limão e um pouco de água.', 'O patê está cremoso e espalhável?', 'Ponha água aos poucos para não ficar ralo.'],
        ['Acerte o sal e prove.', 'O sabor ficou equilibrado?', 'Mais limão dá frescor; mais azeite suaviza.'],
      ], 'Mantenha refrigerado depois de pronto.'],
  ]),
];
