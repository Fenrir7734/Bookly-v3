<template>
  <div class="container mt-5 mb-5 pt-5" style="background-color: white">
    <div class="container h-100 row m-0">
      <div class=" text-center">
        <h2>{{ user.username }}</h2>
      </div>
      <hr class="mt-5 mb-5 " style="padding: 0; color: #27A2FC">
      <div class="row text-center">
        <div class="col-12">
         <span style="text-transform: uppercase">All reads:</span> <span style="color: #27A2FC">{{ shelves.length }}</span>
        </div>
      </div>
    </div>
    <hr class="mx-4 mb-5 mt-5" style="padding: 0; color: #27A2FC">
    <div class="container">
      <div class="row">
        <div v-if="typeof shelves !== 'undefined' && shelves.length > 0" class="row m-0 justify-content-center">
          <div v-for="shelf in shelves" :key="shelf.id.bookId" class="col-md-8 mb-2 mt-2">
            <div class="card">
              <div class="row">
                <div class="col-6" style="padding-left: 20px">
                  <router-link :to='"/book-details/" + shelf.id.bookId' style="text-decoration: none; color: #27A2FC">{{ shelf.bookTitle }}</router-link>
                </div>
                <div class="col-6 text-end" style="padding-right: 20px">
                  <div class="row">
                    <div class="col-6">
                      Your rate:
                      <span style="color: #27A2FC">
                        <font-awesome-icon :icon="['fas', 'star']"/> {{ shelf.rate }}
                      </span>
                      / 5
                    </div>
                    <div class="col-6">
                      Average:
                      <span style="color: #27A2FC">
                        <font-awesome-icon :icon="['fas', 'star']"/> {{ shelf.avg }}
                      </span>
                      / 5
                    </div>
                  </div>
                </div>
              </div>
              <hr class="mt-2 mb-1" style="padding: 0; color: #27A2FC;">
              <div class="row" style="padding: 20px">
                <div v-if="shelf.content != null">
                   {{ shelf.content }}
                </div>
                <div v-else class="text-center">
                  <h4>No reviews</h4>
                </div>
              </div>
              <div class="row" style="font-size: 12px;">
                <div class="col-4">
                  <router-link :to="{ name: 'comment-edit', params: { bookId: shelf.id.bookId, userId: shelf.id.userId, content: shelf.content, rate: shelf.rate, username: user.username, curr: this.$route.path, a: 'PUT' } }" class="ps-3" v-if="isAdmin || currentUserUsername === user.username"><font-awesome-icon :icon="['fas', 'pen-to-square']" style="color: #27A2FC" /></router-link>
                  <span class="ps-3" v-if="isAdmin || currentUserUsername === user.username" @click="deleteComment(shelf.id.bookId)"><font-awesome-icon :icon="['fas', 'trash-can']" style="color: #27A2FC" /></span>
                </div>
                <div class="col-8 text-end">
                  <i>Created at: {{ parseDate(shelf.createdAt) }} | Updated at: {{ parseDate(shelf.updatedAt) }}</i>
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
import UserService from "@/services/UserService";
import ShelfService from "@/services/ShelfService";
import BookService from "@/services/BookService";
import jwt_decode from "jwt-decode";

export default {
  name: "UserDetails",
  data() {
    return {
      user: {},
      shelves: [],
      page: {
        size: 10,
        totalElements: 0,
        totalPages: 1,
        number: 0
      }
    }
  },
  methods: {
    retrieveUser() {
      UserService.getByUsername(this.$route.params.username)
          .then(response => {
            this.user = response.data
          })
          .catch(error => console.log(error))
    },
    retrieveBooks(page) {
      ShelfService.getAllOfUser(page, 3, this.$route.params.username)
          .then(response => {
            this.shelves = response.data._embedded.shelves
            for (let i = 0; i < this.shelves.length; i++) {
              BookService.get(this.shelves[i].id.bookId)
                  .then(response => {
                    this.shelves[i].bookTitle = response.data.title
                  })
                  .catch(error => console.log(error))
              ShelfService.getBookStats(this.shelves[i].id.bookId)
                  .then(response => {
                    this.shelves[i].avg = response.data.rate
                  })
                  .catch(error => console.log(error))
            }
          })
          .catch(error => console.log(error))
    },
    deleteComment(bookId) {
      let username = jwt_decode(this.$store.state.auth.user.data.accessToken).sub;
      ShelfService.delete(username, bookId)
          .then(() => this.$router.go())
    },
    handleCurrentChange(page) {
      this.retrieveBooks(page - 1)
    },
    parseDate(date) {
      return date
          ? date.slice(0, 10)
          : ""
    },
  },
  mounted() {
    this.retrieveUser()
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
  background-color: #efefef;
  padding: 10px;
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