<template>
  <div>
    <el-table :data="tableData" style="width: 100%; margin-top: 10px;">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="username" label="用户名" width="150" />
      <el-table-column prop="method" label="请求方法" width="100" />
      <el-table-column prop="url" label="请求URL" width="200" />
      <el-table-column prop="ip" label="IP地址" width="180" />
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button size="mini" type="primary" @click="handleView(scope.row)">查看</el-button>
          <!--          <el-button size="mini" type="danger" style="margin-left: 10px;" @click="handleDelete(scope.row)">删除-->
          <!--          </el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="margin-top: 20px; text-align: right;"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :current-page="currentPage"
      :page-size="pageSize"
      :page-sizes="[5, 10, 20, 50]"
      :total="total"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
    />
    <el-dialog
      :visible.sync="dialogVisible"
      title="查看日志"
      width="50%"
      @close="dialogClosed"
    >
      <div v-if="selectedLog">
        <p><strong>请求方法:</strong> {{ selectedLog.method }}</p>
        <p><strong>请求URL:</strong> {{ selectedLog.url }}</p>
        <p><strong>参数:</strong> {{ selectedLog.params }}</p>
        <p><strong>创建时间:</strong> {{ selectedLog.createTime }}</p>
        <p><strong>IP地址:</strong> {{ selectedLog.ip }}</p>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getOperateLogs } from '@/api/log' // 假设有这个API接口

export default {
  name: 'OperationLogs',
  data() {
    return {
      tableData: [], // 操作日志数据
      dialogVisible: false, // 控制弹窗显示
      selectedLog: null, // 当前选中的日志
      currentPage: 1, // 当前页码
      pageSize: 5, // 每页显示记录数
      total: 0 // 总记录数
    }
  },
  mounted() {
    this.fetchLogs()
  },
  methods: {
    // 获取操作日志数据
    async fetchLogs() {
      try {
        const params = {
          page: this.currentPage,
          size: this.pageSize
        }
        const res = await getOperateLogs(params)
        if (res.code === 20000) {
          // 在获取操作日志后，确保日志数据完整性
          if (Array.isArray(res.data.records) && res.data.records.length > 0) {
            this.tableData = res.data.records.map(log => ({
              method: log?.method || '未知',
              url: log?.url || '未知',
              ip: log?.ip || '未知',
              createTime: log?.createTime || '未知',
              params: log?.params || '{}',
              username: log?.username || '未知'
            }))
          } else {
            this.tableData = []
            console.warn('没有找到操作日志')
          }
          console.log(this.tableData) // 确认 data 是正确填充的
          this.total = res.data.total
        } else {
          this.$message.error('获取操作日志失败：' + res.message)
        }
      } catch (err) {
        console.error('获取操作日志失败:', err)
        this.$message.error('获取操作日志失败')
      }
    },

    // 分页页码改变时
    handlePageChange(page) {
      this.currentPage = page
      this.fetchLogs()
    },

    // 每页记录数改变时
    handleSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this.fetchLogs()
    },

    // 查看日志的弹窗
    handleView(log) {
      this.selectedLog = log
      this.dialogVisible = true
    },

    // 关闭弹窗
    dialogClosed() {
      this.dialogVisible = false
      this.selectedLog = null
    }

    // // 删除操作日志
    // async handleDelete(log) {
    //   try {
    //     await this.$confirm('确定删除该日志吗？', '提示', {
    //       confirmButtonText: '删除',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     })
    //     const res = await deleteOperateLogById(log.id)
    //     if (res.code === 20000) {
    //       this.$message.success('删除成功')
    //       this.fetchLogs() // 刷新数据
    //     } else {
    //       this.$message.error('删除失败：' + res.message)
    //     }
    //   } catch (err) {
    //     if (err !== 'cancel') {
    //       console.error('删除失败:', err)
    //       this.$message.error('删除失败：' + (err.message || '未知错误'))
    //     }
    //   }
    // }
  }
}
</script>

<style scoped>
/* 这里可以添加一些自定义样式 */
</style>
