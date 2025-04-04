<template>
  <div>
    <el-input v-model="input" placeholder="请输入内容" style="width: 200px; margin-bottom: 20px;" />
    <el-button type="primary" @click="handleSearch">搜索</el-button>
    <el-button plain @click="dialogFormVisible = true">
      新增
    </el-button>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="picture" label="图像" width="180">
        <template #default="scope">
          <el-image style="width: 80px; height: 80px" :src="scope.row.picture" fit="cover" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" width="180" />
      <el-table-column prop="price" label="价格" width="180" />
      <el-table-column prop="desc" label="简介" width="180" />
      <el-table-column prop="kindId" label="种类" />
      <el-table-column prop="key_word" label="关键词" width="180" />
      <el-table-column prop="status" label="状态" width="180" />
      <el-table-column prop="sold_amount" label="销量" width="180" />
    </el-table>

    <!-- 弹窗：新增商品 -->
    <el-dialog :visible.sync="dialogFormVisible" title="新增商品" width="50%" @close="dialogClosed">
      <AddGood @closeDialog="dialogClosed" @refreshTable="fetchData" />
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
      kindList: [] // 存储kind数据
    }
  },
  mounted() {
    this.fetchKindList() // 获取kindList
    this.fetchData() // 获取商品数据
  },
  methods: {
    // 获取所有kind信息
    async fetchKindList() {
      try {
        const response = await axios.get('http://localhost:9090/spba-api/kind/getAll')
        if (response.data.code === 20000) {
          this.kindList = response.data.data.records // 保存kind数据
          console.log(this.kindList)
        } else {
          console.error('获取种类数据失败:', response.data.message)
        }
      } catch (error) {
        console.error('获取种类数据失败:', error)
      }
    },
    // 获取商品数据
    async fetchData() {
      try {
        const response = await axios.get('http://localhost:9090/spba-api/goods/ALLGoodsList')
        const goods = response.data.data.records

        // 根据商品的kindId，填充对应的kindName
        goods.forEach(good => {
          const kind = this.kindList.find(k => k.id === good.kindId)
          if (kind) {
            good.kindId = kind.kindName // 给good添加kindName
          }
        })

        this.tableData = goods // 更新表格数据
        console.log(goods) // 打印数据查看结果
      } catch (error) {
        console.error('获取商品数据失败:', error)
      }
    },
    handleSearch() {
      console.log('搜索:', this.input)
    },
    dialogClosed() {
      this.dialogFormVisible = false
    }
  }
}
</script>
