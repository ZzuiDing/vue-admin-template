<template>
  <div>
    <el-form ref="form" :model="localKind" label-width="100px">
      <!-- 只有在 kind.id 存在时才显示 ID 输入框 -->
      <el-form-item v-if="localKind.id" label="ID" prop="id">
        <el-input v-model="localKind.id" placeholder="请输入商品ID" :disabled="true" />
      </el-form-item>

      <el-form-item label="种类名称" prop="kindName">
        <el-input v-model="localKind.kindName" placeholder="请输入名称" />
      </el-form-item>
    </el-form>

    <div style="text-align: right">
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="submitForm">提交</el-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: {
    kind: Object // 接收父组件传递的 kind prop
  },
  data() {
    return {
      // 如果 kind 是 null 或 undefined，使用默认对象
      localKind: { ...this.kind } || { id: '', kindName: '' }
    }
  },
  watch: {
    // 监听 kind 变化，确保 kind 不为 null 或 undefined
    kind(newKind) {
      if (newKind && (newKind.id !== this.localKind.id || newKind.kindName !== this.localKind.kindName)) {
        this.localKind = { ...newKind }
      }
    }
  },
  methods: {
    async submitForm() {
      try {
        if (!this.localKind.id) {
          await axios.post('http://localhost:9090/spba-api/kind/add', { kindName: this.localKind.kindName })
          this.$message.success('新增成功！')
        } else {
          await axios.post('http://localhost:9090/spba-api/kind/update', this.localKind)
          this.$message.success('修改成功！')
        }
        this.resetForm()
        this.$emit('closeDialog')
        this.$emit('refreshTable')
      } catch (error) {
        console.error('提交失败:', error)
        this.$message.error('提交失败，请检查输入！')
      }
    },
    resetForm() {
      this.localKind = { id: '', kindName: '' } // 清空 localKind
    },
    closeDialog() {
      this.resetForm()
      this.$emit('closeDialog')
    }
  }
}
</script>
