<template>
  <div>
    <el-input
      v-model="input"
      placeholder="请输入用户名"
      style="width: 200px; margin-bottom: 20px;"
      @input="handleSearch"
    />
    <el-button type="primary" @click="handleSearch">搜索</el-button>
    <el-button plain @click="openAddDialog()">新增用户</el-button>

    <el-table :data="tableData" style="width: 100%; margin-top: 10px;">
      <el-table-column prop="id" label="ID" min-width="60" />
      <el-table-column prop="image" label="头像" min-width="120">
        <template #default="scope">
          <el-image
            style="width: 60px; height: 60px"
            :src="scope.row.image"
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="用户名" min-width="120" />
      <el-table-column prop="email" label="邮箱" min-width="180" />
      <el-table-column prop="gender" label="性别" min-width="30" />
      <el-table-column prop="phone" label="电话" min-width="60" />
      <el-table-column prop="wealth" label="钱包余额" min-width="100" />
      <el-table-column prop="role" label="角色" min-width="100">
        <template #default="scope">
          <span>{{ scope.row.role === 1 ? '用户' : '管理员' }}</span>
        </template>
      </el-table-column>
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
            @click="deleteUser(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗组件：新增/编辑用户 -->
    <el-dialog
      :visible.sync="dialogFormVisible"
      :title="editUser ? '编辑用户' : '新增用户'"
      width="50%"
      @before-close="dialogClosed"
    >
      <AddUser
        :user-data="editUser"
        @closeDialog="dialogClosed"
        @refreshTable="fetchData"
      />
    </el-dialog>

    <!-- 分页器 -->
    <el-pagination
      style="margin-top: 20px; text-align: center;"
      background
      layout="prev, pager, next"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script>
import AddUser from '@/views/User/AddUser.vue'
import { getUserList, deleteUserById } from '@/api/user'

export default {
  name: 'UserManagement',
  components: { AddUser },
  data() {
    return {
      input: '',
      tableData: [],
      dialogFormVisible: false,
      editUser: null,
      currentPage: 1, // 当前页
      pageSize: 10, // 每页显示条数
      total: 0, // 数据总数
      keyword: '' // 搜索关键词
    }
  },
  watch: {
    dialogFormVisible(val) {
      if (!val) {
        this.editUser = null
      }
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    // 获取用户数据
    async fetchData() {
      try {
        const res = await getUserList({
          page: this.currentPage,
          pageSize: this.pageSize,
          keyword: this.keyword
        })
        if (res.code === 20000) {
          this.tableData = res.data.records // 假设后端返回 { records, total }
          this.total = res.data.total
        } else {
          this.$message.error('获取用户数据失败: ' + res.message)
        }
      } catch (err) {
        console.error('获取用户数据失败:', err)
        this.$message.error('获取用户数据失败')
      }
    },
    // 搜索功能
    handleSearch() {
      console.log('搜索用户名:', this.input)
      this.keyword = this.input.trim()
      this.currentPage = 1
      this.fetchData()
    },
    // 打开新增对话框
    openAddDialog() {
      this.editUser = null
      this.dialogFormVisible = true
    },
    // 打开编辑对话框
    openEditDialog(user) {
      this.editUser = { ...user }
      this.dialogFormVisible = true
    },
    // 关闭对话框
    dialogClosed() {
      this.dialogFormVisible = false
      this.editUser = null
    },
    // 删除用户
    async deleteUser(user) {
      try {
        await this.$confirm('确定删除该用户吗?', '提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await deleteUserById(user.id)
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
    },
    // 分页切换
    handlePageChange(page) {
      this.currentPage = page
      this.fetchData()
    }
  }
}
</script>

<style scoped>
/* 如需样式，可在此添加 */
</style>
