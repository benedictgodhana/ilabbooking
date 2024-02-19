<template>
 
  <RouterView />
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const showSearch = ref(false)
const isMenuOpen = ref(false)

// Function to toggle the menu
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<style scoped>
header {
  background-color: darkblue; /* Adjust color as needed */
  color: white;
  padding: 1rem;
  display: flex;
  align-items: center;
  font-size: 14px; /* Default font size */
  height:90px;
}

.logo {
  flex: 1; /* Take remaining space */
}



.logo img {
  max-height: 150px; /* Adjust height as needed */
  margin-top: 20px;
}

.menu-toggle {
  display: none; /* Hide toggle button by default for non-mobile views */
}

.menu-toggle i {
  font-size: 1.5rem; /* Adjust size of the menu icon */
  cursor: pointer;
}

nav {
  display: flex;
  gap: 1rem;
}

nav.active {
  flex-direction: column; /* Align navigation links vertically when menu is open */
  position: absolute; /* Position the menu on top of other content */
  top: 4rem; /* Adjust distance from the top */
  left: 0;
  right: 0;
  background-color: #333; /* Add background color for the menu */
  padding: 1rem; /* Add padding to the menu */
}

.nav-link {
  color: white;
  text-decoration: none;
  transition: opacity 0.3s ease;
  margin-right: 1rem; /* Add margin between navigation items */
}

.nav-link:hover {
  opacity: 0.8;
}

.search-icon {
  margin-left: auto; /* Push the icon to the right */
}

.search-icon i {
  font-size: 1.5rem; /* Adjust size as needed */
  cursor: pointer;
}

.search-form {
  margin-left: auto; /* Push the form to the right */
}

.search-form form {
  display: flex;
  align-items: center;
}

.search-form input[type="text"] {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 1rem; /* Add spacing between input and other form elements */
}

/* Media query for mobile devices */
@media (max-width: 768px) {
  .menu-toggle {
    display: block; /* Show toggle button for mobile views */
  }

  nav {
    display: none; /* Hide navigation menu by default for mobile views */
  }

  nav.active {
    display: flex; /* Show the menu when 'active' class is applied */
  }

  .nav-link {
    margin-right: 0; /* Remove margin between navigation items for mobile */
    margin-bottom: 1rem; /* Add spacing between navigation links */
  }
}
</style>
