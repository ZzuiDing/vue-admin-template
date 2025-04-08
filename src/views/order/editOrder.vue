<template>
  <div>
    <el-form :model="form" label-width="120px">
      <el-form-item label="订单ID">
        <el-input v-model="form.id" :disabled="editOrder !== null" />
      </el-form-item>
      <el-form-item label="买方">
        <el-input v-model="form.buyer" />
      </el-form-item>
      <el-form-item label="卖方">
        <el-input v-model="form.seller" />
      </el-form-item>
      <el-form-item label="内容">
        <el-input v-model="form.content" />
      </el-form-item>
      <el-form-item label="购买数量">
        <el-input-number v-model="form.amount" :min="1" />
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker v-model="form.date" type="date" placeholder="选择日期" />
      </el-form-item>
      <el-form-item label="支付方式">
        <el-select v-model="form.pay_method">
          <el-option label="支付宝" value="alipay" />
          <el-option label="微信" value="wechat" />
          <el-option label="银行转账" value="bank" />
        </el-select>
      </el-form-item>
      <el-form-item label="支付金额">
        <el-input-number v-model="form.pay_amount" :min="0" precision="2" />
      </el-form-item>
      <el-form-item label="快递号">
        <el-input v-model="form.expres_id" />
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="form.address" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="closeDialog">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: {
    orderData: Object
  },
  data() {
    return {
      form: {
        id: '',
        buyer: '',
        seller: '',
        content: '',
        amount: 1,
        date: '',
        status: '待处理',
        pay_method: '',
        pay_amount: 0,
        expres_id: '',
        address: ''
      },
      editOrder: this.orderData !== null
    }
  },
  watch: {
    orderData: {
      handler(val) {
        if (val) {
          this.form = { ...val }
        }
      },
      immediate: true
    }
  },
  methods: {
    submitForm() {
      const url = this.editOrder
        ? `http://localhost:9090/spba-api/order/updateOrder`
        : `http://localhost:9090/spba-api/order/addOrder`

      axios
        .post(url, this.form)
        .then(response => {
          if (response.data.code === 20000) {
            this.$message.success(this.editOrder ? '订单更新成功' : '订单新增成功')
            this.$emit('refreshTable')
            this.closeDialog()
          } else {
            this.$message.error('操作失败: ' + response.data.message)
          }
        })
        .catch(error => {
          this.$message.error('操作失败: ' + error.message)
        })
    },
    closeDialog() {
      this.$emit('closeDialog')
    }
  }
}
</script>

<style scoped>
/* 样式同之前编辑用户页面的样式 */
</style>
