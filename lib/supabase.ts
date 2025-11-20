import { createClient } from '@supabase/supabase-js';

// Configuration provided for GenixHub CRM
const supabaseUrl = 'https://pbjhbehfbgesisgliohh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBiamhiZWhmYmdlc2lzZ2xpb2hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MjQwODgsImV4cCI6MjA3OTIwMDA4OH0.g7unH2EXrYAaHPxsDRvEBzT6OTCfI7TJzJzBQttn3Q0';

export const supabase = createClient(supabaseUrl, supabaseKey);