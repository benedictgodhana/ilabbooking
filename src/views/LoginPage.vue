<template>
  <DashboardHeader />

  <v-alert v-if="successMessage" type="success">{{ successMessage }}</v-alert>
  <v-alert v-if="errorMessage" type="error" style="margin: 10px;">{{ errorMessage }}</v-alert>


  <v-container fluid class="login-container">

    <v-row justify="center" align="center" class="login-row">
      <v-col cols="12" sm="8" md="6">
        <v-card class="login-card" elevation="4">
          <img src="/LOGO_2.png" alt="Logo" class="login-logo">
          <v-card-title class="login-title"></v-card-title>
          <v-card-text>
            <v-form @submit.prevent="login">
              <v-text-field v-model="email" label="Email" type="email" required></v-text-field>
              <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
              <v-btn :loading="isLoading" :disabled="isLoading" type="submit" class="login-button">
                <v-icon v-if="!isLoading" left>mdi-login</v-icon>
                <v-icon v-else>mdi-loading</v-icon>
                Login
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DashboardHeader from '@/components/DashboardHeader.vue';
import axiosInstance from '../service/api';

export default {
  components: {
    DashboardHeader,
  },
  data() {
    return {
      successMessage: '', // Success message
      errorMessage: '', // Error message
      email: '',
      password: '',
      isLoading: false, // Loading state
      errorMessage: '', // Error message
    };
  },
  methods: {
    async login() {
      // Start loading
      this.isLoading = true;

      try {
        // Make API call to authenticate user using axios instance
        const response = await axiosInstance.post('/login', {
          email: this.email,
          password: this.password
        });

        // Authentication successful
        // Store token in local storage or Vuex store
        const token = response.data.token;
        localStorage.setItem('token', token);
        
        // Fetch user data
        const user = response.data.user;
        localStorage.setItem('user', JSON.stringify(user));


        // Check user's role
        const userRole = response.data.role; // Assuming role is returned from the backend

        this.successMessage = 'Login successful';

        setTimeout(() => {
          this.successMessage = ''; // Clear success message after 3 seconds
        }, 3000); // 3000 milliseconds = 3 seconds

        
        // Redirect to dashboard based on role
        if (userRole === 'Ilab Receptionist') {
          this.$router.push({ name: 'IlabDashboard', params: { user: user } });
        } else if (userRole === 'Ibiz Receptionist') {
          this.$router.push({ name: 'IbizDashboard', params: { user: user } });
        } else if (userRole === "Director's Receptionist") {
          this.$router.push({ name: 'DirectorDashboard', params: { user: user } });
        } else if (userRole === "Normal User") {
          this.$router.push({ name: 'UserDashboard', params: { user: user } });
        } else if (userRole === 'Admin') {
          this.$router.push({ name: 'AdminDashboard', params: { user: user } });
        } else {
          // Handle other roles or scenarios
          console.error('Unknown role:', userRole);
        }

        this.errorMessage = '';
      } catch (error) {
        // Authentication failed
        console.error('Login failed:', error);
        this.errorMessage = 'Invalid email or password';

        setTimeout(() => {
          this.errorMessage = ''; // Clear error message after 3 seconds
        }, 3000); // 3000 milliseconds = 3 seconds


        this.successMessage = '';
      } finally {
        // Stop loading
        this.isLoading = false;
      }
    }
  }
};
</script>



<style scoped>
.login-container {
  height: 60vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-row {
  margin-top: 50px;
}

.login-card {
  width: 100%;
  padding: 2rem;
  border-radius:10px;
}

.login-title {
  display: flex;
  align-items: center;
}
.login-logo {
  display: block; 
  margin: 0 auto; 
  max-width: 100%; 
  height: auto; 
  width: 150px; 
}

.login-button {
  width: 100%; 
  background: darkblue;
  color:white;
}
</style>
