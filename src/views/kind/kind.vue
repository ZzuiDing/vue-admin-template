<template>
  <div>
    <el-input
      v-model="input"
      placeholder="请输入内容"
      style="width: 200px; margin-bottom: 20px;"
      @input="handleSearch"
    />
    <el-button type="primary" @click="handleSearch">搜索</el-button>
    <el-button plain @click="openAddDialog()">新增</el-button>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="id" width="80" />
      <el-table-column prop="kindName" label="种类" width="180" />
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.row)"
          >修改
          </el-button>
          <el-button
            v-if="role === 2"
            size="mini"
            type="danger"
            style="margin-left: 10px;"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-show="total > 0"
      :current-page="pageNum"
      :page-size="pageSize"
      :total="total"
      layout="total, prev, pager, next, jumper"
      @current-change="handlePageChange"
    />

    <!-- 弹窗：新增/编辑种类 -->
    <el-dialog
      :visible.sync="dialogFormVisible"
      title="修改种类"
      width="50%"
      @close="dialogClosed"
    >
      <add-kind
        :kind="selectedKind"
        @closeDialog="dialogClosed"
        @refreshTable="fetchData"
      />
    </el-dialog>
  </div>
</template>

<script>
import addKind from '@/views/kind/addKind.vue'
import {
  getAllKinds,
  deleteKindById
} from '@/api/kind'

export default {
  components: { addKind },
  data() {
    return {
      input: '',
      tableData: [],
      dialogFormVisible: false,
      selectedKind: null,
      pageNum: 1, // 当前页
      pageSize: 10, // 每页显示的记录数
      total: 0, // 总记录数
      role: this.$store.state.user.role, // 获取用户角色
      keyword: '' // 搜索关键词
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    // 获取数据
    async fetchData() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        keyword: this.keyword // 如果有搜索关键字
      }
      try {
        const res = await getAllKinds(params)
        if (res.code === 20000) {
          this.tableData = res.data.records
          this.total = res.data.total // 总记录数
        } else {
          this.$message.error('获取种类数据失败：' + res.message)
        }
      } catch (error) {
        console.error('获取种类数据失败:', error)
        this.$message.error('获取种类数据失败')
      }
    },
    handleSearch() {
      console.log('搜索:', this.input)
      // 调用 fetchData 方法，传递搜索参数
      this.pageNum = 1 // 重置页码为1
      this.keyword = this.input.trim() // 更新搜索关键词
      this.fetchData()
    },
    openAddDialog() {
      this.selectedKind = null
      this.dialogFormVisible = true
    },
    handleEdit(row) {
      this.selectedKind = { ...row }
      this.dialogFormVisible = true
    },
    dialogClosed() {
      this.dialogFormVisible = false
      this.selectedKind = null
    },
    async handleDelete(row) {
      try {
        await this.$confirm('确定删除该种类吗?', '提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await deleteKindById(row.id)
        if (res.code === 20000) {
          this.$message.success('删除成功！')
          this.fetchData()
        } else {
          this.$message.error('删除失败：' + res.message)
        }
      } catch (err) {
        // 如果是取消操作 err 为 'cancel'
        if (err !== 'cancel') {
          console.error('删除失败:', err)
          this.$message.error('删除失败：' + (err.message || '未知错误'))
        }
      }
    },
    // 分页改变时触发
    handlePageChange(page) {
      this.pageNum = page
      this.fetchData()
    }
  }
}
</script>
