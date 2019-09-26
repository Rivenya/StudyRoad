function node(key, value) {
  this.key = key
  this.value = value
  this.next = null
}
function LinkList() {
  this.head = new node("head", "head")
  this.getHead = function () {
    return this.head
  }
  this.insert = function (key, value) {
    let current = this.head
    let newNode = new node(key, value)
    while (current.next !== null) {
      current = current.next
    }
    current.next = newNode
  }
  this.serach = function (key) {
    let current = this.head
    while (current.key !== key && current.next) {
      current = current.next
    }
    if (current.key !== key) {
      return false
    }
    return current
  }
  this.remove = function (key) {
    let current = this.head
    while (current.next.key !== key && current.next.next) {
      current = current.next
    }
    if (current.key !== key) {
      return false
    }
    current.next = current.next.next
  }
}
function HashTable() {
  this.list = null
  this.prime = null
  this.keyCount = 0

  this.init = function (size) {
    this.list = new Array(size)
    for (let i = 0; i < this.list.length; i++) {
      this.list[i] = new LinkList()
    }
    this.prime = getPrime()
  }
  getPrime = () => {
    let num = this.list.length
    while (num > 2) {
      for (let i = 2; i < num; i++) {
        if (num % i === 0) {
          break;
        }
        return num
      }
      num -= 1
    }
  }
  is_crowd = () => {
    if (Math.floor(this.keyCount / this.prime) > 5) {
      return true
    } else {
      false
    }
  }
  this.getIndex = function (key) {
    return Math.abs(Hash(key, 0) % this.prime)
  }
  this.expand = function () {
    let tmp = new Array(this.list.length)
    for (let i = 0; i < this.list.length; i++) {
      tmp[i] = this.list[i]
    }
    this.list = new Array(this.list.length * 2)
    this.prime = getPrime()
    this.keyCount = 0
    for (let i = 0; i < tmp.length; i++) {
      let head = tmp[i]
      while (head.next) {
        this.set(head.key, head.value)
        head = head.next
      }
    }
  }
  this.set = function (key, value) {
    let index = this.getIndex(key)
    if (this.list[index].serach(key)) {
      this.list[index].serach(key).value = value
    } else {
      this.list[index].insert(key, value)
      this.keyCount += 1
    }
    if (is_crowd()) {
      this.expand()
    }
  }
  this.get = function (key) {
    let index = this.getIndex(key)
    if (this.list[index].serach(key)) {
      return this.list[index].serach(key).value
    } else {
      return false
    }
  }
  this.delete = function (key) {
    let index = this.getIndex(key)
    if (this.list[index].serach(key)) {
      this.list[index].remove(key)
      this.keyCount -= 1
    } else {
      return false
    }
  }
  this.hasKey = function (key) {
    let index = this.getIndex(key)
    if (this.list[index].serach(key)) {
      return true
    } else {
      return false
    }
  }
}
function Hash(key, seed) {
  var remainder, bytes, h1, h1b, c1, c1b, c2, c2b, k1, i;

  remainder = key.length & 3; // key.length % 4
  bytes = key.length - remainder;
  h1 = seed;
  c1 = 0xcc9e2d51;
  c2 = 0x1b873593;
  i = 0;

  while (i < bytes) {
    k1 =
      ((key.charCodeAt(i) & 0xff)) |
      ((key.charCodeAt(++i) & 0xff) << 8) |
      ((key.charCodeAt(++i) & 0xff) << 16) |
      ((key.charCodeAt(++i) & 0xff) << 24);
    ++i;

    k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
    k1 = (k1 << 15) | (k1 >>> 17);
    k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

    h1 ^= k1;
    h1 = (h1 << 13) | (h1 >>> 19);
    h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
    h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
  }

  k1 = 0;

  switch (remainder) {
    case 3: k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
    case 2: k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
    case 1: k1 ^= (key.charCodeAt(i) & 0xff);

      k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
      k1 = (k1 << 15) | (k1 >>> 17);
      k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
      h1 ^= k1;
  }

  h1 ^= key.length;

  h1 ^= h1 >>> 16;
  h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
  h1 ^= h1 >>> 13;
  h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
  h1 ^= h1 >>> 16;

  return h1 >>> 0;
}

var zz = new HashTable()
zz.init(5)
zz.set("我爱你1", "中国1")
zz.set("我爱你2", "中国2")
zz.set("我爱你3", "中国3")
zz.set("我爱你4", "中国4")
zz.set("天地", "山水")
zz.set("么么", "哒")

console.log(zz.get("我爱你1"))
console.log(zz.get("我爱你2"))
console.log(zz.get("我爱你3"))
console.log(zz.get("我爱你4"))
console.log(zz.get("天地"))
console.log(zz.get("么么"))
