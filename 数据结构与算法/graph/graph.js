function Graph () {
  let map = [];
  let node_num = 0;
  let edge_num = 0;
  this.init = function (props) {
    map = props;
    node_num = this.get_node_num();
    edge_num = this.get_edge_num();
  }
  this.get_node_num = function () {
    if (node_num != 0) {
      return node_num
    }
    return map.length
  }
  this.get_edge_num = function () {
    if (edge_num != 0) {
      return edge_num
    }
    let num = 0
    for (let i = 0; i < map.length; i++) {
      for (let j = i + 1; j < map[i].length; j++) {
        if (map[i][j] !== 0 && map[i][j] !== '#') {
          num += 1
        }
      }
    }
    return num
  }
  function graph_dfs (num, array, path) {
    array[num] = 1
    path.push(num)
    for (let i = 0; i < map[num].length; i++) {
      if (map[num][i] !== 0 && map[num][i] !== '#' && array[i] === 0) {
        graph_dfs(i, array, path)
      }
    }
  }
  function graph_bfs (num, path, array) {
    path.push(num)
    for (let i = 0; i < map[num].length; i++) {
      array.push()
    }
  }
  this.dfs = function (i) {
    let path = []
    let array = new Array(map.length)
    for (let i = 0; i < array.length; i++) {
      array[i] = 0
    }
    graph_dfs(i, array, path)
    return path
  }
  this.bfs = function (i) {
    let path = []
    let array = new Array(map.length)
    for (let i = 0; i < array.length; i++) {
      array[i] = 0
    }
    graph_bfs(i, path, array)
  }
}

var test_data = [
  [0, 28, '#', '#', 10, '#', '#'],
  [28, 0, 16, '#', '#', '#', 14],
  ['#', 16, 0, 12, '#', '#', '#'],
  ['#', '#', 12, 0, '#', 22, 18],
  ['#', '#', '#', 22, 0, 25, '#'],
  [10, '#', '#', '#', 25, 0, 24],
  ['#', 14, '#', 18, '#', 24, 0],
]

var z = new Graph()
z.init(test_data)
console.log(z.dfs(0))