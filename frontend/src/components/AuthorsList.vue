<template>
  <div class="container mt-5 px-5 h-100">
    <div class="mb-5 text-center">
      <h2>Authors</h2>
      <router-link class="ps-3" v-if="isAdmin" :to="{ name: 'authors-edit' }"><font-awesome-icon :icon="['fas', 'plus']" style="color: #27A2FC" /></router-link>
    </div>
  </div>
  <div class="row justify-content-center">
    <div class="col-md-8 mb-5 text-center justify-content-center">
      <span v-for="author in authors" :key="author.id">
          <router-link :to="'/author-details/' + author.id">
            {{ author.name }}
          </router-link><br>
      </span>
    </div>
    <div class="row">
      <el-pagination
          background
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :page-count="page.totalPages"
      class="pagination">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import AuthorService from "@/services/AuthorService";

export default {
  name: "AuthorsList",
  data() {
    return {
      authors: [],
      page: {
        size: 10,
        totalElements: 0,
        totalPages: 1,
        number: 0
      }
    }
  },
  methods: {
    retrieveAuthors(page) {
      AuthorService.getAll(page, 10)
          .then(response => {
            this.authors = response.data._embedded.authors
            this.page.size = response.data.page.size
            this.page.totalElements = response.data.page.totalElements
            this.page.totalPages = response.data.page.totalPages
            this.page.number = response.data.page.number
          })
          .catch(error => console.log(error))
    },
    handleCurrentChange(page) {
      this.retrieveAuthors(page - 1)
    }
  },
  mounted() {
    this.retrieveAuthors(0)
  }
}
</script>

<style scoped>

</style>