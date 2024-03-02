<template>
  <div class="container h-100">
    <div class="mt-5 px-5">
      <div class="mb-5 text-center">
        <h2>Author</h2>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-md-8">
        <form @submit.prevent="createAuthor">
          <div v-if="globalError" class="alert alert-danger" role="alert">
            {{ globalError }}
          </div>
          <div class="row">
            <div class="col-md-6">
              <label for="first-name">First name:</label>
              <input type="text" id="first-name" class="form-control" v-model="author.firstname">
              <div class="invalid-feedback d-block">
                {{ errors.firstname }}
              </div>
            </div>
            <div class="col-md-6">
              <label for="last-name">Last name:</label>
              <input type="text" id="last-name" class="form-control" v-model="author.lastname">
              <div class="invalid-feedback d-block">
                {{ errors.lastname }}
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <label for="birth-date">Birth date:</label>
              <input type="date" id="birth-date" class="form-control" v-model="author.birthDate">
              <div class="invalid-feedback d-block">
                {{ errors.birthDate }}
              </div>
            </div>
            <div class="col-md-6">
              <label for="death-date">Death date:</label>
              <input type="date" id="death-date" class="form-control" v-model="author.deathDate">
              <div class="invalid-feedback d-block">
                {{ errors.deathDate }}
              </div>
            </div>
          </div>
          <div class="row" style="padding-left: 12px; padding-right: 12px">
            <label for="description">Description:</label>
            <textarea id="description" rows="5" v-model="author.description"></textarea>
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
import AuthorService from "@/services/AuthorService";

export default {
  name: "AuthorEdit",
  props: ['id', 'firstname', 'lastname', 'description', 'birthDate', 'deathDate'],
  data() {
    return {
      author: {
        id: "",
        firstname: "",
        lastname: "",
        description: "",
        birthDate: "",
        deathDate: ""
      },
      errors: {
        firstname: "",
        lastname: "",
        description: "",
        birthDate: "",
        deathDate: ""
      },
      globalError: ""
    }
  },
  methods: {
    async createAuthor() {
      this.globalError = null
      if (!this.validate()) {
        return
      }

      try {
        if (this.author.id) {
          await AuthorService.update(this.author.id, this.author)
          await this.$router.push({ name: 'signupSuccess', params: { msg: "author updated successfully!", curr: `/author-details/${this.author.id}` }})
        } else {
          await AuthorService.create(this.author)
          await this.$router.push({ name: 'signupSuccess', params: { msg: "author created successfully!", curr: `/authors` }})
        }
      } catch (error) {
        let status = error.response.status;
        this.globalError = status === 401 || status === 403 || status === 409 || status === 400
            ? error.response.data.message
            : "Unexpected error"
      }
    },
    validate() {
      let errors = validator.begin()
          .validateFirstName(this.author.firstname, CheckIf.lengthIs().greaterOrEqualTo(2).and().smallerOrEqualTo(50))
          .validateLastName(this.author.lastname, CheckIf.lengthIs().greaterOrEqualTo(2).and().smallerOrEqualTo(50))
          .validateBirthDate(this.author.birthDate, this.author.deathDate)
          .validateDeathDate(this.author.deathDate)
          .validate();
      Object.keys(this.errors)
          .forEach(key => this.errors[key] = errors.has(key) ? errors.get(key) : "")
      return errors.size === 0
    },
  },
  created() {
    this.author.id = this.id ? this.id : ""
    this.author.firstname = this.firstname ? this.firstname : ""
    this.author.lastname = this.lastname ? this.lastname : ""
    this.author.birthDate = this.birthDate ? this.birthDate : ""
    this.author.deathDate = this.deathDate ? this.deathDate : ""
    this.author.description = this.description ? this.description : ""
  }
}
</script>

<style scoped>

</style>