<template>
  <div>
    <el-input v-model="input" placeholder="请输入用户名" style="width: 200px; margin-bottom: 20px;"/>
    <el-button type="primary" @click="handleSearch">搜索</el-button>
    <el-button plain @click="openAddDialog()">新增用户</el-button>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="ID" min-width="60"/>
      <el-table-column prop="avatar" label="头像" min-width="120">
        <template #default="scope">
          <el-image style="width: 60px; height: 60px" :src="scope.row.avatar" fit="cover"/>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="用户名" min-width="120"/>
      <el-table-column prop="email" label="邮箱" min-width="180"/>
      <el-table-column prop="role" label="角色" min-width="100"/>
      <el-table-column prop="status" label="状态" min-width="80"/>
      <el-table-column label="操作" min-width="200">
        <template #default="scope">
          <el-button size="mini" type="primary" @click="openEditDialog(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteUser(scope.row)">删除</el-button>
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
  </div>
</template>

<script>
import axios from 'axios'
import AddUser from '@/views/User/AddUser.vue'

export default {
  components: {AddUser},
  data() {
    return {
      input: '',
      tableData: [],
      dialogFormVisible: false,
      editUser: null
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
    async fetchData() {
      try {
        const response = await axios.get('http://localhost:9090/spba-api/user/getUserList')
        if (response.data.code === 20000) {
          this.tableData = response.data.data
        } else {
          this.$message.error('获取用户数据失败: ' + response.data.message)
        }
      } catch (error) {
        console.error('获取用户数据失败:', error)
      }
    },
    handleSearch() {
      console.log('搜索用户名:', this.input)
      // 如果有搜索接口可调用如下：
      // axios.get('/api/user/search', { params: { name: this.input } })
    },
    openAddDialog() {
      this.editUser = null
      this.dialogFormVisible = true
    },
    openEditDialog(user) {
      this.editUser = {...user}
      this.dialogFormVisible = true
    },
    dialogClosed() {
      this.dialogFormVisible = false
      this.editUser = null
    },
    async deleteUser(user) {
      this.$confirm('确定删除该用户吗?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const response = await axios.post(`http://localhost:9090/spba-api/user/deleteUser?id=${user.id}`)
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
