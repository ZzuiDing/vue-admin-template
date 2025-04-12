<template>
  <div class="dashboard-container">
    <div class="dashboard-text">Hi,  {{ name }}</div>
    <!--    <div class="dashboard-text">邮箱: {{ email }}</div>-->
    <div v-if="role === 1">
      <p v-if="summaryData['已发货'] && summaryData['已发货'].value !== undefined">
        您出售的商品目前已发货订单数量：{{ summaryData['已发货'].value }},目前还有{{ summaryData['已支付'].value }}单未发出
        已完成{{ summaryData['已完成'].value }}单订单，目前还有{{ summaryData['待支付'].value }}单待支付
      </p>
      <p v-if="summaryDataSeller['已发货'] && summaryDataSeller['已发货'].value !== undefined">
        您购买的商品目前已发货订单数量：{{ summaryDataSeller['已发货'].value }},{{ summaryDataSeller['已支付'].value }}单未发出
        已完成{{ summaryDataSeller['已完成'].value }}单订单，目前还有{{ summaryDataSeller['待支付'].value }}单待支付
      </p>
    </div>
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
import { summary, summarySeller } from '@/api/order'

export default {
  name: 'Dashboard',
  components: { AddUser },
  data() {
    return {
      dialogVisible: false,
      editUser: null,
      summaryData: {
        '已发货': {
          value: 0,
          color: '#67C23A'
        },
        '已完成': {
          value: 0,
          color: '#409EFF'
        },
        '待支付': {
          value: 0,
          color: '#F56C6C'
        },
        '已取消': {
          value: 0,
          color: '#E6A23C'
        },
        '已支付': {
          value: 0,
          color: '#909399'
        }
      },
      summaryDataSeller: {
        '已发货': {
          value: 0,
          color: '#67C23A'
        },
        '已完成': {
          value: 0,
          color: '#409EFF'
        },
        '待支付': {
          value: 0,
          color: '#F56C6C'
        },
        '已取消': {
          value: 0,
          color: '#E6A23C'
        },
        '已支付': {
          value: 0,
          color: '#909399'
        }
      }
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
      const response = await userinfo()
      if (response.code !== 20000) {
        this.$message.error('获取用户信息失败')
      } else {
        this.editUser = response.data
        console.log('用户信息:', this.editUser)
      }

      const orderSummary = await summary()
      if (orderSummary.code !== 20000) {
        this.$message.error('获取订单统计信息失败')
      } else {
        const newSummaryData = orderSummary.data

        // 遍历返回的订单统计信息并合并到现有的 summaryData
        for (const status in newSummaryData) {
          if (this.summaryData.hasOwnProperty(status)) {
            // 强制确保 value 是数字类型
            this.summaryData[status] = newSummaryData[status] || 0
          }
        }
        console.log('更新后的订单统计信息:', this.summaryData)
      }

      const orderSummarySeller = await summarySeller()
      if (orderSummarySeller.code !== 20000) {
        this.$message.error('获取订单统计信息失败')
      } else {
        const newSummaryDataSeller = orderSummarySeller.data

        // 遍历返回的订单统计信息并合并到现有的 summaryDataSeller
        for (const status in newSummaryDataSeller) {
          if (this.summaryDataSeller.hasOwnProperty(status)) {
            // 强制确保 value 是数字类型
            this.summaryDataSeller[status] = newSummaryDataSeller[status] || 0
          }
        }
        console.log('更新后的Seller订单统计信息:', this.summaryDataSeller)
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
