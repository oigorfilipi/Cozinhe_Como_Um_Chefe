function rgb(hex) {
  return [1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16));
}

function linear(channel) {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

export function contrastRatio(first, second) {
  const luminance = (hex) => rgb(hex).map(linear).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
  const a = luminance(first);
  const b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

function blend(first, second, fraction) {
  const a = rgb(first);
  const b = rgb(second);
  return `#${a.map((value, index) => Math.round(value * (1 - fraction) + b[index] * fraction).toString(16).padStart(2, '0')).join('')}`.toUpperCase();
}

export function themeColors(accent, theme) {
  const base = /^#[0-9a-f]{6}$/i.test(accent) ? accent.toUpperCase() : '#286B49';
  const dark = theme === 'dark';
  const pageText = dark ? '#F4F7F2' : '#183027';
  const card = dark ? '#1D2B23' : '#FFFFFF';
  const buttonText = contrastRatio(base, '#FFFFFF') >= 4.5 ? '#FFFFFF' : '#101A16';
  let ink = base;
  for (let index = 0; index <= 20 && contrastRatio(ink, card) < 4.5; index += 1) {
    ink = blend(base, dark ? '#FFFFFF' : '#000000', (index + 1) / 20);
  }
  let mission = base;
  for (let index = 0; index <= 20 && contrastRatio(mission, '#123D2C') < 3; index += 1) {
    mission = blend(base, '#FFFFFF', (index + 1) / 20);
  }
  return { accent: base, accentInk: ink, accentMission: mission, buttonText, pageText };
}
