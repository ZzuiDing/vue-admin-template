<template>
  <div>
    <el-form ref="form" :model="refund" label-width="100px">
      <el-form-item label="退款ID">
        <el-input v-model="refund.id" disabled />
      </el-form-item>
      <el-form-item label="订单ID">
        <el-input v-model="refund.orderId" disabled />
      </el-form-item>
      <!--    <el-form-item label="用户ID">-->
      <!--      <el-input v-model="refund.userId" disabled/>-->
      <!--    </el-form-item>-->
      <el-form-item label="原因">
        <el-input v-model="refund.reason" type="textarea" />
      </el-form-item>
      <!--    <el-form-item label="退款金额">-->
      <!--      <el-input v-model="refund.amount" disabled/>-->
      <!--    </el-form-item>-->
      <el-form-item v-if="refund.express" label="退货快递单号" />
      <el-form-item label="状态">
        <el-select v-model="refund.status" placeholder="请选择状态" disabled>
          <el-option label="已拒绝" value="已拒绝" />
          <el-option label="已退款" value="已退款" />
        </el-select>

      </el-form-item>
    </el-form>
    <div style="text-align: right;">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit">提交</el-button>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  props: {
    refundData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      refund: {
        id: null,
        orderId: '',
        userId: '',
        reason: '',
        amount: '',
        status: '',
        express: ''
      }
    }
  },
  watch: {
    refundData: {
      handler(newVal) {
        this.refund = { ...newVal }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    async submit() {
      try {
        const res = await request.post('/spba-api/refund/update', this.refund)
        if (res.code === 20000) {
          this.$message.success('处理成功')
          this.$emit('closeDialog')
          this.$emit('refreshTable')
        } else {
          this.$message.error(res.message || '提交失败')
        }
      } catch (error) {
        this.$message.error('提交失败')
        console.error(error)
      }
    },
    cancel() {
      this.$emit('closeDialog')
    }
  }
}
</script>
