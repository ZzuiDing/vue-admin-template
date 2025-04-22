<!-- src/views/orders/OrderPageBase.vue -->
<template>
  <div>
    <OrderTable
      :orders="orders"
      :status="status"
      @edit="handleEdit"
      @updateOrder="dealErs"
      @viewExpress="handleViewExpress"
    />

    <el-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :total="totalOrders"
      layout="total, prev, pager, next, jumper"
      class="mt-4"
      @current-change="handlePageChange"
    />

    <el-dialog :visible.sync="dialogVisible" title="订单详情">
      <EditOrder
        :order-data="currentOrder"
        :flag="flag"
        :status="status"
        @refreshTable="dealErs"
        @closeDialog="dialogVisible = false"
      />
    </el-dialog>
    <el-drawer
      title="快递详情"
      :visible.sync="expressDrawerVisible"
      size="50%"
      direction="rtl"
      custom-class="express-drawer"
      :modal="false"
      :with-header="true"
      :append-to-body="true"
      :lock-scroll="false"
    >
      <div v-if="expressInfo && expressInfo.result">
        <p><strong>快递公司：</strong>{{ expressInfo.result.expName }}</p>
        <p><strong>快递单号：</strong>{{ expressInfo.result.number }}</p>
        <el-timeline>
          <el-timeline-item
            v-for="(item, index) in expressInfo.result.list"
            :key="index"
            :timestamp="item.time"
          >
            {{ item.status }}
          </el-timeline-item>
        </el-timeline>
      </div>
      <div v-else>
        <p>暂无快递信息</p>
      </div>
    </el-drawer>

  </div>
</template>

<script>
import { getBuyerOrderList, getOrderList, getSellerOrderList } from '@/api/order'
import OrderTable from '@/components/order/OrderTable.vue'
import EditOrder from '@/components/order/EditOrder.vue'
import { express } from '@/api/express'

export default {
  name: 'OrderPageBase',
  components: { OrderTable, EditOrder },
  props: {
    status: String
  },
  data() {
    return {
      orders: [],
      totalOrders: 0,
      currentPage: 1,
      pageSize: 10,
      dialogVisible: false,
      currentOrder: null,
      flag: '',
      expressDrawerVisible: false,
      expressInfo: null
    }
  },
  mounted() {
    this.dealErs()
  },
  methods: {
    async handleViewExpress(expressNumber) {
      // try {
      //   const res = await express(this.form.expressId)
      //   if (res.code === 20000) {
      //     this.expressInfo = JSON.parse(res.data)
      //     this.expressDrawerVisible = true
      //   } else {
      //     this.$message.error('获取快递信息失败：' + res.message)
      //   }
      // } catch (err) {
      //   console.error(err)
      //   this.$message.error('请求出错，请稍后重试')
      // }
      try {
        const res = await express(expressNumber)
        if (res.code === 20000) {
          this.expressInfo = JSON.parse(res.data)
        } else {
          this.expressInfo = null
          this.$message.warning('未获取到快递信息：' + res.message)
        }
      } catch (err) {
        console.error('获取快递信息失败:', err)
        this.expressInfo = null
        this.$message.error('获取快递信息异常')
      }
      this.expressDrawerVisible = true
    },
    handlePageChange(page) {
      this.currentPage = page
      this.dealErs()
    },
    dealErs() {
      if (this.$route.path.includes('Buyer')) {
        this.fetchBuyerOrders()
        this.flag = 'buyer'
      } else if (this.$route.path.includes('Seller')) {
        this.fetchSellerOrders()
        this.flag = 'seller'
      } else {
        this.fetchOrders()
        this.flag = 'admin'
      }
    },
    async fetchOrders() {
      try {
        const res = await getOrderList({
          pageNum: this.currentPage,
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
    async fetchBuyerOrders() {
      try {
        const res = await getBuyerOrderList({
          pageNum: this.currentPage,
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
          pageNum: this.currentPage,
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
      this.currentOrder = order
      this.dialogVisible = true
    }
  }
}
</script>
