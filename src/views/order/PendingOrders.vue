<!-- src/views/orders/PendingPayment.vue -->
<template>
  <div>
    <OrderTable :orders="orders" :status="'待支付'" @edit="handleEdit" @updateOrder="dealErs" />
    <el-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :total="totalOrders"
      layout="total, prev, pager, next, jumper"
      class="mt-4"
      @current-change="handlePageChange"
    />
    <el-dialog :visible.sync="dialogVisible" title="订单详情">
      <EditOrder :order-data="currentOrder" :flag="flag" @refreshTable="dealErs" @closeDialog="dialogVisible = false" />
    </el-dialog>
  </div>
</template>

<script>
import { getBuyerOrderList, getOrderList, getSellerOrderList } from '@/api/order'
import OrderTable from '@/components/order/OrderTable.vue'
import EditOrder from '@/components/order/EditOrder.vue'

export default {
  name: 'PendingPayment',
  components: { OrderTable, EditOrder },
  data() {
    return {
      orders: [],
      currentOrder: null,
      dialogVisible: false,
      flag: '',
      totalOrders: 0,
      currentPage: 1,
      pageSize: 10,
      status: '待支付'
    }
  },
  computed: {
  },
  mounted() {
    this.dealErs()
  },
  methods: {
    handlePageChange(page) {
      this.currentPage = page
      this.dealErs()
    },
    dealErs() {
      if (this.$route.path.includes('Buyer')) {
        this.fetchBuyerOrders()
        this.flag = 'buyer'
      } else if (this.$route.path.includes('seller')) {
        this.fetchSellerOrders()
        this.flag = 'seller'
      } else {
        this.fetchOrders()
        this.flag = 'admin'
      }
    },
    async fetchOrders() {
      try {
        const res = await getOrderList()
        if (res.code === 20000) {
          this.orders = res.data.records
        } else {
          this.$message.error('订单加载失败：' + res.message)
        }
      } catch (err) {
        console.error('订单获取异常:', err)
        this.$message.error('获取订单失败，请稍后重试')
      }
    },
    async fetchBuyerOrders() {
      try {
        const res = await getBuyerOrderList({
          page: this.currentPage,
          pageSize: this.pageSize,
          status: this.status
        })
        if (res.code === 20000) {
          this.orders = res.data.records
          this.totalOrders = res.data.total
        } else {
          this.$message.error('订单加载失败：' + res.message)
        }
      } catch (err) {
        console.error('订单获取异常:', err)
        this.$message.error('获取订单失败，请稍后重试')
      }
    },
    async fetchSellerOrders() {
      try {
        const res = await getSellerOrderList({
          page: this.currentPage,
          pageSize: this.pageSize,
          status: this.status
        })
        if (res.code === 20000) {
          this.orders = res.data.records
          this.totalOrders = res.data.total
        } else {
          this.$message.error('订单加载失败：' + res.message)
        }
      } catch (err) {
        console.error('订单获取异常:', err)
        this.$message.error('获取订单失败，请稍后重试')
      }
    },
    handleEdit(order) {
      console.log('Editing order:', order)
      this.currentOrder = order
      this.dialogVisible = true
    }
  }
}
</script>
