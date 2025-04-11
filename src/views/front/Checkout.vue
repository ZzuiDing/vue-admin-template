<template>
  <el-container direction="vertical">
    <common-header
      title="🛒 我的购物车"
      @goHome="home"
      @login="login"
      @backend="backend"
    />
    <el-main margin="50px">
      <div class="checkout-page">
        <h2>🧾 结算信息</h2>
        <el-card class="address-card">
          <div class="address-header">
            <strong>收货地址</strong>
            <el-button type="text" @click="selectAddress">选择其他地址</el-button>
            <address-select
              v-model="showAddressSelect"
              @confirm="onAddressConfirm"
            />

          </div>
          <p>{{ currentAddress.name }}  {{ currentAddress.phone }}</p>
          <p>{{ currentAddress.address }}</p>
        </el-card>
        <el-card v-for="item in NewcartItems" :key="item.id" class="checkout-item">
          <div class="item-info">
            <img :src="item.picture" class="item-img">
            <div class="item-detail">
              <p><strong>{{ item.name }}</strong></p>
              <p>单价：¥{{ item.price }}</p>
              <p>数量：{{ item.num }}</p>
              <p>小计：¥{{ item.num * item.price }}</p>
            </div>
          </div>
        </el-card>

        <div class="total-section">
          <p>总金额：<strong style="color: #f56c6c;">¥{{ totalAmount }}</strong></p>
          <el-button type="primary" @click="submitOrder">提交订单</el-button>
        </div>
      </div>
    </el-main>
    <CommonFooter />
  </el-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import CommonHeader from '@/layout/components/CommonHeader.vue'
import CommonFooter from '@/layout/components/CommonFooter.vue'
import { addOrder } from '@/api/order'
import AddressSelect from '@/layout/components/AddressSelect.vue'

export default {
  name: 'CheckoutPage',
  components: { CommonFooter, CommonHeader, AddressSelect },
  data() {
    return {
      selectedIds: [],
      NewcartItems: [],
      currentAddress: {},
      showAddressSelect: false
    }
  },
  computed: {
    ...mapState('cart', ['cartItems']),
    ...mapGetters('cart', ['totalAmount'])
  },
  mounted() {
    const idStr = this.$route.query.ids || ''
    this.selectedIds = idStr.split(',').map(id => parseInt(id))
    console.log('选中的商品ID:', this.selectedIds)
    // 拉取购物车数据后过滤只展示选中的
    this.$store.dispatch('cart/fetchCart').then(() => {
      this.NewcartItems = this.$store.state.cart.cartItems.filter(item =>
        this.selectedIds.includes(item.id)
      )
    })
  },
  methods: {
    async submitOrder() {
      try {
        if (this.selectedIds.length === 0) {
          return this.$message.warning('请先选择要结算的商品')
        }
        if (!this.currentAddress.id) {
          return this.$message.warning('请先选择收货地址')
        }
        console.log('提交订单:', this.selectedIds, this.currentAddress.id)
        const res = await addOrder(this.selectedIds, this.currentAddress.id)
        if (res.code === 20000) {
          this.$message.success('订单提交成功')
          this.$router.push({
            path: 'orderSuccess',
            query: {
              orderId: res.data
            }
          }) // 可跳转到成功页
        } else {
          this.$message.error('提交失败')
        }
      } catch (e) {
        this.$message.error('网络异常')
      }
    },
    // selectAddress() {
    //   this.$message.info('此处可打开地址选择弹窗')
    //   // 示例：修改当前地址
    //   this.currentAddress = {
    //     name: '李四',
    //     phone: '13911112222',
    //     fullAddress: '上海市浦东新区世纪大道200号'
    //   }
    // },
    selectAddress() {
      this.showAddressSelect = true
    },
    onAddressConfirm(addr) {
      this.currentAddress = addr
    },
    home() {
      this.$router.push('/')
    },
    login() {
      this.$router.push('/login')
    },
    backend() {
      this.$router.push('/backend')
    }
  }
}
</script>

<style scoped>
.checkout-page {
  padding: 20px;
}

.checkout-item {
  margin-bottom: 10px;
}

.item-info {
  display: flex;
  gap: 12px;
}

.item-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.item-detail {
  flex: 1;
}

.total-section {
  text-align: right;
  margin-top: 20px;
}

.address-card {
  margin-bottom: 20px;
}

.address-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

</style>
