// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
if (!supabaseKey) throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY')

// Create client with anon key
export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    },
    global: {
        headers: {
            'x-my-custom-header': 'emb-talent'
        }
    }
})

export async function uploadPdf(file) {
    if (!file) {
        throw new Error('No file provided');
    }

    // Simple filename with timestamp
    const filename = `${Date.now()}.pdf`;

    try {
        // Basic upload with minimal options
        const { data, error } = await supabase.storage
            .from('pdfs')
            .upload(filename, file);

        if (error) {
            console.error('Upload error:', error);
            throw error;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('pdfs')
            .getPublicUrl(filename);

        return publicUrl;
    } catch (error) {
        console.error('Upload error:', error);
        throw new Error('Failed to upload file. Please try again.');
    }
}
