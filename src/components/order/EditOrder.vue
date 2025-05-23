<template>
  <div>
    <el-form :model="form" label-width="120px">
      <el-form-item label="订单ID">
        <el-input v-model="form.id" :disabled="isEdit" />
      </el-form-item>
      <el-form-item label="买方">
        <el-input v-model="form.buyerName" disabled />
      </el-form-item>
      <el-form-item label="卖方">
        <el-input v-model="form.sellerName" disabled />
      </el-form-item>
      <el-form-item label="内容">
        <el-input v-model="form.goodName" disabled />
      </el-form-item>
      <el-form-item label="购买数量">
        <el-input-number v-model="form.amount" :min="1" disabled />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.desc" type="textarea" :rows="4" placeholder="请输入内容" />
      </el-form-item>
      <el-form-item label="日期" disabled>
        <el-date-picker
          v-model="form.date"
          disabled
          type="date"
          placeholder="选择日期"
          style="width: 100%;"
        />
      </el-form-item>
      <el-form-item label="支付方式" disabled>
        <el-select v-model="form.payMethod" placeholder="请选择支付方式" disabled>
          <el-option label="支付宝" value="alipay" />
          <el-option label="微信" value="wechat" />
          <el-option label="银行转账" value="bank" />
        </el-select>
      </el-form-item>
      <el-form-item label="支付金额" disabled>
        <el-input-number v-model="form.payAmount" :min="0" :precision="2" disabled />
      </el-form-item>
      <el-form-item label="快递号">
        <el-input v-model="form.expressId" style="width: 70%;" :disabled="!(flag === 'seller'&&status==='已支付')" />
        <el-button
          type="primary"
          icon="el-icon-search"
          style="margin-left: 10px;"
          :disabled="!form.expressId"
          @click="getExpressDetail"
        >
          查看详情
        </el-button>
      </el-form-item>

      <el-form-item label="地址" disabled>
        <el-input v-model="form.address" disabled />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="closeDialog">取消</el-button>
      </el-form-item>
    </el-form>
    <el-drawer
      title="快递详情"
      :visible.sync="expressDrawerVisible"
      size="50%"
      direction="rtl"
      custom-class="express-drawer"
      :modal="false"
      :with-header="true"
      :append-to-body="true"
      :lock-scroll="false"
    >
      <div v-if="expressInfo && expressInfo.result">
        <p><strong>快递公司：</strong>{{ expressInfo.result.expName }}</p>
        <p><strong>快递单号：</strong>{{ expressInfo.result.number }}</p>
        <el-timeline>
          <el-timeline-item
            v-for="(item, index) in expressInfo.result.list"
            :key="index"
            :timestamp="item.time"
          >
            {{ item.status }}
          </el-timeline-item>
        </el-timeline>
      </div>
      <div v-else>
        <p>暂无快递信息</p>
      </div>
    </el-drawer>

  </div>
</template>

<script>
import { addOrder, updateOrder } from '@/api/order'
import { express } from '@/api/express'

export default {
  name: 'EditOrder',
  props: {
    orderData: {
      type: Object,
      default: () => ({})
    },
    status: {
      type: String,
      default: ''
    },
    flag: {
      type: String
    }
  },
  data() {
    return {
      form: {
        id: '',
        buyer: '',
        seller: '',
        content: '',
        goodName: '',
        amount: 1,
        date: '',
        status: '待处理',
        payMethod: '',
        payAmount: 0,
        expressId: '',
        addressId: ''
      },
      expressDrawerVisible: false,
      expressInfo: null

    }
  },
  computed: {
    isEdit() {
      // 如果父组件传入了 orderData 且有 id，就认为是编辑
      return !!this.orderData && this.orderData.id != null
    }
  },
  watch: {
    orderData: {
      immediate: true,
      handler(val) {
        if (val && val.id != null) {
          // 编辑时，填充表单
          this.form = { ...val }
        } else {
          // 新增时，重置表单
          this.resetForm()
        }
      }
    }
  },
  mounted() {
    console.log('flag', this.flag)
  },
  methods: {
    async getExpressDetail() {
      try {
        const res = await express(this.form.expressId, this.$store.state.user.phone)
        if (res.code === 20000) {
          this.expressInfo = JSON.parse(res.data)
          this.expressDrawerVisible = true
        } else {
          this.$message.error('获取快递信息失败：' + res.message)
        }
      } catch (err) {
        console.error(err)
        this.$message.error('请求出错，请稍后重试')
      }
    },
    resetForm() {
      this.form = {
        id: '',
        buyer: '',
        seller: '',
        content: '',
        amount: 1,
        date: '',
        status: '待处理',
        payMethod: '',
        payAmount: 0,
        expressId: '',
        addressId: '',
        GoodName: ''
      }
    },
    async submitForm() {
      try {
        const fn = this.isEdit ? updateOrder : addOrder
        const res = await fn(this.form)
        if (res.code === 20000) {
          this.$message.success(this.isEdit ? '订单更新成功' : '订单新增成功')
          this.$emit('refreshTable')
          this.closeDialog()
        } else {
          this.$message.error('操作失败：' + res.message)
        }
      } catch (err) {
        console.error('提交订单失败：', err)
        this.$message.error('提交失败，请重试')
      }
    },
    closeDialog() {
      this.$emit('closeDialog')
      this.resetForm()
    }
  }
}
</script>

<style scoped>
/* 如有需要，可添加样式 */
</style>
