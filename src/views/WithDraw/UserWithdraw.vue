<template>
  <div>
    <el-form :model="form" label-width="80px" class="withdraw-form">
      <el-form-item label="提现金额">
        <el-input v-model="form.amount" placeholder="请输入提现金额" type="number" />
      </el-form-item>
      <el-button type="primary" @click="submitRequest">提交申请</el-button>
      <h3>您目前的钱包余额：  {{ wealth }}</h3><p>提现金额100起</p>
    </el-form>

    <el-table :data="requests" stripe style="margin-top: 30px">
      <el-table-column prop="id" label="申请ID" width="80" />
      <el-table-column prop="amount" label="金额" />
      <el-table-column prop="status" label="状态" />
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next, total"
      :current-page="pageNum"
      :page-size="pageSize"
      :total="total"
      style="margin-top: 20px; text-align: right"
      @current-change="handlePageChange"
    />

  </div>
</template>

<script>
import { getWithdrawRequests, generateWithdraw } from '@/api/withdraw'
import { userinfo } from '@/api/user'

export default {
  data() {
    return {
      form: {
        amount: null
      },
      wealth: 0,
      requests: [],
      pageNum: 1,
      pageSize: 10,
      total: 0
    }
  },
  created() {
    this.loadRequests()
  },
  methods: {
    async loadRequests() {
      const res = await getWithdrawRequests({
        pageNum: this.pageNum,
        pageSize: this.pageSize
      })
      if (res.code === 20000) {
        this.requests = res.data.records
        this.total = res.data.total
      } else {
        this.$message.error('获取提现记录失败')
      }

      const response2 = await userinfo()
      if (response2.code !== 20000) {
        this.$message.error('获取用户信息失败')
      } else {
        this.wealth = response2.data.wealth
      }
    },
    handlePageChange(newPage) {
      this.pageNum = newPage
      this.loadRequests()
    },

    submitRequest() {
      if (!this.form.amount || this.form.amount <= 0) {
        this.$message.error('请输入有效的提现金额')
        return
      } else if (this.form.amount <= 100) {
        this.$message.error('提现金额必须大于100')
        return
      } else if (this.form.amount > this.wealth) {
        this.$message.error('提现金额不能超过钱包余额')
        return
      }
      generateWithdraw(this.form).then(() => {
        this.$message.success('申请成功')
        this.form.amount = null
        this.loadRequests()
      })
    }
  }
}
</script>
