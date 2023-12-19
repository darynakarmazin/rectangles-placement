// Зчитати JSON файл
const blocksData = require("./blocks.json");
const containerSize = { width: 350, height: 300 };

// Функція для обчислення площі прямокутника
function calculateArea(rectangle) {
  return rectangle.width * rectangle.height;
}

// Сортування блоків за площею
blocksData.sort((a, b) => calculateArea(b) - calculateArea(a));

// Створення матриці
const containerMatrix = Array.from({ length: containerSize.height }, () =>
  Array(containerSize.width).fill(0)
);

const blockCoordinates = [];

for (const block of blocksData) {
  // Логіка розміщення блоків
  // ...
}

// Оновлення контейнеру та розрахунок fullness
const fullness = calculateFullness(containerMatrix);

function calculateFullness(matrix) {
  const emptySpace = matrix.reduce(
    (acc, row) => acc + row.filter((cell) => cell === 0).length,
    0
  );

  const totalSpace = containerSize.width * containerSize.height;
  const usedSpace = totalSpace - emptySpace;

  return 1 - emptySpace / (usedSpace + emptySpace);
}

const result = {
  fullness,
  blockCoordinates,
};
