<template>
  <div>
    <el-input v-model="input" placeholder="请输入内容" style="width: 200px; margin-bottom: 20px;" />
    <el-button type="primary" @click="handleSearch">搜索</el-button>
    <el-button plain @click="dialogFormVisible = true">
      新增
    </el-button>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="id" width="180" />
      <el-table-column prop="kindName" label="种类" width="180" />
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <!-- 修改按钮 -->
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.row)"
          >修改
          </el-button>

          <!-- 删除按钮 -->
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

    <!-- ✅ 弹窗：新增商品 -->
    <el-dialog :visible.sync="dialogFormVisible" title="修改种类" width="50%" @close="dialogClosed">
      <add-kind :kind="selectedKind" @closeDialog="dialogClosed" @refreshTable="fetchData" />
    </el-dialog>

    <!--    <el-dialog-->
    <!--      v-model="dialogVisible"-->
    <!--      title="Tips"-->
    <!--      width="500"-->
    <!--      :before-close="handleClose"-->
    <!--    >-->
    <!--      <span>This is a message</span>-->
    <!--      <template #footer>-->
    <!--        <div class="dialog-footer">-->
    <!--          <el-button @click="dialogVisible = false">Cancel</el-button>-->
    <!--          <el-button type="primary" @click="dialogVisible = false">-->
    <!--            Confirm-->
    <!--          </el-button>-->
    <!--        </div>-->
    <!--      </template>-->
    <!--    </el-dialog>-->
  </div>
</template>

<script>
import axios from 'axios'
import addKind from '@/views/kind/addKind.vue'
// import { ref } from 'vue'
// const dialogFormVisible = ref(false)

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
        const response = await axios.get('http://localhost:9090/spba-api/kind/getAll')
        // this.tableData = response.data.data.records
        this.tableData = response.data.data.records.sort((a, b) => a.id - b.id) // 按 id 排序
        console.log(response.data.data.records)
      } catch (error) {
        console.error('获取数据失败:', error)
      }
    },
    handleEdit(row) {
      this.selectedKind = { ...row } // 深拷贝 row 确保不会直接修改原数据
      console.log('编辑:', this.selectedKind)
      this.dialogFormVisible = true // 打开弹窗
    },
    dialogClosed() {
      this.dialogFormVisible = false
      this.selectedKind = null // 关闭弹窗时清空 selectedKind
    },
    handleSearch() {
      console.log('搜索:', this.input)
    },
    handleDelete(row) {
      this.$confirm('确定删除该种类吗?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 删除数据逻辑（在这里假设通过接口删除）
        try {
          const response = await axios.post(`http://localhost:9090/spba-api/kind/delete?id=${row.id}`)
          // 检查返回结果，如果返回的 code 为 500，则主动抛出异常
          if (response.data.code === 500) {
            throw new Error(response.data.message || '删除失败，请检查输入')
          }
          this.$message.success('删除成功！')
          await this.fetchData() // 刷新数据
        } catch (error) {
          console.error('删除失败:', error)
          if (error.response && error.response.data) {
            this.$message.error(`删除失败: ${error.response.data.message || '请检查输入'}`)
          } else {
            this.$message.error(`删除失败: ${error.message || '服务器错误'}`)
          }
        }
      })
      // dialogClosed() {
    //   this.dialogFormVisible = false
    }
  }
}

</script>

