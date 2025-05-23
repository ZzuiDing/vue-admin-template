<template>
  <div>
    <el-input v-model="input" placeholder="请输入内容" style="width: 200px; margin-bottom: 20px;" @input="handleSearch" />
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
      <!--      <el-table-column prop="key_word" label="关键词" min-width="80" />-->
      <el-table-column prop="status" label="状态" min-width="60" />
      <el-table-column prop="soldAmount" label="销量" min-width="180" />
      <el-table-column label="操作" min-width="200">
        <template #default="scope">
          <el-button v-if="scope.row.status === '下架'" size="mini" type="primary" @click="activate(scope.row.id)">
            上架
          </el-button>
          <el-button v-if="scope.row.status === '在售'" size="mini" type="primary" @click="activate(scope.row.id)">
            下架
          </el-button>
          <el-button size="mini" type="primary" @click="openEditDialog(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteGood(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-if="total > 0"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
    />

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
import AddGood from '@/views/Good/AddGood.vue'
import store from '@/store'
import { getAllKinds } from '@/api/kind'
import { getAllGoods, getGoodsByUserId, deleteGoodById, updateStatus } from '@/api/good'

export default {
  components: { AddGood },
  data() {
    return {
      input: '',
      tableData: [],
      dialogFormVisible: false,
      editGood: null,
      kindList: [],
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页显示的条数
      total: 0, // 总记录数
      keyword: '' // 搜索关键词
    }
  },
  watch: {
    dialogFormVisible(val) {
      if (!val) {
        this.editGood = null
      }
    },
    editGood(newValue) {
      if (!newValue) {
        this.$nextTick(() => {
          this.editGood = null
        })
      }
    }
  },
  mounted() {
    this.fetchKindList()
    this.fetchData()
  },
  methods: {
    // 激活商品上架/下架
    async activate(id) {
      const response = await updateStatus(id)
      if (response.code === 20000) {
        this.$message.success('修改成功')
        await this.fetchData()
      } else {
        this.$message.error(response.message)
      }
    },

    // 获取商品分类
    async fetchKindList() {
      try {
        const response = await getAllKinds()
        if (response.code === 20000) {
          this.kindList = response.data.records
        } else {
          this.$message.error(`获取种类失败: ${response.message}`)
        }
      } catch (error) {
        console.error('获取种类数据失败:', error)
        this.$message.error('获取种类数据失败')
      }
    },

    // 获取商品列表
    async fetchData() {
      try {
        let response
        if (store.getters.role !== 1) {
          response = await getAllGoods({
            pageNum: this.currentPage,
            pageSize: this.pageSize,
            keyword: this.keyword
          })
        } else {
          response = await getGoodsByUserId({
            pageNum: this.currentPage,
            pageSize: this.pageSize,
            keyword: this.keyword
          })
        }

        const goods = response.data.records
        goods.forEach(good => {
          const kind = this.kindList.find(k => k.id === good.kindId)
          if (kind) {
            good.kindName = kind.kindName
          }
        })

        this.tableData = goods
        this.total = response.data.total // 获取总记录数
      } catch (error) {
        console.error('获取商品数据失败:', error)
        this.$message.error('获取商品数据失败')
      }
    },

    // 搜索功能
    handleSearch() {
      console.log('搜索:', this.input)
      // 可加入模糊搜索逻辑，例如过滤 this.tableData
      this.keyword = this.input.trim()
      this.currentPage = 1 // 重置页码
      this.fetchData()
    },

    // 打开新增商品弹窗
    openAddDialog() {
      this.editGood = null
      this.dialogFormVisible = true
    },

    // 打开编辑商品弹窗
    openEditDialog(good) {
      this.editGood = { ...good }
      this.dialogFormVisible = true
    },

    // 关闭弹窗
    dialogClosed() {
      this.editGood = null
      this.dialogFormVisible = false
    },

    // 删除商品
    async deleteGood(row) {
      try {
        await this.$confirm('确定删除该商品吗?', '提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        })

        const response = await deleteGoodById(row.id)
        if (response.code !== 20000) {
          throw new Error(response.message || '删除失败')
        }

        this.$message.success('删除成功！')
        this.fetchData()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除失败:', error)
          this.$message.error(`删除失败: ${error.message || '服务器错误'}`)
        }
      }
    },

    // 分页改变时的处理
    handlePageChange(page) {
      this.currentPage = page
      this.fetchData()
    },

    // 每页条数改变时的处理
    handleSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this.fetchData()
    }
  }
}
</script>
