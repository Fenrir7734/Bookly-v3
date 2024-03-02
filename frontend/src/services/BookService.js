import http from '../http-common'
import authHeader from "@/services/AuthHeader";

class BookService {
    getAll(page, size, genre) {
        return http.get(
            typeof genre !== 'undefined'
                ? `/core/api/books?page=${page}&size=${size}&genre=${genre}`
                : `/core/api/books?page=${page}&size=${size}`
        )
    }

    getAllAuthorBooks(page, size, authorId) {
        return http.get(`/core/api/books?page=${page}&size=${size}&author=${authorId}`)
    }

    get(id) {
        return http.get(`/core/api/books/${id}`)
    }

    getCover(id) {
        return http.get(`/core/api/books/${id}/cover`)
    }

    create(data) {
        return http.post('/core/api/books', data, { headers: authHeader() })
    }

    update(id, data) {
        return http.put(`/core/api/books/${id}`, data, { headers: authHeader() })
    }

    delete(id) {
        return http.delete(`/core/api/books/${id}`, { headers: authHeader() })
    }
}

export default new BookService()