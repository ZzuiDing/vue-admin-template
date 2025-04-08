<template>
  <div>
    <h2>商品详情</h2>
    <div>
      <p>商品ID: {{ productId }}</p>
      <!-- 在此处添加商品的详细信息组件 -->
      <el-button @click="backToHome">返回主页</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductDetailPage',
  props: {
    productId: Number
  },
  methods: {
    backToHome() {
      console.log('返回主页')
      this.$emit('go-to-home')
    }
  }
}
</script>

<style scoped>
/* 样式根据需求调整 */
</style>
