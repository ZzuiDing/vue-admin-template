<template>
  <div>
    <el-form ref="form" :model="localKind" label-width="100px">
      <!-- 编辑时显示 ID -->
      <el-form-item v-if="localKind.id" label="ID" prop="id">
        <el-input v-model="localKind.id" disabled />
      </el-form-item>

      <el-form-item label="种类名称" prop="kindName">
        <el-input v-model="localKind.kindName" placeholder="请输入名称" />
      </el-form-item>
    </el-form>

    <div style="text-align: right; margin-top: 10px;">
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="submitForm">提交</el-button>
    </div>
  </div>
</template>

<script>
import { addKind, updateKind } from '@/api/kind'

export default {
  name: 'AddKind',
  props: {
    kind: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      // 本地拷贝，避免直接修改父组件传入的 prop
      localKind: {
        id: '',
        kindName: ''
      }
    }
  },
  computed: {
    isEdit() {
      return !!(this.localKind && this.localKind.id)
    }
  },
  watch: {
    // 当父组件传入的 kind 变化时，更新本地表单
    kind: {
      handler(val) {
        if (val && val.id != null) {
          this.localKind = { ...val }
        } else {
          this.resetForm()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    resetForm() {
      this.localKind = {
        id: '',
        kindName: ''
      }
      // 如果你有校验规则，可以调用 this.$refs.form.resetFields()
    },
    closeDialog() {
      this.resetForm()
      this.$emit('closeDialog')
    },
    async submitForm() {
      try {
        const fn = this.isEdit ? updateKind : addKind
        const res = await fn(this.localKind)
        if (res.code === 20000) {
          this.$message.success(this.isEdit ? '修改成功！' : '新增成功！')
          this.$emit('refreshTable')
          this.closeDialog()
        } else {
          this.$message.error(res.message || '操作失败')
        }
      } catch (error) {
        console.error('提交失败:', error)
        this.$message.error('提交失败，请重试')
      }
    }
  }
}
</script>

<style scoped>
/* 根据需要添加样式 */
</style>
