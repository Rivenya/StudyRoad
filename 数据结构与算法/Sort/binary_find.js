function binary_sort (arr, num) {
  function binary_sort_ex (start, end) {
    if (num === arr[0]) {
      return 0
    }
    if (start < end) {
      let middle = Math.floor((end + start) / 2)
      if (num > arr[middle]) {
        return binary_sort_ex(middle + 1, end)
      } else if (arr[middle] > num) {
        return binary_sort_ex(start, middle)
      } else if (num === arr[middle]) {
        return middle
      }
    }
  }
  return binary_sort_ex(0, arr.length - 1)
}

var a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
console.log(binary_sort(a, 9));