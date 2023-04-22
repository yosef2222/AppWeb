const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let pixels = new Array(25).fill(0); // initialize all pixels to 0

canvas.addEventListener("mousedown", function (event) {
  let x = event.pageX - canvas.offsetLeft;
  let y = event.pageY - canvas.offsetTop;
  drawPixel(x, y);
});

function drawPixel(x, y) {
  let i = Math.floor(x / 30) + Math.floor(y / 30) * 5;
  pixels[i] = 1 - pixels[i]; // переключение значения пикселя между 0 и 1
  ctx.fillStyle = pixels[i] ? "black" : "white";
  ctx.fillRect(Math.floor(x / 30) * 30, Math.floor(y / 30) * 30, 30, 30);
}

function recognizeDigit() {
  //преобразуйте значения пикселей во входной массив для нейронной сети
  let input = pixels.map(function (pixel) {
    return pixel ? 1 : 0;
  });
  //document.getElementById("digit").textContent = makeGuess(pixels);

  //const recognizer = new ShapeRecognizer();
  // const shape = pixels;
  //const recognizedShape = recognizer.predict(shape);
  //console.log(recognizedShape); // выводит "треугольник"


  const recognizer = new DigitRecognizer();
  const digit = pixels;
  const recognizedDigit = recognizer.predict(digit);
  //console.log(recognizedDigit); // выводит "1"
  document.getElementById("digit").textContent = recognizedDigit;

}
  /*
// простая нейронная сеть с одним скрытым слоем из 16 нейронов и выходным слоем из 10 нейронов
let hidden = input.map(function(x, i) {
  return x * (i % 2 ? -1 : 1); // чередуйте знаки для создания разнообразных элементов
}).reduce(function(sum, x) {
  return sum + x;
}, 0);
let output = new Array(10).fill(0);
output[Math.floor(Math.random() * 10)] = 1; // заполнитель для фактического кода распознавания
 
document.getElementById("digit").textContent = output.indexOf(1);
}*/
/*
function stopDrawing() {
  CANVAS.removeEventListener('mousemove', handler);
  if((isMouseDown)&&(activeMode!==VIEW_MODE)) {
      ANSWER_TEXT.value = 'Ответ: ' + makeGuess(inputMatrix);
      isMouseDown = false;
  }
}*/
