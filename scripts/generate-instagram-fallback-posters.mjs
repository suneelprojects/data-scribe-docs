import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("../", import.meta.url).pathname;
const source = readFileSync(join(root, "src/lib/instagram-studio.server.ts"), "utf8");
const marker = "const FALLBACK_LESSONS: FallbackLesson[] = ";
const start = source.indexOf(marker);
const end = source.indexOf("\n];\n\nconst EAZYDATAFIX_FACTS", start);
if (start < 0 || end < 0) throw new Error("Could not locate FALLBACK_LESSONS");
const lessons = Function(`return ${source.slice(start + marker.length, end + 2)}`)();

const palettes = [
  ["#0b66ff", "#00b8d9", "#eaf3ff"],
  ["#6d4aff", "#15b8a6", "#f0edff"],
  ["#006d77", "#f59e0b", "#e8f7f5"],
  ["#155eef", "#8b5cf6", "#edf4ff"],
  ["#007a5a", "#2e90fa", "#eafbf4"],
];

const escapeXml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

function wrap(value, max) {
  const words = String(value).split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    if (!line || `${line} ${word}`.length <= max) line = line ? `${line} ${word}` : word;
    else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function tspans(lines, x, firstY, lineHeight) {
  return lines
    .map((line, index) => `<tspan x="${x}" y="${firstY + index * lineHeight}">${escapeXml(line)}</tspan>`)
    .join("");
}

function posterSvg(lesson, index) {
  const [primary, accent, tint] = palettes[index % palettes.length];
  const titleLines = wrap(lesson.title, 20).slice(0, 2);
  const subtitleLines = wrap(lesson.subtitle, 44).slice(0, 2);
  const rows = lesson.points.slice(0, 5);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
  <rect width="1080" height="1350" fill="#f8fbff"/>
  <rect width="1080" height="16" fill="${primary}"/>
  <circle cx="1010" cy="80" r="150" fill="${tint}"/>
  <circle cx="70" cy="1250" r="190" fill="${tint}"/>
  <text x="72" y="78" font-family="DejaVu Sans" font-size="31" font-weight="700" fill="#0a1733">EazyDataFix</text>
  <rect x="72" y="104" width="255" height="42" rx="21" fill="${primary}"/>
  <text x="200" y="133" text-anchor="middle" font-family="DejaVu Sans" font-size="18" font-weight="700" letter-spacing="1.5" fill="#ffffff">DAILY PYTHON LEARNING</text>

  <text x="72" font-family="DejaVu Sans" font-size="59" font-weight="800" fill="#091b3a">${tspans(titleLines, 72, 220, 68)}</text>
  <text x="72" font-family="DejaVu Sans" font-size="27" font-weight="400" fill="#48617e">${tspans(subtitleLines, 72, 350, 36)}</text>

  <g transform="translate(805 182)">
    <rect x="0" y="0" width="190" height="170" rx="40" fill="#0a1733"/>
    <path d="M50 84 L78 55 L91 68 L76 84 L91 100 L78 113 Z" fill="${accent}"/>
    <path d="M140 84 L112 55 L99 68 L114 84 L99 100 L112 113 Z" fill="${primary}"/>
    <rect x="87" y="43" width="16" height="82" rx="8" transform="rotate(17 95 84)" fill="#ffffff"/>
    <text x="95" y="151" text-anchor="middle" font-family="DejaVu Sans" font-size="16" font-weight="700" fill="#ffffff">PYTHON MAP</text>
  </g>

  <path d="M166 468 C260 420 340 430 420 478" fill="none" stroke="${primary}" stroke-width="5" opacity=".22"/>
  <path d="M166 628 C260 580 340 590 420 638" fill="none" stroke="${accent}" stroke-width="5" opacity=".22"/>
  ${rows
    .map((point, row) => {
      const y = 430 + row * 154;
      const rowColor = row % 2 === 0 ? primary : accent;
      const outcomeLines = wrap(point.outcome, 36).slice(0, 2);
      return `
  <g transform="translate(72 ${y})">
    <rect x="0" y="0" width="936" height="126" rx="24" fill="#ffffff" stroke="#d8e4f2" stroke-width="2"/>
    <rect x="0" y="0" width="12" height="126" rx="6" fill="${rowColor}"/>
    <circle cx="74" cy="63" r="35" fill="${tint}" stroke="${rowColor}" stroke-width="3"/>
    <text x="74" y="73" text-anchor="middle" font-family="DejaVu Sans Mono" font-size="25" font-weight="700" fill="${rowColor}">${String(row + 1).padStart(2, "0")}</text>
    <text x="132" y="52" font-family="DejaVu Sans" font-size="27" font-weight="700" fill="#102a4c">${escapeXml(point.label)}</text>
    <text x="132" font-family="DejaVu Sans" font-size="23" font-weight="400" fill="#48617e">${tspans(outcomeLines, 132, 86, 28)}</text>
    <path d="M850 47 L878 63 L850 79" fill="none" stroke="${rowColor}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
  </g>`;
    })
    .join("")}

  <rect x="72" y="1228" width="936" height="70" rx="20" fill="#0a1733"/>
  <text x="108" y="1273" font-family="DejaVu Sans" font-size="22" font-weight="700" letter-spacing="1.2" fill="#ffffff">LEARN  •  PRACTICE  •  BUILD</text>
  <text x="966" y="1273" text-anchor="end" font-family="DejaVu Sans" font-size="22" font-weight="600" fill="${accent}">eazydatafix.com</text>
</svg>`;
}

const outDir = join(root, "src/assets/instagram-fallback");
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

lessons.forEach((lesson, index) => {
  const svgPath = join(outDir, `${String(index).padStart(2, "0")}.svg`);
  const pngPath = join(outDir, `${String(index).padStart(2, "0")}.png`);
  const jpgPath = join(outDir, `${String(index).padStart(2, "0")}.jpg`);
  writeFileSync(svgPath, posterSvg(lesson, index));
  execFileSync("inkscape", [svgPath, `--export-filename=${pngPath}`]);
  execFileSync("convert", [pngPath, "-strip", "-interlace", "Plane", "-quality", "82", jpgPath]);
  rmSync(svgPath);
  rmSync(pngPath);
});
console.log(`Generated ${lessons.length} rich fallback posters.`);
