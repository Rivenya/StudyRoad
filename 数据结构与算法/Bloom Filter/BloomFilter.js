function MurmurHash(data, offset, seed) {
  let len = data.length,
    m = 0x5bd1e995,
    r = 24,
    h = seed ^ len,
    len_4 = len >> 2;

  for (let i = 0; i < len_4; i++) {
    let i_4 = (i << 2) + offset,
      k = data[i_4 + 3];

    k = k << 8;
    k = k | (data[i_4 + 2] & 0xff);
    k = k << 8;
    k = k | (data[i_4 + 1] & 0xff);
    k = k << 8;
    k = k | (data[i_4 + 0] & 0xff);
    k *= m;
    k ^= k >>> r;
    k *= m;
    h *= m;
    h ^= k;
  }

  // avoid calculating modulo  
  let len_m = len_4 << 2,
    left = length - len_m,
    i_m = len_m + offset;

  if (left != 0) {
    if (left >= 3) {
      h ^= data[i_m + 2] << 16;
    }
    if (left >= 2) {
      h ^= data[i_m + 1] << 8;
    }
    if (left >= 1) {
      h ^= data[i_m];
    }

    h *= m;
  }

  h ^= h >>> 13;
  h *= m;
  h ^= h >>> 15;

  return h;
}
class BloomFilter {
  constructor(maxkeys, errRote) {
    this.maxkeys = maxkeys
    this.errRote = errRote
    // 位图长度
    this.bitSize = Math.ceil(this.maxkeys * (-Math.log(this.errRote) / (Math.log(2) * Math.log(2))))
    // 错误率
    this.hashCount = Math.ceil(Math.log(2) * (this.bitSize / this.maxkeys));
    this.bit = new Array(this.bitSize).fill(0)
  }
  setBit = (num) => {
    let index = Math.floor(num / 32)
    let xb = num % 32
    this.bit[index] = this.bit[index] | 1 << xb
  }
  getBit = (num) => {
    let index = Math.floor(num / 32)
    let xb = num % 32
    return this.bit[index] = this.bit[index] & 1 << xb
  }
  addBloomFilter = (prop) => {
    let hash1 = MurmurHash(prop, 0, 0)
    this.setBit(hash1)
  }
  isExist = (prop) => {
    let hash1 = MurmurHash(prop, 0, 0)
    let value = this.getBit(hash1)
    if (value === 0) {
      return false
    } else {
      return true
    }
  }
}

let bloomFilter = new BloomFilter(1000000, 0.01);
bloomFilter.addBloomFilter('http://www.baidu.com');
let va = bloomFilter.isExist('http://www.baidu.com/123')
console.log(va);