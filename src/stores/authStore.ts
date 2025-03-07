import { defineStore } from 'pinia';
import { ref, onMounted } from 'vue';
import { supabase } from '@/plugins/supabase';
import type { User } from '@supabase/supabase-js';

export const useAuthStore = defineStore('authStore', () => {
    const user = ref<User | null>(null);
    const isAuthChecked = ref(false); // Ensure auth is fully loaded before redirects
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    // Check User Session (On App Load)
    const checkUser = async () => {
        isLoading.value = true;
        const { data, error: userError } = await supabase.auth.getUser();

        if (userError) {
            console.error('Error fetching user:', userError.message);
            user.value = null;
        } else {
            user.value = data.user ?? null;
        }

        isLoading.value = false;
        isAuthChecked.value = true; // Mark that authentication check is completed
    };

    // Listen for Supabase Auth Changes (Keeps User Logged In)
    supabase.auth.onAuthStateChange((event, session) => {
        user.value = session?.user ?? null;
        isAuthChecked.value = true; // Mark auth as checked
    });

    // Sign Up & Auto-login
    const signUp = async (email: string, password: string) => {
        isLoading.value = true;
        error.value = null;

        const { error: signUpError } = await supabase.auth.signUp({ email, password });

        if (signUpError) {
            error.value = signUpError.message;
        } else {
            await checkUser(); // Restore session immediately
        }

        isLoading.value = false;
    };

    // Login
    const signIn = async (email: string, password: string) => {
        isLoading.value = true;
        error.value = null;

        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

        if (signInError) {
            error.value = signInError.message;
        } else {
            await checkUser(); // Restore session
        }

        isLoading.value = false;
    };

    // Logout
    const signOut = async () => {
        await supabase.auth.signOut();
        user.value = null;
    };

    // Automatically check user on app load
    onMounted(checkUser);

    return { user, isAuthChecked, isLoading, error, checkUser, signUp, signIn, signOut };
});
