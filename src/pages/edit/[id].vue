<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useBlogStore } from "@/stores/blogStore";
import { useAuthStore } from "@/stores/authStore";
import { useRoute, useRouter } from "vue-router";

const blogStore = useBlogStore();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const postId = (route.params as { id: string }).id;

const post = ref<{
  title: string;
  text: string;
  author: string;
  date: string;
} | null>(null);
const title = ref("");
const text = ref("");
const author = ref("");
const isSaving = ref(false);
const errorMessage = ref<string | null>(null);

// Check authentication and redirect if not logged in
watch(
  () => authStore.isAuthChecked,
  (isChecked) => {
    if (isChecked && !authStore.user) {
      router.push("/auth"); // Redirect to login if not authenticated
    }
  }
);

// Fetch the existing post from Supabase
const fetchPost = async () => {
  const existingPost = blogStore.posts.find((p) => p.id === postId);
  if (existingPost) {
    post.value = existingPost;
    title.value = existingPost.title;
    text.value = existingPost.text;
    author.value = existingPost.author;
  } else {
    errorMessage.value = "Post not found!";
  }
};

// Update post in Supabase
const updatePost = async () => {
  if (!title.value.trim() || !text.value.trim()) {
    errorMessage.value = "All fields are required!";
    return;
  }

  isSaving.value = true;
  errorMessage.value = null;

  try {
    await blogStore.updatePost({
      id: postId,
      title: title.value,
      text: text.value,
      author: author.value,
      date: post.value?.date || new Date().toISOString(), // Keep original date
    });

    router.push("/"); // Redirect to home after saving
  } catch (error) {
    console.error("Error updating post:", error);
    errorMessage.value = "Failed to update the post.";
  } finally {
    isSaving.value = false;
  }
};

// Fetch post data on mount
onMounted(fetchPost);
</script>

<template>
  <v-container v-if="authStore.isAuthChecked && post">
    <v-card class="pa-4">
      <v-card-title>Edit Post</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="title"
          label="Title"
          outlined
          required
        />
        <v-textarea
          v-model="text"
          label="Content"
          outlined
          required
        />

        <v-alert
          v-if="errorMessage"
          type="error"
          class="mt-2"
        >
          {{ errorMessage }}
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="primary"
          :loading="isSaving"
          @click="updatePost"
        >
          Save Changes
        </v-btn>
        <v-btn
          color="grey"
          variant="text"
          to="/"
        >
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>

  <!-- Show Loading Indicator Until Auth Check Completes -->
  <v-container
    v-else-if="!authStore.isAuthChecked"
    class="d-flex justify-center align-center"
    style="height: 100vh"
  >
    <v-progress-circular
      indeterminate
      size="50"
      color="primary"
    />
  </v-container>

  <!-- Show error if post is not found -->
  <v-container v-else>
    <v-alert type="error">
      Post not found!
    </v-alert>
  </v-container>
</template>
