function spawn(genf) {
  return new Promise(
    (resolve, reject) => {
      const gen = genf
      function step(nextf) {
        let next
        try {
          next = nextf()
        } catch (error) {
          reject(error)
        }
        if (next.done) return resolve(next.value)
        Promise.resolve(next.value).then(
          res => {
            step(function () { return gen.next(res) })
          }, err => {
            step(function () { return gen.throw(err) })
          }
        )
      }
      step(function () { return gen.next(undefined); });
    }
  )
}