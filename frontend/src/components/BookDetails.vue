<template>
  <div class="container mt-5 mb-5 pt-5" style="background-color: white">
    <div class="container h-100 row m-0">
      <div class=" text-center">
        <h2>{{ book.title }}</h2>
        <i>by <router-link :to="'/author-details/' + author.id">{{ author.firstname }} {{ author.lastname }}</router-link></i>
        <router-link class="ps-3" v-if="isAdmin" :to="{ name: 'books-edit', params: { id: book.id, isbn: book.isbn, title: book.title, published: book.published, pages: book.pages, description: book.description, authorId: author.id, genreId: book.genreId } }"><font-awesome-icon :icon="['fas', 'pen-to-square']" style="color: #27A2FC" /></router-link>
        <span class="ps-3" v-if="isAdmin" @click="deleteBook"><font-awesome-icon :icon="['fas', 'trash-can']" style="color: #27A2FC" /></span>
      </div>
      <hr class="mt-5 mb-5" style="padding: 0; color: #27A2FC">
      <div class="col-md-8 mb-md-0 mb-sm-5">
        {{ book.description }}
      </div>
      <div class="col-md-4 pt-5 pb-5" style="background-color: #efefef">
        <div v-if="loggedIn" class="row mb-5">
          <div  class="col-12 d-flex justify-content-center">
            <router-link :to="{ name: 'comment-edit', params: { username: currentUserUsername, bookId: book.id, content: userComment.content, rate: userComment.rate, curr: `/book-details/${this.book.id}`, a: 'POST' }}">
              <star-rating
                  :v-model="userComment.rate"
                  :rating="userComment.rate"
                  @update:rating="setRating"
                  :show-rating="false"
                  :star-size="30"
                  active-color="#27a2fc"></star-rating>
            </router-link>
          </div>
        </div>
        <div class="row justify-content-center">
          <h5 class="col-12 d-flex justify-content-center" style="text-transform: uppercase">Average rating</h5>
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
    <hr class="mx-4 mb-2 mt-5" style="padding: 0; color: #27A2FC">
    <div class="container row m-0" >
      <div class="row text-center">
        <div class="col-md-3">
          <i>Pages: {{ book.pages }}</i>
        </div>
        <div class="col-md-3">
          <i>Published: {{ book.published }}</i>
        </div>
        <div class="col-md-3">
          <i>Genre: <router-link :to="'/books/' + genre.name">{{ this.capitalize(genre.name) }}</router-link></i>
        </div>
        <div class="col-md-3">
          <i>ISBN: {{ book.isbn }}</i>
        </div>
      </div>
    </div>
    <hr class="mx-4 mb-5 mt-2" style="padding: 0; color: #27A2FC">
    <div class="container" :key="reload">
      <div class="row">
        <div v-if="typeof comments !== 'undefined' && comments.length > 0" class="row m-0 justify-content-center">
          <div v-for="comment in comments" :key="comment.id" class="col-md-8 mb-2 mt-2">
            <div v-if="comment.content != null" class="card"  >
              <div class="row">
                <div class="col-6" style="padding-left: 20px;">
                  <router-link :to='"/user-details/" + comment.username' style="text-decoration: none; color: #27A2FC">{{ comment.username }}</router-link>
                </div>
                <div class="col-6 text-end" style="padding-right: 20px">
                  <span style="color: #27A2FC">
                    <font-awesome-icon :icon="['fas', 'star']"/> {{ comment.rate }}
                  </span>
                  / 5
                </div>
              </div>
              <hr class="mt-2 mb-1" style="padding: 0; color: #27A2FC;">
              <div class="row" style="padding: 20px">
                {{ comment.content }}
              </div>
              <div class="row" style="font-size: 12px;">
                <div class="col-4">
                  <router-link :to="{ name: 'comment-edit', params: { bookId: comment.id.bookId, userId: comment.id.userId, content: comment.content, rate: comment.rate, username: comment.username, curr: `/book-details/${this.book.id}`, a: 'PUT' } }" class="ps-3" v-if="isAdmin || currentUserUsername === comment.username"><font-awesome-icon :icon="['fas', 'pen-to-square']" style="color: #27A2FC" /></router-link>
                  <span class="ps-3" v-if="isAdmin || currentUserUsername === comment.username" @click="deleteComment(comment.username)"><font-awesome-icon :icon="['fas', 'trash-can']" style="color: #27A2FC" /></span>
                </div>
                <div class="col-8 text-end">
                  <i>Created at: {{ parseDate(comment.createdAt) }} | Updated at: {{ parseDate(comment.updatedAt) }}</i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="row text-center pb-5">
          <h2>Comments not found</h2>
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
  </div>
