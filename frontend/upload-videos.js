const { createClient } = require('./node_modules/@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
const envContent = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY'];

const supabase = createClient(supabaseUrl, supabaseKey);

const videoDir = 'C:\\Users\\IQRA TRADERS\\Desktop\\Fitrah Website\\videos';
const videoFiles = [
  '6446060-hd_1080_1920_25fps.mp4',
  'Cinematic_Beard_Oil_Bottle_Scene.mp4',
  'Product_Commercial_Generation.mp4',
  'video3 (1).mp4'
];

async function uploadVideos() {
  console.log("Creating 'media' bucket if it doesn't exist...");
  await supabase.storage.createBucket('media', { public: true });

  for (let i = 0; i < videoFiles.length; i++) {
    const fileName = videoFiles[i];
    const filePath = path.join(videoDir, fileName);
    
    if (fs.existsSync(filePath)) {
      console.log(`Uploading ${fileName}...`);
      const fileBuffer = fs.readFileSync(filePath);
      
      const { data, error } = await supabase.storage
        .from('media')
        .upload(`videos/video-${i + 1}.mp4`, fileBuffer, {
          contentType: 'video/mp4',
          upsert: true
        });

      if (error) {
        console.error(`Error uploading ${fileName}:`, error.message);
      } else {
        const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(`videos/video-${i + 1}.mp4`);
        console.log(`✅ Uploaded successfully: ${publicUrlData.publicUrl}`);
      }
    } else {
      console.log(`❌ File not found: ${filePath}`);
    }
  }
  console.log("All done! You can now uncomment the videos in the code.");
}

uploadVideos();
