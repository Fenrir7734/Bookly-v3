import http from '../http-common'
import TokenHelper from "@/utils/TokenHelper";

class AuthenticationService {
    signup(data) {
        return http.post('/auth/api/auth/signup', data)
    }

    signin(data) {
        return http.post('/auth/api/auth/signin', data)
    }

    logout() {
        TokenHelper.removeUser()
    }

    validate() {
        let data = {
            accessToken: JSON.parse(TokenHelper.getUser()).data.accessToken,
            tokenType: "Bearer"
        }
        return http.post('/auth/api/auth/valid', data)
    }
}

export default new AuthenticationService()