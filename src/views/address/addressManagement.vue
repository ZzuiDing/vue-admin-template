<template>
  <div>
    <el-form ref="formRef" :model="form" label-width="100px" :rules="rules">
      <el-form-item label="地址" prop="address">
        <el-input v-model="form.address" />
      </el-form-item>
      <el-form-item label="收件人" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="form.phone" />
      </el-form-item>
      <el-form-item label="备注" prop="desc">
        <el-input v-model="form.desc" type="textarea" />
      </el-form-item>
      <el-form-item label="用户ID" prop="userId">
        <el-input v-model="form.userId" />
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('closeDialog')">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: {
    addressData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      form: {
        id: null,
        address: '',
        name: '',
        phone: '',
        desc: '',
        userId: ''
      },
      rules: {
        address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
        name: [{ required: true, message: '请输入收件人', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入电话', trigger: 'blur' }],
        userId: [{ required: true, message: '请输入用户ID', trigger: 'blur' }]
      }
    }
  },
  watch: {
    addressData: {
      immediate: true,
      handler(val) {
        if (val) this.form = { ...val }
      }
    }
  },
  methods: {
    async submitForm() {
      this.$refs.formRef.validate(async(valid) => {
        if (!valid) return

        const url = this.form.id
          ? 'http://localhost:9090/spba-api/address/update'
          : 'http://localhost:9090/spba-api/address/create'

        try {
          const res = await axios.post(url, this.form)
          if (res.data.code !== 20000) throw new Error(res.data.message)
          this.$message.success(this.form.id ? '修改成功' : '新增成功')
          this.$emit('closeDialog')
          this.$emit('refreshTable')
        } catch (err) {
          this.$message.error('保存失败: ' + err.message)
        }
      })
    }
  }
}
</script>
