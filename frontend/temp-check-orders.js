const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const extract = (key) => {
  const match = env.match(new RegExp(key + '=(.*)'));
  return match ? match[1].trim().replace(/^"|"$/g, '') : null;
};
const supabase = createClient(extract('NEXT_PUBLIC_SUPABASE_URL'), extract('SUPABASE_SERVICE_ROLE_KEY'));

async function check() {
  const { data, error } = await supabase.from('orders').select('*').limit(1);
  if (data && data.length > 0) {
    console.log(Object.keys(data[0]));
  } else {
    console.log(error || "No data");
  }
}
check();
