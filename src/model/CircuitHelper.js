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
var charArr, newArr, newPath;

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
}

function findIsVisitIndex(char, isVisited) {
  for (var i = 0; i < rel.length; i++) {
    if (rel[i].indexOf(char) > -1 && isVisited[i] == 0) {
      return i;
    }
  }
  return -1;
}

function findAZIndexInRel() {
  for (var i = 0; i < rel.length; i++) {
    if (rel[i].indexOf("a") > -1 && rel[i].indexOf("z") > -1) {
      return i;
    }
  }
  return -1;
}

function charAppearTimesInPath(path) {
  var s = new Set();
  for (var i = 0; i < path.length; i++) {
    s.add(rel[path[i]][0]);
    s.add(rel[path[i]][1]);
  }
  return s.size;
}
function getNewPath() {
  var isVisited = new Int8Array(charArr.length);
  var aIndex = charArr.indexOf("a");
  var zIndex = charArr.indexOf("z");
  newPath = [];
  var ma = [];
  var mz = [];
  for (var i = 0; i < newArr[aIndex].length; i++) {
    var num = newArr[aIndex][i];
    if (num != 0) {
      for (var j = 0; j < num; j++) {
        var isIndex = findIsVisitIndex("a", isVisited);
        if (isIndex != -1) {
          ma.push(isIndex);
          isVisited[isIndex] = 1;
        }
      }
    }
  }
  for (var i = 0; i < newArr[zIndex].length; i++) {
    var num = newArr[zIndex][i];
    if (num != 0) {
      for (var j = 0; j < num; j++) {
        var isIndex = findIsVisitIndex("z", isVisited);
        if (isIndex != -1) {
          mz.push(isIndex);
          isVisited[isIndex] = 1;
        }
      }
    }
  }

  for (var i = 0; i < ma.length; i++) {
    for (var j = 0; j < mz.length; j++) {
      if (ma[i] != undefined && mz[j] != undefined) {
        newPath.push([ma[i], mz[j]]);
      } else if (ma[i] != undefined && mz[j] == undefined) {
        newPath.push([ma[i]]);
      } else if (ma[i] == undefined && mz[j] != undefined) {
        newPath.push([mz[j]]);
      }
    }
  }

  //进行newPath正确性判断
  //首先(az自成一格)
  var path = [];
  var azIndex = findAZIndexInRel();
  for (var i = 0; i < newPath.length; i++) {
    var a = [];
    for (var j = 0; j < newPath[i].length; j++) {
      if (newPath[i][j] != azIndex) {
        a.push(newPath[i][j]);
      } else {
        a = [];
        a.push(azIndex);
        break;
      }
    }
    path.push(a);
  }
  newPath = path;

  //其次除az外最多出现一格字母
  //[['a', 'g', 'R', 4], ['d', 'z', 'R', 1], ['a', 'd', 'R', 2], ['g', 'z', 'R', 2]]
  //[[0, 1], [0, 3], [2, 1], [2, 3]]-----这里的【0，1】和【2,3】明显需要移除
  path = [];
  for (var i = 0; i < newPath.length; i++) {
    if (charAppearTimesInPath(newPath[i]) == 3) {
      path.push(newPath[i]);
    }
  }
  newPath = path;
}

function indexAppearTimes(index) {
  var times = 0;
  for (var i = 0; i < newPath.length; i++) {
    if (newPath[i].indexOf(index) > -1) {
      times = times + 1;
    }
  }
  return times;
}

function getFirstRel(p1, p2) {
  for (var i = 0; i < firstRel.length; i++) {
    if (firstRel[i].indexOf(p1) > -1 && firstRel[i].indexOf(p2) > -1) {
      return i;
    }
  }
  return -1;
}

function getNewPathIndex(newPath, ind) {
  for (var i = 0; i < newPath.length; i++) {
    if (newPath[i].indexOf(ind) > -1) {
      return i;
    }
  }
  return -1;
}

