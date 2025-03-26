import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hbbczzluseindiwurpny.supabase.co";
const supabaseAnonKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiYmN6emx1c2VpbmRpd3VycG55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwMjA2ODYsImV4cCI6MjA1ODU5NjY4Nn0.R6GqlavkxyBSuhmyaqEml8DMxkWKB5XHJCNO-VWd28o";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
