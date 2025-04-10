<template>
  <div class="mainpage">
    <el-container>
      <!-- 顶部导航栏 -->
      <el-header class="header">
        <el-row type="flex" justify="space-between" align="middle">
          <el-col :span="8" class="logo" @click.native="home">创作者购物平台</el-col>

          <el-col :span="8" class="search-container">
            <el-input
              v-model="searchQuery"
              placeholder="搜索商品"
              prefix-icon="el-icon-search"
            />
          </el-col>

          <el-col :span="8" class="user-container" style="text-align: right;">
            <el-avatar
              v-if="isLoggedIn"
              :size="40"
              :src="userAvatar"
              class="user-avatar"
              @click.native="backend"
            />
            <el-button
              v-if="!isLoggedIn"
              type="primary"
              icon="el-icon-user"
              size="small"
              @click="login"
            >
              登录
            </el-button>
          </el-col>
        </el-row>
      </el-header>

      <!-- 主页内容 -->
      <el-main>
        <!-- 动态组件显示 -->
        <component
          :is="currentPage"
          :banners="banners"
          :hot-goods="hotGoods"
          :categories="categories"
          :product-id="currentProductId"
          @go-to-product-detail="goToProductDetail"
          @go-to-home="home"
        />
      </el-main>

      <!-- 底部购物车 -->
      <el-footer>
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
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import HomePage from './HomePage.vue'
import ProductDetailPage from './ProductDetailPage.vue'
import { getToken } from '@/utils/auth'
import { topSoldGoods } from '@/api/good'

export default {
  name: 'MainPage',
  components: {
    HomePage: HomePage,
    ProductDetailPage
  },
  data() {
    return {
      banners: [
        'https://cdn.pixabay.com/photo/2016/11/22/19/31/adult-1850925_960_720.jpg',
        'https://cdn.pixabay.com/photo/2016/03/09/09/17/store-1245754_960_720.jpg'
      ],
      hotGoods: [],
      categories: [
        { title: '数码家电', desc: '最新潮流的电子产品等你来选购' },
        { title: '服饰美妆', desc: '时尚穿搭与护肤新品应有尽有' },
        { title: '日用百货', desc: '生活必备，品质好物尽在其中' }
      ],
      cartVisible: false,
      cartItems: [
        { name: '手机', price: 2999 },
        { name: '耳机', price: 399 }
      ],
      searchQuery: '', // 搜索框绑定的查询内容
      isLoggedIn: false, // 用户登录状态
      userAvatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      currentPage: 'HomePage', // 当前显示的页面组件
      currentProductId: null
    }
  },
  mounted() {
    // 检查用户登录状态
    const token = getToken()
    if (token) {
      this.isLoggedIn = true
      // 这里可以获取用户信息，例如头像等
      this.userAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
    } else {
      this.isLoggedIn = false
    }
    // 获取数据
    this.fetchData()
  },
  methods: {
    login() {
      this.$router.push('/backend/dashboard')
    },
    // 跳转到商品详情页
    goToProductDetail(productId) {
      console.log('跳转到商品详情页，商品ID:', productId)
      this.currentPage = 'ProductDetailPage'
      this.currentProductId = productId
    },
    // 跳转到后台管理页面
    backend() {
      console.log('Avatar clicked, navigating to backend dashboard...')
      this.$router.push('/backend/dashboard')
    },
    home() {
      console.log('Home clicked, navigating to home page...')
      this.currentPage = 'HomePage'
      this.currentProductId = null
    },
    async fetchData() {
      // 获取热销商品数据
      const response = await topSoldGoods()
      console.log('获取热销商品:', response)
      this.hotGoods = response.data.records
    }
  }
}
</script>

<style scoped>
.mainpage {
  padding: 20px;
  position: relative;
}

.header {
  background-color: #39c5bb;
  padding: 10px;
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

.el-header {
  background-color: #39c5bb;
  padding: 10px;
}
</style>
