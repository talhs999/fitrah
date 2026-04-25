const fs = require('fs');

const src = 'C:\\Users\\IQRA TRADERS\\Desktop\\Fitrah Website\\logos new\\';
const dest = 'C:\\Users\\IQRA TRADERS\\Desktop\\Fitrah Website\\frontend\\public\\';

fs.copyFileSync(src + 'Black.png', dest + 'logo-black.png');
fs.copyFileSync(src + 'white.png', dest + 'logo-white.png');
console.log('✅ Logos copied to public/');
