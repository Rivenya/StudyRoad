class bitMap {
  constructor(num) {
    this.max_index = Array(num)
  }
  insertNumber = (num) => {
    let index = Math.floor(num / 32)
    let xb = num % 32
    this.max_index[index] = this.max_index[index] | 1 << xb
  }
  isexist = (num) => {
    let index = Math.floor(num / 32)
    let xb = num % 32
    let value = this.max_index[index] & 1 << xb
    if (value != 1) {
      console.log("不存在这个数");
    }
  }
}
