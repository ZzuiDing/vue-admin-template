<template>
  <div>
    <!-- 错误日志表格 -->
    <el-table :data="logData" style="width: 100%; margin-top: 10px;">
      <el-table-column prop="id" label="日志ID" width="80" />
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column prop="method" label="请求方式" width="120" />
      <el-table-column prop="message" label="错误信息" width="750" />
      <el-table-column prop="url" label="请求URL" width="200" />
      <el-table-column label="操作" width="80">
        <template #default="scope">
          <el-button size="mini" type="primary" @click="handleView(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
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

    <!-- 错误详情对话框 -->
    <el-dialog
      :visible.sync="dialogVisible"
      title="错误日志详情"
      width="50%"
      @close="dialogClosed"
    >
      <div>
        <p><strong>日志ID:</strong> {{ selectedLog.id }}</p>
        <p><strong>创建时间:</strong> {{ selectedLog.createTime }}</p>
        <p><strong>请求方式:</strong> {{ selectedLog.method }}</p>
        <p><strong>错误信息:</strong> {{ selectedLog.message }}</p>
        <p><strong>请求URL:</strong> {{ selectedLog.url }}</p>
      </div>
      <template #footer>
        <el-button @click="dialogClosed">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getErrorLogs } from '@/api/log'

export default {
  name: 'ErrorLogManagement',
  data() {
    return {
      logData: [], // 日志数据
      currentPage: 1, // 当前页数
      pageSize: 10, // 每页数据条数
      total: 0, // 总记录数
      dialogVisible: false, // 对话框是否可见
      selectedLog: {} // 当前选中的日志
    }
  },
  mounted() {
    this.fetchLogs() // 初始化加载数据
  },
  methods: {
    // 获取错误日志数据
    async fetchLogs() {
      try {
        const params = {
          page: this.currentPage,
          size: this.pageSize
        }
        const res = await getErrorLogs(params)
        if (res.code === 20000) {
          this.logData = res.data.records
          this.total = res.data.total
        } else {
          this.$message.error('获取日志数据失败：' + res.message)
        }
      } catch (err) {
        console.error('获取日志数据失败:', err)
        this.$message.error('获取日志数据失败')
      }
    },
    // 页码变化时触发
    handlePageChange(page) {
      this.currentPage = page
      this.fetchLogs()
    },
    // 每页数据条数变化时触发
    handleSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this.fetchLogs()
    },
    // 查看日志详情
    handleView(log) {
      this.selectedLog = log
      this.dialogVisible = true
    },
    // 关闭对话框
    dialogClosed() {
      this.dialogVisible = false
      this.selectedLog = {}
    }
  }
}
</script>

<style scoped>
/* 如需样式，可在此添加 */
</style>
