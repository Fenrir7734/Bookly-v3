import http from '../http-common'
import authHeader from "@/services/AuthHeader";

class AuthorService {
    getAll(page, size) {
        return http.get(`/core/api/authors?page=${page}&size=${size}`)
    }

    get(id) {
        return http.get(`/core/api/authors/${id}`)
    }

    create(data) {
        return http.post('/core/api/authors', data, { headers: authHeader() })
    }

    update(id, data) {
        return http.put(`/core/api/authors/${id}`, data, { headers: authHeader() })
    }

    delete(id) {
        return http.delete(`/core/api/authors/${id}`, { headers: authHeader() })
    }
}

export default new AuthorService()