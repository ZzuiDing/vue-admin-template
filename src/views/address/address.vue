<template>
  <div>
    <el-input v-model="input" placeholder="请输入地址关键词" style="width: 200px; margin-bottom: 20px;" />
    <el-button type="primary" @click="handleSearch">搜索</el-button>
    <el-button plain @click="dialogFormVisible = true">新增地址</el-button>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="address" label="地址" width="200" />
      <el-table-column prop="name" label="收件人" width="120" />
      <el-table-column prop="phone" label="电话" width="150" />
      <el-table-column prop="desc" label="备注" width="200" />
      <el-table-column prop="userId" label="用户ID" width="100" />
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.row)">修改</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogFormVisible" title="地址编辑" width="50%" @close="dialogClosed">
      <edit-address :address-data="selectedAddress" @closeDialog="dialogClosed" @refreshTable="fetchData" />
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import EditAddress from '@/views/address/addressManagement.vue'

export default {
  components: { EditAddress },
  data() {
    return {
      input: '',
      tableData: [],
      dialogFormVisible: false,
      selectedAddress: null
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      try {
        const res = await axios.get('http://localhost:9090/spba-api/address/getAll')
        this.tableData = res.data.data.records.sort((a, b) => a.id - b.id)
      } catch (err) {
        console.error('获取地址数据失败:', err)
      }
    },
    handleEdit(row) {
      this.selectedAddress = { ...row }
      this.dialogFormVisible = true
    },
    dialogClosed() {
      this.dialogFormVisible = false
      this.selectedAddress = null
    },
    handleSearch() {
      console.log('搜索关键词:', this.input)
    },
    handleDelete(row) {
      this.$confirm('确定删除该地址吗？', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          const response = await axios.post(`http://localhost:9090/spba-api/address/delete?id=${row.id}`)
          if (response.data.code !== 20000) throw new Error(response.data.message || '删除失败')
          this.$message.success('删除成功')
          await this.fetchData()
        } catch (error) {
          this.$message.error('删除失败: ' + (error.message || '服务器异常'))
        }
      })
    }
  }
}
</script>
