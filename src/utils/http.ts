import axios from 'axios'

// Tạo một instance của axios với cấu hình mặc định
const http = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000, // Hủy request sau 10 giây nếu server không phản hồi
  headers: {
    'Content-Type': 'application/json',
  },
})

// Có thể thêm Interceptors ở đây nếu cần (xử lý token, error global...)
// http.interceptors.response.use(...)

export default http
