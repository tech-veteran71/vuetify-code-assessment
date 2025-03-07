<script setup lang="ts">
import { useAuthStore } from "@/stores/authStore";
import { useBlogStore } from "@/stores/blogStore";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { ref, watch, computed } from "vue";

const authStore = useAuthStore();
const blogStore = useBlogStore();
const { user } = storeToRefs(authStore);
const { posts, isLoading } = storeToRefs(blogStore);
const router = useRouter();
const showLoginAlert = ref(false);

// View Mode Toggle (Saved in localStorage)
const viewMode = ref(localStorage.getItem("viewMode") || "card");

// Pagination Setup
const postsPerPage = 6; // Number of posts per page
const currentPage = ref(Number(localStorage.getItem("currentPage")) || 1);

// Compute paginated posts based on the current page
const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage;
  return posts.value.slice(start, start + postsPerPage);
});

// Total pages calculation
const totalPages = computed(() => Math.ceil(posts.value.length / postsPerPage));

// Save page state to localStorage
watch(currentPage, (newPage) => {
  localStorage.setItem("currentPage", newPage.toString());
});

const handleAddPostClick = () => {
  if (!user.value) {
    showLoginAlert.value = true;
  } else {
    router.push("/create");
  }
};

const deletePost = async (id: string) => {
  await blogStore.deletePost(id);
};

</script>

<template>
  <v-container>
    <!-- Toggle between List & Card View -->
    <v-row class="d-flex align-center justify-space-between mb-4">
      <v-col cols="6">
        <v-btn-toggle
          v-model="viewMode"
          color="primary"
          mandatory
        >
          <v-btn value="card">
            <v-icon>mdi-view-grid</v-icon> Card View
          </v-btn>
          <v-btn value="list">
            <v-icon>mdi-format-list-bulleted</v-icon> List View
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <!-- Show Loader While Fetching Posts -->
    <v-row
      v-if="isLoading"
      class="d-flex justify-center align-center"
      style="height: 60vh"
    >
      <v-progress-circular
        indeterminate
        size="50"
        color="primary"
      />
    </v-row>

    <!-- No Blog Posts Available -->
    <v-row
      v-else-if="posts.length === 0"
      class="d-flex justify-center align-center text-center"
      style="height: 60vh"
    >
      <v-col cols="12">
        <v-icon
          size="100"
          color="grey"
        >
          mdi-note-text
        </v-icon>
        <p class="text-h6 font-weight-medium mt-4">
          No blog posts available
        </p>
        <p class="text-body-2 text-grey-darken-1">
          Be the first to write something amazing!
        </p>
        <v-btn
          v-if="user"
          color="primary"
          class="mt-4"
          @click="handleAddPostClick"
        >
          <v-icon start>
            mdi-plus-circle
          </v-icon> Add New Post
        </v-btn>
      </v-col>
    </v-row>

    <!-- Blog Posts (Card View) -->
    <v-row v-else-if="viewMode === 'card'">
      <v-col
        v-for="post in paginatedPosts"
        :key="post.id"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card
          class="mx-auto"
          max-width="600"
          elevation="10"
          rounded="lg"
          transition="fade"
        >
          <v-card-title class="text-h5 font-weight-bold">
            <v-icon
              color="primary"
              start
            >
              mdi-book-open-page-variant
            </v-icon>
            {{ post.title }}
          </v-card-title>
          <v-card-subtitle class="text-grey-lighten-1">
            <v-icon
              size="16"
              class="me-1"
            >
              mdi-account
            </v-icon>
            {{ post.author }}
            <v-icon
              size="16"
              class="mx-2"
            >
              mdi-calendar
            </v-icon> {{ post.date }}
          </v-card-subtitle>
          <v-card-text class="text-body-2 text-grey-lighten-2">
            {{ post.text.substring(0, 150) }}...
          </v-card-text>
          <v-card-actions>
            <v-btn
              v-if="user"
              color="primary"
              variant="elevated"
              :to="`/edit/${post.id}`"
            >
              <v-icon start>
                mdi-pencil
              </v-icon>Edit
            </v-btn>
            <v-btn
              v-if="user"
              color="error"
              variant="text"
              @click="deletePost(post.id)"
            >
              <v-icon start>
                mdi-delete
              </v-icon>Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Blog Posts (List View) -->
    <v-row v-else-if="viewMode === 'list'">
      <v-col cols="12">
        <v-table density="comfortable">
          <thead>
            <tr>
              <th class="text-left">
                Title
              </th>
              <th class="text-left">
                Author
              </th>
              <th class="text-left">
                Date
              </th>
              <th class="text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="post in paginatedPosts"
              :key="post.id"
            >
              <td>{{ post.title }}</td>
              <td>{{ post.author }}</td>
              <td>{{ post.date }}</td>
              <td>
                <v-btn
                  v-if="user"
                  icon
                  :to="`/edit/${post.id}`"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  v-if="user"
                  icon
                  color="error"
                  @click="deletePost(post.id)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>

    <!-- Pagination Controls -->
    <v-row
      v-if="totalPages > 1"
      class="d-flex justify-center mt-4"
    >
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        color="primary"
      />
    </v-row>

    <!-- "Add New Post" Button -->
    <v-btn
      v-if="posts.length > 0 && user"
      color="primary"
      class="mt-6"
      variant="flat"
      elevation="5"
      @click="handleAddPostClick"
    >
      <v-icon start>
        mdi-plus-circle
      </v-icon> Add New Post
    </v-btn>

    <!-- Login Required Alert -->
    <v-dialog
      v-model="showLoginAlert"
      max-width="400"
    >
      <v-card>
        <v-card-title class="text-h6">
          Login Required
        </v-card-title>
        <v-card-text>You must be logged in to create a new post.</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            @click="router.push('/auth')"
          >
            Login
          </v-btn>
          <v-btn
            color="grey"
            variant="text"
            @click="showLoginAlert = false"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
