import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// --- CẤU HÌNH ---
const IGNORE_LIST = [
  'node_modules', 
  '.git', 
  '.vscode', 
  'dist', 
  'build', 
  '.DS_Store',
  'package-lock.json', // Có thể bỏ dòng này nếu muốn xem lock file
  '.env'
];

// Lấy đường dẫn hiện tại
const __filename = fileURLToPath(import.meta.url);
const currentDir = process.cwd(); // Lấy thư mục nơi bạn chạy lệnh

console.log(`\n📦 Project Structure for: ${currentDir}\n`);

function printTree(dir, prefix = '') {
  try {
    const items = fs.readdirSync(dir);

    // Lọc bỏ các file/folder trong danh sách đen
    const filteredItems = items.filter(item => !IGNORE_LIST.includes(item));

    filteredItems.forEach((item, index) => {
      const isLast = index === filteredItems.length - 1;
      const itemPath = path.join(dir, item);
      const stats = fs.statSync(itemPath);

      // Ký tự vẽ cây
      const connector = isLast ? '└── ' : '├── ';
      const icon = stats.isDirectory() ? '📂 ' : '📄 ';
      
      console.log(`${prefix}${connector}${icon}${item}`);

      // Nếu là thư mục thì đệ quy (gọi lại chính hàm này)
      if (stats.isDirectory()) {
        const newPrefix = prefix + (isLast ? '    ' : '│   ');
        printTree(itemPath, newPrefix);
      }
    });
  } catch (err) {
    console.log(`${prefix} [Access Denied or Error]`);
  }
}

// Chạy hàm
printTree(currentDir);
console.log('\n✨ Done!\n');