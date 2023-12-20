// 1. Читання вхідних даних:
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

// 2. Ініціалізація алгоритму:
// Сортування блоків за площею.
blocksData.sort((a, b) => b.width * b.height - a.width * a.height);

console.log(blocksData);

// 3. Розміщення блоків в контейнері:
function placeBlocksInContainer(blocks, containerWidth, containerHeight) {
  const placedBlocks = [];
  let currentX = 0;
  let currentY = containerHeight;

  for (const block of blocks) {
    if (currentX + block.width <= containerWidth) {
      // Розмістити блок на поточній позиції
      const placedBlock = {
        ...block,
        x: currentX,
        y: currentY - block.height,
      };
      placedBlocks.push(placedBlock);

      // Оновити поточні координати
      currentX += block.width;
    } else {
      // Перейти на новий рядок
      currentX = 0;
      currentY -= block.height;

      // Розмістити блок на новому рядку
      const placedBlock = {
        ...block,
        x: currentX,
        y: currentY - block.height,
      };
      placedBlocks.push(placedBlock);

      // Оновити поточні координати
      currentX += block.width;
    }
  }

  return { blocks: placedBlocks };
}

const placementResult = placeBlocksInContainer(
  blocksData,
  containerWidth,
  containerHeight
);
console.log(placementResult.blocks);

const colors = {};
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const result = placementResult.blocks
  .map((block, index) => {
    const sizeKey = `${block.width}-${block.height}`;
    const color = colors[sizeKey] || getRandomColor();
    colors[sizeKey] = color;
    return `<div class="block" style="height:${block.height}px; width:${block.width}px; background-color:${color}; position: absolute; top:${block.y}px; left:${block.x}px;">${index}</div>`;
  })
  .join(" ");
list.innerHTML = result;
