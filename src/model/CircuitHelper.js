function deepcopy(obj) {
  var out = [],
    i = 0,
    len = obj.length;
  for (; i < len; i++) {
    if (obj[i] instanceof Array) {
      out[i] = deepcopy(obj[i]);
    } else out[i] = obj[i];
  }
  return out;
}

// var firstRel = deepcopy(rel)

// az之间的电压
var V1 = 10;

var arr, rel, V, firstRel;

var map = {};
var charArr, newArr;

function replaceRel(charA, charB) {
  for (var i = 0; i < rel.length; i++) {
    for (var j = 0; j < rel[i].length; j++) {
      if (rel[i][j] == charA) {
        rel[i][j] = charB;
        map[charA] = charB;
      }
    }
  }
}

function rowIndex(char) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i][0] == char) {
      return i;
    }
  }
  return -1;
}

function getAZindex(char, arr) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[0][i] == char) return i;
  }
  return -1;
}

function equalPoint() {
  var isVisit = new Int8Array(arr[0].length);
  var ai = getAZindex("a", arr);
  var zi = getAZindex("z", arr);
  for (var i = 0; i < arr[ai].length; i++) {
    if (arr[ai][i] == 1) {
      replaceRel(arr[0][i], "a");
      isVisit[arr[0].indexOf("a")] = 1;
    }
  }

  for (var i = 0; i < arr[zi].length; i++) {
    if (arr[zi][i] == 1) {
      replaceRel(arr[0][i], "z");
      isVisit[arr[0].indexOf("z")] = 1;
    }
  }

  for (var i = 0; i < rel.length; i++) {
    for (var j = 0; j < rel[i].length - 2; j++) {
      if (isVisit[arr[0].indexOf(rel[i][j])] == 0) {
        var index = rowIndex(rel[i][j]);
        isVisit[arr[0].indexOf(rel[i][j])] = 1;

        for (var k = 0; k < arr[index].length; k++) {
          if (arr[index][k] == 1) {
            replaceRel(arr[0][k], rel[i][j]);
          }
        }
      }
    }
  }
}

// // 第一步等效点替换
// equalPoint()
// console.log(rel)
// console.log(map)

function isInArr(arr, char) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == char) {
      return 1;
    }
  }
  return 0;
}

function numInRelLink(charA, charB, rel) {
  var num = 0;
  for (var i = 0; i < rel.length; i++) {
    if (
      (charA == rel[i][0] && charB == rel[i][1]) ||
      (charB == rel[i][0] && charA == rel[i][1])
    ) {
      num = num + 1;
    }
  }
  return num;
}

function resistanceArr(charA, charB, rel) {
  var resistanceArr = [];
  var index = [];
  for (var i = 0; i < rel.length; i++) {
    if (
      (charA == rel[i][0] && charB == rel[i][1]) ||
      (charB == rel[i][0] && charA == rel[i][1])
    ) {
      index.push(i);
      resistanceArr.push(rel[i][3]);
    }
  }
  var bRes = bResistance(resistanceArr);
  var newRel = [];
  for (var i = 0; i < rel.length; i++) {
    if (isInArr(index, i) == 0) {
      newRel.push(rel[i]);
    }
  }
  newRel.push([charA, charB, "X", bRes]);
  return newRel;
}

function bResistance(resistanceArr) {
  var r = 0;
  for (var i = 0; i < resistanceArr.length; i++) {
    r = r + 1 / resistanceArr[i];
  }
  return 1 / r;
}

// console.log(arr)
function getNewArr(rel) {
  var charArr = [];
  for (var i = 0; i < rel.length; i++) {
    if (isInArr(charArr, rel[i][0]) == 0) {
      charArr.push(rel[i][0]);
    }

    if (isInArr(charArr, rel[i][1]) == 0) {
      charArr.push(rel[i][1]);
    }
  }

  var newArr = new Array(charArr.length); //表格有10行
  for (var i = 0; i < newArr.length; i++) {
    newArr[i] = new Array(charArr.length); //每行有10列
    for (var j = 0; j < newArr.length; j++) {
      newArr[i][j] = 0;
    }
  }
  for (var i = 0; i < charArr.length; i++) {
    for (var j = 0; j < charArr.length; j++) {
      newArr[i][j] = numInRelLink(charArr[i], charArr[j], rel);
    }
  }
  return newArr;
}

function getCharArr(rel) {
  var charArr = [];
  for (var i = 0; i < rel.length; i++) {
    if (isInArr(charArr, rel[i][0]) == 0) {
      charArr.push(rel[i][0]);
    }

    if (isInArr(charArr, rel[i][1]) == 0) {
      charArr.push(rel[i][1]);
    }
  }

  var newArr = new Array(charArr.length); //表格有10行
  for (var i = 0; i < newArr.length; i++) {
    newArr[i] = new Array(charArr.length); //每行有10列
    for (var j = 0; j < newArr.length; j++) {
      newArr[i][j] = 0;
    }
  }
  for (var i = 0; i < charArr.length; i++) {
    for (var j = 0; j < charArr.length; j++) {
      newArr[i][j] = numInRelLink(charArr[i], charArr[j], rel);
    }
  }
  return charArr;
}

console.log("-----");

