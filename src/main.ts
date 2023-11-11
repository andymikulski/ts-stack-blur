import { stackBlurInPlace } from "./stackBlur";

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);
const cellSize = 10;


const width = 50;
const height = 50;
const maxVal = 255;

canvas.width = width * cellSize;
canvas.height = height * cellSize;

function generateHeightmap(width: number, height: number, maxValue: number) {
  let heightmap: number[] = [];
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      heightmap.push(Math.floor(Math.random() * maxValue + 1)); // Random number between 0 and 100
    }
  }
  return heightmap;
}



function renderHeightmap(map: number[], height: number, width: number) {
  for (let i = 0; i < map.length; i++) {
    let value = map[i];

    let y = (i / width) | 0;
    let x = i - (y * width);

    let grayScale = Math.floor(value * 255 / maxVal); // Convert height value to grayscale
    ctx.fillStyle = 'rgb(' + grayScale + ',' + grayScale + ',' + grayScale + ')';
    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
  }
}


const heightmap = generateHeightmap(width, height, maxVal);
let renderedMap = ([] as number[]).concat(heightmap);
renderHeightmap(heightmap, height, width);

let i = 0;
setInterval(() => {
  i++;
  // if (i > 25){
  //   i = 0;
  //   renderedMap = generateHeightmap(width,height, maxVal);
  // }
  stackBlurInPlace(renderedMap, width, height, 1);
  // renderHeightmap(renderedMap, height, width);
  triggerUpdate();
}, 1000 / 60);


let flagged = false;
const triggerUpdate = () => {
  if (!flagged) {
    flagged = true;
    requestAnimationFrame(() => {
      renderHeightmap(renderedMap, height, width);
      flagged = false;
    });
  }
}
window.addEventListener('mousemove', (e: MouseEvent) => {
  for (let yOffset = -2; yOffset <= 2; yOffset++) {
    for (let xOffset = -2; xOffset <= 2; xOffset++) {
      const x = ((e.offsetX / cellSize) | 0) + xOffset;
      const y = ((e.offsetY / cellSize) | 0) + yOffset;
      renderedMap[(y * width) + x] += (Math.random()*maxVal)|0;
    }
  }
  // triggerUpdate();
});



