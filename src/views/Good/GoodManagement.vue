<template>
  <div>
    <el-input v-model="input" placeholder="请输入内容" style="width: 200px; margin-bottom: 20px;" />
    <el-button type="primary" @click="handleSearch">搜索</el-button>
    <el-button plain @click="openAddDialog()">新增</el-button>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="id" min-width="40" />
      <el-table-column prop="picture" label="图像" min-width="180">
        <template #default="scope">
          <el-image style="width: 80px; height: 80px" :src="scope.row.picture" fit="cover" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" min-width="180" />
      <el-table-column prop="price" label="价格" min-width="60" />
      <el-table-column prop="desc" label="简介" min-width="180" />
      <el-table-column prop="kindName" label="种类" min-width="80" />
      <el-table-column prop="key_word" label="关键词" min-width="80" />
      <el-table-column prop="status" label="状态" min-width="60" />
      <el-table-column prop="sold_amount" label="销量" min-width="180" />
      <el-table-column label="操作" min-width="200">
        <template #default="scope">
          <el-button size="mini" type="primary" @click="openEditDialog(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteGood(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗：新增/编辑商品 -->
    <el-dialog
      :visible.sync="dialogFormVisible"
      :title="editGood ? '编辑商品' : '新增商品'"
      width="50%"
      @before-close="dialogClosed"
    >
      <AddGood
        :good-data="editGood"
        @closeDialog="dialogClosed"
        @refreshTable="fetchData"
      />
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import AddGood from '@/views/Good/AddGood.vue'

export default {
  components: { AddGood },
  data() {
    return {
      input: '',
      tableData: [],
      dialogFormVisible: false,
      editGood: null, // 记录要编辑的商品
      kindList: []
    }
  },
  watch: {
    dialogFormVisible(val) {
      if (!val) {
        console.log('弹窗已关闭')
        this.editGood = null
        console.log(this.editGood)// 关闭弹窗时清空数据
      }
    },
    editGood(newValue) {
      if (!newValue) {
        this.$nextTick(() => {
          this.editGood = null // 确保 Vue 响应式清空
        })
      }
    }
  },
  mounted() {
    this.fetchKindList()
    this.fetchData()
  },
  methods: {
    async fetchKindList() {
      try {
        const response = await axios.get('http://localhost:9090/spba-api/kind/getAll')
        if (response.data.code === 20000) {
          this.kindList = response.data.data.records
        } else {
          console.error('获取种类数据失败:', response.data.message)
        }
      } catch (error) {
        console.error('获取种类数据失败:', error)
      }
    },
    async fetchData() {
      try {
        const response = await axios.get('http://localhost:9090/spba-api/goods/ALLGoodsList')
        const goods = response.data.data.records

        goods.forEach(good => {
          const kind = this.kindList.find(k => k.id === good.kindId)
          if (kind) {
            good.kindName = kind.kindName // 保留 kindId，新增 kindName 字段
          }
        })
        this.tableData = goods
        console.log('商品数据:', this.tableData)
      } catch (error) {
        console.error('获取商品数据失败:', error)
      }
    },
    handleSearch() {
      console.log('搜索:', this.input)
    },
    openAddDialog() {
      this.editGood = null // 新增时清空数据
      this.dialogFormVisible = true
      console.log(this.editGood)
    },
    openEditDialog(good) {
      this.editGood = { ...good } // 复制对象，防止修改原数据
      this.dialogFormVisible = true
    },
    dialogClosed() {
      this.editGood = null // 先清空数据
      this.dialogFormVisible = false // 再关闭弹窗
    },
    deleteGood(row) {
      this.$confirm('确定删除该种类吗?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 删除数据逻辑（在这里假设通过接口删除）
        try {
          const response = await axios.post(`http://localhost:9090/spba-api/goods/delete?id=${row.id}`)
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
