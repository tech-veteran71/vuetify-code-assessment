<script setup lang="ts">
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const router = useRouter();

const logout = async () => {
  await authStore.signOut();
  router.push("/auth");
};
</script>

<template>
  <v-app>
    <!-- Navigation Bar -->
    <v-app-bar
      elevation="6"
      color="surface"
    >
      <v-container class="d-flex align-center">
        <!-- Clickable Blog Logo -->
        <router-link
          to="/"
          class="text-decoration-none"
        >
          <v-toolbar-title class="text-h5 font-weight-bold cursor-pointer">
            <v-icon
              size="36"
              color="primary"
              class="me-2"
            >
              mdi-feather
            </v-icon>
            Luxury Blog
          </v-toolbar-title>
        </router-link>

        <v-spacer />

        <!-- Navigation Links -->
        <v-btn
          variant="text"
          to="/"
        >
          Home
        </v-btn>
        <v-btn
          v-if="user"
          variant="text"
          to="/create"
        >
          New Post
        </v-btn>

        <!-- Authentication Buttons -->
        <v-btn
          v-if="user"
          variant="text"
          @click="logout"
        >
          Logout
        </v-btn>
        <v-btn
          v-else
          variant="text"
          to="/auth"
        >
          Login
        </v-btn>
      </v-container>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>
