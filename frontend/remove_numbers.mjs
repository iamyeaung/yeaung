import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ ERROR: Missing Supabase credentials.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function removeNumbersFromTitles() {
  console.log("🔍 Fetching logs to clean up titles...");
  
  const { data: logs, error } = await supabase.from("daily_logs").select("id, title");
  
  if (error) {
    console.error("❌ Error fetching logs:", error.message);
    return;
  }
  
  let successCount = 0;
  for (const log of logs) {
    // Regex to match "၁။ ", "1. ", "၁၀။ " at the start of the string
    const newTitle = log.title.replace(/^[၀-၉0-9]+[။.]\s*/, '');
    
    if (newTitle !== log.title) {
      const { error: updateError } = await supabase
        .from("daily_logs")
        .update({ title: newTitle })
        .eq("id", log.id);
        
      if (updateError) {
        console.error(`❌ Error updating log ${log.id}:`, updateError.message);
      } else {
        console.log(`✅ Updated: "${log.title}" -> "${newTitle}"`);
        successCount++;
      }
    }
  }
  
  console.log(`🎉 Done! Successfully updated ${successCount} titles.`);
}

removeNumbersFromTitles();
