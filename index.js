// 1.Читання вхідних даних:

// Зчитати JSON файл з параметрами прямокутних блоків.
// Зчитати розмір контейнера.

const list = document.querySelector(".container");

let containerHeight = document.documentElement.clientHeight;
let containerWidth = document.documentElement.clientWidth;

list.style.width = `${containerWidth}px`;
list.style.height = `${containerHeight}px`;

window.addEventListener("resize", () => {
  containerHeight = document.documentElement.clientHeight;
  containerWidth = document.documentElement.clientWidth;
  list.style.width = `${containerWidth}px`;
  list.style.height = `${containerHeight}px`;

  console.log(`Ширина: ${containerWidth}, Висота: ${containerHeight}`);
});

async function fetchBlocksJSON() {
  const response = await fetch("./data/block.json");
  const blocks = await response.json();
  return blocks;
}
const blocksData = await fetchBlocksJSON();

// 2.Ініціалізація алгоритму:
// Сортування блоків за площею.
blocksData.sort((a, b) => b.width * b.height - a.width * a.height);

console.log(blocksData);

// 3. Розміщення блоків в контейнері:
function placeBlocksInContainer(blocks, containerWidth, containerHeight) {
  const gridSize = 10; // Розмір сітки для розташування блоків
  const gridWidth = Math.ceil(containerWidth / gridSize);
  const gridHeight = Math.ceil(containerHeight / gridSize);
  const grid = new Array(gridHeight)
    .fill(null)
    .map(() => new Array(gridWidth).fill(null));

  const placedBlocks = [];

  for (const block of blocks) {
    const blockWidthInGrid = Math.ceil(block.width / gridSize);
    const blockHeightInGrid = Math.ceil(block.height / gridSize);

    for (let row = 0; row < gridHeight - blockHeightInGrid + 1; row++) {
      for (let col = 0; col < gridWidth - blockWidthInGrid + 1; col++) {
        let canPlace = true;

        for (let i = 0; i < blockHeightInGrid; i++) {
          for (let j = 0; j < blockWidthInGrid; j++) {
            if (grid[row + i][col + j] !== null) {
              canPlace = false;
              break;
            }
          }
          if (!canPlace) break;
        }

        if (canPlace) {
          for (let i = 0; i < blockHeightInGrid; i++) {
            for (let j = 0; j < blockWidthInGrid; j++) {
              grid[row + i][col + j] = block;
            }
          }

          const placedBlock = {
            ...block,
            x: col * gridSize,
            y: row * gridSize,
          };
          placedBlocks.push(placedBlock);
          break;
        }
      }
      if (placedBlocks.length === blocks.length) break;
    }
  }

  return { blocks: placedBlocks, gridSize };
}

const placementResult = placeBlocksInContainer(
  blocksData,
  containerWidth,
  containerHeight
);

const colors = {};
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

console.log(placementResult.blocks);

const result = placementResult.blocks
  .map((block, index) => {
    const sizeKey = `${block.width}-${block.height}`;
    const color = colors[sizeKey] || getRandomColor();
    colors[sizeKey] = color;
    return `<div class="block" style="height:${block.height}px; width:${block.width}px; background-color:${color}; position: absolute; top:${block.y}px; left:${block.x}px;">${index}</div>`;
  })
  .join(" ");
list.innerHTML = result;
