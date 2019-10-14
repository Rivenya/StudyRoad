function merge_sort (arr) {
  function merge (arr1, arr2) {
    let temp = [];
    let position1 = 0;
    let position2 = 0;
    while (arr1.length - 1 >= position1 && arr2.length - 1 >= position2) {
      if (arr1[position1] < arr2[position2]) {
        temp.push(arr1[position1])
        position1++;
      } else {
        temp.push(arr2[position2])
        position2++;
      }
    }
    if (arr1.length > position1) {
      while (arr1.length > position1) {
        temp.push(arr1[position1])
        position1++
      }
    }
    if (arr2.length > position2) {
      while (arr2.length > position2) {
        temp.push(arr2[position2])
        position2++
      }
    }
    return temp
  }
  function merge_sort_ex (arr, start, end) {
    if (start < end) {
      var middle = Math.floor((start + end) / 2)
      var arr1 = merge_sort_ex(arr, start, middle)
      var arr2 = merge_sort_ex(arr, middle + 1, end)
      return merge(arr1, arr2)
    }
    return [arr[end]]
  }
  return merge_sort_ex(arr, 0, arr.length - 1)
}
var arr = [3, 2, 1, 20, 11, 84, 7]
console.log(merge_sort(arr));