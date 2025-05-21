<template>
  <div class="dashboard-container">
    <!-- 普通用户 -->
    <div v-if="role === 1">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card shadow="hover">
            <div class="title">出售订单统计</div>
            <div ref="sellerChart" style="height: 300px;" />
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="hover">
            <div class="title">个人订单统计</div>
            <div ref="orderChart" style="height: 300px;" />
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-top: 20px">
        <el-col :span="12">
          <el-card shadow="hover">
            <div class="title">近七日订单数量</div>
            <div ref="dailyUserChart" style="height: 300px;" />
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover">
            <div class="title">操作</div>
            <el-button type="primary" @click="openDialog">修改用户信息</el-button>
          </el-card>
        </el-col>
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
      </el-row>

      <el-row :gutter="20" style="margin-top: 20px" />
    </div>

    <!-- 管理员 -->
    <div v-else>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card shadow="hover">
            <div class="title">全部订单统计</div>
            <div ref="adminChart" style="height: 300px;" />
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card shadow="hover">
            <div class="title">近七日订单数量</div>
            <div ref="dailyAdminChart" style="height: 300px;" />
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-top: 20px">
        <el-col :span="24">
          <el-card shadow="hover">
            <div class="title">操作</div>
            <el-button type="primary" @click="openDialog">修改用户信息</el-button>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 修改用户信息弹窗 -->
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
import {
  summary,
  summarySeller,
  summaryAdmin, getRecentSevenDaysOrders
} from '@/api/order'
import * as echarts from 'echarts'

export default {
  name: 'Dashboard',
  components: { AddUser },
  data() {
    return {
      wealth: 0,
      dialogVisible: false,
      editUser: null,
      summaryData: {},
      summaryDataSeller: {},
      summaryDataAdmin: {},
      dailyDataAdmin: [],
      dailyDataUser: []
    }
  },
  computed: {
    ...mapGetters(['name', 'role'])
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      try {
        const userRes = await userinfo()
        if (userRes.code === 20000) {
          this.editUser = userRes.data
          this.wealth = userRes.data.wealth
        }

        if (this.role === 1) {
          const [res1, res2, res3] = await Promise.all([
            summary(),
            summarySeller(),
            getRecentSevenDaysOrders()
          ])
          if (res1.code === 20000) this.summaryData = this.mapChartData(res1.data)
          if (res2.code === 20000) this.summaryDataSeller = this.mapChartData(res2.data)
          if (res3.code === 20000) this.dailyDataUser = res3.data
        } else if (this.role === 2) {
          const [res, dailyRes] = await Promise.all([
            summaryAdmin(),
            getRecentSevenDaysOrders()
          ])
          if (res.code === 20000) this.summaryDataAdmin = this.mapChartData(res.data)
          if (dailyRes.code === 20000) this.dailyDataAdmin = dailyRes.data
        }

        this.$nextTick(() => {
          if (this.role === 1) {
            this.initChart(this.$refs.orderChart, this.summaryData)
            this.initChart(this.$refs.sellerChart, this.summaryDataSeller)
            this.initLineChart(this.$refs.dailyUserChart, this.dailyDataUser)
          } else if (this.role === 2) {
            this.initChart(this.$refs.adminChart, this.summaryDataAdmin)
            this.initLineChart(this.$refs.dailyAdminChart, this.dailyDataAdmin)
          }
        })
      } catch (error) {
        this.$message.error('数据加载失败')
        console.error(error)
      }
    },
    mapChartData(rawData) {
      const chartData = []
      for (const status in rawData) {
        const { value, status: label } = rawData[status]
        // const excluded = ['已取消', '退款中']
        // if (excluded.includes(label)) continue
        chartData.push({ value, name: label })
      }
      return chartData
    },
    initChart(refEl, chartData) {
      if (!refEl) return
      const chart = echarts.init(refEl)
      chart.setOption(this.buildChartOption(chartData))
    },
    buildChartOption(data) {
      return {
        tooltip: { trigger: 'item' },
        legend: { bottom: '0%' },
        series: [
          {
            color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272'],
            name: '订单状态',
            type: 'pie',
            radius: ['40%', '70%'],
            label: { formatter: '{b}: {c}单' },
            data: data
          }
        ]
      }
    },
    initLineChart(refEl, data) {
      if (!refEl) return
      const chart = echarts.init(refEl)
      chart.setOption({
        title: { text: '近七日订单数', left: 'center' },
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: data.map(item => item.date)
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: data.map(item => item.count),
            type: 'line',
            smooth: true
          }
        ]
      })
    },
    openDialog() {
      this.dialogVisible = true
    },
    dialogClosed() {
      this.dialogVisible = false
      this.editUser = null
    },
    refreshUserInfo() {
      this.$store.dispatch('user/getInfo')
      this.fetchData()
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
