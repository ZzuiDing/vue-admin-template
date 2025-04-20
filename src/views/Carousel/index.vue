<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" title="修改轮播图" width="50%">
      <el-form ref="carouselForm" :model="carouselForm" label-width="100px">
        <el-form-item label="图片上传">
          <el-upload
            class="upload-demo"
            action=""
            :http-request="handleUpload"
            :before-upload="beforeUpload"
            :show-file-list="false"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <img v-if="carouselForm.imageUrl" :src="carouselForm.imageUrl" class="avatar" alt="上传图片">
          </el-upload>
        </el-form-item>

        <el-form-item label="描述">
          <el-input v-model="carouselForm.description" placeholder="请输入描述" />
        </el-form-item>

        <el-form-item label="排序">
          <el-input-number v-model="carouselForm.sortOrder" :min="1" />
        </el-form-item>
      </el-form>

      <!-- ✅ 正确的 footer 插槽写法：放在 el-dialog 的 slot="footer" 中 -->
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>

    <!-- 轮播图列表 -->
    <el-table :data="carouselList" style="width: 100%; margin-top: 20px">
      <el-table-column prop="imageUrl" label="图片" width="180">
        <template slot-scope="scope">
          <img :src="scope.row.imageUrl" style="width: 100px; height: 60px; object-fit: cover">
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="sortOrder" label="排序" />
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="small" @click="editCarousel(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteCarousel(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-button type="primary" style="margin-top: 20px" @click="showAddDialog">新增轮播图</el-button>
  </div>
</template>

<script>
import { uploadToOSS } from '@/api/file'
import axios from 'axios'

export default {
  data() {
    return {
      carouselList: [], // 轮播图数据列表
      dialogVisible: false,
      carouselForm: {
        id: null,
        imageUrl: '',
        description: '',
        sortOrder: 1
      }
    }
  },
  mounted() {
    this.fetchCarousels()
  },
  methods: {
    fetchCarousels() {
      // 从后端获取轮播图数据
      axios.get('http://localhost:9090/spba-api/carousel/getAllCarousels')
        .then(response => {
          this.carouselList = response.data.data
          console.log('轮播图数据:', this.carouselList)
        })
    },
    async handleUpload(parmas) {
      // 上传文件到OSS
      const file = parmas.file
      try {
        const url = await uploadToOSS(file)
        this.carouselForm.imageUrl = url
        this.$message.success('上传成功')
      } catch (error) {
        console.error('上传失败:', error)
        this.$message.error('上传失败，请重试')
      }
    },
    // handleSuccess(response, file, fileList) {
    //   // 上传成功后的回调，更新图片URL
    //   this.carouselForm.imageUrl = uploadToOSS(file)
    // },
    beforeUpload(file) {
      const isImage = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isImage) {
        this.$message.error('只能上传图片文件')
      }
      return isImage
    },
    showAddDialog() {
      this.dialogVisible = true
      this.carouselForm = { id: null, imageUrl: '', description: '', sortOrder: 1 } // 重置表单
    },
    submitForm() {
      if (this.carouselForm.id) {
        // 编辑现有的轮播图
        axios.put('http://localhost:9090/spba-api/carousel/update', this.carouselForm)
          .then(() => {
            this.dialogVisible = false
            this.fetchCarousels() // 刷新轮播图列表
          })
      } else {
        // 新增轮播图
        axios.post('http://localhost:9090/spba-api/carousel/add', this.carouselForm)
          .then(() => {
            this.dialogVisible = false
            this.fetchCarousels() // 刷新轮播图列表
          })
      }
    },
    editCarousel(row) {
      this.carouselForm = { ...row } // 填充表单数据
      this.dialogVisible = true
    },
    deleteCarousel(id) {
      axios.delete(`http://localhost:9090/spba-api/carousel/delete/${id}`)
        .then(() => {
          this.fetchCarousels() // 删除后刷新轮播图列表
        })
    }
  }
}
</script>

<style scoped>
.avatar {
  width: 100px;
  height: 60px;
  object-fit: cover;
}
</style>
