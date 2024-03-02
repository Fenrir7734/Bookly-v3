<template>
  <Card>
    <form class="mt-md-4 pb-5" @submit.prevent="handleLogin">
      <h2 class="fw-bold mb-2 text-uppercase mb-5">Login</h2>
      <div class="form-outline form-white mb-4">
        <input type="text" class="form-control form-control-lg" placeholder="Username" v-model="login.username"/>
        <div class="invalid-feedback d-block">
          {{ errors.username }}
        </div>
      </div>
      <div class="form-outline form-white mb-4">
        <input type="password" id="typePasswordX" class="form-control form-control-lg" placeholder="Password" v-model="login.password"/>
        <div class="invalid-feedback d-block">
          {{ errors.password }}
        </div>
      </div>
      <button class="btn btn-outline-light btn-lg px-5" type="submit">Sign In</button>
    </form>
  </Card>
</template>

<script>
import validator from "@/validators/Validator";
import CheckIf from "@/validators/checkers/CheckIf";
import Card from "@/components/Card";
import TokenHelper from "@/utils/TokenHelper";

export default {
  name: "SingIn",
  data() {
    return {
      login: {
        username: "",
        password: ""
      },
      errors: {
        username: "",
        password: ""
      }
    }
  },
  methods: {
    handleLogin() {
      if (!this.validate()) {
        return
      }

      this.$store.dispatch("auth/login", this.login)
          .then(user => {
            TokenHelper.storeUser(user)
            this.$router.push("/")
          })
          .catch(error => {
            console.log(error)
            let errorMessage = error.response.status === 401
                ? error.response.data.message
                : "Unexpected error";
            this.errors.username = errorMessage;
            this.errors.password = errorMessage;
          })
    },
    validate() {
      let errors = validator.begin()
          .validateUsername(this.login.username, CheckIf.isNotBlank())
          .validatePassword(this.login.password, CheckIf.isNotBlank())
          .validate();

      Object.keys(this.errors)
          .forEach(key => this.errors[key] = errors.has(key) ? errors.get(key) : "")
      return errors.size === 0
    }
  },
  created() {
    if (this.$store.state.auth.status.loggedIn) {
      this.$router.push("/")
    }
  },
  components: {
    Card
  }
}
</script>

<style scoped>

</style>