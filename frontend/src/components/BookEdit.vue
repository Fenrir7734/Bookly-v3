<template>
  <div class="container h-100">
    <div class="mt-5 px-5">
      <div class="mb-5 text-center">
        <h2>Book by {{ author.firstname }} {{ author.lastname }}</h2>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-md-8">
        <form @submit.prevent="createBook">
          <div v-if="globalError" class="alert alert-danger" role="alert">
            {{ globalError }}
          </div>
          <div class="row">
            <div class="col-md-6">
              <label for="first-name">ISBN:</label>
              <input type="text" id="first-name" class="form-control" v-model="book.isbn" required>
              <div class="invalid-feedback d-block">
                {{ errors.isbn }}
              </div>
            </div>
            <div class="col-md-6">
              <label for="last-name">Title:</label>
              <input type="text" id="last-name" class="form-control" v-model="book.title" required>
              <div class="invalid-feedback d-block">
                {{ errors.title }}
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <label for="birth-date">Release date:</label>
              <input type="date" id="birth-date" class="form-control" v-model="book.published" required>
              <div class="invalid-feedback d-block">
                {{ errors.published }}
              </div>
            </div>
            <div class="col-md-6">
              <label for="death-date">Pages:</label>
              <input type="number" id="death-date" class="form-control" v-model="book.pages" min="0" required>
              <div class="invalid-feedback d-block">
                {{ errors.pages }}
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <label for="genre">Genre:</label>
              <select name="genre" id="genre" class="form-select" v-model="book.genreId">
                <option v-for="(genre, index) in genres" :value="genre.id" :key="genre.id" v-bind:selected="index === 0">
                  {{ capitalize(genre.name) }}
                </option>
              </select>
            </div>
          </div>
          <div class="row" style="padding-left: 12px; padding-right: 12px">
            <label for="description">Description:</label>
            <textarea id="description" rows="5" v-model="book.description"></textarea>
          </div>
          <div class="row mt-3">
            <div class="col-lg-12">
              <button class="btn btn-primary bg-blue float-end border-0" type="submit">Save</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import validator from "@/validators/Validator";
import CheckIf from "@/validators/checkers/CheckIf";
import GenreService from "@/services/GenreService";
import BookService from "@/services/BookService";
import AuthorService from "@/services/AuthorService";

export default {
  name: "BookEdit",
  props: ['id', 'isbn', 'title', 'published', 'pages', 'description', 'authorId', 'genreId'],
  data() {
    return {
      author: {},
      genres: [],
      book: {
        id: "",
        isbn: "",
        title: "",
        published: "",
        pages: "",
        description: "",
        authorId: -1,
        genreId: 1
      },
      errors: {
        isbn: "",
        title: "",
        published: "",
        pages: "",
        description: "",
        authorId: "",
        genreId: ""
      },
      globalError: ""
    }
  },
  methods: {
    async retrieveGenres() {
      GenreService.getAll()
          .then(response => {
            this.genres = response.data._embedded.items
          })
          .catch(error => console.log(error))
    },
    async retrieveAuthor() {
      AuthorService.get(this.book.authorId)
          .then(response => {
            this.author = response.data
          })
          .catch(error => console.log(error))
    },
    async createBook() {
      this.globalError = null
      if (!this.validate()) {
        return
      }

      try {
        if (this.book.id) {
          await BookService.update(this.book.id, this.book)
          await this.$router.push({ name: 'signupSuccess', params: { msg: "book updated successfully!", curr: `/book-details/${this.book.id}` }})
        } else {
          await BookService.create(this.book)
          await this.$router.push({ name: 'signupSuccess', params: { msg: "book created successfully!", curr: `/` }})
        }
        await this.$router.push("/signup-success")
      } catch (error) {
        console.log(error)
        let status = error.response.status;
        this.globalError = status === 401 || status === 403 || status === 400
            ? error.response.data.message
            : "Unexpected error"

        this.globalError = status === 409 ? "Duplicate ISBN" : this.globalError;
      }
    },
    validate() {
      let errors = validator.begin()
          .validateISBN(this.book.isbn, CheckIf.match().pattern(/[0-9]{13}/))
          .validateTitle(this.book.title, CheckIf.lengthIs().greaterOrEqualTo(3).and().smallerOrEqualTo(255))
          .validatePublished(this.book.published)
          .validate()

      Object.keys(this.errors)
          .forEach(key => this.errors[key] = errors.has(key) ? errors.get(key) : "")
      return errors.size === 0
    },
    capitalize(str) {
      return str.slice(0, 1) + str.slice(1).toLowerCase();
    }
  },
  mounted() {
    this.retrieveGenres()
  },
  created() {
    if (this.authorId) {
      localStorage.setItem("authorId", this.authorId)
    }
    this.book.authorId = localStorage.getItem("authorId")
    this.book.id = this.id ? this.id : ""
    this.book.isbn = this.isbn ? this.isbn : ""
    this.book.title = this.title ? this.title : ""
    this.book.published = this.published ? this.published : ""
    this.book.pages = this.pages ? this.pages : ""
    this.book.description = this.description ? this.description : ""
    this.book.genreId = this.genreId ? this.genreId : this.book.genreId

    this.retrieveAuthor()
  }
}
</script>

<style scoped>

</style>