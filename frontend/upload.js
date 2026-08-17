const cloudinary = require('cloudinary').v2;

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: 'em5hu05n',
  api_key: '115962497288799',
  api_secret: 'OIxTUEUy2CvS151-nmabCNaYcnA'
});

async function run() {
  try {
    // 2. Upload an image
    console.log("Uploading image...");
    const uploadResult = await cloudinary.uploader.upload(
      'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      { public_id: 'my_sample_image' }
    );
    console.log("Upload successful!");
    console.log("Secure URL:", uploadResult.secure_url);
    console.log("Public ID:", uploadResult.public_id);
    
    // 3. Get image details
    console.log("\n--- Image Details ---");
    console.log("Width:", uploadResult.width, "px");
    console.log("Height:", uploadResult.height, "px");
    console.log("Format:", uploadResult.format);
    console.log("File Size:", uploadResult.bytes, "bytes");

    // 4. Transform the image
    // f_auto: Automatically choose the most optimized format (like WebP or AVIF) for the requesting browser.
    // q_auto: Automatically adjust the compression quality to reduce file size without visible quality loss.
    const transformedUrl = cloudinary.url(uploadResult.public_id, {
      fetch_format: 'auto',
      quality: 'auto'
    });

    console.log("\n--- Transformation ---");
    console.log("Done! Click link below to see optimized version of the image. Check the size and the format.");
    console.log(transformedUrl);

  } catch (error) {
    console.error("Error occurred:", error);
  }
}

run();
