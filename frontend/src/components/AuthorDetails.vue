<template>
  <div class="container mt-5 mb-5 pt-5" style="background-color: white">
    <div class="container h-100 row m-0">
      <div class="text-center">
        <h2>{{ author.firstname }} {{ author.lastname }}</h2>
        <router-link v-if="isAdmin" :to="{ name: 'authors-edit', params: { id: author.id, firstname: author.firstname, lastname: author.lastname, birthDate: author.birthDate, deathDate: author.deathDate, description: author.description }}"><font-awesome-icon :icon="['fas', 'pen-to-square']" style="color: #27A2FC"/></router-link>
        <router-link class="ps-3" v-if="isAdmin" :to="{ name: 'books-edit', params: { authorId: author.id } }"><font-awesome-icon :icon="['fas', 'plus']" style="color: #27A2FC" /></router-link>
      </div>
      <hr class="mt-5 mb-5 " style="padding: 0; color: #27A2FC">
      <div v-if="author.description" class="col-md-8 mb-md-0 mb-sm-5">
        {{ author.description }}
      </div>
      <div v-else class="col-md-8 mb-md-0 mb-sm-5 text-center align-self-center">
        <h4>No description</h4>
      </div>
      <div class="col-md-4 pt-5 pb-5" style="background-color: #efefef">
        <div class="row justify-content-center">
          <h5 class="col-12 d-flex justify-content-center" style="text-transform: uppercase">Average books rating</h5>
          <div class="col-12 justify-content-center">
            <div class="text-center">
              <font-awesome-icon :icon="['fas', 'star']" style="color: #27A2FC"/>
              <span style="font-size: 32px; padding-left: 10px; color: #27A2FC">{{ stats.rate }}</span> / 5
            </div>
          </div>
          <div class="col-12 justify-content-center pt-3">
            <div class="text-center">
              <span style="color: #27A2FC">{{ stats.numberOfRates }}</span> rates of author books
            </div>
          </div>
          <div class="col-12 justify-content-center">
            <div class="text-center">
              <span style="color: #27A2FC">{{ stats.numberOfComments }}</span> comments of author books
            </div>
          </div>
        </div>
      </div>
    </div>
    <hr class="mx-4 mb-5 mt-5" style="padding: 0; color: #27A2FC">
    <div class="row justify-content-center">
      <div class="col-md-8 mb-5 text-center justify-content-center">
        <div v-if="typeof books !== 'undefined' && books.length > 0" class="row m-0">
          <div v-for="book in books" :key="book.id" class="col-lg-4 col-md-6 col-12 mb-4">
            <div class="card">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">
                  <router-link :to="'/book-details/' + book.id" class="card-title-router">{{ book.title }}</router-link>
                </h5>
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
      <div class="row pb-5">
        <el-pagination
            background
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
            :page-count="page.totalPages"
            class="pagination">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>


import AuthorService from "@/services/AuthorService";
import BookService from "@/services/BookService";
import ShelfService from "@/services/ShelfService";

export default {
  name: "AuthorDetails",
  data() {
    return {
      author: {},
      books: [],
      stats: {},
      page: {
        size: 10,
        totalElements: 0,
        totalPages: 1,
        number: 0
      }
    }
  },
  methods: {
    retrieveAuthor() {
      AuthorService.get(this.$route.params.authorId)
          .then(response => {
            this.author = response.data;
          })
          .catch(error => console.log(error))

      ShelfService.getAuthorStats(this.$route.params.authorId)
          .then(response => {
            let stats = response.data;
            this.stats["numberOfRates"] = stats.numberOfRates
            this.stats["numberOfComments"] = stats.numberOfComments
            this.stats["rate"] = stats.numberOfRates > 0 ? stats.rate : "-"
          })
          .catch(error => console.log(error))
    },
    retrieveBooks(page) {
      BookService.getAllAuthorBooks(page, 3, this.$route.params.authorId)
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
                    this.books[i]["rate"] = stats.rate
                  })
                  .catch(error => console.log(error))
            }
          })
          .catch(error => console.log(error))
    },
    handleCurrentChange(page) {
      this.retrieveBooks(page - 1)
    }
  },
  mounted() {
    this.retrieveAuthor()
    this.retrieveBooks(0)
  }
};
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
  background-color: #efefef;
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