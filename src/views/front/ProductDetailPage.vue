<template>
  <el-container direction="vertical">
    <!-- 顶部栏 -->
    <CommonHeader
      @goHome="goHome"
      @login="login"
      @backend="goBackend"
    />
    <div class="product-detail-page">
      <!-- 主体内容 -->
      <el-main>
        <h2>商品详情界面</h2>
        <el-row>
          <!-- 商品图片 -->
          <el-col :span="12" class="product-image-container">
            <img :src="product.picture || product.image" alt="商品图片" class="product-img">
          </el-col>

          <!-- 商品信息 -->
          <el-col :span="12" class="product-info-container">
            <div class="product-details">
              <h2>{{ product.name }}</h2>
              <p class="price">¥{{ product.price }}</p>
              <p class="description">{{ product.description }}</p>

              <!-- 评分组件 -->
              <el-rate v-model="rating" disabled />

              <!-- 数量选择 -->
              <div class="quantity-container">
                <el-button-group>
                  <!--                  <el-button @click="decreaseQuantity">-</el-button>-->
                  <el-input-number
                    v-model="quantity"
                    :min="1"
                    :max="100"
                    size="small"
                    label="数量"
                    @change="updateQuantity"
                  />
                  <!--                  <el-button @click="increaseQuantity">+</el-button>-->
                </el-button-group>
              </div>

              <!-- 购买按钮和加入购物车按钮 -->
              <div class="action-buttons">
                <el-button type="primary" class="cart-button" @click="addToCart">加入购物车</el-button>
                <el-button type="danger" class="buy-button" @click="buyNow">立即购买</el-button>
              </div>
            </div>
          </el-col>
        </el-row>

        <!-- 商品评论 -->
        <div class="product-reviews">
          <h3>商品评论</h3>

          <!-- 评论输入区 -->
          <el-rate v-model="rating" />
          <el-input
            v-model="newComment"
            placeholder="写下你的评论..."
            type="textarea"
            rows="4"
            class="comment-input"
          />
          <el-button type="success" class="submit-comment-button" @click="submitComment">提交评论</el-button>

          <!-- 评论列表 -->
          <div v-for="(review, index) in reviews" :key="index" class="review-item">
            <p><strong>{{ review.username }}</strong> (评分: {{ review.rating }})</p>
            <p>{{ review.comment }}</p>
            <p class="review-time">{{ review.time }}</p>
          </div>
        </div>
      </el-main>
    </div>
    <!-- 底部栏 -->
    <CommonFooter />
  </el-container>

</template>

<script>
import { getGoodById } from '@/api/good'
import CommonHeader from '@/layout/components/CommonHeader.vue'
import CommonFooter from '@/layout/components/CommonFooter.vue'
import { addToCart } from '@/api/shoppingCart'

export default {
  name: 'ProductDetailPage',
  components: {
    CommonHeader,
    CommonFooter
  },
  data() {
    return {
      product: {
        name: '',
        price: 0,
        description: '',
        image: ''
      },
      reviews: [
        { username: '用户A', rating: 4, comment: '商品很好！', time: '2025-04-10' },
        { username: '用户B', rating: 5, comment: '非常棒，质量很好。', time: '2025-04-09' }
      ],
      newComment: '',
      rating: 5,
      quantity: 1,
      ShoppingCart: {
        goodId: '',
        num: 1
      }
    }
  },
  mounted() {
    this.fetchProductDetails()
  },
  methods: {
    goHome() {
      this.$router.push('/')
    },
    login() {
      this.$router.push('/login')
    },
    goBackend() {
      this.$router.push('/backend/dashboard')
    },
    increaseQuantity() {
      this.quantity++
    },
    decreaseQuantity() {
      if (this.quantity > 1) this.quantity--
    },
    updateQuantity(newQuantity) {
      this.quantity = newQuantity
    },
    async addToCart() {
      console.log('加入购物车:', this.product.id, '数量:', this.quantity)
      this.ShoppingCart.goodId = this.product.id
      this.ShoppingCart.num = this.quantity
      const response = await addToCart(this.ShoppingCart)
      if (response.code === 20000) {
        this.$message.success('已加入购物车')
        // await addToCart(this.ShoppingCart)
        await this.$store.dispatch('cart/fetchCart') // 通知 Vuex 刷新购物车
      } else {
        this.$message.error('加入购物车失败')
      }
    },
    buyNow() {
      this.$message.success(`已开始购买 ${this.quantity} 件商品`)
    },
    submitComment() {
      if (this.newComment.trim() === '') {
        this.$message.warning('评论不能为空')
        return
      }
      const newReview = {
        username: '当前用户',
        rating: this.rating,
        comment: this.newComment,
        time: new Date().toLocaleString()
      }
      this.reviews.push(newReview)
      this.newComment = ''
      this.rating = 5
      this.$message.success('评论提交成功')
    },
    async fetchProductDetails() {
      try {
        const response = await getGoodById(this.$router.currentRoute.params.id)
        this.product = response.data
      } catch (error) {
        console.error('获取商品详情失败:', error)
      }
    }
  }
}
</script>

<style scoped>
.product-detail-page {
  padding: 20px;
}

.product-image-container {
  text-align: center;
}

.product-img {
  width: 100%;
  max-width: 300px;
  object-fit: contain;
}

.product-info-container {
  padding-left: 30px;
}

.product-details h2 {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 10px;
}

.price {
  font-size: 24px;
  color: #f40;
  margin-bottom: 10px;
}

.description {
  font-size: 16px;
  color: #555;
  margin-bottom: 20px;
}

.quantity-container {
  margin: 20px 0;
}

.action-buttons {
  margin-top: 20px;
}

.cart-button,
.buy-button {
  width: 48%;
  margin: 0 1%;
}

.product-reviews {
  margin-top: 50px;
}

.product-reviews h3 {
  font-size: 20px;
  margin-bottom: 10px;
}

.review-item {
  border-top: 1px solid #ddd;
  padding: 10px 0;
}

.review-time {
  color: #aaa;
  font-size: 12px;
}

.comment-input {
  margin-bottom: 10px;
}

.submit-comment-button {
  margin-top: 10px;
}
</style>
