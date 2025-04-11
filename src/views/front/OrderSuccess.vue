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
        <div v-if="loading">
          <el-spinner />
          正在加载支付页面...
        </div>
        <!-- 替换掉原来的 v-html -->
        <div ref="paymentContainer" />
      </el-card>
    </el-main>
    <common-footer />
  </el-container>
</template>

<script>
import CommonHeader from '@/layout/components/CommonHeader.vue'
import CommonFooter from '@/layout/components/CommonFooter.vue'
import { alipay, checkpay } from '@/api/pay'

export default {
  name: 'OrderSuccess',
  components: { CommonHeader, CommonFooter },
  data() {
    return {
      orderIds: [],
      paymentHtml: '',
      loading: true
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

    this.fetchPaymentHtml()
  },
  methods: {
    async fetchPaymentHtml() {
      try {
        const orderIdsAsStrings = this.orderIds.map(id => String(id))
        const dataToSend = { orderIds: orderIdsAsStrings }

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
            this.$router.push('/')
          }
        }).catch(() => {
          this.$message.info('请尽快完成支付')
          // location.reload()
        })
      } catch (error) {
        this.$message.error('加载支付页面失败')
        console.error(error)
      } finally {
        this.loading = false
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
