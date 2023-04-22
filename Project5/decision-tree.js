



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
    var bestFeature;
    var bestValue;
    var bestGain = -Infinity;
  
    for (var i = 0; i < features.length; i++) {
      var featureValues = new Set(data.map(function (x) { return x[features[i]]; }));//Переменная со всеми вариантами выбранной характеристики(Характеристика: outlook, варианты: sunny,overcast,rain)
      //console.log(features.length); 4
      //console.log(features[i]); outlook
      //console.log(featureValues); sunny,overcast,rain
      featureValues.forEach(function (value) {
        var gain = informationGain(data, features[i], value);
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
    var totalEntropy = entropy(data);
    var leftData = data.filter(function (x) { return x[feature] === value; });  //Массив только с                sunny          //overcast   //rain
    var rightData = data.filter(function (x) { return x[feature] !== value; }); //Массив с остальными значениями overcast,rain  //sunny,rain //sunny,overcast
    //console.log(leftData);
    //console.log(rightData);
    var leftEntropy = entropy(leftData);
    var rightEntropy = entropy(rightData);
    var leftWeight = leftData.length / data.length;  //доля левой ветки от всех
    var rightWeight = rightData.length / data.length;//доля правой ветки от всех
    var gain = totalEntropy - (leftWeight * leftEntropy) - (rightWeight * rightEntropy);//Выйгранная информация
    return gain;
  }
  
//

  function entropy(data) {//вычисляет энтропию данных в заданном массиве data.
    var classes = new Set(data.map(function (x) { return x.cls; }));
    //console.log(classes);//no,yes
    var entropy = 0;
    classes.forEach(function (cls) {
      var p = data.filter(function (x) { return x.cls === cls; }).length / data.length;// количесвто no(yes)/общее количесвто
      entropy -= p * Math.log2(p);
      //console.log(entropy);
    });
    return entropy; //чем менее упорядочена система, тем энтропия больше
  }

//

function buildTree(data, features) {
    // Если все элементы данных имеют одинаковый класс, вернуть лист с этим классом
    var classes = new Set(data.map(function (x) { return x.cls; }));
    if (classes.size === 1) {
        return { type: "leaf", value: classes.values().next().value, accuracy: 1 };
  }
  // Если нет больше признаков для разбиения, вернуть лист с наиболее частым классом (no,yes)
  if (features.length === 0) {
  var mode = modeFunction(data.map(function (x) { return x.cls; }));
  //console.log(data);
  var accuracy = getAccuracy(data, mode);
  //console.log(accuracy);
  return { type: "leaf", value: mode, accuracy: accuracy };
  }
  
  // Выбор признака для разбиения
  var split = chooseSplit(data, features); //feature: bestFeature, value: bestValue
  
  // Разбиение данных по выбранному признаку
  var leftData = [];
  var rightData = [];
  for (var i = 0; i < data.length; i++) {
  if (data[i][split.feature] === split.value) {
  leftData.push(data[i]);
  } else {
  rightData.push(data[i]);
  }
  }
  
  // Рекурсивное построение дерева для левой и правой ветвей
  var leftTree = buildTree(leftData, features.filter(function (x) { return x !== split.feature; }));
  var rightTree = buildTree(rightData, features.filter(function (x) { return x !== split.feature; }));
  
  // Возврат узла дерева с информацией о разбиении и дочерних узлах
  return { type: "node", feature: split.feature, value: split.value, left: leftTree, right: rightTree };
  }
  
  function predict(tree, example) {
    if (tree.type === "leaf") {
      return tree.value;
    }
    var value = example[tree.feature];
    if (value === tree.value) {
      return predict(tree.left, example);
    } else {
      return predict(tree.right, example);
    }
  }
  
  // Тестовые данные
  var data = [
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
  var features = ["outlook", "temp", "humidity", "wind"];
  //console.log(data);
  //console.log(features);
  
  // Построение дерева решений
  var tree = buildTree(data, features);
  
  // Тестирование дерева на новых данных
  //var newExample = { outlook: "sunny", temp: "cool", humidity: "normal", wind: "strong" };
  //console.log(tree);
  //var prediction = predict(tree, newExample);
  //console.log("Prediction: " + prediction); // Ожидаемый результат: "no"

//   function draw(){
//     var canvas = document.getElementById('tutorial');
//     if (canvas.getContext){
//       var ctx = canvas.getContext('2d');


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
