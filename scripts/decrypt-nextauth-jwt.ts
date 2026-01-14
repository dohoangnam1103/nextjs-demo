import { jwtDecrypt } from 'jose';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load .env manually
const envContent = readFileSync(join(__dirname, '../.env'), 'utf-8');
const AUTH_SECRET = envContent
  .split('\n')
  .find(line => line.startsWith('AUTH_SECRET='))
  ?.split('=')[1]
  ?.trim();

const encryptedJWT = "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoicnQzbFJOM0NQVk9iNWpmVl8yaHR6UkpQVENmc0psVWlxQjV0NG5URFdPUXM2WDR3aDZDdGJyY0RCT2FxYUVocXdKdGNaVU1TRmNISC1kTEM1azUzZncifQ..64FHCf-VQpHWrS9S3sD6Hw.J1mNU412p-aEw_LUI9hrkkPf5nRfeyH1h3FGZQsmX-XV7kl4ClqyTr8_qd-CB_WELr4EiqD9OZY7S1y75GxYgbxwUDFbI5w0dDQ2jtkFlnxDUZKKBNfTt2OZRvRag8RspnxU_z7rP0Sgyp3KCBuDIrVtRNJGhcGGELutXJQGlB9QJBLQnSYg16ztXeLdnuOj5yKXVyh9fP7YLYN3CCpMYylJNL_mgo0avzlUl9QMMvU.yXN9JD9tciTmov24upWzyC_VHMwRPWbrcDTd-tVH2xY";

console.log('🔐 JWE Token Analysis:\n');

// Phân tích cấu trúc
const parts = encryptedJWT.split('.');
console.log('📊 Cấu trúc: JWE có 5 phần (khác với JWT thường chỉ có 3):');
console.log('  1. Protected Header');
console.log('  2. Encrypted Key');
console.log('  3. Initialization Vector');
console.log('  4. Ciphertext (dữ liệu mã hóa)');
console.log('  5. Authentication Tag\n');

// Decode header (chưa mã hóa)
const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString());
console.log('📋 HEADER (Chưa mã hóa):');
console.log(header);
console.log('');

console.log('🔒 PHÂN TÍCH:');
console.log('  - alg: "dir" → Direct encryption (không wrap key)');
console.log('  - enc: "A256CBC-HS512" → AES-256-CBC + HMAC-SHA512');
console.log('  - kid: Key ID (identifier của secret key)\n');

console.log('⚠️  QUAN TRỌNG:');
console.log('  - Token này ĐƯỢC MÃ HÓA (encrypted), không chỉ ký (signed)');
console.log('  - KHÔNG THỂ đọc nội dung nếu không có AUTH_SECRET');
console.log('  - Đây là NextAuth.js JWT - an toàn hơn JWT thường\n');

console.log('🔓 Đang thử DECRYPT với AUTH_SECRET từ .env...\n');

async function main() {
  // Thử decrypt
  const secret = AUTH_SECRET;
  if (!secret) {
    console.log('❌ Không tìm thấy AUTH_SECRET trong .env!');
    process.exit(1);
  }

  try {
    const { payload } = await jwtDecrypt(
      encryptedJWT,
      new TextEncoder().encode(secret)
    );
    
    console.log('✅ DECRYPT THÀNH CÔNG!\n');
    console.log('📦 PAYLOAD (Dữ liệu bên trong):');
    console.log(JSON.stringify(payload, null, 2));
    
    if (payload.exp) {
      const expDate = new Date((payload.exp as number) * 1000);
      const now = new Date();
      console.log('\n⏰ THỜI GIAN:');
      console.log('  - Hết hạn:', expDate.toLocaleString('vi-VN'));
      console.log('  - Còn hiệu lực:', expDate > now ? '✅ CÓ' : '❌ KHÔNG');
    }
  } catch (error: unknown) {
    console.log('❌ DECRYPT THẤT BẠI!');
    console.log('Lý do:', error instanceof Error ? error.message : 'Unknown error');
    console.log('\nCó thể do:');
    console.log('  - AUTH_SECRET sai');
    console.log('  - Token đã hết hạn');
    console.log('  - Token bị sửa đổi');
  }
}

main();
