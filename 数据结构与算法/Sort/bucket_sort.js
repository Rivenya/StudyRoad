// 计算桶
// max/10 - min/10 +1 
function bucket_sort (arr) {
  let max = arr.reduce((a, b) => {
    return a > b ? a : b
  })
  let min = arr.reduce((a, b) => {
    return a < b ? a : b
  })
  let bucket = 4
  let divisor = Math.floor((max - min + 1) / bucket)
  let bucket_array = new Array(bucket + 1)
  let tmp = []
  for (let i = 0; i < bucket_array.length; i++) {
    bucket_array[i] = []
  }
  for (let i = 0; i < arr.length; i++) {
    bucket_array[Math.floor(arr[i] / divisor)].push(arr[i])
  }
  for (let i = 0; i < bucket_array.length; i++) {
    if (bucket_array[i].length > 0) {
      quick_sort(bucket_array[i])
    }
  }
  for (let i = 0; i < bucket_array.length; i++) {
    for (let j = 0; j < bucket_array[i].length; j++) {
      tmp.push(bucket_array[i][j])
    }
  }
  return tmp
}
//快速排序算法  
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
var a = [3, 90, 4, 6, 77, 7, 12, 102, 34, 56, 12, 44, 12]
console.log(bucket_sort(a));