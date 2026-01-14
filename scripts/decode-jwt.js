// Script để decode JWT token
const jwt = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIxIiwibmFtZSI6IkFkbWluIE5hbSIsInJvbGUiOiJ1c2VyIiwiZXhwaXJlc0F0IjoiMjAyNi0wMS0yMVQxNTozNDo1NC45NjFaIiwiaWF0IjoxNzY4NDA0ODk0LCJleHAiOjE3NjkwMDk2OTR9.mr1zYEOpWE-GpwQFO9I6lNi2OaNdO5JPSVn6F-93uWE";

// Tách JWT thành 3 phần
const [headerB64, payloadB64, signature] = jwt.split('.');

// Decode Header
const header = JSON.parse(Buffer.from(headerB64, 'base64url').toString());
console.log('📋 HEADER (Thuật toán):');
console.log(header);
console.log('');

// Decode Payload
const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString());
console.log('📦 PAYLOAD (Dữ liệu User):');
console.log(payload);
console.log('');

// Kiểm tra thời gian hết hạn
const now = Math.floor(Date.now() / 1000);
const isExpired = payload.exp < now;

console.log('⏰ THỜI GIAN:');
console.log('  - Tạo lúc (iat):', new Date(payload.iat * 1000).toLocaleString('vi-VN'));
console.log('  - Hết hạn (exp):', new Date(payload.exp * 1000).toLocaleString('vi-VN'));
console.log('  - expiresAt:', payload.expiresAt);
console.log('  - Trạng thái:', isExpired ? '❌ ĐÃ HẾT HẠN' : '✅ CÒN HIỆU LỰC');
console.log('');

console.log('🔐 SIGNATURE (Chữ ký - không thể decode):');
console.log('  ', signature);
console.log('');

console.log('ℹ️  LƯU Ý:');
console.log('  - Đây là JWT từ hệ thống cũ (custom auth)');
console.log('  - userId: "1" → Admin Nam');
console.log('  - Token này CÓ THỂ verify bằng SESSION_SECRET từ .env');
