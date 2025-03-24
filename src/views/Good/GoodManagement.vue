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
      <el-table-column prop="kind" label="种类" />
      <el-table-column prop="key_word" label="关键词" width="180" />
      <el-table-column prop="status" label="状态" width="180" />
      <el-table-column prop="sold_amount" label="销量" width="180" />
    </el-table>

    <!-- ✅ 弹窗：新增商品 -->
    <el-dialog :visible.sync="dialogFormVisible" title="新增商品" width="50%" @close="dialogClosed">
      <AddGood @closeDialog="dialogClosed" @refreshTable="fetchData" />
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
import AddGood from '@/views/Good/AddGood.vue'
// import { ref } from 'vue'
// const dialogFormVisible = ref(false)

export default {
  components: { AddGood },
  data() {
    return {
      input: '',
      tableData: [],
      dialogFormVisible: false
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get('http://localhost:9090/spba-api/goods/ALLGoodsList')
        this.tableData = response.data.data.records
        console.log(response.data.data.records)
      } catch (error) {
        console.error('获取数据失败:', error)
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

