// Renders a `herdr pane read --format ansi` capture as an SVG: node ansi2svg.mjs <in.ansi> <out.svg>
import { readFileSync, writeFileSync } from 'node:fs';
const [, , input, output] = process.argv;
const palette = ['#1e1e1e', '#e06c75', '#98c379', '#e5c07b', '#61afef', '#c678dd', '#56b6c2', '#d0d0d0'];
const cw = 9, ch = 20, plain = '#d0d0d0';
const rows = readFileSync(input, 'utf8').replace(/\r/g, '').split('\n').map((line) => {
    let fg = plain, dim = false, bold = false;
    const cells = [];
    for (const part of line.split(/(\x1b\[[0-9;]*m)/)) {
        const code = /^\x1b\[([0-9;]*)m$/.exec(part);
        if (code === null) { for (const chr of part) cells.push({ chr, fg, dim, bold }); continue; }
        const values = code[1].split(';').map(Number);
        for (let i = 0; i < values.length; i += 1) {
            const n = values[i];
            if (n === 0 || code[1] === '' || n === 22) { fg = n === 22 ? fg : plain; dim = false; bold = false; }
            else if (n === 1) bold = true;
            else if (n === 2) dim = true;
            else if (n >= 30 && n <= 37) fg = palette[n - 30];
            else if (n === 38 && values[i + 1] === 5) { fg = palette[values[i + 2] % 8] ?? plain; i += 2; }
        }
    }
    return cells;
});
while (rows.length > 0 && rows.at(-1).length === 0) rows.pop();
const width = Math.max(100, ...rows.map((cells) => cells.length)) * cw + 32;
const escape = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const text = rows.flatMap((cells, y) => cells.filter((c) => c.chr !== ' ').map((c, _, all) => {
    const x = cells.indexOf(c);
    return `<text x="${16 + x * cw}" y="${30 + y * ch}" fill="${c.fg}" opacity="${c.dim ? 0.6 : 1}"${c.bold ? ' font-weight="bold"' : ''}>${escape(c.chr)}</text>`;
})).join('');
writeFileSync(output, `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${rows.length * ch + 32}"><rect width="100%" height="100%" fill="#1e1e1e"/><g font-family="Liberation Mono" font-size="15">${text}</g></svg>`);
