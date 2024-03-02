import http from '../http-common'
import authHeader from "@/services/AuthHeader";

class AuthorService {
    getAll(page, size) {
        return http.get(`/authors?page=${page}&size=${size}`)
    }

    get(id) {
        return http.get(`/authors/${id}`)
    }

    create(data) {
        return http.post('/authors', data, { headers: authHeader() })
    }

    update(id, data) {
        return http.put(`/authors/${id}`, data, { headers: authHeader() })
    }

    delete(id) {
        return http.delete(`/authors/${id}`, { headers: authHeader() })
    }
}

export default new AuthorService()