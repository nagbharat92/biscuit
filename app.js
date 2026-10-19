const form = document.querySelector("form");
const selection = document.querySelector(".selection");

// All cards use the same original drawing so only the palette treatment changes.
const palette = [
  [238, 232, 213], [37, 42, 37], [81, 59, 50], [124, 81, 64],
  [200, 132, 96], [237, 182, 139], [244, 212, 172], [50, 79, 75],
  [91, 123, 98], [139, 155, 112], [154, 79, 63], [203, 121, 82],
  [75, 78, 87], [114, 113, 122], [52, 50, 51], [223, 184, 120],
];
const drawing = new Uint8Array(64 * 64);

function box(x, y, width, height, color) {
  for (let row = y; row < y + height; row += 1) {
    drawing.fill(color, row * 64 + x, row * 64 + x + width);
  }
}

function drawCharacter() {
  // Backpack and boots sit behind the coat and face.
  box(18, 30, 28, 19, 1);
  box(19, 31, 26, 16, 3);
  box(20, 33, 24, 12, 15);
  box(22, 46, 9, 11, 1);
  box(34, 46, 9, 11, 1);
  box(23, 46, 7, 7, 12);
  box(35, 46, 7, 7, 12);
  box(23, 48, 2, 5, 13);
  box(35, 48, 2, 5, 13);
  box(21, 54, 10, 4, 14);
  box(34, 54, 10, 4, 14);
  box(22, 54, 7, 1, 3);
  box(35, 54, 7, 1, 3);

  box(20, 30, 25, 17, 1);
  box(21, 31, 23, 14, 7);
  box(23, 31, 18, 14, 8);
  box(24, 33, 4, 10, 9);
  box(32, 34, 1, 11, 7);
  box(34, 37, 5, 5, 7);
  box(35, 37, 4, 1, 9);
  box(31, 36, 1, 1, 15);
  box(31, 40, 1, 1, 15);
  box(19, 34, 3, 10, 1);
  box(20, 35, 3, 7, 8);
  box(20, 42, 3, 3, 5);
  box(42, 34, 3, 10, 1);
  box(41, 35, 3, 7, 7);
  box(41, 42, 3, 3, 4);

  box(23, 13, 19, 18, 1);
  box(21, 17, 23, 10, 1);
  box(22, 18, 21, 8, 4);
  box(24, 15, 17, 15, 4);
  box(25, 16, 15, 12, 5);
  box(25, 17, 5, 7, 6);
  box(23, 15, 4, 9, 2);
  box(24, 14, 17, 5, 2);
  box(26, 15, 6, 4, 3);
  box(37, 17, 4, 4, 2);
  box(27, 22, 2, 3, 1);
  box(36, 22, 2, 3, 1);
  box(31, 27, 4, 1, 3);
  box(31, 25, 2, 1, 4);

  box(25, 8, 15, 2, 1);
  box(22, 10, 21, 6, 1);
  box(23, 11, 19, 4, 7);
  box(24, 11, 14, 3, 8);
  box(25, 10, 9, 2, 9);
  box(21, 15, 24, 3, 1);
  box(22, 15, 22, 1, 9);
  box(24, 14, 17, 1, 10);

  box(24, 29, 17, 4, 10);
  box(25, 29, 15, 2, 11);
  box(36, 31, 4, 8, 10);
  box(36, 31, 3, 6, 11);
  box(36, 38, 4, 1, 15);
}

function nearestColor(color, colors) {
  let closest = colors[0];
  let distance = Infinity;
  for (const candidate of colors) {
    const difference = candidate.reduce((sum, channel, i) => sum + (channel - color[i]) ** 2, 0);
    if (difference < distance) {
      distance = difference;
      closest = candidate;
    }
  }
  return closest;
}

function drawPreview(canvas) {
  const depth = Number(canvas.dataset.depth);
  const context = canvas.getContext("2d");
  if (!context) {
    selection.textContent = "Artwork previews are unavailable in this browser.";
    selection.classList.remove("visually-hidden");
    return;
  }
  const image = context.createImageData(64, 64);
  const greenPalette = [[24, 48, 39], [72, 107, 62], [164, 184, 109], [232, 239, 198]];
  const richPalette = palette.flatMap((color) =>
    Array.from({ length: 16 }, (_, shade) =>
      color.map((channel) => Math.min(255, Math.round(channel * (0.75 + shade / 32)))),
    ),
  );
  const dither = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

  for (let i = 0; i < drawing.length; i += 1) {
    const material = drawing[i];
    const base = palette[material];
    const x = i % 64;
    const y = Math.floor(i / 64);
    const luminance = (base[0] * 0.2126 + base[1] * 0.7152 + base[2] * 0.0722) / 255;
    let color;
    if (depth === 1) {
      const threshold = 0.3 + dither[(y % 4) * 4 + (x % 4)] / 40;
      color = luminance > threshold ? [255, 255, 255] : [0, 0, 0];
    } else if (depth === 2) {
      color = greenPalette[Math.min(3, Math.floor(luminance * 4))];
    } else if (depth === 4) {
      color = base;
    } else {
      const variation = ((x * 13 + y * 7) % 7) / 100;
      const light = material === 0 ? 1 : 1.14 - x / 200 - y / 400 + variation;
      color = nearestColor(base.map((channel) => Math.min(255, channel * light)), richPalette);
    }
    image.data.set([...color, 255], i * 4);
  }
  context.putImageData(image, 0, 0);
}

function updateSelection() {
  const chosen = form.querySelector('input[name="bit-depth"]:checked');
  selection.textContent = chosen
    ? `${chosen.value}-bit selected. Up to ${2 ** Number(chosen.value)} colors for your character.`
    : "No color depth selected yet.";
}

form.addEventListener("submit", (event) => event.preventDefault());
form.addEventListener("change", updateSelection);
window.addEventListener("pageshow", updateSelection);
updateSelection();
drawCharacter();
document.querySelectorAll("canvas[data-depth]").forEach(drawPreview);
