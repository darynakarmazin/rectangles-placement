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

  // console.log(`Ширина: ${containerWidth}, Висота: ${containerHeight}`);
});

async function fetchBlocksJSON() {
  const response = await fetch("./data/block.json");
  const blocks = await response.json();
  return blocks;
}

function calculateInnerEmptySpace(containerWidth, containerHeight, blocks) {
  let emptySpace = 0;

  for (let i = 0; i < blocks.length; i++) {
    for (let j = i + 1; j < blocks.length; j++) {
      const intersectWidth =
        Math.min(blocks[i].right, blocks[j].right) -
        Math.max(blocks[i].left, blocks[j].left);
      const intersectHeight =
        Math.min(blocks[i].bottom, blocks[j].bottom) -
        Math.max(blocks[i].top, blocks[j].top);

      if (intersectWidth > 0 && intersectHeight > 0) {
        emptySpace += intersectWidth * intersectHeight;
      }
    }
  }

  return emptySpace;
}

function calculateTotalSpace(containerWidth, containerHeight, blocks) {
  const containerArea = containerWidth * containerHeight;
  const blocksArea = blocks.reduce(
    (acc, block) =>
      acc + (block.right - block.left) * (block.bottom - block.top),
    0
  );

  return containerArea - blocksArea;
}

function calculateFullness(containerWidth, containerHeight, blocks) {
  const innerEmptySpace = calculateInnerEmptySpace(
    containerWidth,
    containerHeight,
    blocks
  );
  const totalSpace = calculateTotalSpace(
    containerWidth,
    containerHeight,
    blocks
  );

  return 1 - innerEmptySpace / (innerEmptySpace + totalSpace);
}

const blocksData = await fetchBlocksJSON();

// Сортування блоків за площею.
blocksData.sort((a, b) => b.width * b.height - a.width * a.height);

// Розміщення блоків в контейнері:
function placeBlocksInContainer(blocks, containerWidth, containerHeight) {
  const placedBlocks = [];
  let currentX = 0;
  let currentY = containerHeight;

  for (const block of blocks) {
    if (currentX + block.width <= containerWidth) {
      // Розмістити блок на поточній позиції
      const placedBlock = {
        ...block,
        left: currentX,
        top: currentY - block.height,
        right: currentX + block.width,
        bottom: currentY,
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
        left: currentX,
        top: currentY - block.height,
        right: currentX + block.width,
        bottom: currentY,
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

const colors = {};
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function renderBlocks(placedBlocks) {
  const result = placedBlocks
    .map((block, index) => {
      const sizeKey = `${block.right - block.left}-${block.bottom - block.top}`;
      const color = colors[sizeKey] || getRandomColor();
      colors[sizeKey] = color;
      return `<div class="block" style="height:${
        block.bottom - block.top
      }px; width:${
        block.right - block.left
      }px; background-color:${color}; position: absolute; top:${
        block.top
      }px; left:${block.left}px;">${index}</div>`;
    })
    .join(" ");
  list.innerHTML = result;
}

renderBlocks(placementResult.blocks);

const fullness = calculateFullness(
  containerWidth,
  containerHeight,
  placementResult.blocks
);

console.log("Fullness:", fullness);
console.log("blockCoordinates:", placementResult.blocks);
