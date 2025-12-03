// ===================================
// CONFIGURACIÓN DE SUPABASE
// ===================================

// IMPORTANTE: Reemplaza estos valores con tus credenciales de Supabase
const SUPABASE_URL = 'https://bseecefypuqlratyegos.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzZWVjZWZ5cHVxbHJhdHllZ29zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NzE2OTYsImV4cCI6MjA3ODA0NzY5Nn0.BTRT0527dE5xgsoWiibQ5YUHxYyjRRzQO6PjcXjXiDA'; 

// Inicializar cliente de Supabase
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Exportar para uso global
window.supabase = supabaseClient;

console.log('✅ Cliente de Supabase inicializado');
