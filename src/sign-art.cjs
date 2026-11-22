const ink = '#171717';
const yellow = '#ffda27';

function sign(symbol, frame = '<path d="M80 5 155 80 80 155 5 80Z"/>') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
    <g fill="${yellow}" stroke="${ink}" stroke-width="3.5">${frame}</g>
    <g fill="${ink}">${symbol}</g>
  </svg>`;
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

function lines(path, width) {
  return `<path d="${path}" fill="none" stroke="${ink}" stroke-width="${width}"/>`;
}

function dividedRoad(begins) {
  const divider = begins ? 'M69 44H91Q89 74 80 79Q71 74 69 44Z' : 'M69 116H91Q89 86 80 81Q71 86 69 116Z';
  const lanes = begins
    ? 'M63 123V110C63 88 48 86 48 65V56M112 55V63C112 86 97 88 97 112'
    : 'M48 116V103C48 81 63 79 63 56M97 38V49C97 71 112 74 112 96V106';
  const arrowheads = begins ? 'M48 43 36 61H60ZM97 124 85 106H109Z' : 'M63 43 51 61H75ZM112 119 100 101H124Z';
  return sign(`<path d="${divider}"/>${lines(lanes, 9)}<path d="${arrowheads}"/>`);
}

function chevron(left) {
  const symbol = '<path d="M43 22H79L124 80 79 138H43L88 80Z"/>';
  const shape = left ? `<g transform="translate(160) scale(-1 1)">${symbol}</g>` : symbol;
  return sign(shape, '<rect x="26" y="9" width="108" height="142"/>');
}

const roundaboutArrow = lines('M54 66A29 29 0 0 1 96 56', 10) + '<path d="M104 64 86 60 101 46Z"/>';
const roundabout = [0, 120, 240].map(angle =>
  `<g transform="rotate(${angle} 80 80)">${roundaboutArrow}</g>`
).join('');

module.exports = {
  'asymmetric-narrowing': sign(lines('M65 40V120M92 40V65L105 90V120', 6)),
  'chevron-left': chevron(true),
  'chevron-right': chevron(false),
  crossroads: sign(lines('M80 39V121M39 80H121', 12)),
  'divided-road-begins': dividedRoad(true),
  'divided-road-ends': dividedRoad(false),
  'junction-left': sign(lines('M90 45V115M57 79H90', 9)),
  'junction-right': sign(lines('M70 45V115M70 79H103', 9)),
  roundabout: sign(roundabout),
  'single-hump': sign('<path d="M80 31 65 50H75V66H85V50H95ZM46 100H58Q80 68 102 100H114V108H46Z"/>'),
  'uneven-road': sign('<path d="M40 83H49C60 83 61 69 71 69S82 83 93 83 104 69 114 69 125 83 132 83V95H40Z" transform="translate(-4 0)"/>'),
};
