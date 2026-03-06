import opentype from "opentype.js";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fontPath = join(__dirname, "KaushanScript-Regular.ttf");
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

// White background, black text
const svgLight = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <rect width="${width}" height="${height}" fill="#ffffff"/>
  <path d="${pathData}" fill="#000000"/>
</svg>`;

// Black background, white text
const svgDark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <rect width="${width}" height="${height}" fill="#000000"/>
  <path d="${pathData}" fill="#ffffff"/>
</svg>`;

// Transparent background versions too
const svgBlack = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <path d="${pathData}" fill="#000000"/>
</svg>`;

const svgWhite = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <path d="${pathData}" fill="#ffffff"/>
</svg>`;

writeFileSync(join(__dirname, "skill-mill-light.svg"), svgLight);
writeFileSync(join(__dirname, "skill-mill-dark.svg"), svgDark);
writeFileSync(join(__dirname, "skill-mill-black.svg"), svgBlack);
writeFileSync(join(__dirname, "skill-mill-white.svg"), svgWhite);

console.log(`Generated SVGs: ${width}x${height}px`);
console.log("  skill-mill-light.svg  (white bg, black text)");
console.log("  skill-mill-dark.svg   (black bg, white text)");
console.log("  skill-mill-black.svg  (transparent bg, black text)");
console.log("  skill-mill-white.svg  (transparent bg, white text)");
