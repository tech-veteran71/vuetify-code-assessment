<script setup lang="ts">
import { ref, watch } from "vue";
import { useBlogStore } from "@/stores/blogStore";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";

const blogStore = useBlogStore();
const authStore = useAuthStore();
const router = useRouter();

// Redirect to login if the user is not authenticated
watch(
  () => authStore.isAuthChecked,
  (isChecked) => {
    if (isChecked && !authStore.user) {
      router.push("/auth"); // Redirect to login page
    }
  }
);

const title = ref("");
const text = ref("");
const author = ref(authStore.user?.email || "Anonymous"); // Default to "Anonymous" if no email
const isSaving = ref(false);
const errorMessage = ref<string | null>(null);

// Ensure author updates when the user logs in
watch(
  () => authStore.user,
  (newUser) => {
    author.value = newUser?.email || "Anonymous";
  }
);

// Submit new post to Supabase
const submitPost = async () => {
  if (!title.value.trim() || !text.value.trim() || !author.value.trim()) {
    errorMessage.value = "All fields are required!";
    return;
  }

  isSaving.value = true;
  errorMessage.value = null;

  const newPost = {
    title: title.value,
    text: text.value,
    author: author.value,
    date: new Date().toISOString(), // Current date
  };

  try {
    await blogStore.addPost(newPost);
    router.push("/"); // Redirect to home after saving
  } catch (error) {
    console.error("Error saving post:", error);
    errorMessage.value = "Failed to save the post.";
  } finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <v-container v-if="authStore.isAuthChecked">
    <v-card class="pa-4">
      <v-card-title>Add New Post</v-card-title>
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
          @click="submitPost"
        >
          Save
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
    v-else
    class="d-flex justify-center align-center"
    style="height: 100vh"
  >
    <v-progress-circular
      indeterminate
      size="50"
      color="primary"
    />
  </v-container>
</template>
