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
      <el-form-item label="性别" prop="gender">
        <el-select v-model="form.gender" placeholder="请选择性别">
          <el-option label="男" value="男" />
          <el-option label="女" value="女" />
        </el-select>
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <template v-if="$store.getters.role === 2">
          <el-select v-model="form.role" placeholder="请选择角色">
            <el-option :label="'用户'" :value="1" />
            <el-option :label="'管理员'" :value="2" />
          </el-select>
        </template>
        <template v-else>
          <span>{{ roleText(form.role) }}</span>
        </template>
      </el-form-item>

      <el-form-item label="密码" prop="passwd">
        <el-input v-model="form.passwd" type="password" placeholder="请输入密码" />
      </el-form-item>
      <el-form-item label="头像">
        <el-upload
          class="avatar-uploader"
          :http-request="handleUpload"
          :show-file-list="false"
          :before-upload="beforeUpload"
        >
          <img v-if="form.image" :src="form.image" class="avatar" alt="">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>
    </el-form>

    <div style="text-align: right; margin-top: 10px;">
      <el-button type="primary" @click="handleSubmit">提交</el-button>
      <el-button @click="closeDialog">取消</el-button>
    </div>
  </div>
</template>

<script>
import { registerUser, updateUserInfo } from '@/api/user'
import { uploadToOSS } from '@/api/file'

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
        image: '',
        passwd: ''
      },
      rules: {
        name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        role: [{ required: true, message: '请选择角色', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              if (![1, 2].includes(Number(value))) {
                callback(new Error('角色值非法'))
              } else {
                callback()
              }
            }, trigger: 'change'
          }],
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
    roleText(val) {
      return val === 2 ? '管理员' : '用户'
    },
    async handleSubmit() {
      await this.$refs.formRef.validate(async valid => {
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
    },
    async handleUpload(params) {
      const file = params.file
      try {
        const url = await uploadToOSS(file)
        console.log('上传成功:', url)
        this.form.image = url
        this.$message.success('上传成功')
      } catch (error) {
        console.error('上传失败:', error)
        this.$message.error('上传失败，请重试')
      }
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传图片格式只能是 JPG 或 PNG!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }

      return isJPG && isLt2M
    },
    resetForm() {
      this.form = {
        id: null,
        name: '',
        email: '',
        phone: '',
        role: '',
        image: '',
        passwd: ''
      }
    },
    closeDialog() {
      this.resetForm()
      this.$emit('closeDialog')
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

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
