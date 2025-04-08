<template>
  <div class="product-detail">
    <div v-if="product">
      <h2>{{ product.name }}</h2>
      <img :src="product.img" class="product-img"/>
      <p>{{ product.description }}</p>
      <p class="price">¥{{ product.price }}</p>
      <el-button type="primary" @click="addToCart(product)">加入购物车</el-button>
    </div>
    <div v-else>
      <p>加载中...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductDetail',
  data() {
    return {
      product: null,
    }
  },
  mounted() {
    const productId = this.$route.params.id;
    this.getProductDetails(productId);
  },
  methods: {
    // 获取商品详情
    getProductDetails(productId) {
      // 这里假设你有一个 API 来获取商品详情
      // 你可以通过产品 ID 获取商品数据
      // 例如使用 axios 获取
      const productData = {
        1: {
          id: 1,
          name: '手机',
          price: 2999,
          img: 'https://via.placeholder.com/300x200?text=Phone',
          description: '最新款手机，性能强大'
        },
        2: {
          id: 2,
          name: '电脑',
          price: 5999,
          img: 'https://via.placeholder.com/300x200?text=Laptop',
          description: '高性能游戏电脑'
        },
        // 其他商品数据...
      };

      this.product = productData[productId];
    },
    addToCart(product) {
      // 模拟添加商品到购物车的操作
      this.$emit('add-to-cart', product);
    }
  }
}
</script>

<style scoped>
.product-detail {
  padding: 20px;
}

.product-img {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.price {
  color: #e91e63;
  font-weight: bold;
  font-size: 24px;
}

.el-button {
  margin-top: 20px;
}
</style>
