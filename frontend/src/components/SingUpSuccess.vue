<template>
  <Card>
    <h2 class="fw-bold mb-2 text-uppercase mb-5">{{ text }}</h2>
    <router-link :to="path" class="btn btn-outline-light btn-lg px-5" type="submit">Go Back</router-link>
  </Card>
</template>

<script>
import Card from "@/components/Card";

export default {
  name: "SingUpConfirm",
  props: ["msg", "curr"],
  data() {
    return {
      text: "SUCCESS",
      path: "/"
    }
  },
  components: {
    Card
  },
  created() {
    this.text = this.msg ? this.msg : this.text
    this.path = this.curr ? this.curr : this.path
  }
}
</script>

<style scoped>

</style>