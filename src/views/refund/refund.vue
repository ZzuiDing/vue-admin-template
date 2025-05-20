<template>
  <div>
    <el-input v-model="input" placeholder="请输入退款原因关键词" style="width: 200px; margin-bottom: 20px;" />
    <el-button type="primary" @click="handleSearch">搜索</el-button>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="ID" min-width="60" />
      <el-table-column prop="orderId" label="订单ID" min-width="100">
        <template #default="scope">
          <el-button
            type="text"
            @click="orderdetail(scope.row.orderId)"
          >{{ scope.row.orderId }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="reason" label="退款原因" min-width="180" />
      <el-table-column prop="status" label="状态" min-width="100" />
      <el-table-column prop="express" label="快递单号" min-width="180">
        <template #default="scope">
          <div style="display: flex; align-items: center;">
            <span style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              {{ scope.row.express || '—' }}
            </span>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-search"
              style="margin-left: 8px;"
              :disabled="!scope.row.express"
              @click="getExpressDetail(scope.row.express)"
            >
              查看
            </el-button>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作" min-width="180">
        <template #default="scope">
          <el-button
            v-if="scope.row.status === '申请中' && flag === 'seller'"
            size="mini"
            type="success"
            @click="openHandleDialog(scope.row)"
          >处理
          </el-button>
          <el-button
            v-if="scope.row.status === '申请中' && flag === 'seller'"
            size="mini"
            type="primary"
            @click="accept(scope.row.id)"
          >通过申请
          </el-button>
          <el-button
            v-if="scope.row.status === '申请中' && flag === 'seller'"
            size="mini"
            type="primary"
            @click="decline(scope.row.id)"
          >拒绝申请
          </el-button>
          <el-button
            v-if="scope.row.status === '申请中' && flag === 'buyer'"
            size="mini"
            type="success"
            @click="openHandleDialog(scope.row)"
          >查看
          </el-button>
          <el-button v-if="scope.row.status === '申请中'" size="mini" type="danger" @click="cancel(scope.row.id)">取消
          </el-button>
          <el-button
            v-if="(scope.row.status === '处理中' && flag === 'buyer') && scope.row.express === ''"
            size="mini"
            type="primary"
            @click="openExpressDialog(scope.row)"
          >添加快递单号
          </el-button>
          <el-button
            v-if="scope.row.status === '处理中' && flag === 'seller' && scope.row.express !== ''"
            size="mini"
            type="danger"
            @click="commit(scope.row.id)"
          >确认退款
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      v-if="totalRecords > pageSize"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="totalRecords"
      layout="total, prev, pager, next, jumper"
      @current-change="handlePageChange"
    />

    <el-dialog :visible.sync="dialogVisible" title="处理退款" width="50%" @close="closeDialog">
      <RefundForm
        :refund-data="selectedRefund"
        @closeDialog="closeDialog"
        @refreshTable="fetchBuyerRefunds"
      />
    </el-dialog>
    <el-dialog :visible.sync="OrderdialogVisible" title="查看订单详情" width="50%" @close="OrderdialogVisible = false">
      <edit-order
        :order-data="orderdata"
        :flag="flag"
        @closeDialog="OrderdialogVisible = false"
      />
    </el-dialog>
    <el-dialog :visible.sync="ExpressdialogVisible" title="添加订单号" width="30%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="快递单号">
          <el-input v-model="form.express" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitExpress(form.id, form.express)">提交</el-button>
          <el-button @click="ExpressdialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
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
import RefundForm from './RefundForm.vue'
import {
  getBuyerRefund,
  cancelRefund,
  getSellerRefund,
  acceptRefund,
  addExpress,
  commit,
  declineRefund, getALLRefund
} from '@/api/refund'
import EditOrder from '@/components/order/EditOrder.vue'
import { getOrderDetail } from '@/api/order'
import { express } from '@/api/express'

export default {
  components: { EditOrder, RefundForm: RefundForm },
  data() {
    return {
      input: '',
      tableData: [],
      dialogVisible: false,
      selectedRefund: null,
      OrderdialogVisible: false,
      orderdata: {},
      flag: '',
      expressInfo: {
        result: {
          expName: '',
          number: '',
          list: []
        }
      },
      ExpressdialogVisible: false,
      form: {
        express: '',
        id: null
      },
      totalRecords: 0, // 总记录数
      currentPage: 1, // 当前页
      pageSize: 10, // 每页显示的数量
      expressDrawerVisible: false
    }
  },
  watch: {
    expressDrawerVisible(val) {
      if (!val) {
        this.expressInfo = {
          result: {
            expName: '',
            number: '',
            list: []
          }
        }
      }
    }
  },
  mounted() {
    this.dealErs()
  },
  methods: {
    async getExpressDetail(id) {
      try {
        const res = await express(id, this.$store.state.user.phone)
        if (res.code === 20000) {
          this.expressInfo = JSON.parse(res.data)
          this.expressDrawerVisible = true
        } else {
          this.$message.error('获取快递信息失败：' + res.message)
        }
      } catch (err) {
        console.error(err)
        this.$message.error('请求出错，请稍后重试')
      }
    },
    async decline(id) {
      this.$confirm('确定拒绝该退款申请吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        declineRefund(id).then(res => {
          if (res.code === 20000) {
            this.$message.success('处理成功')
            this.dealErs()
          } else {
            this.$message.error(res.message || '处理失败')
          }
        })
      }).catch(() => {
      })
    },
    async commit(id) {
      const res = await commit(id)
      if (res.code === 20000) {
        this.$message.success('退款成功')
        this.dealErs()
      } else {
        this.$message.error(res.message || '退款失败')
      }
    },
    async submitExpress(id, express) {
      const res = await addExpress(id, express)
      if (res.code === 20000) {
        this.$message.success('添加快递单号成功')
        this.dealErs()
      } else {
        this.$message.error(res.message || '添加快递单号失败')
      }
      this.ExpressdialogVisible = false
    },
    openExpressDialog(row) {
      this.form.id = row.id
      this.form.expressId = row.expressId || ''
      this.ExpressdialogVisible = true
    },
    accept(id) {
      this.$confirm('确定通过该退款申请吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        acceptRefund(id).then(res => {
          if (res.code === 20000) {
            this.$message.success('处理成功')
            this.dealErs()
          } else {
            this.$message.error(res.message || '处理失败')
          }
        })
      }).catch(() => {
      })
    },
    cancel(id) {
      this.$confirm('确定取消该退款吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        cancelRefund(id).then(res => {
          if (res.code === 20000) {
            this.$message.success('取消成功')
            this.dealErs()
          } else {
            this.$message.error(res.message || '取消失败')
          }
        })
      }).catch(() => {
      })
    },
    dealErs() {
      if (this.$route.path.includes('Buyer')) {
        this.fetchBuyerRefunds()
        this.flag = 'buyer'
      } else if (this.$route.path.includes('Seller')) {
        this.fetchSellerRefunds()
        this.flag = 'seller'
      } else {
        this.fetchALLRefunds()
        this.flag = 'admin'
      }
    },
    async orderdetail(orderId) {
      this.OrderdialogVisible = true
      await getOrderDetail(orderId).then(res => {
        if (res.code === 20000) {
          this.orderdata = res.data
        } else {
          this.$message.error('获取订单详情失败')
          return {}
        }
      })
    },
    async fetchBuyerRefunds() {
      try {
        const res = await getBuyerRefund({ page: this.currentPage, size: this.pageSize })
        if (res.code === 20000) {
          this.tableData = res.data.records
          this.totalRecords = res.data.total // 总记录数
          console.log('totalRecords', this.totalRecords)
        } else {
          this.$message.error(res.message || '获取退款数据失败')
        }
      } catch (error) {
        console.error(error)
        this.$message.error('网络错误')
      }
    },
    async fetchSellerRefunds() {
      try {
        const res = await getSellerRefund({ page: this.currentPage, size: this.pageSize })
        if (res.code === 20000) {
          this.tableData = res.data.records
          this.totalRecords = res.data.total // 总记录数
        } else {
          this.$message.error(res.message || '获取退款数据失败')
        }
      } catch (error) {
        console.error(error)
        this.$message.error('网络错误')
      }
    },
    async fetchALLRefunds() {
      try {
        const res = await getALLRefund({ page: this.currentPage, size: this.pageSize })
        if (res.code === 20000) {
          this.tableData = res.data.records
          this.totalRecords = res.data.total // 总记录数
        } else {
          this.$message.error(res.message || '获取退款数据失败')
        }
      } catch (error) {
        console.error(error)
        this.$message.error('网络错误')
      }
    },
    handleSearch() {
      this.tableData = this.tableData.filter(item =>
        item.reason.includes(this.input)
      )
    },
    openHandleDialog(row) {
      this.selectedRefund = { ...row }
      this.dialogVisible = true
    },
    closeDialog() {
      this.dialogVisible = false
      this.selectedRefund = null
    },
    async deleteRefund(row) {
      try {
        await this.$confirm('确定删除该退款记录吗？', '提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        })

        const res = 'await deleteRefundById(row.id)'
        if (res.code === 20000) {
          this.$message.success('删除成功')
          await this.fetchBuyerRefunds()
        } else {
          this.$message.error(res.message)
        }
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('删除失败')
        }
      }
    },
    handlePageChange(page) {
      this.currentPage = page
      console.log('当前页:', this.currentPage)
      console.log('actual page:', page)
      this.dealErs() // 重新加载分页数据
    }
  }
}
</script>
