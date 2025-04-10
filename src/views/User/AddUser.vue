<template>
  <div>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="用户名" prop="name">
        <el-input v-model="form.name" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select v-model="form.role" placeholder="请选择角色">
          <el-option label="管理员" value="admin" />
          <el-option label="用户" value="user" />
        </el-select>
      </el-form-item>
      <el-form-item label="密码" prop="passwd">
        <!-- 注意：type 为 password -->
        <el-input v-model="form.passwd" type="password" placeholder="请输入密码" />
      </el-form-item>
      <el-form-item label="头像">
        <el-upload
          class="avatar-uploader"
          action="http://localhost:9090/spba-api/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
        >
          <img v-if="form.avatar" :src="form.avatar" class="avatar" alt="">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>
    </el-form>

    <div style="text-align: right; margin-top: 10px;">
      <el-button type="primary" @click="handleSubmit">提交</el-button>
      <el-button @click="$emit('closeDialog')">取消</el-button>
    </div>
  </div>
</template>

<script>
import { registerUser, updateUserInfo } from '@/api/user'

export default {
  name: 'AddUser',
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
          { min: 6, max: 20, message: '密码长度在6到20个字符之间', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    userData: {
      immediate: true,
      handler(val) {
        if (val && Object.keys(val).length > 0) {
          this.form = { ...val }
        }
      }
    }
  },
  methods: {
    handleAvatarSuccess(res) {
      // 假设上传成功后返回 { data: '图片地址' }
      this.form.avatar = res.data
    },
    async handleSubmit() {
      this.$refs.formRef.validate(async valid => {
        if (!valid) return

        try {
          // 如果 userData 有 id，则表示编辑，否则为新增
          const isEdit = this.userData && this.userData.id
          const urlFn = isEdit ? updateUserInfo : registerUser
          const res = await urlFn(this.form)
          if (res.code === 20000) {
            this.$message.success(isEdit ? '编辑成功' : '新增成功')
            this.$emit('refreshTable')
            this.$emit('closeDialog')
          } else {
            this.$message.error(res.message || '操作失败')
          }
        } catch (error) {
          console.error(error)
          this.$message.error('提交出错，请重试')
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