function solveCharArrAndNewArr() {
  charArr = getCharArr(rel);
  newArr = getNewArr(rel);

  // 把矩阵中大于1的合并
  for (var i = 0; i < charArr.length; i++) {
    for (var j = 0; j < i; j++) {
      if (newArr[i][j] > 1) {
        rel = resistanceArr(charArr[i], charArr[j], rel);
      }
    }
  }
  charArr = getCharArr(rel);
  newArr = getNewArr(rel);
}

// // 第二步合并并联电路
// solveCharArrAndNewArr()

function getPNotAC(charArr) {
  a = [];
  for (var i = 0; i < charArr.length; i++) {
    if (charArr[i] != "a" && charArr[i] != "z") {
      a.push(charArr[i]);
    }
  }
  return a;
}

function findAllItemHasP(rel, p, isVisit) {
  a = [];
  for (var i = 0; i < rel.length; i++) {
    if ((rel[i][0] == p || rel[i][1] == p) && isVisit[i] == 0) {
      a.push(i);
      isVisit[i] = 1;
    }
  }
  return a;
}

function notAllVisit(isVisit) {
  for (var i = 0; i < isVisit.length; i++) {
    if (isVisit[i] == 0) {
      return 1;
    }
  }
  return 0;
}

var isVisit;

// console.log(isVisit)
var a;

// 储存a到z的所有路径
var paths = [];
var alist = [];

function pathsAndAList() {
  isVisit = new Int8Array(rel.length);
  a = getPNotAC(charArr);
  for (var i = 0; i < a.length; i++) {
    var f = findAllItemHasP(rel, a[i], isVisit);
    if (f.length > 0) {
      paths.push(f);
    }
  }
  if (isVisit.indexOf(0) > -1) {
    paths.push([isVisit.indexOf(0)]);
  }

  for (var i = 0; i < paths.length; i++) {
    var sumR = 0;
    for (var j = 0; j < paths[i].length; j++) {
      if (paths[i][j] != undefined) {
        sumR = sumR + rel[paths[i][j]][3];
      }
    }
    alist.push((V / sumR).toFixed(1));
  }
}

// //  第三步得到路径和对应的电流数组
// pathsAndAList()
// console.log(alist)

// 以下求电流和电压
export function AinTwoPoints(arr1, rel1, V1, p1, p2) {
  arr = deepcopy(arr1);
  rel = deepcopy(rel1);
  V = V1;
  firstRel = deepcopy(rel1);
  // console.log(arr)
  // console.log(rel)
  // console.log(V)
  // console.log(firstRel)
  init();
  var a = [];
  if (map[p1] != undefined) {
    a.push(map[p1]);
  } else {
    a.push(p1);
  }

  if (map[p2] != undefined) {
    a.push(map[p2]);
  } else {
    a.push(p2);
  }

  // 找在rel中的位置
  var indexInRel = -1;

  for (var i = 0; i < rel.length; i++) {
    if (rel[i].indexOf(a[0]) > -1 && rel[i].indexOf(a[1]) > -1) {
      indexInRel = i;
      break;
    }
  }

  var indexInPaths = -1;
  for (var i = 0; i < paths.length; i++) {
    if (paths[i].indexOf(indexInRel) > -1) {
      indexInPaths = i;
      break;
    }
  }

  return alist[indexInPaths];
}

export function VinTwoPoints(arr1, rel1, V1, p1, p2) {
  var A = AinTwoPoints(arr1, rel1, V1, p1, p2);
  // 求在最原始rel中的对应电阻
  var indexInFirstRel = -1;

  for (var i = 0; i < rel1.length; i++) {
    if (rel1[i].indexOf(p1) > -1 && rel1[i].indexOf(p2) > -1) {
      indexInFirstRel = i;
      break;
    }
  }

  var R = rel1[indexInFirstRel][3];
  return (A * R).toFixed(1);
}

function init() {
  // 第一步等效点替换
  equalPoint();
  // 第二步合并并联电路
  solveCharArrAndNewArr();
  //  第三步得到路径和对应的电流数组
  pathsAndAList();
}

// var arr1 = [
//   ["", "a", "b", "c", "d", "e", "f", "g", "z"],
//   ["a", 0, 1, 0, 0, 0, 1, 0, 0],
//   ["b", 1, 0, 0, 0, 0, 1, 0, 0],
//   ["c", 0, 0, 0, 1, 0, 0, 1, 0],
//   ["d", 0, 0, 1, 0, 0, 0, 1, 0],
//   ["e", 0, 0, 0, 0, 0, 0, 0, 1],
//   ["f", 1, 1, 0, 0, 0, 0, 0, 0],
//   ["g", 0, 0, 1, 1, 0, 0, 0, 0],
//   ["z", 0, 0, 0, 0, 1, 0, 0, 0]
// ];
// var rel1 = [["f", "g", "R", 4], ["d", "e", "R", 1], ["b", "c", "V", 10000000]];
// console.log("de电流" + AinTwoPoints(arr1, rel1, V1, "d", "e"));
// console.log("fg电流" + AinTwoPoints(arr1, rel1, V1, "f", "g"));
// console.log("de电压", VinTwoPoints(arr1, rel1, V1, "d", "e"));
// console.log("fg电压", VinTwoPoints(arr1, rel1, V1, "f", "g"));
