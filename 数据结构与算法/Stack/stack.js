function Stack() {
  this.data = []
  this.push = num => {
    this.data.push(num)
  }
  this.pop = () => {
    return this.data.pop()
  }
  this.top = () => {
    return this.data[this.data.length - 1]
  }
  this.clear = num => {
    this.data = []
  }
}
