<template>
  <v-layout>
    <v-app-bar dense height="100" style="background: darkblue;">
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click="drawer = !drawer" color="orange"></v-app-bar-nav-icon>
      </template>
      <v-app-bar-title></v-app-bar-title>
      <template v-slot:append>
        <v-btn icon @click="goToViewBookings" style="margin-right: 8px;">
          <v-icon color="orange">mdi-calendar-clock</v-icon>
        </v-btn>
        <v-btn icon @click="showSearch = !showSearch" style="margin-right: 8px;">
          <v-icon color="orange">mdi-magnify</v-icon>
        </v-btn>
        <v-btn icon style="margin-right: 8px;">
          <v-icon color="orange">mdi-help-circle-outline</v-icon>
        </v-btn>
        <v-btn icon style="margin-right: 8px;">
          <v-icon color="orange">mdi-cog</v-icon>
        </v-btn>
        <v-btn icon @click="toggleNotification" style="margin-right: 28px;">
          <v-icon color="orange">mdi-bell</v-icon>
          <!-- Display the notification count if it's greater than 0 -->
          <span v-if="notificationCount > 0" class="notification-count">{{ notificationCount }}</span>
        </v-btn>
        <v-btn icon @click="logout" style="margin-right: 8px;">
          <v-icon color="orange">mdi-logout</v-icon>
        </v-btn>
        <v-avatar style="width: 36px; height: 36px; margin-right: 18px;">
          <img src="/4035887-200.png" alt="User Avatar" style="width: 100%; height: 100%; object-fit: cover;">
        </v-avatar>
      </template>
    </v-app-bar>
  </v-layout>
</template>

<script setup>
import { ref } from 'vue';
import axiosInstance from '../service/api';
import { useRouter } from 'vue-router';

const drawer = ref(false);
const notificationCount = ref(10); // Initial notification count
const router = useRouter();

const logout = async () => {
  try {
    await axiosInstance.post('/logout', {}, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming you store the token in localStorage
      }
    });
    // Clear the token from localStorage or wherever it's stored
    localStorage.removeItem('token');
    // Redirect the user to the login page or perform any other necessary actions
    router.push('/login');
  } catch (error) {
    console.error('Logout failed:', error);
    // Handle logout failure
  }
};
</script>

<style scoped>
.notification-count {
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: red;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
}
.card {
  padding:20px;
}
.wrap {
  display: flex;
  flex-wrap: wrap;
  margin-top: 120px;
  margin-right:48px;
}
.left {
  flex: 0 0 15%;
  height: 100%;
}
.content {
  flex: 0 0 80%;
}
</style>
