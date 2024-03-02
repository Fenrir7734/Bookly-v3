<template>
  <div class="container mt-5 px-5 h-100">
    <div class="mb-5 text-center">
      <h2>Books</h2>
    </div>
  </div>
  <div class="row justify-content-center">
    <div class="col-md-8 mb-5 text-center justify-content-center">
      <div v-if="typeof books !== 'undefined' && books.length > 0" class="row m-0">
        <div v-for="book in books" :key="book.id" class="col-lg-4 col-md-6 col-12 mb-4">
          <div class="card">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">
                <router-link :to="'/book-details/' + book.id" class="card-title-router">{{ book.title }}</router-link>
              </h5>
              <p class="card-subtitle">
                <i>by <router-link :to="'/author-details/' + getAuthorId(book._links.Author.href)">{{ book.author }}</router-link></i>
              </p>
              <p class="card-text">{{ book.description }}</p>
              <div class="row">
                <div class="col-md-4">
                  <font-awesome-icon :icon="['fas', 'eye']"/> {{ book.numberOfRates }}
                </div>
                <div class="col-md-4">
                  <font-awesome-icon :icon="['fas', 'comment']"/> {{ book.numberOfComments }}
                </div>
                <div class="col-md-4">
                  <font-awesome-icon :icon="['fas', 'star']"/> {{ book.rate }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <h2>Books not found</h2>
      </div>
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
import BookService from "@/services/BookService";
import ShelfService from "@/services/ShelfService";

export default {
  name: 'BooksList',
  data() {
    return {
      books: [],
      booksStats: [],
      page: {
        size: 10,
        totalElements: 0,
        totalPages: 1,
        number: 0
      }
    }
  },
  methods: {
    retrieveBooks(page) {
      BookService.getAll(page, 9, this.$route.params.genre)
          .then(response => {
            this.books = response.data._embedded
                ? response.data._embedded.books
                : []
            this.page.size = response.data.page.size
            this.page.totalElements = response.data.page.totalElements
            this.page.totalPages = response.data.page.totalPages
            this.page.number = response.data.page.number

            for (let i = 0; i < this.books.length; i++) {
              ShelfService.getBookStats(this.books[i].id)
                  .then(response => {
                    let stats = response.data;
                    this.books[i]["numberOfRates"] = stats.numberOfRates
                    this.books[i]["numberOfComments"] = stats.numberOfComments
                    this.books[i]["rate"] = stats.numberOfRates > 0 ? stats.rate : "-"
                  })
                  .catch(error => console.log(error))
            }
          })
          .catch(error => console.log(error))
    },
    getAuthorId(link) {
      return link.slice(34)
    },
    getBookStatus(bookId) {
      console.log(bookId)
    },
    handleCurrentChange(page) {
      this.retrieveBooks(page - 1)
    }
  },
  mounted() {
    this.retrieveBooks(0)
  }
}
</script>

<style scoped>
p {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card{
  border: 0;
}
.card-title{
  font-weight: bold;
}
.card-title-router {
  text-decoration: none;
  color: black;
}
.card-title-router:hover {
  transition: 0.2s;
  color: #27A2FC !important;
}
</style>