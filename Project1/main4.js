function buildMap(n) {


let
canv = document.getElementById('canvas'),
ctx = canv.getContext('2d');
canv.width = 800;//window.innerWidth;//400;
canv.height = 800;//window.innerHeight;//400;
map = new Array();
map.lenght = n;
XBegin= -1;
YBegin= -1;
XEnd= -1;
YEnd= -1;
X=1;
Y=1;
Xe=1;
Ye=1;
size = canv.width/n;
isMouseDown = false;
isDelDown = false;
isBeginDown = false;
isEndDown = false;
isEnterDown = false;
pointRoute=0;
A = new Array();

function grid(){
  grid1("#FFFFFF");
  grid1("#A9A9A9");
}

function grid1(a){ // Рисование сетки
  ctx.beginPath();
  ctx.strokeStyle = a;
  ctx.lineWidth = 1;
  
  // Draw vertical lines
  for (let x = 0; x <= canvas.width; x += size) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
  }
  
  // Draw horizontal lines
  for (let y = 0; y <= canvas.height; y += size) {
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
  }
  
  ctx.stroke();}


// ---------------------------- Рисование карты ------------------

grid();
map.length = n;
for(let i=0; i<n; i++){
    map[i] = new Array();
    map[i].length = n;
}
for (let i=0; i<map.length; i++){
  for (let j=0; j<map[i].length; j++)
    map[i][j] = 0;}


canv.addEventListener('mousedown',function() {
    isMouseDown = true;
});

canv.addEventListener('mouseup',function() {
    isMouseDown = false;
});

document.addEventListener('keydown',function(e){
    if(e.keyCode == 46)isDelDown = true;
    if(e.keyCode == 66)isBeginDown = true;
    if(e.keyCode == 69)isEndDown = true;
    if (e.keyCode == 13) isEnterDown = true;
   // console.log(isEnterDown);
    //console.log(e.keyCode);
    
})

document.addEventListener('keyup',function(e){
    if(e.keyCode == 46)isDelDown = false;
    if(e.keyCode == 66)isBeginDown = false;
    if(e.keyCode == 69)isEndDown = false;
    if (e.keyCode == 13) isEnterDown = false;
})

canv.addEventListener('mousemove',function(e) {//Если мышка двигается
    x = Math.floor(e.offsetX/size);
    y = Math.floor(e.offsetY/size);

    if((isMouseDown)&&(isDelDown)){ //Очистк клетки
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.fillRect(x*size,y*size, size, size);
        ctx.fill();
       map[x][y]=0;
       grid();
    }
    if((isMouseDown)&&(isDelDown==false)){ // Закрашивание клетки
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.fillRect(x*size,y*size, size, size);
        ctx.fill();
        map[x][y]=1;
        grid(); 
    }
    if((isMouseDown)&&(isBeginDown)){ // Закрашивание клетки входа
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.fillRect(x*size,y*size, size, size);
        ctx.fill();
        X1=x;
        Y1=y;
        if((X!=X1)||(Y!=Y1)){
            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.fillRect(X*size,Y*size, size, size);
            ctx.fill();
           map[X][Y]=0; 
        }
        XBegin=x;X=x;
        YBegin=y;Y=y;
        map[x][y]=0;
        grid();
    }
    if((isMouseDown)&&(isEndDown)){ // Закрашивание клетки выхода
        ctx.beginPath();
        ctx.fillStyle = "blue";
        ctx.fillRect(x*size,y*size, size, size);
        ctx.fill();
        Xe1=x;
        Ye1=y;
        if((Xe!=Xe1)||(Ye!=Ye1)){
            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.fillRect(Xe*size,Ye*size, size, size);
            ctx.fill();
           map[Xe][Ye]=0; 
        }

        XEnd=x;Xe=x;
        YEnd=y;Ye=y;
        map[x][y]=0;
        grid();
    }
    if((isMouseDown)&&(pointRoute)){ // Закрашивание найденного маршрута
     // for(let i = 0; i < A.length - 1; i++){
     //   for(let j = 0; j <= 1; j++){
     //     console.log(A[i]);
     //   }
     // }
     // console.log(1)
      for (let i = 1; i < A.length+1; i++) {
            if (i!==A.length) {
                xi = A[i][0];
                yi = A[i][1];
            }
            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.fillRect(xi*size,yi*size, size, size);
            ctx.fill();
            map[xi][yi]=0;
    }
      pointRoute=0;
      grid();
  }

        
    
    //console.log(Math.floor(e.offsetX/n)*n);
});

canv.addEventListener('mousedown',function(e) {//Если мышка не двигается
    x = Math.floor(e.offsetX/size);
    y = Math.floor(e.offsetY/size);

    if((isMouseDown)&&(isDelDown)){
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.fillRect(x*size,y*size, size, size);
        ctx.fill();
       map[x][y]=0;
       grid();
    }
    if((isMouseDown)&&(isDelDown==false)){
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.fillRect(x*size,y*size, size, size);
        ctx.fill();
        map[x][y]=1; 
        grid();
    }
    if((isMouseDown)&&(isBeginDown)){
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.fillRect(x*size,y*size, size, size);
        ctx.fill();
        X1=x;
        Y1=y;
        if((X!=X1)||(Y!=Y1)){
            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.fillRect(X*size,Y*size, size, size);
            ctx.fill();
           map[X][Y]=0; 
        }
        XBegin=x;X=x;
        YBegin=y;Y=y;
        map[x][y]=0;
       grid();
    }
    if((isMouseDown)&&(isEndDown)){
        ctx.beginPath();
        ctx.fillStyle = "blue";
        ctx.fillRect(x*size,y*size, size, size);
        ctx.fill();
        Xe1=x;
        Ye1=y;
        if((Xe!=Xe1)||(Ye!=Ye1)){
            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.fillRect(Xe*size,Ye*size, size, size);
            ctx.fill();
           map[Xe][Ye]=0; 
        }

        XEnd=x;Xe=x;
        YEnd=y;Ye=y;
        map[x][y]=0;
        grid();
    }

    if((isMouseDown)&&(pointRoute)){
       for (let i = 1; i < A.length+1; i++) {
             if (i!==A.length) {
                 xi = A[i][0];
                 yi = A[i][1];
             }
             ctx.beginPath();
             ctx.fillStyle = "white";
             ctx.fillRect(xi*size,yi*size, size, size);
             ctx.fill();
             map[xi][yi]=0;
     }

/*function Point1(i,color){
  xi = A[i][0];
  yi = A[i][1];
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.fillRect(xi*size,yi*size, size, size);
  ctx.fill();
  map[xi][yi]=0;
}

Point1(0,"red");
Point1(A.length,"blue");*/

       pointRoute=0;
       grid();
   }
        
    
    //console.log(Math.floor(e.offsetX/n)*n);
});
// -------------------------------------------------------------------------------------


