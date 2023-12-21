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
    let rotatedWidth = block.width;
    let rotatedHeight = block.height;

    if (block.rotation === 90 || block.rotation === 270) {
      rotatedWidth = block.height;
      rotatedHeight = block.width;
    }

    if (
      currentX + rotatedWidth <= containerWidth &&
      currentY - rotatedHeight >= 0
    ) {
      const placedBlock = {
        ...block,
        left: currentX,
        top: containerHeight - currentY,
        right: currentX + rotatedWidth,
        bottom: containerHeight - currentY + rotatedHeight,
      };
      placedBlocks.push(placedBlock);

      currentX += rotatedWidth;
    } else {
      currentX = 0;
      currentY -= rotatedHeight;

      if (currentY < 0) {
        throw new Error("Unable to place all blocks within the container.");
      }

      const placedBlock = {
        ...block,
        left: currentX,
        top: containerHeight - currentY,
        right: currentX + rotatedWidth,
        bottom: containerHeight - currentY + rotatedHeight,
      };
      placedBlocks.push(placedBlock);

      currentX += rotatedWidth;
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
      }px; left:${block.left}px;"><div style="transform: rotate(${
        block.rotation
      }deg);">${index}</div></div>`;
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
