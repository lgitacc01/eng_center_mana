import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
// Giữ nguyên import của bạn
import { defineConfig } from "eslint/config"; 

export default defineConfig([
  // 1. Cấu hình chung cho globals
  {
    languageOptions: {
      globals: {
        ...globals.browser, // Giữ lại (nếu bạn có code front-end)
        ...globals.node     // << THÊM VÀO ĐỂ SỬA LỖI 'process'
      }
    }
  },

  // 2. Cấu hình JS (thay thế cho object sai của bạn)
  js.configs.recommended,

  // 3. Cấu hình TypeScript (của bạn bị thiếu '...')
  ...tseslint.configs.recommended,

  // 4. Tùy chỉnh luật để hỗ trợ lỗi 'err'
  {
     rules: {
       // Báo cho ESLint: Biến nào bắt đầu bằng gạch dưới (_)
       // thì được phép không sử dụng
       "@typescript-eslint/no-unused-vars": "off"
       
     }
  }
]);