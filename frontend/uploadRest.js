const cloudinary = require('cloudinary').v2;
const path = require('path');

cloudinary.config({
  cloud_name: 'em5hu05n',
  api_key: '115962497288799',
  api_secret: 'OIxTUEUy2CvS151-nmabCNaYcnA'
});

const filesToUpload = [
  { local: 'public/assets/Black.png', folder: 'fitrah_assets', resource_type: 'image' },
  { local: 'public/assets/white.png', folder: 'fitrah_assets', resource_type: 'image' },
  { local: 'public/assets/6c6b8b4f-0302-4c17-babe-bf4c7ed5826a.png', folder: 'fitrah_assets', resource_type: 'image' },
  { local: 'public/assets/fitrah-beard-image.png', folder: 'fitrah_assets', resource_type: 'image' },
  { local: 'public/gallery/1.jpg', folder: 'fitrah_gallery', resource_type: 'image' },
  { local: 'public/gallery/2.jpg', folder: 'fitrah_gallery', resource_type: 'image' },
  { local: 'public/gallery/3.jpg', folder: 'fitrah_gallery', resource_type: 'image' },
  { local: 'public/gallery/4.jpg', folder: 'fitrah_gallery', resource_type: 'image' },
  { local: 'public/gallery/5.jpg', folder: 'fitrah_gallery', resource_type: 'image' },
  { local: 'public/gallery/6.jpg', folder: 'fitrah_gallery', resource_type: 'image' }
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
      
      const optimizedUrl = cloudinary.url(uploadResult.public_id, { fetch_format: 'auto', quality: 'auto', secure: true });
      results[file.local] = optimizedUrl;
      console.log(`-> SUCCESS: ${optimizedUrl}`);
    } catch (error) {
      console.error(`-> ERROR uploading ${file.local}:`, error.message);
    }
  }

  console.log("\n\n--- SUMMARY ---");
  console.log(JSON.stringify(results, null, 2));
}

run();
