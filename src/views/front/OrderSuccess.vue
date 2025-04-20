<template>
  <el-container direction="vertical">
    <common-header
      title="✅ 订单提交成功"
      @goHome="goHome"
      @login="login"
      @backend="backend"
    />
    <el-main class="order-success">
      <el-card>
        <h2>请尽快完成支付</h2>
        <p>订单号：{{ orderIds }}</p>

        <!-- 支付方式选择 -->
        <el-radio-group v-model="selectedPaymentMethod">
          <el-radio label="wallet">系统钱包支付</el-radio>
          <el-radio label="alipay">支付宝支付</el-radio>
        </el-radio-group>

        <!-- 根据选择的支付方式显示不同内容 -->
        <div v-if="selectedPaymentMethod === 'alipay'" v-show="loading">
          <el-spinner />
          正在加载支付宝支付页面...
        </div>
        <div v-if="selectedPaymentMethod === 'wallet'" v-show="loading">
          <el-spinner />
          正在加载钱包支付页面...
        </div>

        <div v-show="!loading" ref="paymentContainer" v-html="paymentHtml" />
        <!--        //钱包余额-->
        <div v-if="selectedPaymentMethod === 'wallet'">
          <el-card>
            <h3>钱包余额：{{ walletBalance }}</h3>
            <p>请确保钱包余额足够支付订单金额</p>
          </el-card>
        </div>
        <!-- 支付按钮 -->
        <el-button type="primary" @click="handlePayment">立即支付</el-button>

        <el-button type="primary" @click="goHome">返回首页</el-button>
        <!--        <el-button type="primary" @click="login">登录</el-button>-->
        <el-button type="primary" @click="backend">管理后台</el-button>
      </el-card>
    </el-main>
    <common-footer />
  </el-container>
</template>

<script>
import CommonHeader from '@/layout/components/CommonHeader.vue'
import CommonFooter from '@/layout/components/CommonFooter.vue'
import { alipay, walletPay, checkpay } from '@/api/pay'
import { balance, pay } from '@/api/wallet'

export default {
  name: 'OrderSuccess',
  components: { CommonHeader, CommonFooter },
  data() {
    return {
      orderIds: [],
      paymentHtml: '',
      loading: true,
      selectedPaymentMethod: 'alipay', // 默认选中支付宝支付,
      walletBalance: 0 // 假设你有一个方法来获取钱包余额
    }
  },
  mounted() {
    console.log('OrderSuccess mounted', this.$route.query)

    // 获取 orderId，确保它是一个数组
    const orderId = this.$route.query.orderId

    if (!orderId) {
      this.$message.error('订单ID缺失')
      console.error('订单ID缺失')
      this.$router.push('/')
      return
    }

    // 确保 orderIds 是数组，如果是单个订单ID（数字或字符串），转换为数组
    this.orderIds = Array.isArray(orderId) ? orderId : [orderId]

    // 初始加载支付页面
    // this.fetchPaymentHtml()

    this.fetchWalletBalance()
  },
  methods: {
    // 支付按钮点击事件
    async handlePayment() {
      this.loading = true // 显示加载状态
      const orderIdsAsStrings = this.orderIds.map(id => String(id))
      const dataToSend = { orderIds: orderIdsAsStrings }
      try {
        if (this.selectedPaymentMethod === 'alipay') {
          // 支付宝支付
          const res = await alipay(dataToSend)

          // 创建一个新窗口并写入支付 HTML
          const newWin = window.open('', '_blank')
          newWin.document.open()
          newWin.document.write(res.data) // 写入 form 和 script
          console.log(newWin.document)
          newWin.document.close()

          // 弹出确认支付完成弹窗
          this.$confirm('是否已完成支付？', '支付确认', {
            confirmButtonText: '已完成',
            cancelButtonText: '未完成',
            type: 'warning'
          }).then(async() => {
            const response = await checkpay({ orderIds: orderIdsAsStrings })
            if (response.code !== 20000) {
              this.$message.error('支付失败或订单不存在')
              // 刷新页面
              location.reload()
            } else {
              this.$message.success('支付成功！')
              this.$router.push('/BuyerOrder/paid')
            }
          }).catch(() => {
            this.$message.info('请尽快完成支付')
            // location.reload()
          })
        } else if (this.selectedPaymentMethod === 'wallet') {
          // 系统钱包支付
          const res = await pay(dataToSend)
          if (res.code !== 20000) {
            // this.$message.error('支付失败或订单不存在')
            this.$message.error(res.message)
            // 刷新页面
            // location.reload()
            // 处理系统钱包支付逻辑，显示支付页面
            // this.paymentHtml = res.data
          } else {
            this.$message.success('支付成功！')
            // this.$router.push('/')
          }
        }
      } catch (error) {
        this.$message.error('加载支付页面失败')
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    async fetchWalletBalance() {
      try {
        const res = await balance()
        if (res.code === 20000) {
          this.walletBalance = res.data
        } else {
          this.$message.error('获取钱包余额失败')
        }
      } catch (error) {
        console.error('获取钱包余额失败', error)
      }
    },
    // 获取支付页面
    async fetchPaymentHtml() {
      // 获取支付页面 HTML 内容（在支付按钮点击之前可选择不调用）
      const orderIdsAsStrings = this.orderIds.map(id => String(id))
      const dataToSend = { orderIds: orderIdsAsStrings }

      if (this.selectedPaymentMethod === 'alipay') {
        // 预加载支付宝支付 HTML
        const res = await alipay(dataToSend)
        this.paymentHtml = res.data
      } else if (this.selectedPaymentMethod === 'wallet') {
        // 预加载钱包支付 HTML
        const res = await walletPay(dataToSend)
        this.paymentHtml = res.data
      }
    },

    goHome() {
      this.$router.push('/')
    },
    login() {
      this.$router.push('/login')
    },
    backend() {
      this.$router.push('/backend/dashboard')
    }
  }
}
</script>

<style scoped>
.order-success {
  padding: 40px;
}
</style>
