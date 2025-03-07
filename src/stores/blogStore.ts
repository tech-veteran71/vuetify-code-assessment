import { defineStore } from 'pinia';
import { ref, onMounted } from 'vue';
import { supabase } from '@/plugins/supabase';

interface BlogPost {
  id: string;
  title: string;
  text: string;
  author: string;
  date: string;
}

export const useBlogStore = defineStore('blogStore', () => {
  const posts = ref<BlogPost[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Fetch posts from Supabase
  const fetchPosts = async () => {
    isLoading.value = true;
    const { data, error: fetchError } = await supabase.from('blogs').select('*').order('date', { ascending: false });

    if (fetchError) {
      error.value = fetchError.message;
      console.error('Error fetching posts:', fetchError);
    } else {
      posts.value = data;
    }
    isLoading.value = false;
  };

  // Add a new post to Supabase
  const addPost = async (post: Omit<BlogPost, 'id'>) => {
    isLoading.value = true;
    const { data, error: insertError } = await supabase.from('blogs').insert([post]).select().single();

    if (insertError) {
      error.value = insertError.message;
      console.error('Error adding post:', insertError);
    } else {
      posts.value.unshift(data); // Add new post at the top
    }
    isLoading.value = false;
  };

  // Update a post in Supabase
  const updatePost = async (updatedPost: BlogPost) => {
    isLoading.value = true;
    const { error: updateError } = await supabase.from('blogs').update(updatedPost).eq('id', updatedPost.id);

    if (updateError) {
      error.value = updateError.message;
      console.error('Error updating post:', updateError);
    } else {
      const index = posts.value.findIndex((post) => post.id === updatedPost.id);
      if (index !== -1) posts.value[index] = updatedPost;
    }
    isLoading.value = false;
  };

  // Delete a post from Supabase
  const deletePost = async (id: string) => {
    isLoading.value = true;
    const { error: deleteError } = await supabase.from('blogs').delete().eq('id', id);

    if (deleteError) {
      error.value = deleteError.message;
      console.error('Error deleting post:', deleteError);
    } else {
      posts.value = posts.value.filter((post) => post.id !== id);
    }
    isLoading.value = false;
  };

  // Fetch posts when the store is initialized
  onMounted(fetchPosts);

  return { posts, isLoading, error, fetchPosts, addPost, updatePost, deletePost };
});
