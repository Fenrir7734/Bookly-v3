import http from '../http-common'
import authHeader from "@/services/AuthHeader";

class BookService {
    getAll(page, size, genre) {
        return http.get(
            typeof genre !== 'undefined'
                ? `/books?page=${page}&size=${size}&genre=${genre}`
                : `/books?page=${page}&size=${size}`
        )
    }

    getAllAuthorBooks(page, size, authorId) {
        return http.get(`/books?page=${page}&size=${size}&author=${authorId}`)
    }

    get(id) {
        return http.get(`/books/${id}`)
    }

    getCover(id) {
        return http.get(`/books/${id}/cover`)
    }

    create(data) {
        return http.post('/books', data, { headers: authHeader() })
    }

    update(id, data) {
        return http.put(`/books/${id}`, data, { headers: authHeader() })
    }

    delete(id) {
        return http.delete(`/books/${id}`, { headers: authHeader() })
    }
}

export default new BookService()