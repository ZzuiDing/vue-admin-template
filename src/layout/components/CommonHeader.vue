<template>
  <el-header class="header">
    <el-row type="flex" justify="space-between" align="middle">
      <el-col :span="8" class="logo" @click.native="$emit('goHome')">创作者购物平台</el-col>

      <el-col :span="8" class="search-container">
        <el-input
          v-model="searchQuery"
          placeholder="搜索商品"
          prefix-icon="el-icon-search"
        />
      </el-col>

      <el-col :span="8" class="user-container" style="text-align: right;">
        <el-avatar
          v-if="isLoggedIn"
          :size="40"
          :src="userAvatar"
          class="user-avatar"
          @click.native="$emit('backend')"
        />
        <el-button
          v-if="!isLoggedIn"
          type="primary"
          icon="el-icon-user"
          size="small"
          @click="$emit('login')"
        >
          登录
        </el-button>
      </el-col>
    </el-row>
  </el-header>
</template>

<script>
import { getToken } from '@/utils/auth'

export default {
  name: 'CommonHeader',
  data() {
    return {
      searchQuery: '',
      isLoggedIn: false,
      userAvatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
    }
  },
  mounted() {
    const token = getToken()
    this.isLoggedIn = !!token
  }
}
</script>

<style scoped>
.header {
  background-color: #39c5bb;
  padding: 10px;
}
</style>
