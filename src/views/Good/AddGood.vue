<template>
  <div>
    <el-form ref="form" :model="good" label-width="100px">
      <el-form-item v-if="good.id!== null" label="商品ID">
        <el-input v-model="good.id" disabled />
      </el-form-item>
      <el-form-item v-if="good.id!== null" label="用户ID">
        <el-input v-model="good.userId" disabled />
      </el-form-item>
      <el-form-item label="商品名称">
        <el-input v-model="good.name" />
      </el-form-item>
      <el-form-item label="价格">
        <el-input v-model="good.price" type="number" />
      </el-form-item>
      <el-form-item label="图片">
        <el-upload
          class="avatar-uploader"
          action=""
          :http-request="handleUpload"
          :show-file-list="false"
          :before-upload="beforeUpload"
        >
          <img v-if="good.picture" :src="good.picture" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>
      <el-form-item label="简介">
        <el-input v-model="good.desc" />
      </el-form-item>
      <el-form-item label="商品类别">
        <el-select v-model="good.kindId" placeholder="请选择类别">
          <el-option
            v-for="kind in kindList"
            :key="kind.id"
            :label="kind.kindName"
            :value="kind.id"
          />
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
import request from '@/utils/request'

export default {
  props: {
    goodData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      good: {
        id: null,
        userId: null,
        name: '',
        price: '',
        picture: '',
        kindId: '',
        desc: ''
      },
      kindList: [], // 存储类别列表
      file: null
    }
  },
  watch: {
    // 监听父组件传入的 goodData，自动填充表单
    goodData: {
      handler(newGoodData) {
        if (newGoodData && Object.keys(newGoodData).length > 0) {
          this.good = Object.assign({}, newGoodData) // 确保 Vue 监听
        } else {
          this.resetForm() // 为空时清空
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.fetchKindList()
  },
  methods: {
    // 获取商品类别列表
    async fetchKindList() {
      try {
        const response = await axios.get('http://localhost:9090/spba-api/kind/getAll')
        if (response.data.code === 20000) {
          this.kindList = response.data.data.records
        } else {
          console.error('获取类别失败:', response.data.message)
        }
      } catch (error) {
        console.error('获取类别失败:', error)
      }
    },
    async submitForm() {
      try {
        // 判断是新增还是修改，根据业务需求选择 URL
        let url = ''
        if (!this.good.id) {
          url = 'http://localhost:9090/spba-api/goods/add'
        } else {
          url = 'http://localhost:9090/spba-api/goods/update'
        }

        // 使用封装的 axios 请求
        const response = await request.post(url, this.good)
        console.log('response:', response)
        // const {data} = response;

        // 判断返回的自定义 code 是否为 20000
        console.log('提交结果:', response.code)
        // console.log('提交结果:', response.data.code);
        if (response.code === 20000) {
          if (!this.good.id) {
            this.$message.success('新增成功！')
          } else {
            this.$message.success('修改成功！')
          }
          this.resetForm()
          this.$emit('closeDialog')
          this.$emit('refreshTable')
        } else {
          // 如果 code 不是 20000，提示错误信息
          this.$message.error(response.message || '提交失败，请检查输入！')
        }
      } catch (error) {
        // 捕获请求错误
        console.error('提交失败:', error)
        this.$message.error('提交失败，请检查输入！')
      }
    },
    resetForm() {
      this.good = { // 重置表单数据
        id: null,
        userId: null,
        name: '',
        price: '',
        picture: '',
        kind: '',
        desc: ''
      }
      this.file = null
    },
    closeDialog() {
      this.resetForm()
      this.$emit('closeDialog')
    },
    async handleUpload(params) {
      const file = params.file
      try {
        const url = await uploadToOSS(file)
        this.good.picture = url
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
