function quick_sort (array) {
  function partition (arr, start, end) {
    var privotpos = start;
    var pivot = arr[start]
    for (let i = start + 1; i <= end; i++) {
      if (arr[i] < pivot) {
        privotpos++;
        if (privotpos != i) {
          var temp = arr[privotpos]
          arr[privotpos] = arr[i]
          arr[i] = temp
        }
      }
    }
    arr[start] = arr[privotpos]
    arr[privotpos] = pivot
    return privotpos
  }
  function quick_sort_ex (arr, start, end) {
    if (start < end) {
      var privotpos = partition(arr, start, end)
      quick_sort_ex(arr, start, privotpos - 1)
      quick_sort_ex(arr, privotpos + 1, end)
    }
  }
  quick_sort_ex(array, 0, array.length - 1)
}


var arr = [4, 1, 2, 6, 8, 3, 11]
var z = quick_sort(arr)
console.log(arr);

//优化快速排序算法
function optimize_quick_sort (array) {
  function partition (arr, start, end) {
    var privotpos = start;
    var pivot = arr[start]
    for (let i = start + 1; i <= end; i++) {
      if (arr[i] < pivot) {
        privotpos++;
        if (privotpos != i) {
          var temp = arr[privotpos]
          arr[privotpos] = arr[i]
          arr[i] = temp
        }
      }
    }
    arr[start] = arr[privotpos]
    arr[privotpos] = pivot
    return privotpos
  }
  function quick_sort_ex (arr, start, end) {
    if (start < end) {
      var privotpos = partition(arr, start, end)
      quick_sort_ex(arr, start, privotpos - 1)
      quick_sort_ex(arr, privotpos + 1, end)
    }
  }
  quick_sort_ex(array, 0, array.length - 1)
}