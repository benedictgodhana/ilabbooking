<template>
  <v-dialog v-model="dialog" max-width="400">
    <v-card>
      <v-card-title>Login</v-card-title>
      <v-card-text>
        <!-- Login form fields -->
        <v-text-field v-model="email" label="Email" :error-messages="emailErrors" @input="clearErrors"></v-text-field>
        <v-text-field v-model="password" label="Password" type="password" :error-messages="passwordErrors" @input="clearErrors"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="login">Login</v-btn>
        <v-btn color="error" @click="close">Cancel</v-btn>
      </v-card-actions>
    </v-card>
    <v-snackbar v-model="errorSnackbar" color="error">{{ errorMessage }}</v-snackbar>
  </v-dialog>
</template>

<script>
import axiosInstance from '../src/service/api';

export default {
  props: {
    dialog: Boolean, // Flag to control dialog visibility
  },
  data() {
    return {
      email: '',
      password: '',
      emailErrors: [],
      passwordErrors: [],
      errorSnackbar: false,
      errorMessage: '',
    };
  },
  methods: {
    login() {
      // Clear previous error messages
      this.clearErrors();

      // Validate input fields
      if (!this.email) {
        this.emailErrors.push('Email is required');
      }
      if (!this.password) {
        this.passwordErrors.push('Password is required');
      }

      // If there are validation errors, display them and return
      if (this.emailErrors.length > 0 || this.passwordErrors.length > 0) {
        return;
      }

      // Make API call to authenticate user
      axiosInstance.post('/login', {
        email: this.email,
        password: this.password
      })
      .then(response => {
        // Authentication successful
        // Emit event to notify parent component about successful login
        this.$emit('login-success', response.data.token);
      })
      .catch(error => {
        // Authentication failed
        // Display error message using snackbar
        this.errorMessage = 'Login failed. Please check your credentials.';
        this.errorSnackbar = true;
        console.error('Login failed:', error);
      });
    },
    close() {
      // Close the dialog without logging in
      this.$emit('close');
    },
    clearErrors() {
      // Clear error messages
      this.emailErrors = [];
      this.passwordErrors = [];
    }
  }
};
</script>
