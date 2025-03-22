<template>
  <div>
    <el-input v-model="input" placeholder="请输入内容" style="width: 200px; margin-bottom: 20px;" />
    <el-button type="primary" @click="handleSearch">搜索</el-button>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="picture" label="图像" width="180" />
      <el-table-column prop="name" label="名称" width="180" />
      <el-table-column prop="price" label="价格" width="180" />
      <el-table-column prop="desc" label="简介" width="180" />
      <el-table-column prop="kind" label="种类" />
      <el-table-column prop="key_word" label="关键词" width="180" />
      <el-table-column prop="status" label="状态" width="180" />
      <el-table-column prop="sold_amount" label="销量" width="180" />
    </el-table>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      input: '', // 存储搜索输入
      tableData: [] // 存储用户列表数据
    }
  },
  created() {
    this.getUserList() // 页面加载时获取数据
  },
  methods: {
    async getUserList(params = {}) {
      try {
        const response = await axios.get('http://localhost:9090/spba-api/goods/ALLGoodsList', { params }) // 假设后端接口为 /api/getUserList
        this.tableData = response.data.data.records // 赋值给 tableData
        console.log('获取列表成功:', this.tableData)
      } catch (error) {
        console.error('获取列表失败:', error)
      }
    },
    handleSearch() {
      this.getUserList({ keyword: this.input }) // 调用搜索
    }
  }
}
</script>
