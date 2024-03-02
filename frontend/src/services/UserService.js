import http from '../http-common'

class UserService {
    getById(id) {
        return http.get(`/core/api/users/id/${id}`)
    }

    getByUsername(username) {
        return http.get(`/core/api/users/${username}`)
    }
}

export default new UserService()