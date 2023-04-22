

// Пример данных
// let data = [
//   { age: "young", income: "low", student: "no", credit_rating: "fair", cls: "no" },
//   { age: "young", income: "low", student: "no", credit_rating: "excellent", cls: "no" },
//   { age: "middle_aged", income: "low", student: "no", credit_rating: "fair", cls: "yes" },
//   { age: "middle_aged", income: "medium", student: "no", credit_rating: "fair", cls: "yes" },
//   { age: "middle_aged", income: "medium", student: "no", credit_rating: "excellent", cls: "no" },
//   { age: "middle_aged", income: "medium", student: "yes", credit_rating: "excellent", cls: "yes" },
//   { age: "old", income: "medium", student: "yes", credit_rating: "excellent", cls: "yes" },
//   { age: "old", income: "high", student: "no", credit_rating: "fair", cls: "yes" },
//   { age: "young", income: "medium", student: "yes", credit_rating: "fair", cls: "yes" },
//   { age: "young", income: "high", student: "yes", credit_rating: "excellent", cls: "yes" },
//   { age: "middle_aged", income: "medium", student: "no", credit_rating: "excellent", cls: "yes" },
//   { age: "young", income: "medium", student: "no", credit_rating: "fair", cls: "yes" },
//   { age: "middle_aged", income: "high", student: "yes", credit_rating: "fair", cls: "yes" },
//   { age: "old", income: "medium", student: "no", credit_rating: "excellent", cls: "no" }
// ];

// // Список функций
// let features = ["age", "income", "student", "credit_rating"];

const myForm = document.getElementById("myForm");
const csvFile = document.getElementById("csvFile");

let data1;
let features1;
//let tree;

function csvToArray(str, delimiter = ",") {
  // split the text into an array of lines
  const lines = str.trim().split("\n");
  // get the headers from the first line
  const headers = lines.shift().split(delimiter);
  // create an array of objects, one for each line
  const arr = lines.map(function (line) {
    // remove any trailing whitespace, including \r
    line = line.trim();
    const values = line.split(delimiter);
    // create an object with the headers as keys and the values as values
    const obj = {};
    headers.forEach(function (header, i) {
      const value = i < values.length ? values[i] : "";
      obj[header.trim().replace(/\"/g, "")] = value.trim().replace(/\"/g, "");
    });
    return obj;
  });
  return arr;
}

myForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const input = csvFile.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    try {
      const text = e.target.result;
      data1 = csvToArray(text); // присваиваем значение переменной data
      //console.log(data1);
      features1 = Object.keys(data1[0]);
      features1.pop();
      //console.log(features1);
      //console.log(features1.length);
      // Alternatively, you can append the data to an HTML element:
      // const resultDiv = document.getElementById("result");
      // resultDiv.innerHTML = JSON.stringify(data);
    } catch (error) {
      console.error(error);
    }
  };

  reader.readAsText(input);
});

document.querySelector("#submit").onclick = function () {
  // Построить дерево
  tree = buildTree(data1, features1);
  console.log(tree);
}

document.forms.publish.onsubmit = function () {
  let inputValues = this.message.value.split(",");
  let example = {};
  for (let i = 0; i < features.length; i++) {
    example[features[i]] = inputValues[i];
  }
  console.log(example);
  //let tree = buildTree(data1, features1);
  let result = predict(tree, example);
  console.log(tree);
  console.log(result);

  return false;
};


// document.querySelector("#submit2").onclick = function(){

//     // Пример использования дерева
//     let example = { age: "young", income: "high", student: "no", credit_rating: "fair" };
//     let result = predict(tree, example);
//     console.log(tree);
//     console.log(result);
// }


// // Построить дерево
// let tree = buildTree(data, features);

// // Пример использования дерева
// let example = { age: "young", income: "high", student: "no", credit_rating: "fair" };
// let result = predict(tree, example);
// console.log(tree);
// console.log(result);



function getAccuracy(data) { //Функция getAccuracy вычисляет точность прогнозирования для данного узла дерева, путем подсчета количества правильно угаданных значений label в выборке, деленной на общее количество элементов выборки. 
  if (data.length === 0) {
    return 0;
  }

  const correct = data.filter((x) => x.label === modeFunction(data)).length;
  const accuracy = correct / data.length;
  return accuracy;
}


function modeFunction(data, prop = "label") {//Возвращает наиболее распространенное значение данного свойства в предоставленных данных.
  const values = data.map((x) => x[prop]);
  //console.log(values);
  const valueCounts = {};

  for (let i = 0; i < values.length; i++) {
    if (valueCounts[values[i]] === undefined) {
      valueCounts[values[i]] = 0;
    }
    valueCounts[values[i]]++;
  }
  //console.log(valueCounts);

  let modeValue = null;
  let modeCount = -1;
  for (const value in valueCounts) {
    if (valueCounts[value] > modeCount) {
      modeValue = value;
      modeCount = valueCounts[value];
      // console.log(modeValue);
      // console.log(modeCount);

    }
  }

  return modeValue;
}

//

function chooseSplit(data, features) {//Выбирает наилучший признак для разделения данных и наилучшее значение для разделения на основе получения информации (информационная выгода)
  let bestFeature;
  let bestValue;
  let bestGain = -Infinity;

  for (let i = 0; i < features.length; i++) {
    let featureValues = new Set(data.map(function (x) { return x[features[i]]; }));//Переменная со всеми вариантами выбранной характеристики(Характеристика: outlook, варианты: sunny,overcast,rain)
    //console.log(features.length); 4
    //console.log(features[i]); outlook
    //console.log(featureValues); sunny,overcast,rain
    featureValues.forEach(function (value) {
      let gain = informationGain(data, features[i], value);
      if (gain > bestGain) {
        bestGain = gain;
        bestFeature = features[i];
        bestValue = value;
      }
    });
  }
  //console.log({ feature: bestFeature, value: bestValue });
  return { feature: bestFeature, value: bestValue };
}

