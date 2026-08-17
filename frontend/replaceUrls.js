const fs = require('fs');
const path = require('path');

const replacements = {
  '"/assets/Black.png"': '"https://res.cloudinary.com/em5hu05n/image/upload/f_auto,q_auto/v1/fitrah_assets/Black"',
  '"/assets/white.png"': '"https://res.cloudinary.com/em5hu05n/image/upload/f_auto,q_auto/v1/fitrah_assets/white"',
  '"/assets/6c6b8b4f-0302-4c17-babe-bf4c7ed5826a.png"': '"https://res.cloudinary.com/em5hu05n/image/upload/f_auto,q_auto/v1/fitrah_assets/6c6b8b4f-0302-4c17-babe-bf4c7ed5826a"',
  '"/assets/fitrah-beard-image.png"': '"https://res.cloudinary.com/em5hu05n/image/upload/f_auto,q_auto/v1/fitrah_assets/fitrah-beard-image"',
  '"/gallery/1.jpg"': '"https://res.cloudinary.com/em5hu05n/image/upload/f_auto,q_auto/v1/fitrah_gallery/1"',
  '"/gallery/2.jpg"': '"https://res.cloudinary.com/em5hu05n/image/upload/f_auto,q_auto/v1/fitrah_gallery/2"',
  '"/gallery/3.jpg"': '"https://res.cloudinary.com/em5hu05n/image/upload/f_auto,q_auto/v1/fitrah_gallery/3"',
  '"/gallery/4.jpg"': '"https://res.cloudinary.com/em5hu05n/image/upload/f_auto,q_auto/v1/fitrah_gallery/4"',
  '"/gallery/5.jpg"': '"https://res.cloudinary.com/em5hu05n/image/upload/f_auto,q_auto/v1/fitrah_gallery/5"',
  '"/gallery/6.jpg"': '"https://res.cloudinary.com/em5hu05n/image/upload/f_auto,q_auto/v1/fitrah_gallery/6"',
  '"/assets/Gemini_Generated_Image_jkg1ffjkg1ffjkg1.png"': '"https://res.cloudinary.com/em5hu05n/image/upload/f_auto,q_auto/v1/fitrah_assets/Gemini_Generated_Image_jkg1ffjkg1ffjkg1"'
};

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  for (const [search, replace] of Object.entries(replacements)) {
    if (content.includes(search)) {
      content = content.split(search).join(replace);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
console.log('Done!');
