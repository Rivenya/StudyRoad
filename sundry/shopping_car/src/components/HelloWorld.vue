<template>
  <div>
    <h2>购物车</h2>
    <table>
      <tr>
        <th>勾选</th>
        <th>水果名称</th>
        <th>水果价格</th>
        <th>数量</th>
        <th>价格</th>
      </tr>
      <tr v-for="(item,index) in Item" :key="index">
        <td>
          <input type="checkbox" v-model="item.isActive" />
        </td>
        <td>{{item.name}}</td>
        <td>{{item.price}}</td>
        <td>
          <button @click="add(index)">+</button>
          {{item.number}}
          <button @click="minus(index)">-</button>
        </td>
        <td>{{item.number*item.price}}</td>
      </tr>
      <tr>
        <td>{{isActive}}/{{allIsActive}}</td>
        <td>{{allPrive}}</td>
      </tr>
    </table>
  </div>
</template>
<script>
export default {
  name: 'Cart',
  props: [
    'Item'
  ],
  data () {
    return {
      cartList: [{

      }]
    }
  },
  methods: {
    add (index) {
      this.Item[index].number += 1
    },
    minus (index) {
      let number = this.Item[index].number
      if (number > 0) {
        this.Item[index].number -= 1
      } else {
        if (window.confirm('是否要删除水果？')) {
          this.$emit('deleteItem', index)
        }
      }
    }
  },
  computed: {
    isActive () {
      return this.Item.filter(item => item.isActive === true).length
    },
    allIsActive () {
      return this.Item.length
    },
    allPrive () {
      let num = 0;
      if (this.Item.length > 0) {
        this.Item.forEach(item => {
          if (item.isActive) {
            num += (item.price * item.number)
          }
        })
      }
      return num
    }
  }
}
</script>
<style lang="">
</style>