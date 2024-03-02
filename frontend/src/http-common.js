import axios from 'axios'
export default axios.create({
    baseURL: "http://localhost:8762/core/api",
    headers: {
        "Content-type": "application/json"
    }
});