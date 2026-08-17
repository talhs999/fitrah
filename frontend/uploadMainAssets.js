const cloudinary = require('cloudinary').v2;
const path = require('path');

cloudinary.config({
  cloud_name: 'em5hu05n',
  api_key: '115962497288799',
  api_secret: 'OIxTUEUy2CvS151-nmabCNaYcnA'
});

const filesToUpload = [
  // Videos
  { local: 'public/Video Project 1.mp4', folder: 'fitrah_videos', resource_type: 'video' },
  { local: 'public/videos/video-1.mp4', folder: 'fitrah_videos', resource_type: 'video' },
  { local: 'public/videos/video-2.mp4', folder: 'fitrah_videos', resource_type: 'video' },
  { local: 'public/videos/video-3.mp4', folder: 'fitrah_videos', resource_type: 'video' },
  { local: 'public/videos/video-4.mp4', folder: 'fitrah_videos', resource_type: 'video' },
  // Images
  { local: 'public/assets/Gemini_Generated_Image_fculq8fculq8fcul.png', folder: 'fitrah_assets', resource_type: 'image' },
  { local: 'public/assets/hero_slide_1_beard_oil_1776964963587.png', folder: 'fitrah_assets', resource_type: 'image' },
  { local: 'public/assets/Gemini_Generated_Image_jkg1ffjkg1ffjkg1.png', folder: 'fitrah_assets', resource_type: 'image' },
  { local: 'public/assets/2ndbnr-responcive.png', folder: 'fitrah_assets', resource_type: 'image' },
  { local: 'public/assets/banner-img 1.png', folder: 'fitrah_assets', resource_type: 'image' },
  { local: 'public/assets/3rd banner responsive.png', folder: 'fitrah_assets', resource_type: 'image' }
];

async function run() {
  const results = {};
  for (const file of filesToUpload) {
    try {
      console.log(`Uploading ${file.local}...`);
      const uploadResult = await cloudinary.uploader.upload(
        path.join(__dirname, file.local),
        { 
          folder: file.folder, 
          resource_type: file.resource_type,
          use_filename: true,
          unique_filename: false
        }
      );
      // For images we want f_auto,q_auto. For videos we can use q_auto.
      let optimizedUrl = uploadResult.secure_url;
      if (file.resource_type === 'image') {
        optimizedUrl = cloudinary.url(uploadResult.public_id, { fetch_format: 'auto', quality: 'auto', secure: true });
      } else {
        optimizedUrl = cloudinary.url(uploadResult.public_id, { resource_type: 'video', quality: 'auto', secure: true });
      }
      
      results[file.local] = optimizedUrl;
      console.log(`-> SUCCESS: ${optimizedUrl}`);
    } catch (error) {
      console.error(`-> ERROR uploading ${file.local}:`, error.message);
    }
  }

  console.log("\n\n--- SUMMARY FOR page.tsx ---");
  console.log(JSON.stringify(results, null, 2));
}

run();
