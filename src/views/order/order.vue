<template>
  <div>
    <el-input
      v-model="input"
      placeholder="请输入订单ID"
      style="width: 200px; margin-bottom: 20px;"
    />
    <el-button type="primary" @click="handleSearch">搜索</el-button>
    <el-button plain @click="openAddDialog()">新增订单</el-button>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="订单ID" min-width="60" />
      <el-table-column prop="buyer" label="买方" min-width="60" />
      <el-table-column prop="seller" label="卖方" min-width="60" />
      <el-table-column prop="content" label="内容" min-width="120" />
      <el-table-column prop="amount" label="购买数量" min-width="120" />
      <el-table-column prop="date" label="日期" min-width="180" />
      <el-table-column prop="status" label="当前状态" min-width="100" />
      <el-table-column prop="payMethod" label="支付方式" min-width="80" />
      <el-table-column prop="payAmount" label="支付金额" min-width="80" />
      <el-table-column prop="expressId" label="快递号" min-width="80" />
      <el-table-column prop="address" label="地址" min-width="80" />
      <el-table-column label="操作" min-width="200">
        <template #default="scope">
          <el-button
            size="mini"
            type="primary"
            @click="openEditDialog(scope.row)"
          >编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            style="margin-left: 10px;"
            @click="deleteOrder(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗：新增/编辑订单 -->
    <el-dialog
      :visible.sync="dialogFormVisible"
      :title="editOrder ? '编辑订单' : '新增订单'"
      width="50%"
      @before-close="dialogClosed"
    >
      <EditOrder
        :order-data="editOrder"
        @closeDialog="dialogClosed"
        @refreshTable="fetchData"
      />
    </el-dialog>
  </div>
</template>

<script>
import EditOrder from '@/views/order/editOrder.vue'
import {
  getOrderList,
  deleteOrderById
} from '@/api/order'

export default {
  components: { EditOrder },
  data() {
    return {
      input: '',
      tableData: [],
      dialogFormVisible: false,
      editOrder: null
    }
  },
  watch: {
    dialogFormVisible(val) {
      if (!val) {
        this.editOrder = null
      }
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      try {
        const res = await getOrderList()
        if (res.code === 20000) {
          this.tableData = res.data
        } else {
          this.$message.error('获取订单数据失败: ' + res.message)
        }
      } catch (error) {
        console.error('获取订单数据失败:', error)
        this.$message.error('获取订单数据失败')
      }
    },
    handleSearch() {
      console.log('搜索订单ID:', this.input)
      // TODO: 如果有后台搜索接口，可调用：
      // const res = await searchOrderById(this.input)
    },
    openAddDialog() {
      this.editOrder = null
      this.dialogFormVisible = true
    },
    openEditDialog(order) {
      this.editOrder = { ...order }
      this.dialogFormVisible = true
    },
    dialogClosed() {
      this.dialogFormVisible = false
      this.editOrder = null
    },
    async deleteOrder(order) {
      try {
        await this.$confirm('确定删除该订单吗?', '提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await deleteOrderById(order.id)
        if (res.code === 20000) {
          this.$message.success('删除成功！')
          this.fetchData()
        } else {
          this.$message.error('删除失败: ' + res.message)
        }
      } catch (err) {
        if (err !== 'cancel') {
          console.error('删除失败:', err)
          this.$message.error('删除失败: ' + (err.message || '服务器错误'))
        }
      }
    }
  }
}
</script>

<style scoped>
/* 可以按需添加样式 */
</style>
