const list = document.querySelector(".container");
console.log(list);

// fetch("./data/block.json")
//   .then((response) => response.json())
//   .then((data) => {
//     const result = data
//       .map((block, index) => {
//         return `<div class="block" style="height:${block.height}px; width:${block.width}px;">${index}</div>`;
//       })
//       .join(" ");
//     console.log(typeof result);
//     console.log(result);
//     list.innerHTML = result;
//   });

async function fetchBlocksJSON() {
  const response = await fetch("./data/block.json");
  const blocks = await response.json();
  return blocks;
}

const blocks = await fetchBlocksJSON();
// console.log(blocks);

const colors = {}; // Об'єкт для зберігання кольорів

const result = blocks
  .map((block, index) => {
    const sizeKey = `${block.width}-${block.height}`;

    // Генерація унікального кольору для блока
    const color = colors[sizeKey] || getRandomColor();
    colors[sizeKey] = color;

    return `<div class="block" style="height:${block.height}px; width:${block.width}px; background-color:${color};">${index}</div>`;
  })
  .join(" ");

// console.log(typeof result);
// console.log(result);

function getRandomColor() {
  // Генерація випадкового кольору
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

list.innerHTML = result;
