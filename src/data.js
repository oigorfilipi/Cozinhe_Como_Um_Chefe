export const ingredients = [
  '1 tortilla ou pão para wrap',
  '1 colher de sopa de requeijão',
  '2 folhas de alface lavadas e secas',
  '2 colheres de sopa de cenoura ralada pronta',
];

export const steps = [
  {
    instruction: 'Abra a tortilla sobre o prato.',
    question: 'Ela está aberta e sem rasgos grandes?',
    tip: 'Se rasgou, sobreponha as bordas ou use outra tortilla. Deixe o centro livre para o recheio.',
  },
  {
    instruction: 'Espalhe o requeijão no centro com as costas da colher. Deixe uma borda livre.',
    question: 'O requeijão ficou espalhado no centro?',
    tip: 'Comece pelo meio e espalhe aos poucos. Evite passar requeijão até a borda.',
  },
  {
    instruction: 'Coloque a alface e a cenoura no centro da tortilla.',
    question: 'O recheio ficou no centro, sem transbordar?',
    tip: 'Retire um pouco do recheio e deixe as laterais livres para dobrar.',
  },
  {
    instruction: 'Dobre as laterais e enrole a tortilla, apertando de leve.',
    question: 'O wrap ficou fechado e dá para segurar?',
    tip: 'Dobre as laterais outra vez e enrole um pouco mais firme, sem apertar demais.',
  },
];

export const medals = [
  { name: 'Iniciante', threshold: 10 },
  { name: 'Intermediária', threshold: 20 },
  { name: 'Avançada', threshold: 30 },
  { name: 'Chefe', threshold: 40 },
  { name: 'Alquimista da Cozinha', threshold: 50 },
];

export const recipes = [
  { name: 'Wrap frio', meta: '5 min · Sem aquecimento', emoji: '🌯', equipment: null, available: true },
  { name: 'Omelete simples', meta: '10 min · Fogão', emoji: '🍳', equipment: 'stove' },
  { name: 'Batata crocante', meta: '20 min · Air fryer', emoji: '🥔', equipment: 'fryer' },
  { name: 'Legumes assados', meta: '25 min · Forno', emoji: '🥦', equipment: 'oven' },
  { name: 'Bolo de caneca', meta: '5 min · Micro-ondas', emoji: '🧁', equipment: 'microwave' },
  { name: 'Arroz simples', meta: '30 min · Panela elétrica', emoji: '🍚', equipment: 'electricPot' },
];