const bfs = function(map, fromRow, fromColumn, toRow, toColumn) {
    const pack = (row, column) => `${row}:${column}`;// преобразование координаты ячеек в строку и обратно
    const unpack = cell => cell.split(':').map(x => parseInt(x, 10));
  
    const visited = new Set();//содержит посещенные ячейки,
    const isValidNeighbour = function(row, column) {//проверяет является ли соседняя ячейка допустимой для посещения.
      if (row < 0 || row >= map.length) {//находится ли ячейка в пределах сетки map
        return false;
      }
  
      if (column < 0 || column >= map[row].length) {//является ли она уже посещенной
        return false;
      }
  
      const cell = pack(row, column);//имеет ли значение 0.
      if (visited.has(cell)) {
        return false;
      }
  
      return map[row][column] === 0;
    };
  
    let step = new Map();//содержит все достигнутые ячейки на каждом шаге
    const initialCell = pack(fromRow, fromColumn);// исходная точка
    step.set(initialCell, [initialCell]);
    while (step.size > 0) {
      const nextStep = new Map();//одержит ячейки, достижимые на следующем шаге
      const tryAddCell = function(row, column, path) {//проверяет, является ли соседняя ячейка с координатами row и column допустимой для посещения
        if (isValidNeighbour(row, column)) {//Если ячейка свободна, то
          const cell = pack(row, column);// объединяет координаты ячейки в строку вида "row:column"
          const newPath = [...path];//копирует в newPath все элементы из массива path. path содержит все предыдущие ячейки, которые уже были пройдены + новая
          newPath.push(cell);
          nextStep.set(cell, newPath);//добавляет новую ячейку и новый путь до нее. 
          visited.add(cell);//Добавляем ей в посещённые
        }
      };
  // -------- Функция вывода ----
      for (const [cell, path] of step) {
        const [row, column] = unpack(cell);
        if (row === toRow && column === toColumn) {
/*            let arr = new Array();;
            for (i=0;i<path.length-1; i++){
                if(i!=path.length){
                    arr[i] = path[i].split(':', 2);
                    arr[i+1] = path[i+1].split(':', 2);
                    xi=arr[i][0];
                    yi=arr[i][1];
                    xj=arr[i+1][0];
                    yj=arr[i+1][1];
                }
                ctx.moveTo(xi*size+size/2,yi*size+size/2);
                ctx.lineTo(xj*size+size/2,yj*size+size/2);
                ctx.strokeStyle = "yellow"; //цвет линии
                ctx.lineWidth = size/5; //толщина линии
                ctx.stroke();
            }
            return path;*/

            let arr = new Array();
            for (let i = 1; i < path.length-1; i++) {
                setTimeout(function() {
                    if (i!==path.length) {
                        arr[i] = path[i].split(':', 2);
                        if(i+1!=path.length)
                        arr[i + 1] = path[i + 1].split(':', 2);
                        xi = arr[i][0];
                        yi = arr[i][1];
                        if(i+1!=path.length){
                        xj = arr[i + 1][0];
                        yj = arr[i + 1][1];}

                        A[i] = new Array();
                        A[i].length = 2;

                        for(let j = 0; j < 2; j++){
                          A[i][j]=arr[i][j];
                          //console.log(A[i]);
                        
                        }
                    }
                    if(i!=path.length-2){
                    ctx.beginPath();
                    ctx.moveTo(xi * size + size / 2, yi * size + size / 2); // ctx.moveTo(xi * size + size / 2, yi * size + size / 2);
                    ctx.lineTo(xj * size + size / 2, yj * size + size / 2); // ctx.lineTo(xj * size + size / 2, yj * size + size / 2);
                    ctx.strokeStyle = "yellow"; //цвет линии
                    ctx.lineWidth = size / 5; //толщина линии
                    ctx.stroke();}
                }, i * 100);
            }
           /* for(let i = 0; i < arr.length - 1; i++){
              for(let j = 0; j <= 1; j++){
                A[i] = new Array();
                A[i][j]=arr[i][j];
                console.log(A[i][j]);
              }
            }*/
            pointRoute=1;
            return path;

        }
  
        tryAddCell(row - 1, column, path);
        tryAddCell(row + 1, column, path);
        tryAddCell(row, column - 1, path);
        tryAddCell(row, column + 1, path);
      }
  
      step = nextStep;
    }
    return null;
  };

//-------------Вывод пути при нажатии enter
  document.addEventListener('keydown',function(e){
if(isEnterDown){
    bfs(map, XBegin, YBegin, XEnd, YEnd);

if(bfs(map, XBegin, YBegin, XEnd, YEnd)==null){
  alert("Выхода нет")
}
}})
}