<template>

  <div class="hot-goods-page">
    <CommonHeader
      @goHome="home"
      @login="login"
      @backend="backend"
    />
    <h2>全部热销商品</h2>

    <!-- 搜索框和筛选框 -->
    <el-row class="filter-container" :gutter="20">
      <el-col :span="8">
        <el-input
          v-model="searchQuery"
          placeholder="搜索商品"
          prefix-icon="el-icon-search"
          @input="handleSearch"
        />
      </el-col>
      <el-col :span="8">
        <el-select
          v-model="selectedCategory"
          filterable
          clearable
          placeholder="选择分类"
          @change="handleCategoryChange"
        >
          <el-option
            v-for="category in categories"
            :key="category.id"
            :label="category.kindName"
            :value="category.id"
          />
        </el-select>

      </el-col>
    </el-row>

    <!-- 商品展示 -->
    <el-row :gutter="20">
      <el-col v-for="item in pagedGoods" :key="item.id" :span="6">
        <el-card shadow="hover" @click.native="goToProductDetail(item.id)">
          <img :src="item.picture" class="good-image">
          <div class="good-title">{{ item.name }}</div>
          <div class="good-price">￥{{ item.price }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 分页器 -->
    <el-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :total="totalItems"
      layout="total, prev, pager, next, jumper"
      @current-change="handlePageChange"
    />
    <CommonFooter />
  </div>

</template>

<script>
import { topSoldGoods } from '@/api/good'
import { getAllKinds } from '@/api/kind'
import CommonHeader from '@/layout/components/CommonHeader.vue'
import CommonFooter from '@/layout/components/CommonFooter.vue'

export default {
  name: 'HotGoodsPage',
  components: { CommonFooter, CommonHeader },
  data() {
    return {
      goods: [], // 商品列表
      categories: [], // 商品分类
      searchQuery: '', // 搜索框绑定内容
      selectedCategory: '', // 选中的分类
      currentPage: 1, // 当前页数
      pageSize: 8, // 每页显示的商品数量
      totalItems: 0 // 商品总数
    }
  },
  computed: {
    // 根据分页和过滤条件获取分页后的商品
    pagedGoods() {
      return this.goods.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    }
  },
  async mounted() {
    // 获取分类列表
    await this.fetchCategories()
    // 获取商品数据
    await this.fetchGoods()
  },
  methods: {
    // 获取热销商品数据
    async fetchGoods() {
      const params = {
        page: this.currentPage,
        limit: this.pageSize,
        query: this.searchQuery,
        category: this.selectedCategory,
        num: 100
      }
      const res = await topSoldGoods(params)
      if (res.code === 20000) {
        this.goods = res.data.records
        this.totalItems = res.data.total // 设置商品总数
      } else {
        this.$message.error('获取热销商品失败')
      }
    },

    // 获取商品分类
    async fetchCategories() {
      // 假设 API 返回分类数据
      const res = await getAllKinds()
      if (res.code === 20000) {
        this.categories = res.data.records // 获取分类数据
      } else {
        this.$message.error('获取分类数据失败')
      }
    },

    // 搜索框输入时触发
    handleSearch() {
      this.currentPage = 1 // 搜索时重置为第一页
      this.fetchGoods()
    },

    // 分类筛选变化时触发
    handleCategoryChange() {
      this.currentPage = 1 // 筛选时重置为第一页
      this.fetchGoods()
    },

    // 分页器切换页面时触发
    handlePageChange(page) {
      this.currentPage = page
      this.fetchGoods()
    },

    // 跳转到商品详情页
    goToProductDetail(id) {
      this.$router.push(`/product/${id}`)
    },
    home() {
      this.$router.push('/')
    },
    login() {
      this.$router.push('/login')
    },
    backend() {
      this.$router.push('/backend/dashboard')
    }
  }
}
</script>

<style scoped>
.hot-goods-page {
  padding: 20px;
}

.filter-container {
  margin-bottom: 20px;
}

.good-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.good-title {
  font-weight: bold;
  margin: 10px 0 5px;
}

.good-price {
  color: #e4393c;
}

.el-pagination {
  margin-top: 20px;
  text-align: center;
}
</style>
