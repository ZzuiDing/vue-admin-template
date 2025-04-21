<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover">
          <div class="wealth-box">
            <div class="title">钱包余额</div>
            <div class="wealth">
              <el-icon>
                <Coin />
              </el-icon>
              <span class="amount">￥{{ wealth }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card shadow="hover">
          <div class="title">个人订单统计</div>
          <div ref="orderChart" style="height: 300px;" />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card shadow="hover">
          <div class="title">出售订单统计</div>
          <div ref="sellerChart" style="height: 300px;" />
        </el-card>
      </el-col>
      <el-col :span="12" class="btn-panel">
        <el-card shadow="hover">
          <div class="title">操作</div>
          <el-button type="primary" @click="openDialog">修改用户信息</el-button>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      :visible.sync="dialogVisible"
      title="修改我的信息"
      width="50%"
      @before-close="dialogClosed"
    >
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
import * as echarts from 'echarts'

export default {
  name: 'Dashboard',
  components: { AddUser },
  data() {
    return {
      wealth: 0,
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
    initOrderChart() {
      const chart = echarts.init(this.$refs.orderChart)
      const option = this.buildChartOption(this.summaryData)
      chart.setOption(option)
    },

    initSellerChart() {
      const chart = echarts.init(this.$refs.sellerChart)
      const option = this.buildChartOption(this.summaryDataSeller)
      chart.setOption(option)
    },

    buildChartOption(data) {
      return {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          bottom: '0%'
        },
        series: [
          {
            name: '订单状态',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: true,
              formatter: '{b}: {c}单'
            },
            data: Object.entries(data).map(([status, item]) => ({
              value: item.value,
              name: status
            }))
          }
        ]
      }
    },
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
      const response2 = await userinfo()
      if (response2.code !== 20000) {
        this.$message.error('获取用户信息失败')
      } else {
        this.wealth = response2.data.wealth
        console.log('用户信息:', this.editUser)
      }
      this.$nextTick(() => {
        this.initOrderChart()
        this.initSellerChart()
      })
    }

  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  margin: 30px;
}

.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.wealth-box {
  .wealth {
    font-size: 28px;
    font-weight: bold;
    color: #67c23a;
    display: flex;
    align-items: center;

    .el-icon {
      margin-right: 10px;
    }
  }
}

.amount {
  font-size: 30px;
}

.btn-panel {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
