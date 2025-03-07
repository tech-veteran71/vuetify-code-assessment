<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const email = ref("");
const password = ref("");
const isSignUp = ref(false);

const submitAuth = async () => {
  if (isSignUp.value) {
    await authStore.signUp(email.value, password.value);
  } else {
    await authStore.signIn(email.value, password.value);
  }

  if (!authStore.error) {
    router.push("/");
  }
};
</script>

<template>
  <v-container
    class="d-flex justify-center align-center"
    style="height: 100vh"
  >
    <v-card
      width="400"
      elevation="12"
      rounded="lg"
    >
      <v-card-title class="text-h5 text-center font-weight-bold">
        {{ isSignUp ? "Create Account" : "Welcome Back" }}
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="email"
          label="Email"
          type="email"
          required
        />
        <v-text-field
          v-model="password"
          label="Password"
          type="password"
          required
        />

        <v-alert
          v-if="authStore.error"
          type="error"
          class="mt-2"
        >
          {{ authStore.error }}
        </v-alert>
      </v-card-text>
      <v-card-actions class="d-flex justify-space-between">
        <v-btn
          color="secondary"
          @click="isSignUp = !isSignUp"
        >
          {{ isSignUp ? "Sign In Instead" : "Create Account" }}
        </v-btn>
        <v-btn
          color="primary"
          :loading="authStore.isLoading"
          @click="submitAuth"
        >
          {{ isSignUp ? "Sign Up" : "Sign In" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
