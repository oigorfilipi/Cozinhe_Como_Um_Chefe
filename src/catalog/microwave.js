import { defineRecipes } from './define.js';

export const microwaveRecipes = [
  ...defineRecipes('microwave', 'simple', [
    ['bolo-caneca', 'Bolo de caneca de chocolate', '🧁', 7, 1, 'caneca grande própria para micro-ondas e garfo',
      ['4 colheres de sopa de farinha de trigo', '2 colheres de sopa de açúcar', '1 colher de sopa de cacau', '3 colheres de sopa de leite', '1 colher de sopa de óleo', '½ colher de chá de fermento químico'], [
        ['Misture farinha, açúcar e cacau na caneca.', 'Os ingredientes secos estão uniformes?', 'Desmanche as bolinhas de cacau com garfo.'],
        ['Junte leite e óleo; por último misture o fermento.', 'A massa ficou lisa e ocupa menos da metade da caneca?', 'Use caneca maior para evitar transbordar.'],
        ['Aqueça por 70 a 90 segundos e deixe repousar 1 minuto.', 'O centro está firme, sem massa crua?', 'Aqueça em intervalos de 10 segundos se ainda estiver líquido.'],
      ], 'Use caneca própria para micro-ondas, sem partes metálicas. O tempo varia conforme a potência.'],
    ['mingau-micro', 'Mingau de aveia no micro-ondas', '🥣', 6, 1, 'tigela funda própria para micro-ondas e colher',
      ['½ xícara de aveia', '1 xícara de leite', '½ banana', '1 pitada de canela'], [
        ['Misture aveia e leite na tigela funda.', 'A aveia está coberta pelo leite?', 'Use tigela maior que o volume da mistura para evitar transbordo.'],
        ['Aqueça 1 minuto, mexa, e aqueça mais 30 a 60 segundos.', 'O mingau engrossou sem derramar?', 'Pare, mexa e volte em intervalos curtos.'],
        ['Deixe repousar 1 minuto e acrescente banana e canela.', 'A textura ficou cremosa?', 'Se engrossou demais, adicione um pouco de leite.'],
      ], 'O recipiente e o mingau ficam quentes; use proteção para retirar.'],
    ['batata-micro', 'Batata cozida no micro-ondas', '🥔', 12, 1, 'prato próprio para micro-ondas e garfo',
      ['1 batata média lavada', '1 colher de chá de azeite', '1 pitada de sal'], [
        ['Fure a batata várias vezes com um garfo.', 'Há furos por toda a casca?', 'Fure os dois lados para o vapor sair.'],
        ['Coloque no prato e aqueça 4 minutos; vire com cuidado.', 'A batata começou a amaciar?', 'Use proteção: o prato pode estar muito quente.'],
        ['Aqueça mais 2 a 4 minutos, repouse 2 minutos e tempere.', 'O garfo entra facilmente até o centro?', 'Aqueça em intervalos de 1 minuto se ainda estiver dura.'],
      ], 'Fure a casca antes de aquecer e deixe o vapor sair ao abrir.'],
    ['milho-caneca', 'Milho temperado de caneca', '🌽', 7, 1, 'caneca grande própria para micro-ondas e colher',
      ['½ xícara de milho congelado', '1 colher de sopa de água', '1 colher de chá de manteiga', '1 pitada de sal'], [
        ['Coloque milho e água na caneca e cubra sem vedar.', 'Há espaço para o vapor sair?', 'Use tampa própria para micro-ondas apoiada, sem fechar hermeticamente.'],
        ['Aqueça 2 minutos, mexa e aqueça mais 1 minuto.', 'O milho está quente por igual?', 'Mexa e repita em intervalos curtos se houver partes frias.'],
        ['Escorra excesso de água e misture manteiga e sal.', 'A manteiga derreteu e cobriu o milho?', 'Mexa enquanto o milho ainda está quente.'],
      ], 'Abra a tampa longe do rosto para evitar queimadura com vapor.'],
    ['ovo-mexido-caneca', 'Ovo mexido de caneca', '🍳', 6, 1, 'caneca grande própria para micro-ondas e garfo',
      ['2 ovos', '1 colher de sopa de leite', '1 pitada de sal', '1 colher de chá de manteiga'], [
        ['Unte a caneca e bata os ovos com leite e sal.', 'As gemas e claras estão totalmente misturadas?', 'Nunca aqueça ovo inteiro com casca no micro-ondas.'],
        ['Aqueça 30 segundos, mexa e repita em ciclos de 20 segundos.', 'O ovo está formando pedaços macios?', 'Mexa entre ciclos para cozinhar por igual.'],
        ['Deixe repousar 1 minuto e confira.', 'O ovo está firme, sem parte líquida?', 'Volte por 15 segundos se ainda houver ovo cru.'],
      ], 'Não aqueça ovos com casca; cozinhe até não haver parte líquida.'],
  ]),
  ...defineRecipes('microwave', 'elaborate', [
    ['risoto-micro', 'Risoto de legumes no micro-ondas', '🍚', 30, 2, 'refratário fundo próprio para micro-ondas, tampa ventilada e colher',
      ['¾ de xícara de arroz arbóreo', '2 xícaras de caldo de legumes quente', '½ cenoura ralada', '½ xícara de ervilhas congeladas', '2 colheres de sopa de queijo ralado', '1 colher de chá de azeite'], [
        ['Misture arroz, cenoura e azeite no refratário fundo.', 'Os grãos ficaram envolvidos?', 'Use recipiente grande: o líquido ferve e sobe.'],
        ['Adicione metade do caldo e cubra sem vedar.', 'A tampa permite a saída de vapor?', 'Use tampa própria para micro-ondas, apoiada.'],
        ['Aqueça 8 minutos, mexa e adicione o restante do caldo.', 'O arroz começou a amaciar?', 'Se o líquido secou cedo, acrescente água quente.'],
        ['Junte ervilhas e aqueça mais 7 a 10 minutos, mexendo na metade.', 'O arroz está cozido e as ervilhas quentes?', 'Volte em ciclos de 2 minutos se o centro estiver duro.'],
        ['Descanse 2 minutos e misture o queijo.', 'O risoto ficou úmido e cremoso?', 'Acrescente um pouco de caldo quente se estiver seco.'],
      ], 'Os tempos variam com a potência. Use recipiente próprio, sem metal, e abra a tampa longe do rosto.'],
    ['macarrao-queijo-micro', 'Macarrão cremoso de caneca', '🍝', 18, 1, 'tigela funda própria para micro-ondas e colher',
      ['½ xícara de macarrão pequeno seco', '¾ de xícara de água potável', '¼ de xícara de leite', '⅓ de xícara de queijo ralado', '1 pitada de sal'], [
        ['Coloque macarrão e água na tigela funda.', 'A água cobre o macarrão?', 'Use tigela grande para a água não transbordar.'],
        ['Aqueça 3 minutos, mexa e repita em ciclos de 2 minutos.', 'O macarrão está quase macio?', 'Adicione água em colheradas se secar antes de cozinhar.'],
        ['Escorra apenas o excesso de água, com cuidado.', 'Restou pouco líquido no fundo?', 'Use luva: a tigela e a água estarão muito quentes.'],
        ['Misture leite e queijo.', 'O queijo ficou espalhado?', 'Mexa enquanto o macarrão está quente.'],
        ['Aqueça 30 a 60 segundos e descanse 1 minuto.', 'O molho está quente e cremoso?', 'Volte em 15 segundos se o queijo não derreteu.'],
      ], 'Não use recipiente com metal; mexa entre ciclos para aquecer por igual.'],
    ['cuscuz-caneca', 'Cuscuz de caneca com legumes', '🌽', 15, 1, 'caneca grande própria para micro-ondas e garfo',
      ['½ xícara de flocão de milho', '¼ de xícara de água potável', '2 colheres de sopa de cenoura ralada', '2 colheres de sopa de milho cozido', '1 pitada de sal', '1 colher de chá de azeite'], [
        ['Misture flocão, água e sal; espere 5 minutos.', 'O flocão absorveu a água?', 'Se estiver seco, pingue um pouco mais de água.'],
        ['Misture cenoura e milho cozido.', 'Os legumes estão distribuídos?', 'Solte os flocos com o garfo antes de misturar.'],
        ['Acomode sem apertar na caneca e cubra sem vedar.', 'Há espaço livre para expandir?', 'Não encha além de dois terços da caneca.'],
        ['Aqueça 2 minutos e deixe repousar 1 minuto.', 'O cuscuz está quente e firme?', 'Volte por 20 segundos se houver partes frias.'],
        ['Solte com garfo e finalize com azeite.', 'Os flocos estão separados e úmidos?', 'Pingue água se estiver esfarelando demais.'],
      ]],
    ['bolo-cenoura-caneca', 'Bolo de cenoura com cobertura', '🥕', 15, 1, 'caneca grande própria para micro-ondas, tigela e garfo',
      ['3 colheres de sopa de cenoura bem ralada', '4 colheres de sopa de farinha de trigo', '2 colheres de sopa de açúcar', '3 colheres de sopa de leite', '1 colher de sopa de óleo', '½ colher de chá de fermento químico', '1 colher de sopa de chocolate em pó'], [
        ['Misture cenoura, leite e óleo na caneca.', 'A cenoura está bem distribuída?', 'Rale fino para cozinhar junto com a massa.'],
        ['Junte farinha e açúcar até ficar liso.', 'Não há farinha seca no fundo?', 'Passe o garfo pelas laterais e pelo fundo.'],
        ['Misture o fermento por último; deixe metade da caneca livre.', 'A massa tem espaço para crescer?', 'Troque por uma caneca maior se necessário.'],
        ['Aqueça 80 a 100 segundos e repouse 1 minuto.', 'O centro está firme, sem massa crua?', 'Volte em ciclos de 10 segundos se necessário.'],
        ['Misture chocolate em pó com gotas de leite e espalhe por cima.', 'A cobertura ficou lisa?', 'Adicione leite gota a gota para não ficar líquida.'],
      ], 'Use caneca própria para micro-ondas, sem metal. O tempo varia com a potência.'],
    ['batata-recheada-micro', 'Batata recheada com feijão e queijo', '🥔', 20, 1, 'prato próprio para micro-ondas, garfo e colher',
      ['1 batata grande lavada', '½ xícara de feijão cozido enlatado escorrido', '2 colheres de sopa de queijo ralado', '1 colher de sopa de iogurte natural pasteurizado', '1 pitada de sal'], [
        ['Fure toda a batata com garfo.', 'Há furos nos dois lados?', 'Eles deixam o vapor escapar durante o aquecimento.'],
        ['Aqueça 5 minutos, vire e aqueça mais 3 a 5 minutos.', 'O garfo chega facilmente ao centro?', 'Volte em ciclos de 1 minuto se ainda estiver dura.'],
        ['Aqueça o feijão separado até ficar bem quente.', 'O feijão está quente por igual?', 'Mexa no meio do aquecimento; se for sobra refrigerada, confirme 74 °C.'],
        ['Abra a batata com cuidado e solte a polpa com garfo.', 'A batata abriu sem perder a forma?', 'Espere o vapor sair antes de mexer.'],
        ['Recheie com feijão e queijo; aqueça até derreter e finalize com iogurte.', 'O queijo derreteu e o recheio está quente?', 'Aqueça mais 20 segundos se necessário.'],
      ], 'A batata e o vapor queimam; use proteção. Sobras refrigeradas devem chegar a 74 °C.'],
  ]),
];
