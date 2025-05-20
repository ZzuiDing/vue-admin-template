<!-- src/components/order/OrderTable.vue -->
<template>
  <div>
    <el-table :data="orders" style="width: 100%">
      <el-table-column prop="id" label="订单ID" width="100" />
      <el-table-column prop="buyerName" label="买方" />
      <el-table-column prop="sellerName" label="卖方" />
      <el-table-column prop="goodName" label="内容" />
      <el-table-column prop="amount" label="数量" width="50" />
      <el-table-column prop="date" label="日期" />
      <el-table-column prop="status" label="状态" width="100" />
      <el-table-column v-if="status!=='待支付'" prop="payMethod" label="支付方式" />
      <el-table-column prop="payAmount" label="金额" />
      <el-table-column
        v-if="status !== '待支付' && status !== '已支付'"
        prop="expressId"
        label="快递单号"
        min-width="200"
      >
        <template #default="{ row }">
          <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
            <span
              style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
              :title="row.expressId"
            >
              {{ row.expressId || '—' }}
            </span>
            <el-button
              v-if="row.expressId"
              type="primary"
              size="mini"
              icon="el-icon-search"
              style="margin-left: 8px; flex-shrink: 0;"
              @click="$emit('viewExpress', row.expressId)"
            >
              查看详情
            </el-button>
          </div>
        </template>
      </el-table-column>

      <el-table-column v-if="status!=='待支付'" prop="address" label="地址" />
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button v-if="(scope.row.status!=='待支付'&&scope.row.status!=='已取消')&&(flag==='seller'||flag==='admin')" size="mini" type="primary" @click="$emit('edit', scope.row)">编辑</el-button>
          <!--          <el-button size="mini" type="primary" @click="$router.push(`/orderSuccess?orderId=${scope.row.id}`)">支付</el-button>-->
          <el-button v-if="status==='待支付'" size="mini" type="primary" @click="pay(scope.row.id)">支付</el-button>
          <el-button v-if="flag==='buyer'" size="mini" type="primary" @click="$emit('edit',scope.row)">查看</el-button>
          <el-button v-if="flag==='buyer' && scope.row.status==='已发货'" size="mini" type="primary" @click="confirmOrder(scope.row.id)">确认签收</el-button>
          <el-button v-if="flag==='buyer' && (scope.row.status==='已支付'||scope.row.status==='已完成')" size="mini" type="primary" @click="openRefundDialog(scope.row.id)">申请退款</el-button>
          <el-button
            v-if="flag==='seller' && scope.row.status==='已支付'"
            size="mini"
            type="primary"
            @click="openExpressDialog(scope.row)"
          >添加快递单号
          </el-button>
          <el-button v-if="scope.row.status==='待支付'&&(flag==='buyer'||flag==='admin')" size="mini" type="danger" @click="cancel(scope.row.id)">取消订单</el-button>

        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogVisible" title="添加订单号" width="30%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="快递单号">
          <el-input v-model="form.expressId" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :visible.sync="RefundDialogVisible" title="申请退款" width="30%">
      <el-form ref="form" :model="RefundForm" label-width="80px">
        <el-form-item label="订单id">
          <el-input v-model="RefundForm.orderId" disabled />
        </el-form-item>
        <el-form-item label="申请原因">
          <el-input v-model="RefundForm.reason" type="textarea" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="RefundsubmitForm">提交</el-button>
          <el-button @click="RefundDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>

</template>

<script>
import { cancelOrder, deliverOrder, updateOrderStatus } from '@/api/order'
import { createRefund } from '@/api/refund'

export default {
  name: 'OrderTable',
  props: {
    orders: Array,
    status: String
  },
  data() {
    return {
      flag: '',
      dialogVisible: false,
      RefundDialogVisible: false,
      form: {
        expressId: '',
        id: null
      },
      RefundForm: {
        orderId: '',
        reason: ''
      }
    }
  },
  mounted() {
    console.log('status', this.status)
    this.judgeSeller()
  },
  methods: {
    async RefundsubmitForm() {
      console.log('退款申请', this.RefundForm)
      // this.$emit('RefundsubmitForm', this.RefundForm)
      // console.log('退款申请', this.RefundForm)
      const response = await createRefund(this.RefundForm)
      if (response.code === 20000) {
        this.$message.success('退款申请成功')
        this.$emit('updateOrder', response.data)
      } else {
        this.$message.error(response.message)
      }
      this.RefundDialogVisible = false
    },
    pay(id) {
      // console.log('支付', order)
      // this.$emit('pay', order)
      this.$router.push('/orderSuccess?orderId=' + id)
    },
    openRefundDialog(orderId) {
      this.RefundForm.orderId = orderId
      this.RefundDialogVisible = true
    },
    openExpressDialog(row) {
      this.form.id = row.id
      this.form.expresId = row.expresId || ''
      this.dialogVisible = true
    },
    judgeSeller() {
      // console.log('判断卖家', this.$route.path)
      if (this.$route.path.includes('Seller')) {
        this.flag = 'seller'
      } else if (this.$route.path.includes('Buyer')) {
        this.flag = 'buyer'
      } else {
        this.flag = 'admin'
      }
    },
    async cancel(id) {
      try {
        const response = await cancelOrder(id)
        if (response.code === 20000) {
          this.$message.success('订单取消成功')
          this.$emit('updateOrder', response.data)
        } else {
          this.$message.error(response.message)
        }
      } catch (err) {
        console.error(err)
        this.$message.error('failed')
      }
    },
    async submitForm() {
      try {
        const res = await deliverOrder(this.form.id, this.form.expressId)
        if (res.code === 20000) {
          this.$message.success('快递单号添加成功')
          this.dialogVisible = false
          this.$emit('updateOrder', res.data)
        } else {
          this.$message.error('提交失败：' + res.message)
        }
      } catch (err) {
        console.error('提交异常：', err)
        this.$message.error('提交失败，请稍后再试')
      }
    },
    confirmOrder(id) {
      this.$confirm('是否确认收货？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          const res = await updateOrderStatus(id, '已完成')
          if (res.code === 20000) {
            this.$message({
              type: 'success',
              message: '收货成功'
            })
            this.$emit('updateOrder', res.data)
          } else {
            this.$message.error('收货失败：' + res.message)
          }
        } catch (err) {
          console.error('收货异常:', err)
          this.$message.error('收货失败，请稍后重试')
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }
  }
}
</script>
