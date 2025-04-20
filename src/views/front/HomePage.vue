<template>
  <div>
    <!-- 轮播图 -->
    <el-carousel height="300px">
      <el-carousel-item v-for="(item, index) in banners" :key="index">
        <img :src="item" class="banner-img">
      </el-carousel-item>
    </el-carousel>

    <!-- 热门推荐区域 -->
    <div class="section">
      <div class="section-header">
        <h3>热门推荐</h3>
        <el-button type="text" class="more-link" @click="goToHot">查看更多 ></el-button>
      </div>
      <el-row :gutter="20">
        <el-col v-for="item in hotGoods" :key="item.id" :span="6">
          <el-card shadow="hover" @click.native="goToProductDetail(item.id)">
            <img :src="item.picture" class="product-img">
            <div class="good-title">{{ item.name }}</div>
            <div class="good-price">￥{{ item.price }}</div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 热门商品 -->
    <section class="section">
      <h2 class="section-title">🔥 最新出新</h2>
      <el-row :gutter="20">
        <el-col v-for="(item, index) in newestGoods" :key="index" :span="6">
          <el-card shadow="hover" @click.native="$router.push({ name: 'ProductDetail', params: { id: item.id } })">
            <img :src="item.picture" class="product-img">
            <div class="product-info">
              <h3>{{ item.name }}</h3>
              <p class="price">¥{{ item.price }}</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </section>

    <!-- 商品分类 -->
    <section class="section">
      <h2 class="section-title">📦 商品分类</h2>
      <el-row :gutter="20">
        <el-col v-for="(item, index) in categories" :key="index" :span="8">
          <el-card class="category-card">
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
          </el-card>
        </el-col>
      </el-row>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  props: {
    banners: Array,
    hotGoods: Array,
    newestGoods: Array,
    categories: Array
  },
  methods: {
    // 跳转到商品详情页
    goToProductDetail(productId) {
      console.log('跳转到商品详情页，商品ID:', productId)
      this.$emit('go-to-product-detail', productId)
    },
    goToHot() {
      this.$router.push('/hot')
    }
  }
}
</script>

<style scoped>
.product-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.more-link {
  font-size: 14px;
  color: #409EFF;
  cursor: pointer;
}

</style>
