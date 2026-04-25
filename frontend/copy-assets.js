const fs = require('fs');
const path = require('path');

const src1 = "C:\\Users\\IQRA TRADERS\\.gemini\\antigravity\\brain\\ef226f48-d951-4d4e-ac97-87da031b22bc\\.tempmediaStorage\\media_ef226f48-d951-4d4e-ac97-87da031b22bc_1776965961313.jpg";
const src2 = "C:\\Users\\IQRA TRADERS\\.gemini\\antigravity\\brain\\ef226f48-d951-4d4e-ac97-87da031b22bc\\.tempmediaStorage\\media_ef226f48-d951-4d4e-ac97-87da031b22bc_1776965961608.jpg";

const dest1 = path.join(__dirname, "public", "assets", "story_1.jpg");
const dest2 = path.join(__dirname, "public", "assets", "story_2.jpg");

try {
  fs.copyFileSync(src1, dest1);
  console.log("Successfully copied story_1.jpg to public/assets/");
} catch(e) {
  console.error("Failed to copy story_1.jpg", e.message);
}

try {
  fs.copyFileSync(src2, dest2);
  console.log("Successfully copied story_2.jpg to public/assets/");
} catch(e) {
  console.error("Failed to copy story_2.jpg", e.message);
}
