function insert_sort (arr) {
  for (let i = 1; i <= arr.length - 1; i++) {
    if (arr[i] < arr[i - 1]) {
      let tmp = arr[i]
      let j = i - 1
      while (j >= 0 && tmp < arr[j]) {
        arr[j + 1] = arr[j]
        j--
      }
      arr[j + 1] = tmp
    }
  }
}
var zz = [3, 4, 1, 123, 45, 2, 39, 77]
insert_sort(zz)
console.log(zz);
