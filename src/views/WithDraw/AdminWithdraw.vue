<template>
  <div>
    <el-table :data="requests" stripe>
      <el-table-column prop="id" label="申请ID" width="80" />
      <el-table-column prop="userId" label="用户ID" width="100" />
      <el-table-column prop="amount" label="金额" />
      <el-table-column prop="status" label="状态" />
      <el-table-column label="操作" width="160">
        <template #default="{ row }">
          <el-button
            size="small"
            type="success"
            :disabled="row.status !== '待审核'"
            @click="confirm(row.id)"
          >
            审核通过
          </el-button>
        </template>
      </el-table-column>
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
import { getWithdrawRequests, confirmWithdraw } from '@/api/withdraw'

export default {
  data() {
    return {
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
    loadRequests() {
      getWithdrawRequests({ pageNum: 1, pageSize: 100 }).then(res => {
        this.requests = res.data.records
      })
    },
    confirm(id) {
      this.$confirm('确认要通过该申请吗？', '提示', {
        type: 'warning'
      }).then(() => {
        confirmWithdraw(id).then(() => {
          this.$message.success('审核通过')
          this.loadRequests()
        })
      })
    },
    handlePageChange(newPage) {
      this.pageNum = newPage
      this.loadRequests()
    }

  }
}
</script>
