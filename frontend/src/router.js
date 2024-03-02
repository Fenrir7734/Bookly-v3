import { createWebHistory, createRouter } from 'vue-router'
import store from "@/store";
import BooksList from "@/components/BooksList";
import SingUp from "@/components/SingUp";
import SingUpConfirm from "@/components/SingUpSuccess";
import SingIn from "@/components/SingIn";
import AuthorsList from "@/components/AuthorsList";
import AuthorEdit from "@/components/AuthorEdit";
import AuthorDetails from "@/components/AuthorDetails";
import BookDetails from "@/components/BookDetails";
import UserDetails from "@/components/UserDetails";
import BookEdit from "@/components/BookEdit";
import AuthenticationService from "@/services/AuthenticationService";
import CommentEdit from "@/components/CommentEdit";

const routes = [
    {
        path: "/",
        alias: "/books/:genre?",
        name: "books",
        component: BooksList
    },
    {
        path: "/book-details/:bookId",
        name: "book-details",
        component: BookDetails
    },
    {
        path: "/book-details/comment-edit",
        name: "comment-edit",
        component: CommentEdit,
        props: true
    },
    {
        path: "/books-edit",
        name: "books-edit",
        component: BookEdit,
        props: true
    },
    {
        path: "/authors",
        name: "authors",
        component: AuthorsList
    },
    {
        path: "/authors-edit/:authorId?",
        name: "authors-edit",
        component: AuthorEdit,
        props: true
    },
    {
        path: "/author-details/:authorId",
        name: "author-details",
        component: AuthorDetails
    },
    {
        path: "/signup",
        name: "signup",
        component: SingUp
    },
    {
        path: "/signup-success",
        name: "signupSuccess",
        component: SingUpConfirm,
        props: true
    },
    {
        path: "/signin",
        name: "signin",
        component: SingIn
    },
    {
        path: "/user-details/:username",
        name: "user-details",
        component: UserDetails
    },
    {
        path: "/:catchAll(.*)",
        name: "catcher",
        component: BooksList
    }
]
const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

router.beforeEach( (to, from, next) => {
    const publicPages = ['books', 'book-details', 'authors', 'author-details', 'signup', 'signupSuccess', 'signin', 'user-details', 'catcher'];
    const authRequired = !publicPages.includes(to.name)
    const loggedIn = store.state.auth.status.loggedIn

    if (authRequired && !loggedIn) {
        return next('/signin')
    } else if (authRequired) {
        AuthenticationService.validate()
            .then(() => {
                next()
            })
            .catch(() => {
                store.dispatch('auth/logout')
                    .then(() => {
                        next("/signin")
                    })
                    .catch(error => {
                        console.log(error)
                    })
            })
    } else {
        next();
    }
})

export default router;