// 求电流
export function AinTwoPoints(arr1, rel1, V1, p1, p2) {
  arr = deepcopy(arr1);
  rel = deepcopy(rel1);
  V = V1;
  firstRel = deepcopy(rel1);
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

  if ((a[0] == "a" && a[1] == "z") || (a[1] == "a" && a[0] == "z")) {
    return (V / firstRel[getFirstRel(p1, p2)][3]).toFixed(1);
  }

  // 找在rel中的位置
  var indexInRel = -1;

  for (var i = 0; i < rel.length; i++) {
    if (rel[i].indexOf(a[0]) > -1 && rel[i].indexOf(a[1]) > -1) {
      indexInRel = i;
      break;
    }
  }

  var resistanceArr = [];
  if (indexAppearTimes(indexInRel) > 1) {
    for (var k = 0; k < newPath.length; k++) {
      for (var p = 0; p < newPath[k].length; p++) {
        if (newPath[k][p] != indexInRel) {
          resistanceArr.push(rel[newPath[k][p]][3]);
        }
      }
    }
    resisR = bResistance(resistanceArr);
    return (V / (resisR + rel[indexInRel][3])).toFixed(1);
  } else {
    var tempV = 0;
    var newPathIndex = getNewPathIndex(newPath, indexInRel);
    for (var l = 0; l < newPath[newPathIndex].length; l++) {
      if (newPath[newPathIndex][l] != indexInRel) {
        if (indexAppearTimes(newPath[newPathIndex][l]) > 1) {
          for (var k = 0; k < newPath.length; k++) {
            for (var p = 0; p < newPath[k].length; p++) {
              if (newPath[k][p] != newPath[indexInRel][l]) {
                resistanceArr.push(rel[newPath[k][p]][3]);
              }
            }
          }
          var resisR = bResistance(resistanceArr);
          tempV =
            V -
            (
              (V / (resisR + rel[newPath[newPathIndex][l]][3])) *
              rel[newPath[newPathIndex][l]][3]
            ).toFixed(1);
        } else {
          return (
            V /
            (rel[newPath[newPathIndex][l]][3] + rel[indexInRel][3])
          ).toFixed(1);
        }
      }
    }
    return (tempV / rel[indexInRel][3]).toFixed(1);
  }
}
// 求电压
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
  // 第二步生成关键点和邻接矩阵
  solveCharArrAndNewArr();
  // 第三步得到电源各路径
  getNewPath();
}

// var arr1 = [["","a","anchor_8","anchor_14","anchor_20","z","anchor_11","anchor_17","anchor_23"],["a",0,0,1,1,0,0,0,0],["anchor_8",0,0,0,0,1,0,0,0],["anchor_14",1,0,0,0,0,0,0,0],["anchor_20",1,0,0,0,0,0,0,0],["z",0,1,0,0,0,0,0,0],["anchor_11",0,0,0,0,0,0,1,1],["anchor_17",0,0,0,0,0,1,0,0],["anchor_23",0,0,0,0,0,1,0,0]]
// var rel1 = [["anchor_8","anchor_11","A",0],["anchor_14","anchor_17","R",5],["anchor_20","anchor_23","R",5]]

// arr1 = [["","a","anchor_8","anchor_14","z","anchor_11","anchor_17"],["a",0,1,0,0,0,0],["anchor_8",1,0,0,0,0,0],["anchor_14",0,0,0,1,0,0],["z",0,0,1,0,0,0],["anchor_11",0,0,0,0,0,1],["anchor_17",0,0,0,0,1,0]]
// rel1 = [["anchor_8","anchor_11","R",5],["anchor_14","anchor_17","A",0]]

// arr1 = [["","a","anchor_8","z","anchor_11"],["a",0,1,0,0],["anchor_8",1,0,0,0],["z",0,0,0,1],["anchor_11",0,0,1,0]]
// rel1 = [["anchor_8","anchor_11","R",5]]
// console.log("de电流" + AinTwoPoints(arr1,rel1,V1,'anchor_8','anchor_11'))
// console.log("de电压" + VinTwoPoints(arr1,rel1,V1,'anchor_8','anchor_11'))
// console.log("fg电流"+ AinTwoPoints(arr1,rel1,V1,'anchor_14','anchor_17'))
// console.log("fg电压"+ VinTwoPoints(arr1,rel1,V1,'anchor_14','anchor_17'))
// console.log("qq电流"+ AinTwoPoints(arr1,rel1,V1,'anchor_20','anchor_23'))
// console.log("qq电压"+ VinTwoPoints(arr1,rel1,V1,'anchor_20','anchor_23'))

