// thunkify 假如ajax需要耗时操作
function ajax(fn) {
  var a = 1
  setTimeout(function () {
    fn(a)
  }, 700)
}
function thunkify(fn) {
  return function () {
    var array = new Array(arguments.length);
    var self = this
    for (let i = 0; i < array.length; i++) {
      array[i] = arguments[i];
    }
    return function (callback) {
      var done;
      array.push(function () {
        if (!done) {
          callback.call(self, ...arguments)
        }
      })
      try {
        fn.call(self, ...array)
      } catch (error) {
        callback(error)
      }
    }
  }
}

var thunkAjax = thunkify(ajax)
thunkAjax()(function (a) { console.log(a) })