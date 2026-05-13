type IconNode = { tag: string; attr: Record<string, string>; child: IconNode[] };

type IconDef = {
  tag: string;
  attr: Record<string, string>;
  child: IconNode[];
  svgAttr?: Record<string, string>;
};

const icons: Record<string, IconDef> = {
  FiGithub: {
    tag: 'svg',
    attr: { viewBox: '0 0 24 24' },
    svgAttr: { fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
    child: [
      { tag: 'path', attr: { d: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22' }, child: [] },
    ],
  },
  CiLinkedin: {
    tag: 'svg',
    attr: { viewBox: '0 0 24 24' },
    svgAttr: { fill: 'currentColor' },
    child: [
      {
        tag: 'g', attr: { id: 'LinkedIn' }, child: [
          {
            tag: 'g', attr: {}, child: [
              { tag: 'path', attr: { d: 'M18.44,3.06H5.56a2.507,2.507,0,0,0-2.5,2.5V18.44a2.507,2.507,0,0,0,2.5,2.5H18.44a2.5,2.5,0,0,0,2.5-2.5V5.56A2.5,2.5,0,0,0,18.44,3.06Zm1.5,15.38a1.511,1.511,0,0,1-1.5,1.5H5.56a1.511,1.511,0,0,1-1.5-1.5V5.56a1.511,1.511,0,0,1,1.5-1.5H18.44a1.511,1.511,0,0,1,1.5,1.5Z' }, child: [] },
              {
                tag: 'g', attr: {}, child: [
                  { tag: 'path', attr: { d: 'M6.376,10.748a1,1,0,1,1,2,0v6.5h0a1,1,0,0,1-2,0Z' }, child: [] },
                  { tag: 'circle', attr: { cx: '7.376', cy: '6.744', r: '1' }, child: [] },
                  { tag: 'path', attr: { d: 'M17.62,13.37v3.88a1,1,0,1,1-2,0V13.37a1.615,1.615,0,1,0-3.23,0v3.88a1,1,0,0,1-2,0v-6.5a1.016,1.016,0,0,1,1-1,.94.94,0,0,1,.84.47,3.609,3.609,0,0,1,5.39,3.15Z' }, child: [] },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  FiTwitter: {
    tag: 'svg',
    attr: { viewBox: '0 0 24 24' },
    svgAttr: { fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
    child: [
      { tag: 'path', attr: { d: 'M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z' }, child: [] },
    ],
  },
};

function renderNode(node: IconNode): string {
  const attrStr = Object.entries(node.attr)
    .map(([k, v]) => `${k}="${v}"`)
    .join(' ');
  const children = node.child.map((c) => renderNode(c)).join('');
  return `<${node.tag} ${attrStr}>${children}</${node.tag}>`;
}

export function renderIcon(name: keyof typeof icons, size: number = 20): string {
  const icon = icons[name];
  if (!icon) return '';
  const baseAttrs = [`xmlns="http://www.w3.org/2000/svg"`, `width="${size}"`, `height="${size}"`];
  for (const [k, v] of Object.entries(icon.attr)) {
    baseAttrs.push(`${k}="${v}"`);
  }
  if (icon.svgAttr) {
    for (const [k, v] of Object.entries(icon.svgAttr)) {
      baseAttrs.push(`${k}="${v}"`);
    }
  }
  const children = icon.child.map((c) => renderNode(c)).join('');
  return `<svg ${baseAttrs.join(' ')}>${children}</svg>`;
}
