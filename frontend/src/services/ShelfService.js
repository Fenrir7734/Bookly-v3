import http from '../http-common'
import authHeader from "@/services/AuthHeader";

class ShelfService {
    getAllForBook(page, size, bookId) {
        return http.get(`/core/api/shelves?page=${page}&size=${size}&bookId=${bookId}`)
    }

    getAllOfUser(page, size, username) {
        return http.get(`/core/api/shelves?page=${page}&size=${size}&username=${username}`)
    }

    getUserBook(username, bookId) {
        return http.get(`/core/api/shelves/${username}/${bookId}`)
    }

    getBookStats(bookId) {
        return http.get(`/core/api/shelves/book/${bookId}/stats`)
    }

    getAuthorStats(authorId) {
        return http.get(`/core/api/shelves/author/${authorId}/stats`)
    }

    create(username, body) {
        return http.post(`/core/api/shelves/${username}/${body.id.bookId}`, body, { headers: authHeader() })
    }

    update(username, body) {
        return http.put(`/core/api/shelves/${username}/${body.id.bookId}`, body, { headers: authHeader() })
    }

    delete(username, bookId) {
        return http.delete(`/core/api/shelves/${username}/${bookId}`, { headers: authHeader() })
    }
}

export default new ShelfService()