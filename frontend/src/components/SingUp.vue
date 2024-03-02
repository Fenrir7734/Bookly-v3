<template>
  <Card>
    <form class="mt-md-4 pb-5" @submit.prevent="registerUser">
      <h2 class="fw-bold mb-2 text-uppercase mb-5">Register</h2>
      <div class="form-outline form-white mb-4">
        <input type="text" class="form-control form-control-lg" placeholder="First name" v-model="register.firstname"/>
        <div class="invalid-feedback d-block">
          {{ errors.firstname }}
        </div>
      </div>
      <div class="form-outline form-white mb-4">
        <input type="text" class="form-control form-control-lg" placeholder="Last name" v-model="register.lastname"/>
        <div class="invalid-feedback d-block">
          {{ errors.lastname }}
        </div>
      </div>
      <div class="form-outline form-white mb-4">
        <input type="text" class="form-control form-control-lg" placeholder="Username" v-model="register.username"/>
        <div class="invalid-feedback d-block">
          {{ errors.username }}
        </div>
      </div>
      <div class="form-outline form-white mb-4">
        <input type="email" class="form-control form-control-lg" placeholder="Email" v-model="register.email"/>
        <div class="invalid-feedback d-block">
          {{ errors.email }}
        </div>
      </div>
      <div class="form-outline form-white mb-4">
        <input type="text" class="form-control form-control-lg" placeholder="Phone" v-model="register.phone"/>
        <div class="invalid-feedback d-block">
          {{ errors.phone }}
        </div>
      </div>
      <div class="form-outline form-white mb-4">
        <input type="password" class="form-control form-control-lg" placeholder="Password" v-model="register.password"/>
        <div class="invalid-feedback d-block">
          {{ errors.password }}
        </div>
      </div>
      <div class="form-outline form-white mb-4">
        <input type="password" class="form-control form-control-lg" placeholder="Confirm password" v-model="confirmPassword"/>
        <div class="invalid-feedback d-block">
          {{ errors.confirmPassword }}
        </div>
      </div>
      <button class="btn btn-outline-light btn-lg px-5" type="submit">Sign Up</button>
    </form>
    <div>
      <div class="invalid-feedback d-block" style="font-size: 16px">
        {{ globalError }}
      </div>
    </div>
  </Card>
</template>

<script>
import validator from "@/validators/Validator";
import CheckIf from "@/validators/checkers/CheckIf";
import Card from "@/components/Card";

export default {
  name: "SingUp",
  data() {
    return {
      register: {
        firstname: "",
        lastname: "",
        username: "",
        password: "",
        email: "",
        phone: ""
      },
      confirmPassword: "",
      errors: {
        firstname: "",
        lastname: "",
        username: "",
        password: "",
        email: "",
        phone: ""
      },
      globalError: ""
    }
  },
  methods: {
    async registerUser() {
      if (!this.validate()) {
        return
      }

      this.$store.dispatch('auth/register', this.register)
          .then(response => {
            if (!response.response || response.response.status === 201) {
              this.$router.push({ name: "signupSuccess", params: { msg: "Registered successfully!" } })
            } else {
              let status = response.response.status;
              this.globalError = status === 401 || status === 403 || status === 409 || status === 400
                  ? response.response.data.message
                  : "Unexpected error"
            }
          })
          .catch(error => {
            console.log("tutaj2")
            let status = error.response.status;
            this.globalError = status === 401 || status === 403 || status === 409 || status === 400
                ? error.response.data.message
                : "Unexpected error"
          })
    },
    validate() {
      let errors = validator.begin()
          .validateFirstName(this.register.firstname, CheckIf.lengthIs().greaterOrEqualTo(2).and().smallerOrEqualTo(50))
          .validateLastName(this.register.lastname, CheckIf.lengthIs().greaterOrEqualTo(2).and().smallerOrEqualTo(50))
          .validateUsername(this.register.username, CheckIf.lengthIs().greaterOrEqualTo(4).and().smallerOrEqualTo(30))
          .validateEmail(this.register.email, CheckIf.match().pattern(/^\S+@\S+\.\S+$/))
          .validatePhone(this.register.phone, CheckIf.match().pattern(/\d{11}/))
          .validateConfirmPassword(this.register.password, this.confirmPassword)
          .validatePassword(this.register.password, CheckIf.lengthIs().greaterThan(8).and().smallerThan(30))
          .validatePassword(this.register.password, CheckIf.isNotBlank())
          .validate()

      Object.keys(this.errors)
          .forEach(key => this.errors[key] = errors.has(key) ? errors.get(key) : "")
      return errors.size === 0
    }
  },
  created() {
    if (this.$store.state.auth.status.loggedIn) {
      this.$router.push({ name: "signupSuccess", params: { msg: "Already registered" } })
    }
  },
  components: {
    Card
  }
}
</script>

<style scoped>

</style>