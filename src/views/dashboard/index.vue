<template>
  <div class="dashboard-container">
    <div class="dashboard-text">用户名: {{ name }}</div>
    <!--    <div class="dashboard-text">邮箱: {{ email }}</div>-->

    <el-button type="primary" @click="openDialog">修改用户信息</el-button>

    <el-dialog
      :visible.sync="dialogVisible"
      title="修改我的信息"
      width="50%"
      @before-close="dialogClosed"
    >
      <!-- 复用 AddUser 组件 -->
      <AddUser
        :user-data="editUser"
        @closeDialog="dialogClosed"
        @refreshTable="refreshUserInfo"
      />
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AddUser from '@/views/User/AddUser.vue'
import { userinfo } from '@/api/user'

export default {
  name: 'Dashboard',
  components: { AddUser },
  data() {
    return {
      dialogVisible: false,
      editUser: null
    }
  },
  computed: {
    ...mapGetters(['name', 'role'])
  },
  mounted() {
    // 组件加载时获取用户信息
    this.fetchData()
  },
  methods: {
    openDialog() {
      // 把当前用户的信息传给 AddUser
      // this.editUser = {}
      this.fetchData()
      this.dialogVisible = true
    },
    dialogClosed() {
      this.dialogVisible = false
      this.editUser = null
    },
    refreshUserInfo() {
      // 假设更新成功后你希望同步 Vuex 状态，可选实现
      // 可以调用接口重新拉用户信息，或触发 Vuex 动作
      this.$store.dispatch('user/getInfo') // 假设你有这个 action
    },
    async fetchData() {
      // 这里可以调用接口获取用户信息
      // 假设你有一个 Vuex action 来获取用户信息
      const response = await userinfo()
      if (response.code !== 20000) {
        this.$message.error('获取用户信息失败')
      } else {
        // 假设返回的数据结构是 { data: { name: '...', email: '...' } }
        this.editUser = response.data
        console.log('用户信息:', this.editUser)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 20px;
    margin-bottom: 10px;
  }
}
</style>
