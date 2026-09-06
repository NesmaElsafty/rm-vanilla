const VINE_STROKES = [
  { d: 'M280 480 C280 380, 320 340, 300 260 C285 210, 265 175, 258 145', width: 1.1, delay: '0s' },
  { d: 'M300 260 C340 230, 370 190, 380 150', width: 0.9, delay: '2s' },
  { d: 'M280 480 C220 460, 160 440, 100 420 C60 410, 30 395, 10 370', width: 0.85, delay: '4s' },
];

const LIGHT_DOTS = [
  { cx: 10, cy: 370, r: 2, delay: '0s' },
  { cx: 380, cy: 150, r: 2, delay: '2.5s' },
];

export function botanicalSVG({ id = 'botanical', bold = true, animated = true } = {}) {
  const gradId = `goldGrad-${id}`;
  const lightGradId = `goldLight-${id}`;
  const strokeOpacity = bold ? [0.72, 0.62, 0.5] : [0.35, 0.28, 0.2];
  const strokeWidth = bold ? [1.1, 0.9, 0.85] : [0.75, 0.6, 0.5];
  const leafOpacity = bold ? 0.68 : 0.35;
  const leafStroke = bold ? 0.75 : 0.5;

  const vines = VINE_STROKES.map(
    (stroke, i) =>
      `<path d="${stroke.d}" stroke="url(#${gradId})" stroke-width="${strokeWidth[i]}" stroke-linecap="round" opacity="${strokeOpacity[i]}"/>`,
  ).join('');

  const lights = animated
    ? `<g class="vine-light-traces">${VINE_STROKES.map(
        (stroke) =>
          `<path d="${stroke.d}" class="vine-light-trace" stroke="url(#${lightGradId})" stroke-width="${stroke.width}" stroke-linecap="round" pathLength="100" style="animation-delay:${stroke.delay}"></path>`,
      ).join('')}</g>`
    : '';

  const dots = LIGHT_DOTS.map((dot) => {
    const r = bold ? dot.r : dot.r - 0.5;
    const fill = bold ? 'rgba(199,154,59,0.75)' : 'rgba(199,154,59,0.4)';
    const delay = animated ? ` style="animation-delay:${dot.delay}"` : '';
    const cls = animated ? ' class="vine-light-dot"' : '';
    return `<circle cx="${dot.cx}" cy="${dot.cy}" r="${r}"${cls} fill="${fill}"${delay}/>`;
  }).join('');

  const lightGrad = animated
    ? `<linearGradient id="${lightGradId}" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#F8F3EB" stop-opacity="0"/>
        <stop offset="35%" stop-color="#D7BE7A" stop-opacity="0.35"/>
        <stop offset="50%" stop-color="#F8F3EB" stop-opacity="1"/>
        <stop offset="65%" stop-color="#D7BE7A" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="#F8F3EB" stop-opacity="0"/>
      </linearGradient>`
    : '';

  return `<svg class="pointer-events-none botanical-line-art ${bold ? 'botanical-line-art--bold' : ''} ${animated ? 'botanical-line-art--animated' : ''}" viewBox="0 0 400 520" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    ${vines}
    <path d="M380 150 C390 138, 395 122, 385 112 C375 125, 372 140, 380 150Z" stroke="url(#${gradId})" stroke-width="${leafStroke}" fill="${bold ? 'rgba(199,154,59,0.1)' : 'rgba(199,154,59,0.04)'}" opacity="${leafOpacity}"/>
    <path d="M100 420 C88 408, 82 395, 92 382 C104 395, 108 410, 100 420Z" stroke="url(#${gradId})" stroke-width="${leafStroke}" fill="${bold ? 'rgba(199,154,59,0.08)' : 'rgba(199,154,59,0.03)'}" opacity="${bold ? 0.55 : 0.3}"/>
    ${lights}
    ${dots}
    <defs>
      <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#D7BE7A" stop-opacity="${bold ? 0.95 : 0.6}"/>
        <stop offset="45%" stop-color="#C79A3B" stop-opacity="${bold ? 0.88 : 0.5}"/>
        <stop offset="100%" stop-color="${bold ? '#C79A3B' : '#B98FA2'}" stop-opacity="${bold ? 0.75 : 0.3}"/>
      </linearGradient>
      ${lightGrad}
    </defs>
  </svg>`;
}

export function journeyCurveSVG({ id = 'journey-curve', animated = true } = {}) {
  const curveId = `curveGold-${id}`;
  const curveLightId = `curveGoldLight-${id}`;
  const path = 'M0 60 C120 20, 200 100, 320 55 S520 15, 640 60 S760 100, 800 50';
  const light = animated
    ? `<path d="${path}" class="journey-curve-light" stroke="url(#${curveLightId})" stroke-width="1.2" stroke-linecap="round" pathLength="100"/>`
    : '';
  const lightGrad = animated
    ? `<linearGradient id="${curveLightId}" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#F8F3EB" stop-opacity="0"/>
        <stop offset="50%" stop-color="#F8F3EB" stop-opacity="0.9"/>
        <stop offset="100%" stop-color="#F8F3EB" stop-opacity="0"/>
      </linearGradient>`
    : '';

  return `<svg class="pointer-events-none w-full ${animated ? 'journey-curve--animated' : ''}" viewBox="0 0 800 120" fill="none" preserveAspectRatio="none" aria-hidden="true">
    <path d="${path}" stroke="url(#${curveId})" stroke-width="1" stroke-linecap="round" opacity="0.35"/>
    ${light}
    <defs>
      <linearGradient id="${curveId}" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#C79A3B" stop-opacity="0.1"/>
        <stop offset="50%" stop-color="#C79A3B" stop-opacity="0.45"/>
        <stop offset="100%" stop-color="#C79A3B" stop-opacity="0.1"/>
      </linearGradient>
      ${lightGrad}
    </defs>
  </svg>`;
}
