<template>
  <div id="box">
    <img :src="pics" alt="/" />
    <div>
      <p class="title">{{msg}}</p>
      <p class="value">{{value}}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ["value", "pic", "msg"],
  data(){
      return {
      }
  },
  computed: {
    pics(){
        return require('../assets/' + this.pic)
    }
  }
};
</script>

<style lang="less" scoped>
#box {
  display: flex;
  align-items: center;
  background: #fff;
  width: 250px;
  height: 80px;
  justify-content: space-around;
  p{
      text-align: center;
  }
  .title{
      color: dimgray;
      line-height: 24px;
  }
}
</style>