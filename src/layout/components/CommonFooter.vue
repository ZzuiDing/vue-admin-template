<template>
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
      size="700px"
    >
      <div v-if="cartItems.length&&this.$store.getters.token">
        <el-scrollbar height="400px">
          <el-checkbox-group v-model="selectedItemIds">
            <el-card
              v-for="(item, index) in cartItems"
              :key="item.id"
              class="cart-item-card"
            >
              <el-checkbox :label="item.id" class="cart-item-checkbox">
                <div class="item">
                  <img :src="item.picture" class="item-img">
                  <div class="item-info">
                    <div class="item-name">{{ item.name }}</div>
                    <div class="item-meta">
                      <span>单价：¥{{ item.price }}</span>
                      <div class="quantity-control">
                        <el-input-number
                          v-model="item.num"
                          :min="1"
                          size="mini"
                          @change="() => updateQuantity(item)"
                        />
                      </div>
                    </div>
                    <div class="item-total">小计：¥{{ item.price * item.num }}</div>
                  </div>
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    @click="deleteItem(item.id)"
                  />
                </div>
              </el-checkbox>
            </el-card>
          </el-checkbox-group>

        </el-scrollbar>

        <!-- 底部区域 -->
        <div class="cart-summary">
          <span>总计：</span>
          <span class="cart-total">¥{{ totalAmount }}</span>
        </div>

        <div class="checkout">
          <el-button type="success" @click="checkout">结算</el-button>
        </div>
      </div>
      <div v-if="!this.$store.getters.token">
        <p>请登陆后查看购物车</p>
      </div>
      <div v-else>
        <p>购物车为空~</p>
      </div>
    </el-drawer>
  </el-footer>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'CommonFooter',
  data() {
    return {
      cartVisible: false,
      // cartItems: [],
      selectedItemIds: []
    }
  },
  computed: {
    ...mapState('cart', ['cartItems']),
    ...mapGetters('cart', ['totalAmount']),
    totalAmount() {
      return this.cartItems
        .filter(item => this.selectedItemIds.includes(item.id))
        .reduce((sum, item) => sum + item.price * item.num, 0)
    }
  },
  mounted() {
    if (this.$store.getters.token) {
      this.fetchCart()
    }
  },
  methods: {
    ...mapActions('cart', ['fetchCart', 'updateQuantity', 'deleteItem']),
    // checkout() {
    //   this.$router.push('/checkout')
    //   // 后续可调用生成订单接口
    // }
    checkout() {
      if (this.selectedItemIds.length === 0) {
        return this.$message.warning('请先选择要结算的商品')
      }
      this.$router.push({
        path: '/checkout',
        query: {
          ids: this.selectedItemIds.join(',')
        }
      })
    }

    // async updateQuantity(item, newNum) {
    //   if (newNum < 1) return
    //   try {
    //     console.log('更新数量:', item, newNum)
    //     const res = await updateCartItem(item)
    //     if (res.code === 20000) {
    //       // item.num = newNum
    //       this.$message.success('数量已更新')
    //       await this.fetchCartItems()
    //     } else {
    //       this.$message.error('更新失败')
    //     }
    //   } catch (error) {
    //     this.$message.error('网络异常')
    //   }
    // },
    // async fetchCartItems() {
    //   const response = await getCartItems()
    //   if (response.code === 20000) {
    //     this.cartItems = response.data
    //   } else {
    //     this.$message.error('获取购物车数据失败')
    //   }
    // },
    // async deleteItem(id) {
    //   try {
    //     const res = await deleteCartItem(id)
    //     if (res.code === 20000) {
    //       this.$message.success('删除成功')
    //       this.fetchCartItems()
    //     } else {
    //       this.$message.error('删除失败')
    //     }
    //   } catch (error) {
    //     this.$message.error('发生错误')
    //   }
    // },
    // checkout() {
    //   this.$message.success('结算成功（这里只是示意，未实现后端处理）')
    //   // 可以在这里调用后端结算逻辑，比如清空购物车或生成订单
    // }
  }
}
</script>

<style scoped>
.cart-button {
  position: fixed;
  bottom: 30px;
  right: 30px;
  font-size: 22px;
  z-index: 2000;
}

.cart-item-card {
  margin-bottom: 12px;
  padding: 10px;
}

.item {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.item-img {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 6px;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.item-name {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.item-meta {
  font-size: 12px;
  color: #888;
  display: flex;
  justify-content: space-between;
}

.item-total {
  font-size: 14px;
  color: #f56c6c;
  font-weight: bold;
  margin-top: 4px;
}

.cart-summary {
  padding: 10px 10px 0 10px;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #eee;
}

.cart-total {
  color: #f56c6c;
}

.checkout {
  padding: 10px;
  text-align: center;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 5px;
}

</style>

