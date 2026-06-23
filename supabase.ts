import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://flnzycipcdqtwcyujzqe.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsbnp5Y2lwY2RxdHdjeXVqenFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MjA5MzcsImV4cCI6MjA5NzE5NjkzN30.plqw_CtlaJmChDlnkTfHN9MUPVn0IK7Ty_WfujM3ICo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
