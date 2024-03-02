import { createApp } from 'vue';
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus';
import 'element-plus/theme-chalk/index.css'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../public/style.css'
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye, faComment, faStar, faPenToSquare, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import store from "@/store";
import jwt_decode from "jwt-decode";
import StarRating from 'vue-star-rating'

library.add(faEye, faComment, faStar, faPenToSquare, faPlus, faTrashCan)

createApp(App)
    .component("font-awesome-icon", FontAwesomeIcon)
    .component("star-rating", StarRating)
    .use(router)
    .use(store)
    .use(ElementPlus)
    .mixin({
        computed: {
            currentUser() {
                return this.$store.state.auth.user
            },
            currentUserRole() {
                return this.currentUser
                    ? jwt_decode(this.currentUser.data.accessToken).roles
                    : ""
            },
            currentUserUsername() {
                return this.currentUser
                    ? jwt_decode(this.currentUser.data.accessToken).sub
                    : ""
            },
            loggedIn() {
                return this.$store.state.auth.status.loggedIn;
            },
            isUser() {
                return this.currentUser
                    ? this.currentUserRole === "ROLE_USER" || this.currentUserRole === "ROLE_MODERATOR" || this.currentUserRole === "ROLE_ADMIN"
                    : false
            },
            isModerator() {
                return this.currentUser
                    ? this.currentUserRole === "ROLE_MODERATOR" || this.currentUserRole === "ROLE_ADMIN"
                    : false
            },
            isAdmin() {
                return this.currentUser
                    ? this.currentUserRole === "ROLE_ADMIN"
                    : false
            }
        }
    })
    .mount('#app')
