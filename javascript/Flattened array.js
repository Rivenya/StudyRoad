// 拉平数组
const a = [[1, 2, 3, [4, [5, [6], 7], 8], 9], [10, 11, 12], [13, 14, 15], [16]]
//拉平数组
function lp(a) {
  const tmp = []
  function zx(a) {
    a.map(item => {
      if (Array.isArray(item)) {
        return zx(item)
      }
      tmp.push(item)
    })
  }
  zx(a)
  return tmp
}
//拉平数组2
function lp2(a) {
  return a.reduce(
    (pre, next) =>
      Array.isArray(next) ? pre.concat(lp2(next)) : pre.concat(next),
    []
  )
}
//拉平数组3
const c = a.flat(Infinity)

console.log(lp(a))
console.log(lp2(a))
console.log(c)
