import http from '../http-common'

class GenreService {
    getAll() {
        return http.get('/core/api/genres')
    }

    get(id) {
        return http.get(`/core/api/genres/${id}`)
    }

    create(data) {
        return http.post('/core/api/genres', data)
    }

    update(id, data) {
        return http.put(`/core/api/genres/${id}`, data)
    }

    delete(id) {
        return http.delete(`/core/api/genres/${id}`)
    }
}

export default new GenreService()