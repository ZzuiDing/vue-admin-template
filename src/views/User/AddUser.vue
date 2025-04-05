<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
    <el-form-item label="用户名" prop="name">
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="form.email" />
    </el-form-item>
    <el-form-item label="手机号" prop="phone">
      <el-input v-model="form.phone" />
    </el-form-item>
    <el-form-item label="角色" prop="role">
      <el-select v-model="form.role" placeholder="请选择角色">
        <el-option label="管理员" value="admin" />
        <el-option label="用户" value="user" />
      </el-select>
    </el-form-item>
    <el-form-item label="密码" prop="passwd">
      <el-input v-model="form.passwd" type="passwd" />
    </el-form-item>
    <el-form-item label="头像">
      <el-upload
        class="avatar-uploader"
        action="http://localhost:9090/spba-api/upload"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
      >
        <img v-if="form.avatar" :src="form.avatar" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon" />
      </el-upload>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
      <el-button @click="$emit('closeDialog')">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import axios from 'axios'

export default {
  props: {
    userData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      form: {
        id: null,
        name: '',
        email: '',
        phone: '',
        role: '',
        avatar: '',
        passwd: ''
      },
      rules: {
        name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        role: [{ required: true, message: '请选择角色', trigger: 'change' }],
        passwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '密码长度在 6 到 20 个字符之间', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    userData: {
      handler(val) {
        // 如果 userData 是一个有效对象，才赋值
        if (val && typeof val === 'object') {
          this.form = { ...val }
        }
      },
      immediate: true
    }
  },
  methods: {
    handleAvatarSuccess(res) {
      this.form.avatar = res.data // 假设上传成功返回 { data: '图片地址' }
    },
    async handleSubmit() {
      this.$refs.formRef.validate(async valid => {
        if (!valid) return
        try {
          // 确保 userData.id 存在
          const isEdit = this.userData && this.userData.id
          const url = isEdit
            ? 'http://localhost:9090/spba-api/user/updateUserInfo'
            : 'http://localhost:9090/spba-api/user/register'

          const response = await axios.post(url, this.form)
          if (response.data.code === 20000) {
            this.$message.success(isEdit ? '编辑成功' : '新增成功')
            this.$emit('refreshTable')
            this.$emit('closeDialog')
          } else {
            this.$message.error(response.data.message || '操作失败')
          }
        } catch (e) {
          console.error(e)
          this.$message.error('提交出错')
        }
      })
    }

  }
}
</script>

<style scoped>
.avatar-uploader {
  display: flex;
  align-items: center;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
}
</style>