</template>

<script>
import BookService from "@/services/BookService";
import ShelfService from "@/services/ShelfService";
import AuthorService from "@/services/AuthorService";
import UserService from "@/services/UserService";
import GenreService from "@/services/GenreService";
import router from "@/router";
import jwt_decode from "jwt-decode";

export default {
  name: 'BookDetails',
  data() {
    return {
      book: {},
      author: {},
      genre: {},
      stats: {},
      comments: [],
      userComment: {},
      page: {
        size: 10,
        totalElements: 0,
        totalPages: 1,
        number: 0
      },
      reload: 0
    }
  },
  methods: {
    retrieveBook() {
      BookService.get(this.$route.params.bookId)
          .then(response => {
            this.book = response.data;
            this.retrieveAuthor()
            this.retrieveGenre()
          })
          .catch(error => console.log(error))

      ShelfService.getBookStats(this.$route.params.bookId)
          .then(response => {
            let stats = response.data;
            if (stats) {
              this.stats["numberOfRates"] = stats.numberOfRates
              this.stats["numberOfComments"] = stats.numberOfComments
              this.stats["rate"] = stats.numberOfRates > 0 ? stats.rate : "-"
            }
          })
          .catch(error => console.log(error))
    },
    retrieveCurrentUser() {
      let user = this.$store.state.auth.user
      if (user) {
        let username = jwt_decode(user.data.accessToken).sub
        ShelfService.getUserBook(username, this.$route.params.bookId)
            .then(response => {
              this.userComment = response.data
            })
            .catch(() => {
              this.userComment = {
                rate: 0,
                content: ""
              }
            })
      }
    },
    retrieveComments(page) {
      ShelfService.getAllForBook(page, 2, this.$route.params.bookId)
          .then(response => {
            this.comments = response.data._embedded
                ? response.data._embedded.shelves
                : []
            this.page.size = response.data.page.size
            this.page.totalElements = response.data.page.totalElements
            this.page.totalPages = response.data.page.totalPages
            this.page.number = response.data.page.number

            for (let i = 0; i < this.comments.length; i++) {
              UserService.getById(this.comments[i].id.userId)
                  .then(response => {
                    this.comments[i]['username'] = response.data.username
                  })
            }
          })
    },
    retrieveAuthor() {
      AuthorService.get(this.book.authorId)
          .then(response => {
            this.author = response.data;
          })
          .catch(error => console.log(error))
    },
    retrieveGenre() {
      GenreService.get(this.book.genreId)
          .then(response => {
            this.genre = response.data
          })
          .catch(error => console.log(error))
    },
    deleteBook() {
      if (confirm(`Do you really want to delete ${this.book.title}`)) {
        BookService.delete(this.book.id)
            .then(() => router.push("/"))
      }
    },
    deleteComment(username) {
      ShelfService.delete(username, this.$route.params.bookId)
          .then(() => this.$router.go())
    },
    getAuthorId(link) {
      return link.slice(34)
    },
    parseDate(date) {
      return date ? date.slice(0, 10) : ""
    },
    capitalize(str) {
      return str ? str.slice(0, 1) + str.slice(1).toLowerCase() : "";
    },
    handleCurrentChange(page) {
      this.retrieveComments(page - 1)
    },
    setRating(rating) {
      this.userComment.rate = rating
    }
  },
  mounted() {
    this.retrieveBook();
    this.retrieveComments()
    this.retrieveCurrentUser()
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
  background-color: #efefef;
  padding: 10px;
}
</style>