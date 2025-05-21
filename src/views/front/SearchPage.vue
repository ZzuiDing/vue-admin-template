<template>
  <div class="search-page">
    <common-header
      :search-query="keyword"
      @goHome="home"
      @login="login"
      @backend="backend"
    />
    <h2>搜索结果：{{ keyword }}</h2>

    <!-- 分类和搜索信息 -->
    <el-row :gutter="20" class="filter-container">
      <el-col :span="6">
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
    <div v-if="goods.length">
      <el-row :gutter="20">
        <el-col v-for="item in pagedGoods" :key="item.id" :span="6">
          <el-card shadow="hover" @click.native="goToProductDetail(item.id)">
            <img :src="item.picture" class="good-image">
            <div class="good-title">{{ item.name }}</div>
            <div class="good-price">￥{{ item.price }}</div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div v-else>
      <p>没有找到相关商品</p>
    </div>

    <!-- 分页器 -->
    <el-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :total="totalItems"
      layout="total, prev, pager, next, jumper"
      @current-change="handlePageChange"
    />
    <common-footer />
  </div>
</template>

<script>
import { searchGood } from '@/api/good'
import { getAllKinds } from '@/api/kind'
import CommonHeader from '@/layout/components/CommonHeader.vue'
import CommonFooter from '@/layout/components/CommonFooter.vue'

export default {
  name: 'SearchPage',
  components: { CommonFooter, CommonHeader },
  data() {
    return {
      goods: [],
      categories: [],
      selectedCategory: '',
      keyword: '',
      currentPage: 1,
      pageSize: 8,
      totalItems: 0
    }
  },
  computed: {
    pagedGoods() {
      return this.goods
    }
  },
  watch: {
    '$route.query.keyword': {
      handler() {
        this.keyword = this.$route.query.keyword || ''
        this.currentPage = 1
        this.fetchGoods()
      },
      immediate: true
    }
  },
  mounted() {
    this.fetchCategories()
  },
  methods: {
    async fetchGoods() {
      const res = await searchGood({
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        keyword: this.keyword
      })
      if (res.code === 20000) {
        this.goods = res.data.records
        this.totalItems = res.data.total
        console.log('goods:', this.goods)
      }
    },
    async fetchCategories() {
      const res = await getAllKinds()
      if (res.code === 20000) {
        this.categories = res.data.records
      }
    },
    handlePageChange(page) {
      this.currentPage = page
      this.fetchGoods()
    },
    handleCategoryChange() {
      this.currentPage = 1
      this.fetchGoods()
    },
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
.search-page {
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
