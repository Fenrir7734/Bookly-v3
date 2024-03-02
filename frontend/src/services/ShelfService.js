import http from '../http-common'
import authHeader from "@/services/AuthHeader";

class ShelfService {
    getAllForBook(page, size, bookId) {
        return http.get(`/shelves?page=${page}&size=${size}&bookId=${bookId}`)
    }

    getAllOfUser(page, size, username) {
        return http.get(`/shelves?page=${page}&size=${size}&username=${username}`)
    }

    getUserBook(username, bookId) {
        return http.get(`/shelves/${username}/${bookId}`)
    }

    getBookStats(bookId) {
        return http.get(`/shelves/book/${bookId}/stats`)
    }

    getAuthorStats(authorId) {
        return http.get(`/shelves/author/${authorId}/stats`)
    }

    create(username, body) {
        return http.post(`/shelves/${username}/${body.id.bookId}`, body, { headers: authHeader() })
    }

    update(username, body) {
        return http.put(`/shelves/${username}/${body.id.bookId}`, body, { headers: authHeader() })
    }

    delete(username, bookId) {
        return http.delete(`/shelves/${username}/${bookId}`, { headers: authHeader() })
    }
}

export default new ShelfService()