<template>
  <div>
    <el-input v-model="input" placeholder="请输入内容" style="width: 200px; margin-bottom: 20px;" />
    <el-button type="primary" @click="handleSearch">搜索</el-button>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="image" label="头像" width="180" />
      <el-table-column prop="name" label="姓名" width="180" />
      <el-table-column prop="gender" label="性别" width="180" />
      <el-table-column prop="address" label="地址" />
      <el-table-column prop="email" label="邮箱" width="180" />
      <el-table-column prop="phone" label="电话" width="180" />

    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: []
    }
  }
}
</script>
