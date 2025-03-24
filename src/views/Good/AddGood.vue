<template>
  <div>
    <el-form ref="form" :model="good" label-width="100px">
      <el-form-item label="商品名称">
        <el-input v-model="good.name" />
      </el-form-item>
      <el-form-item label="价格">
        <el-input v-model="good.price" type="number" />
      </el-form-item>
      <el-form-item label="图片">
        <!--        <input type="file" @change="handleFileChange"/>-->
        <!--        <img v-if="imageUrl" :src="imageUrl" alt="上传预览" style="max-width: 300px; margin-top: 10px;">-->
        <el-upload
          class="avatar-uploader"
          action=""
          :http-request="handleUpload"
          :show-file-list="false"
          :before-upload="beforeUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>
      <el-form-item label="简介">
        <el-input v-model="good.desc" />
      </el-form-item>
      <el-form-item label="商品类别">
        <el-select v-model="good.kind" placeholder="请选择类别">
          <el-option label="电子产品" value="电子产品" />
          <el-option label="服装" value="服装" />
          <el-option label="食品" value="食品" />
        </el-select>
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
import { uploadToOSS } from '@/api/file'

export default {
  data() {
    return {
      good: {
        name: '',
        price: '',
        desc: '',
        kind: ''
      },
      file: null,
      imageUrl: ''
    }
  },
  methods: {
    async submitForm() {
      try {
        await axios.post('http://localhost:9090/spba-api/goods/add', this.good)
        this.$message.success('新增成功！')
        this.resetForm() // 提交后清空数据
        this.$emit('closeDialog') // 关闭弹窗
        this.$emit('refreshTable') // 通知主页面刷新表格
      } catch (error) {
        console.error('提交失败:', error)
        this.$message.error('提交失败，请检查输入！')
      }
    },
    // handleFileChange(event) {
    //   this.file = event.target.files[0];
    //   this.uploadFile();
    // },
    // async uploadFile() {
    //   if (!this.file) {
    //     alert('请选择文件');
    //     return;
    //   }
    //   try {
    //     this.imageUrl = await uploadToOSS(this.file);
    //     console.log('上传成功，图片地址：', this.imageUrl);
    //   } catch (error) {
    //     console.error('上传失败:', error);
    //   }
    // },
    resetForm() {
      this.good = {
        name: '',
        price: '',
        desc: '',
        kind: ''
      }
      this.file = null
      this.imageUrl = ''
    },
    closeDialog() {
      this.resetForm()
      this.$emit('closeDialog') // 触发父组件的关闭事件
    },
    async handleUpload(params) {
      const file = params.file
      try {
        const url = await uploadToOSS(file)
        this.imageUrl = url
        this.$message.success('上传成功')
      } catch (error) {
        console.error('上传失败:', error)
        this.$message.error('上传失败，请重试')
      }
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传图片格式只能是 JPG 或 PNG!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }

      return isJPG && isLt2M
    }
  }
}
</script>
<style>
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
