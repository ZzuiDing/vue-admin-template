<template>
  <div class="mainpage">
    <el-container>
      <el-header>
        <el-row type="flex" justify="space-between" align="middle">
          <!-- 左侧为空 -->
          <el-col :span="8">创作者购物平台</el-col>

          <!-- 中间搜索框 -->
          <el-col :span="8" class="search-container">
            <el-input
              v-model="searchQuery"
              placeholder="搜索商品"
              prefix-icon="el-icon-search"
            ></el-input>
          </el-col>

          <!-- 右侧用户头像和登录 -->
          <el-col :span="8" class="user-container" style="text-align: right;">
            <el-avatar
              v-if="isLoggedIn"
              size="40"
              :src="userAvatar"
              class="user-avatar"
            ></el-avatar>
            <el-button
              v-if="!isLoggedIn"
              type="primary"
              @click="login"
              icon="el-icon-user"
              size="small"
            >
              登录
            </el-button>
          </el-col>
        </el-row>
      </el-header>

      <el-main>
        <!-- 轮播图 -->
        <el-carousel height="300px">
          <el-carousel-item v-for="(item, index) in banners" :key="index">
            <img :src="item" class="banner-img"/>
          </el-carousel-item>
        </el-carousel>

        <!-- 热门商品 -->
        <section class="section">
          <h2 class="section-title">🔥 热门推荐</h2>
          <el-row :gutter="20">
            <el-col :span="6" v-for="(item, index) in hotGoods" :key="index">
              <el-card shadow="hover" @click="goToProductDetail(item.id)">
                <img :src="item.img" class="product-img"/>
                <div class="product-info">
                  <h3>{{ item.name }}</h3>
                  <p class="price">¥{{ item.price }}</p>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </section>

        <!-- 分类 -->
        <section class="section">
          <h2 class="section-title">📦 商品分类</h2>
          <el-row :gutter="20">
            <el-col :span="8" v-for="(item, index) in categories" :key="index">
              <el-card class="category-card">
                <h3>{{ item.title }}</h3>
                <p>{{ item.desc }}</p>
              </el-card>
            </el-col>
          </el-row>
        </section>
      </el-main>

      <el-footer>Footer</el-footer>
    </el-container>

    <!-- 浮动购物车按钮 -->
    <el-button class="cart-button" type="primary" circle @click="cartVisible = true">
      🛒
    </el-button>

    <!-- 购物车抽屉 -->
    <el-drawer
      :visible.sync="cartVisible"
      title="🛒 我的购物车"
      direction="rtl"
      size="300px"
    >
      <div v-if="cartItems.length">
        <el-card
          v-for="(item, index) in cartItems"
          :key="index"
          style="margin-bottom: 10px;"
        >
          <div>{{ item.name }}</div>
          <div class="price">¥{{ item.price }}</div>
        </el-card>
      </div>
      <div v-else>
        <p>购物车为空~</p>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {getToken} from "@/utils/auth";

export default {
  name: 'MainPage',
  data() {
    return {
      banners: [
        'https://cdn.pixabay.com/photo/2016/11/22/19/31/adult-1850925_960_720.jpg',
        'https://cdn.pixabay.com/photo/2016/03/09/09/17/store-1245754_960_720.jpg'
      ],
      hotGoods: [
        {id: 1, name: '手机', price: 2999, img: 'https://via.placeholder.com/300x200?text=Phone'},
        {id: 2, name: '电脑', price: 5999, img: 'https://via.placeholder.com/300x200?text=Laptop'},
        {id: 3, name: '耳机', price: 399, img: 'https://via.placeholder.com/300x200?text=Headphone'},
        {id: 4, name: '手表', price: 899, img: 'https://via.placeholder.com/300x200?text=Watch'}
      ],
      categories: [
        {title: '数码家电', desc: '最新潮流的电子产品等你来选购'},
        {title: '服饰美妆', desc: '时尚穿搭与护肤新品应有尽有'},
        {title: '日用百货', desc: '生活必备，品质好物尽在其中'}
      ],
      cartVisible: false,
      cartItems: [
        {name: '手机', price: 2999},
        {name: '耳机', price: 399}
      ],
      searchQuery: '', // 搜索框绑定的查询内容
      isLoggedIn: false, // 用户登录状态
      userAvatar: 'https://via.placeholder.com/40', // 用户头像
    }
  },
  methods: {
    login() {
      this.$router.push('/backend/dashboard');
    },
    // 跳转到商品详情页
    goToProductDetail(productId) {
      this.$router.push({name: 'ProductDetail', params: {id: productId}})
    }
  }
}
</script>

<style scoped>
.mainpage {
  padding: 20px;
  position: relative;
}

.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.section {
  margin-top: 30px;
}

.section-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
}

.product-img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 8px;
}

.product-info {
  margin-top: 10px;
}

.price {
  color: #e91e63;
  font-weight: bold;
}

.category-card {
  min-height: 120px;
  text-align: center;
}

.cart-button {
  position: fixed;
  bottom: 30px;
  right: 30px;
  font-size: 22px;
  z-index: 2000;
}

.cart-dialog {
  position: fixed !important;
  right: 30px;
  bottom: 90px;
  margin: 0;
}

.cart-item {
  margin-bottom: 10px;
}
</style>
