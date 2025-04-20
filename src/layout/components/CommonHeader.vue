<template>
  <el-header class="header">
    <el-row type="flex" justify="space-between" align="middle">
      <el-col :span="8" class="logo" @click.native="$emit('goHome')">
        创作者购物平台
      </el-col>

      <el-col :span="8" class="search-container">
        <el-input
          v-model="searchQuery"
          placeholder="搜索商品"
          prefix-icon="el-icon-search"
          @keyup.enter.native="handleSearch"
        >
          <template #append>
            <el-button icon="el-icon-search" @click="handleSearch" />
          </template>
        </el-input>
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
import store from '@/store'

export default {
  name: 'CommonHeader',
  props: {
    searchQuery: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // searchQuery: '',
      isLoggedIn: false,
      userAvatar: store.getters.avatar
    }
  },
  mounted() {
    const token = getToken()
    this.isLoggedIn = !!token
  },
  methods: {
    handleSearch() {
      if (this.searchQuery.trim() !== '') {
        this.$router.push({
          path: '/search',
          query: {
            keyword: this.searchQuery.trim()
          }
        })
      }
    }
  }
}
</script>

<style scoped>
.header {
  background-color: #39c5bb;
  padding: 10px;
}

.search-container {
  display: flex;
  align-items: center;
}
</style>
