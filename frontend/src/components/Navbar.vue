<template>
  <nav class="navbar navbar-expand-md navbar-light bg-blue">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand text-white" href="#">Bookly</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarScroll">
        <ul class="navbar-nav me-auto my-2 my-lg-0 " >
          <li class="nav-item">
            <router-link to="/" class="nav-link nav-text-color" aria-current="page" href="#">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/authors" class="nav-link nav-text-color" href="#">Authors</router-link>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle nav-text-color" href="#" id="navbarScrollingDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Genres
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarScrollingDropdown">
              <li
                  v-for="genre in genres"
                  :key="genre.name"
                  class="dropdown-item">
                <router-link :to="'/books/' + genre.name">{{ this.capitalize(genre.name) }}</router-link>
              </li>
            </ul>
          </li>
        </ul>
        <ul class="navbar-nav my-2 my-lg-0">
          <li v-if="!loggedIn" class="d-flex nav-item">
            <router-link to="/signin" class="nav-link nav-text-color">Sign in</router-link>
          </li>
          <li v-if="!loggedIn" class="d-flex nav-item">
            <router-link to="/signup" class="nav-link nav-text-color" href="#">Sing Up</router-link>
          </li>
          <li v-if="loggedIn" class="d-flex nav-item">
            <router-link :to='"/user-details/" + currentUserUsername' class="nav-link nav-text-color">Hi <b>{{ currentUserUsername }}</b>!</router-link>
          </li>
          <li v-if="loggedIn" class="d-flex nav-item">
            <a class="nav-link nav-text-color" href="#" @click="logout">Log out</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import GenreService from "@/services/GenreService";

export default {
  name: "NavBar",
  data() {
    return {
      genres: [],
      genreIndex: -1
    }
  },
  methods: {
    retrieveGenres() {
      GenreService.getAll()
          .then(response => {
            this.genres = response.data._embedded.items
          })
          .catch(error => console.log(error))
    },
    capitalize(str) {
      return str.slice(0, 1) + str.slice(1).toLowerCase();
    },
    logout() {
      this.$store.dispatch('auth/logout')
          .then(() => {
            this.$router.push("/")
          })
          .catch(error => {
            console.log(error)
          })
    }
  },
  mounted() {
    this.retrieveGenres()
  }
}
</script>

<style scoped>

</style>