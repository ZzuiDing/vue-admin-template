<template>
  <div>
    <el-input
      v-model="input"
      placeholder="请输入内容"
      style="width: 200px; margin-bottom: 20px;"
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
            size="mini"
            type="danger"
            style="margin-left: 10px;"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

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
      selectedKind: null
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      try {
        const res = await getAllKinds()
        if (res.code === 20000) {
          // 按 id 升序排列
          this.tableData = res.data.records.sort((a, b) => a.id - b.id)
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
      // TODO: 如果有搜索接口，可在此调用
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
    }
  }
}
</script>
