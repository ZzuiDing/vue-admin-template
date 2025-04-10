<template>
  <div>
    <el-input
      v-model="input"
      placeholder="请输入地址关键词"
      style="width: 200px; margin-bottom: 20px;"
    />
    <el-button type="primary" @click="handleSearch">搜索</el-button>
    <el-button plain @click="openAddDialog()">新增地址</el-button>

    <el-table :data="tableData" style="width: 100%; margin-top: 10px;">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="address" label="地址" width="200" />
      <el-table-column prop="name" label="收件人" width="120" />
      <el-table-column prop="phone" label="电话" width="150" />
      <el-table-column prop="desc" label="备注" width="200" />
      <el-table-column prop="userId" label="用户ID" width="100" />
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.row)"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="danger"
            style="margin-left: 10px;"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :visible.sync="dialogFormVisible"
      title="地址编辑"
      width="50%"
      @close="dialogClosed"
    >
      <edit-address
        :address-data="selectedAddress"
        @closeDialog="dialogClosed"
        @refreshTable="fetchData"
      />
    </el-dialog>
  </div>
</template>

<script>
import EditAddress from '@/views/address/addressManagement.vue'
import {
  getAllAddresses,
  deleteAddressById
} from '@/api/address'

export default {
  name: 'AddressManagement',
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
        const res = await getAllAddresses()
        if (res.code === 20000) {
          // 如果后端返回 data.records
          this.tableData = res.data.records
            ? res.data.records.sort((a, b) => a.id - b.id)
            : res.data.sort((a, b) => a.id - b.id)
        } else {
          this.$message.error('获取地址数据失败：' + res.message)
        }
      } catch (err) {
        console.error('获取地址数据失败:', err)
        this.$message.error('获取地址数据失败')
      }
    },
    handleSearch() {
      console.log('搜索关键词:', this.input)
      // TODO: 如果有搜索接口，可在这里调用
    },
    openAddDialog() {
      this.selectedAddress = {}
      this.dialogFormVisible = true
    },
    handleEdit(row) {
      this.selectedAddress = { ...row }
      this.dialogFormVisible = true
    },
    dialogClosed() {
      this.dialogFormVisible = false
      this.selectedAddress = null
    },
    async handleDelete(row) {
      try {
        await this.$confirm('确定删除该地址吗？', '提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await deleteAddressById(row.id)
        if (res.code === 20000) {
          this.$message.success('删除成功')
          this.fetchData()
        } else {
          this.$message.error('删除失败：' + res.message)
        }
      } catch (err) {
        if (err !== 'cancel') {
          console.error('删除失败:', err)
          this.$message.error('删除失败：' + (err.message || '未知错误'))
        }
      }
    }
  }
}
</script>

<style scoped>
/* 如需样式，可在此添加 */
</style>
