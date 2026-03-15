import opentype from "opentype.js";
import sharp from "sharp";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fontPath = join(__dirname, "Audiowide-Regular.ttf");
const font = opentype.loadSync(fontPath);

const text = "skill mill";
const fontSize = 72;

// Get the path for the text
const path = font.getPath(text, 0, 0, fontSize);
const bbox = path.getBoundingBox();

// Make square: use the longer side, center text
const textWidth = Math.ceil(bbox.x2 - bbox.x1);
const textHeight = Math.ceil(bbox.y2 - bbox.y1);
const side = Math.max(textWidth, textHeight) + 40; // padding included

// Center the text in the square
const offsetX = -bbox.x1 + (side - textWidth) / 2;
const offsetY = -bbox.y1 + (side - textHeight) / 2;
const width = side;
const height = side;

const pathData = font.getPath(text, offsetX, offsetY, fontSize).toPathData(2);

// SVG variants
const variants = [
  {
    name: "light",
    desc: "white bg, black text",
    bg: `<rect width="${width}" height="${height}" fill="#ffffff"/>`,
    fill: "#000000",
  },
  {
    name: "dark",
    desc: "black bg, white text",
    bg: `<rect width="${width}" height="${height}" fill="#000000"/>`,
    fill: "#ffffff",
  },
  {
    name: "black",
    desc: "transparent bg, black text",
    bg: "",
    fill: "#000000",
  },
  {
    name: "white",
    desc: "transparent bg, white text",
    bg: "",
    fill: "#ffffff",
  },
];

const pngScale = 4; // Render at higher resolution for crisp PNGs
const pngSize = width * pngScale;

for (const v of variants) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  ${v.bg}
  <path d="${pathData}" fill="${v.fill}"/>
</svg>`;

  const svgPath = join(__dirname, `skill-mill-${v.name}.svg`);
  const pngPath = join(__dirname, `skill-mill-${v.name}.png`);

  writeFileSync(svgPath, svg);

  await sharp(Buffer.from(svg))
    .resize(pngSize, pngSize)
    .png()
    .toFile(pngPath);

  console.log(`  skill-mill-${v.name}.svg / .png  (${v.desc})`);
}

console.log(`\nGenerated ${variants.length} SVGs + ${variants.length} PNGs (${width}x${height} svg, ${pngSize}x${pngSize} png)`);
