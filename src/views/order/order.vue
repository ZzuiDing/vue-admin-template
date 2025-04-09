<template>
  <div>
    <el-input v-model="input" placeholder="请输入订单ID" style="width: 200px; margin-bottom: 20px;" />
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
          <el-button size="mini" type="primary" @click="openEditDialog(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteOrder(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

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
import axios from 'axios'
import EditOrder from '@/views/order/editOrder.vue'

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
        const response = await axios.get('http://localhost:9090/spba-api/order/getOrderList')
        if (response.data.code === 20000) {
          this.tableData = response.data.data
        } else {
          this.$message.error('获取订单数据失败: ' + response.data.message)
        }
      } catch (error) {
        console.error('获取订单数据失败:', error)
      }
    },
    handleSearch() {
      console.log('搜索订单ID:', this.input)
      // 如果有搜索接口可调用如下：
      // axios.get('/api/order/search', { params: { id: this.input } })
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
      this.$confirm('确定删除该订单吗?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          const response = await axios.post(`http://localhost:9090/spba-api/order/deleteOrder?id=${order.id}`)
          if (response.data.code !== 20000) {
            throw new Error(response.data.message)
          }
          this.$message.success('删除成功！')
          this.fetchData()
        } catch (error) {
          this.$message.error('删除失败: ' + (error.message || '服务器错误'))
        }
      })
    }
  }
}
</script>

<style scoped>
/* 样式同之前的用户管理样式 */
</style>
