import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lukdudigghvsqizkukeq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1a2R1ZGlnZ2h2c3Fpemt1a2VxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5MzQ1MTEsImV4cCI6MjA4NzUxMDUxMX0.EXzu-FOguFzeBjp37g2U6FGDVlTudV6apMLu1G5SVUQ';

export const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase; // Exporting as default for easier imports in other files