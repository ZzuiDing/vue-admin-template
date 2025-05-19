<template>
  <div>
    <el-form ref="form" :model="good" :rules="rules" label-width="100px">
      <!-- 新增：京东商品ID输入 -->
      <el-form-item label="京东商品链接">
        <el-input v-model="jdGoodUrl" placeholder="输入京东商品链接" style="width: 300px; margin-right: 10px;" />
        <el-button type="primary" @click="fetchJDGoodInform">拉取</el-button>
      </el-form-item>
      <el-form-item v-if="good.id !== null" label="商品ID">
        <el-input v-model="good.id" disabled />
      </el-form-item>
      <el-form-item v-if="good.id !== null" label="用户ID">
        <el-input v-model="good.userId" disabled />
      </el-form-item>
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="good.name" />
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input-number v-model="good.price" :min="0" />
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
      <el-form-item label="简介" prop="desc">
        <el-input v-model="good.desc" />
      </el-form-item>
      <el-form-item label="商品类别" prop="kindId">
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
        price: 0,
        picture: '',
        kindId: '',
        desc: ''
      },
      jdGoodUrl: '',
      kindList: [], // 存储类别列表
      file: null,
      rules: {
        name: [
          { required: true, message: '商品名称不能为空', trigger: 'blur' }
        ],
        picture: [
          { required: true, message: '商品图片不能为空', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '价格不能为空', trigger: 'blur' },
          { type: 'number', message: '价格必须是数字', trigger: 'blur' }
        ],
        kindId: [
          { required: true, message: '请选择商品类别', trigger: 'change' }
        ]
      }
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
    async fetchJDGoodInform() {
      if (!this.jdGoodUrl) return this.$message.warning('请输入京东商品链接')

      // 提取商品ID的正则表达式
      const regex = /item\.jd\.com\/(\d+)\.html/
      const match = this.jdGoodUrl.match(regex)

      if (!match) {
        return this.$message.warning('链接格式错误，请输入有效的京东商品链接')
      }

      const jdGoodId = match[1] // 提取商品ID
      try {
        const res = await axios.get('http://localhost:9090/spba-api/jdGoods/getJDGoodInform', {
          params: { goodId: jdGoodId }
        })
        const data = JSON.parse(res.data)
        const item = data?.jingdong_new_ware_baseproduct_get_responce?.listproductbase_result?.[0]
        if (item) {
          this.good.name = item.name
          this.good.picture = item.imagePath
          this.$message.success('信息填充成功')
        } else {
          this.$message.error('未找到商品信息')
        }
      } catch (err) {
        console.error(err)
        this.$message.error('请求出错')
      }
    },
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
      await this.$refs.form.validate(async(valid) => {
        if (!isNaN(this.good.price)) {
          this.good.price = Number(this.good.price)
        }
        if (valid) {
          try {
            let url = ''
            if (!this.good.id) {
              url = 'http://localhost:9090/spba-api/goods/add'
            } else {
              url = 'http://localhost:9090/spba-api/goods/update'
            }

            const response = await request.post(url, this.good)
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
              this.$message.error(response.message || '提交失败，请检查输入！')
            }
          } catch (error) {
            console.error('提交失败:', error)
            this.$message.error('提交失败，请检查输入！')
          }
        } else {
          this.$message.error('表单验证失败，请检查输入！')
        }
      })
    },
    resetForm() {
      this.good = {
        id: null,
        userId: null,
        name: '',
        price: '',
        picture: '',
        kindId: '',
        desc: ''
      }
      this.jdGoodId = ''
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
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp'
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
