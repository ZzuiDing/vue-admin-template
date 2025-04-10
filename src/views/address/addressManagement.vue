<template>
  <div>
    <el-form
      ref="formRef"
      :model="form"
      label-width="100px"
      :rules="rules"
    >
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
      <el-form-item v-if="form.userId" label="用户ID" prop="userId">
        <el-input v-model="form.userId" disabled />
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
  </div>
</template>

<script>
import {
  createAddress,
  updateAddress
} from '@/api/address'

export default {
  name: 'EditAddress',
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
  computed: {
    isEdit() {
      return this.form.id != null
    }
  },
  watch: {
    addressData: {
      immediate: true,
      handler(val) {
        if (val && val.id != null) {
          this.form = { ...val }
        } else {
          this.resetForm()
        }
      }
    }
  },
  methods: {
    resetForm() {
      this.form = {
        id: null,
        address: '',
        name: '',
        phone: '',
        desc: '',
        userId: ''
      }
      // 如果你需要清除校验状态，可调用：
      // this.$refs.formRef.clearValidate()
    },
    closeDialog() {
      this.$emit('closeDialog')
      this.resetForm()
    },
    submitForm() {
      this.$refs.formRef.validate(async valid => {
        if (!valid) return

        try {
          const fn = this.isEdit ? updateAddress : createAddress
          const res = await fn(this.form)
          if (res.code === 20000) {
            this.$message.success(this.isEdit ? '修改成功' : '新增成功')
            this.$emit('refreshTable')
            this.closeDialog()
          } else {
            this.$message.error(res.message || '操作失败')
          }
        } catch (err) {
          console.error('保存失败:', err)
          this.$message.error('保存失败，请重试')
        }
      })
    }
  }
}
</script>

<style scoped>
.dialog-footer {
  text-align: right;
  margin-top: 20px;
}
</style>