function informationGain(data, feature, value) {//Вычисляет информационный выигрыш
  let totalEntropy = entropy(data);
  let leftData = data.filter(function (x) { return x[feature] === value; });  //Массив только с                sunny          //overcast   //rain
  let rightData = data.filter(function (x) { return x[feature] !== value; }); //Массив с остальными значениями overcast,rain  //sunny,rain //sunny,overcast
  //console.log(leftData);
  //console.log(rightData);
  let leftEntropy = entropy(leftData);
  let rightEntropy = entropy(rightData);
  let leftWeight = leftData.length / data.length;  //доля левой ветки от всех
  let rightWeight = rightData.length / data.length;//доля правой ветки от всех
  let gain = totalEntropy - (leftWeight * leftEntropy) - (rightWeight * rightEntropy);//Выйгранная информация
  return gain;
}

//

function entropy(data) {//вычисляет энтропию данных в заданном массиве data.
  let classes = new Set(data.map(function (x) { return x.cls; }));
  //console.log(classes);//no,yes
  let entropy = 0;
  classes.forEach(function (cls) {
    let p = data.filter(function (x) { return x.cls === cls; }).length / data.length;// количесвто no(yes)/общее количесвто
    entropy -= p * Math.log2(p);
    //console.log(entropy);
  });
  return entropy; //чем менее упорядочена система, тем энтропия больше
}

//

function buildTree(data, features) {
  // Если все элементы данных имеют одинаковый класс, вернуть лист с этим классом
  let classes = new Set(data.map(function (x) { return x.cls; }));
  if (classes.size === 1) {
    return { type: "leaf", value: classes.values().next().value, accuracy: 1 };
  }
  // Если нет больше признаков для разбиения, вернуть лист с наиболее частым классом (no,yes)
  if (features.length === 0) {
    let mode = modeFunction(data.map(function (x) { return x.cls; }));
    //console.log(data);
    let accuracy = getAccuracy(data, mode);
    //console.log(accuracy);
    return { type: "leaf", value: mode, accuracy: accuracy };
  }

  // Выбор признака для разбиения
  let split = chooseSplit(data, features); //feature: bestFeature, value: bestValue

  // Разбиение данных по выбранному признаку
  let leftData = [];
  let rightData = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i][split.feature] === split.value) {
      leftData.push(data[i]);
    } else {
      rightData.push(data[i]);
    }
  }

  // Рекурсивное построение дерева для левой и правой ветвей
  let leftTree = buildTree(leftData, features.filter(function (x) { return x !== split.feature; }));
  let rightTree = buildTree(rightData, features.filter(function (x) { return x !== split.feature; }));

  // Возврат узла дерева с информацией о разбиении и дочерних узлах
  return { type: "node", feature: split.feature, value: split.value, left: leftTree, right: rightTree };
}

function predict(tree, example) {
  if (tree.type === "leaf") {
    return tree.value;
  }
  let value = example[tree.feature];
  if (value === tree.value) {
    return predict(tree.left, example);
  } else {
    return predict(tree.right, example);
  }
}

// Тестовые данные
let data = [
  { outlook: "sunny", temp: "hot", humidity: "high", wind: "weak", cls: "no" },
  { outlook: "sunny", temp: "hot", humidity: "high", wind: "strong", cls: "no" },
  { outlook: "overcast", temp: "hot", humidity: "high", wind: "weak", cls: "yes" },
  { outlook: "rain", temp: "mild", humidity: "high", wind: "weak", cls: "yes" },
  { outlook: "rain", temp: "cool", humidity: "normal", wind: "weak", cls: "yes" },
  { outlook: "rain", temp: "cool", humidity: "normal", wind: "strong", cls: "no" },
  { outlook: "overcast", temp: "cool", humidity: "normal", wind: "strong", cls: "yes" },
  { outlook: "sunny", temp: "mild", humidity: "high", wind: "weak", cls: "no" },
  { outlook: "sunny", temp: "cool", humidity: "normal", wind: "weak", cls: "yes" },
  { outlook: "rain", temp: "mild", humidity: "normal", wind: "weak", cls: "yes" },
  { outlook: "sunny", temp: "mild", humidity: "normal", wind: "strong", cls: "yes" },
  { outlook: "overcast", temp: "mild", humidity: "high", wind: "strong", cls: "yes" },
  { outlook: "overcast", temp: "hot", humidity: "normal", wind: "weak", cls: "yes" },
  { outlook: "rain", temp: "mild", humidity: "high", wind: "strong", cls: "no" }
];
// Признаки для использования в дереве решений
let features = ["outlook", "temp", "humidity", "wind"];
//console.log(data);
//console.log(features);

// Построение дерева решений
let tree = buildTree(data, features);

  // Тестирование дерева на новых данных
  //let newExample = { outlook: "sunny", temp: "cool", humidity: "normal", wind: "strong" };
  //console.log(tree);
  //let prediction = predict(tree, newExample);
  //console.log("Prediction: " + prediction); // Ожидаемый результат: "no"

//   function draw(){
//     let canvas = document.getElementById('tutorial');
//     if (canvas.getContext){
//       let ctx = canvas.getContext('2d');


//       function(this){
//       if(this.feature!==0){
//       ctx.fillStyle = "rgb(200,0,0)";
//       ctx.fillRect (10, 10, 55, 50);
//       console.log(tree.feature);
//       console.log(tree.length);
//     }
//       }
//       ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
//       ctx.fillRect (30, 30, 55, 50);


//     }
//   }
