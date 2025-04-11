<template>
  <el-dialog title="选择收货地址" :visible.sync="visible" width="50%">
    <el-radio-group v-model="selectedId">
      <el-card
        v-for="address in addressList"
        :key="address.id"
        class="address-item"
      >
        <el-radio :label="address.id">
          <div>
            <p><strong>{{ address.name }}</strong> - {{ address.phone }}</p>
            <p>{{ address.address }}</p>
          </div>
        </el-radio>
      </el-card>
    </el-radio-group>

    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="confirmAddress">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getAllAddresses } from '@/api/address'

export default {
  name: 'AddressSelect',
  props: {
    value: Boolean // 用于控制显示
  },
  data() {
    return {
      visible: this.value,
      addressList: [],
      selectedId: null
    }
  },
  watch: {
    value(val) {
      this.visible = val
      if (val) this.loadAddressList()
    },
    visible(val) {
      this.$emit('input', val)
    }
  },
  mounted() {
    this.loadAddressList()
  },
  methods: {
    async loadAddressList() {
      const response = await getAllAddresses()
      if (response.code === 20000) {
        this.addressList = response.data.records
      } else {
        this.$message.error('获取地址列表失败')
      }
      // this.addressList = []
    },
    confirmAddress() {
      const selected = this.addressList.find(a => a.id === this.selectedId)
      if (selected) {
        this.$emit('confirm', selected)
        this.visible = false
      } else {
        this.$message.warning('请选择一个地址')
      }
    }
  }
}
</script>

<style scoped>
.address-item {
  margin-bottom: 10px;
}
</style>