// arr1 = [
//     ['','a','b','c','d','e','f','g','z'],
//     ['a',0,  1,  0,  0,  0,  1,  0,  0],
//     ['b',1,  0,  0,  0,  0,  1,  0,  0],
//     ['c',0,  0,  0,  1,  0,  0,  1,  0],
//     ['d',0,  0,  1,  0,  0,  0,  1,  0],
//     ['e',0,  0,  0,  0,  0,  0,  0,  1],
//     ['f',1,  1,  0,  0,  0,  0,  0,  0],
//     ['g',0,  0,  1,  1,  0,  0,  0,  0],
//     ['z',0,  0,  0,  0,  1,  0,  0,  0]
// ]
//
// rel1 = [
//     ['f', 'g', 'R', 4],
//     ['d', 'e', 'R', 1],
//     ['b', 'c', 'V', 1000000000000]
// ]
// arr1 = [
//     ['','a','b','c','d','e','f','g','z'],
//     ['a',0,  1,  0,  1,  0,  0,  0,  0],
//     ['b',1,  0,  0,  1,  0,  0,  0,  0],
//     ['c',0,  0,  0,  0,  0,  0,  1,  1],
//     ['d',1,  1,  0,  0,  0,  0,  0,  0],
//     ['e',0,  0,  0,  0,  0,  1,  0,  0],
//     ['f',0,  0,  0,  0,  1,  0,  0,  0],
//     ['g',0,  0,  1,  0,  0,  0,  0,  1],
//     ['z',0,  0,  1,  0,  0,  0,  1,  0]
// ]
// rel1 = [
//     ['f', 'g', 'R', 4],
//     ['d', 'e', 'R', 1],
//     ['b', 'c', 'R', 2]
// ]
// arr1 = [
//     ['','a','b','c','d','e','f','g','h','i','z'],
//     ['a',0,  1,  0,  0,  0,  1,  0,  0,  0,  0],
//     ['b',1,  0,  0,  0,  0,  1,  0,  0,  0,  0],
//     ['c',0,  0,  0,  1,  0,  0,  0,  0,  0,  0],
//     ['d',0,  0,  1,  0,  0,  0,  0,  0,  0,  0],
//     ['e',0,  0,  0,  0,  0,  0,  0,  0,  1,  1],
//     ['f',1,  1,  0,  0,  0,  0,  0,  0,  0,  0],
//     ['g',0,  0,  0,  0,  0,  0,  0,  1,  0,  0],
//     ['h',0,  0,  0,  0,  0,  0,  1,  0,  0,  0],
//     ['i',0,  0,  0,  0,  1,  0,  0,  0,  0,  1],
//     ['z',0,  0,  0,  0,  1,  0,  0,  0,  1,  0],
// ]
// rel1 = [
//     ['f', 'g', 'R', 4],
//     ['d', 'e', 'R', 1],
//     ['b', 'c', 'R', 2],
//     ['h', 'i', 'R', 2],
// ]
// arr1 = [
//     ['','a','b','c','d','e','f','g','h','i','z'],
//     ['a',0,  1,  0,  1,  0,  0,  0,  0,  0,  0],
//     ['b',1,  0,  0,  1,  0,  0,  0,  0,  0,  0],
//     ['c',0,  0,  0,  0,  1,  1,  0,  1,  0,  0],
//     ['d',1,  1,  0,  0,  0,  0,  0,  0,  0,  0],
//     ['e',0,  0,  1,  0,  0,  1,  0,  1,  0,  0],
//     ['f',0,  0,  1,  0,  1,  0,  0,  1,  0,  0],
//     ['g',0,  0,  0,  0,  0,  0,  0,  0,  1,  1],
//     ['h',0,  0,  1,  0,  1,  1,  0,  0,  0,  0],
//     ['i',0,  0,  0,  0,  0,  0,  1,  0,  0,  1],
//     ['z',0,  0,  0,  0,  0,  0,  1,  0,  1,  0],
// ]
// rel1 = [
//     ['f', 'g', 'R', 4],
//     ['d', 'e', 'R', 1],
//     ['b', 'c', 'R', 2],
//     ['h', 'i', 'R', 2],
// ]
// console.log("de电流",AinTwoPoints(arr1,rel1,V1,'d','e'))
// console.log("de电压",VinTwoPoints(arr1,rel1,V1,'d','e'))
// console.log("fg电流",AinTwoPoints(arr1,rel1,V1,'f','g'))
// console.log("fg电压",VinTwoPoints(arr1,rel1,V1,'f','g'))
// console.log("bc电流",AinTwoPoints(arr1,rel1,V1,'b','c'))
// console.log("bc电压",VinTwoPoints(arr1,rel1,V1,'b','c'))
