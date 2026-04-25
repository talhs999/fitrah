// Robust Admin User Script
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://glnienrgxonzmfzzjwam.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsbmllbnJneG9uem1menpqd2FtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njk4MjA2NSwiZXhwIjoyMDkyNTU4MDY1fQ.Panl93XEvMPZVoLHdmXoH6lJE5QynH0CD5OvhkJgbUw',
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function run() {
  const email = 'admin@fitrah.com';
  const password = 'Fitrah@2026';

  console.log(`Checking for user: ${email}...`);
  
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error('Error listing users:', listError.message);
    return;
  }

  const existingUser = users.find(u => u.email === email);

  if (existingUser) {
    console.log('User found! Updating password...');
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      existingUser.id,
      { password: password, email_confirm: true }
    );
    
    if (updateError) {
      console.error('Error updating password:', updateError.message);
    } else {
      console.log('SUCCESS: Admin password updated to: ' + password);
    }
  } else {
    console.log('User not found. Creating new admin...');
    const { error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (createError) {
      console.error('Error creating user:', createError.message);
    } else {
      console.log('SUCCESS: Admin user created with password: ' + password);
    }
  }
  
  console.log('\nYou can now login at http://localhost:3000/login');
}

run();
