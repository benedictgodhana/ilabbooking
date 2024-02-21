<template>
  <v-layout>
    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      class="bg-light"
      theme="dark"
      permanent
      style="background:white;"
      elevation="4"
      floating
    >

    <v-list-item class="drawer-header">
      <v-list-item-avatar>
        <v-img src="/LOGO_2.png" contain></v-img>
        <h4 style="color:black">Welcome, {{ userName }}</h4>
      </v-list-item-avatar>
      <v-list-item-content>
      </v-list-item-content>
    </v-list-item>
    <v-divider style="border:2px solid"></v-divider>

    <v-list color="black">
  <v-list-item
    v-for="(item, index) in items"    
    :key="index"
    :prepend-icon="item.icon"
    :title="item.title"
    :to="item.route"
    style="color: black; font-size: 10px;"
    @click="selectItem(index)"
    :class="{ 'v-list-item--active': selectedItem === index, 'active-orange': selectedItem === index }"    ></v-list-item>
</v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block style="background:darkblue;" @click="logout" elevation="4">
              <v-icon color="orange">mdi-logout</v-icon>
                   Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    
    <!-- App Bar -->
    <v-app-bar dense height="100" style="background: darkblue;">
      <!-- Toggle Navigation Drawer Button -->
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" color="orange"></v-app-bar-nav-icon>
      </template>

      <template v-slot:append>
        <v-chip color="orange" class="mr-2" @click="goToViewBookings">
          <v-icon color="orange">mdi-calendar-clock</v-icon>
      </v-chip>
      <v-chip color="orange" class="mr-2" @click="showSearch = !showSearch">
          <v-icon color="orange">mdi-magnify</v-icon>
      </v-chip>
      <v-chip color="orange" class="mr-2">
          <v-icon color="orange">mdi-help-circle-outline</v-icon>
      </v-chip>
      <v-chip color="orange" class="mr-2">
          <v-icon color="orange">mdi-cog</v-icon>
      </v-chip>
      <v-chip color="orange" class="mr-2" @click="toggleNotification">
          <v-icon color="orange">mdi-bell</v-icon>
          <span v-if="notificationCount > 0" class="notification-count">{{ notificationCount }}</span>
      </v-chip>

       
        <v-avatar style="width: 36px; height: 36px; margin-right: 18px;">
          <img :src="userImage" alt="User Avatar" style="width: 100%; height: 100%; object-fit: cover;">
        </v-avatar>
      </template>
    </v-app-bar>

    <v-main style="height: 400px;margin:18px;">

     
      <v-alert v-model="alert.show" :type="alert.type" dismissible>
    {{ alert.message }}
  </v-alert>

      
      <v-alert v-if="showSuccessAlert" type="success" transition="scale-transition" outlined>
        User added successfully!
      </v-alert>

      <v-alert v-if="showErrorAlert" type="error" transition="scale-transition" outlined>
        Failed to add user. Please try again later.
      </v-alert>

<!-- Dialog for Adding a User -->
<v-dialog v-model="showAddUserDialog" max-width="1000px" height="100%" style="margin-top:70px">
  <v-card>
    <v-card-title>Add New User</v-card-title>
    <v-card-text>
      <v-text-field v-model="newUser.name" label="User Name"></v-text-field>
      <v-text-field v-model="newUser.email" label="Email"></v-text-field>
      <v-text-field
      v-model="newUser.password"
      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append="showPassword = !showPassword"
      :type="showPassword ? 'text' : 'password'"
      label="Password"
    ></v-text-field>
      <!-- Role selection dropdown -->
      <v-select v-model="newUser.role" :items="roles" label="Select Role"></v-select>
    </v-card-text>
    <v-card-actions>
      <v-chip color="green" @click="addUser" style="margin: 8px;border-radius: 2px;" elevation="2"><v-icon left>mdi-plus</v-icon>Add</v-chip>
      <v-chip color="red" @click="cancelAddUser" style="border-radius: 2px;" elevation="2"><v-icon left>mdi-close</v-icon>Cancel</v-chip>
    </v-card-actions>
  </v-card>
</v-dialog>

<v-dialog v-model="showEditUserModal"  max-width="1000px" height="100%" style="margin-top:70px">
        <v-card>
          <v-card-title>Edit User</v-card-title>
          <v-card-text>
            <v-text-field v-model="editedUser.name" label="User Name"></v-text-field>
            <v-text-field v-model="editedUser.email" label="Email"></v-text-field>
            <v-text-field
              v-model="editedUser.password"
              :append-icon="passwordVisibility ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="passwordVisibility = !passwordVisibility"
              :type="passwordVisibility ? 'text' : 'password'"
              label="Password"
              hint="Click the eye icon to toggle password visibility"
            ></v-text-field>
            <!-- Role selection dropdown -->
            <v-select v-model="editedUser.role" :items="roles" label="Select Role"></v-select>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="updateUser">Save</v-btn>
            <v-btn color="error" @click="cancelEditUser">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="confirmDialog" max-width="400">
      <v-card>
        <v-card-title>Confirm Deletion</v-card-title>
        <v-card-text>
          Are you sure you want to delete the user <strong>{{ userToDelete.name }}</strong>?
        </v-card-text>
        <v-card-actions>
          <v-btn color="red darken-1" @click="deleteUserConfirmed">Delete</v-btn>
          <v-btn @click="cancelDelete">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    

    <v-dialog v-model="showUserDetailsDialog" max-width="400">
      <v-card>
        <v-card-title>User Details</v-card-title>
        <v-card-text>
          <div>Name: {{ selectedUser.name }}</div>
          <div>Email: {{ selectedUser.email }}</div>
          <div>Role: {{ selectedUser.role }}</div>

          <!-- Add more user details here -->
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="closeUserDetailsDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    



<v-card elevation="4">
  <!-- Button to add new user -->
  <v-chip color="pink" @click="showAddUserDialog = true" style="margin-left: 20px; margin: 8px;border-radius: 2px;" elevation="1">
    <v-icon left>mdi-plus</v-icon>
    Add User
  </v-chip>

  <v-text-field
      v-model="search"
      label="Search"
      variant="outlined"
      dense
      placeholder="Search users..."
      style="width:100%;max-width: 600px;margin: 8px;"
    ></v-text-field>
    

  <!-- Data Table -->
  <v-data-table
    :headers="headers"
    :items="users"
    :items-per-page="5"
    :search="search"
    class="elevation-4"
  >
    <template v-slot:item.actions="{ item }">
      <v-chip color="green" small class="mr-2" @click="viewUser(item)">
        <v-icon>mdi-eye</v-icon>
      </v-chip>
      <v-chip color="orange" small class="mr-2" @click="editUser(item)">
        <v-icon>mdi-pencil</v-icon>
      </v-chip>
      <v-chip color="red" small @click="confirmDelete(item)">
      <v-icon>mdi-delete</v-icon>
    </v-chip>

    </template>

    <template v-slot:item.role="{ item }">
    {{ item.roles.map(role => role.name).join(', ') }}
  </template>
  </v-data-table>
</v-card>
</v-main>  </v-layout>
</template>        
<script>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  data() {
    return {

      confirmDialog: false,
      userToDelete: null,
      alert: {
        show: false,
        message: '',
        type: 'success' // Default to success type
      },

      alert: {
        show: false,
        message: '',
        type: '' // You can set the type dynamically based on success/error
      },
      showPassword: false,
      passwordVisibility: false, // Add this line
      showEditUserModal: false,
      editedUser: {
        name: '',
        email: '',
        password: '',
        role: '',
      },
      showSuccessAlert: false,
      showErrorAlert: false,
      headers: [
        { title: 'Name', value: 'name' },
        { title: 'Email', value: 'email' },
        { title: 'Role', value: 'role' },
        { title: 'Actions', value: 'actions', sortable: false },
      ],
      search: '', // Search input field value
      showUserDetailsDialog: false,
      selectedUser: {},
      users: [],
      roles: [], // Array to store fetched role names
      newUser: { name: '', email: '', role:'' },
      showAddUserDialog: false,
      drawer: true,
      notificationCount: 10,
      user: JSON.parse(localStorage.getItem('user')),
      userName: '',
      userImage: '',
      items: [
        { title: 'Dashboard', icon: 'mdi-view-dashboard', route:"/admin/dashboard"},
        { title: 'Manage Rooms', icon: 'mdi-door', route:"/admin/managerooms" },
        { title: 'Manage Bookings', icon: 'mdi-calendar-check', route:"/admin/managebookings" },
        { title: 'Manage Users', icon: 'mdi-account-group', route:"/admin/manageusers" },
        { title: 'Analytics & Reporting', icon: 'mdi-chart-bar', route:"/admin/analytics&reporting" },
        { title: 'System Settings', icon: 'mdi-cog', route:"/admin/system_settings" },
        { title: 'Manage Reservations', icon: 'mdi-calendar-clock', route:"/admin/managereservations" },
        { title: 'Manage Amenities', icon: 'mdi-bed', route:"/admin/manageamenities" },
        { title: 'Help & Support', icon: 'mdi-help-circle', route:"/admin/help&support" },
        { title: 'System Logs & Audit', icon: 'mdi-file-document-outline', route:"/admin/systemlogs&audit" }
      ],
      selectedItem: null,
      router: useRouter(),
    };
  },
  methods: {
    closeUserDetailsDialog() {
  this.selectedUser = {}; // Reset the selected user data
  this.showUserDetailsDialog = false; // Hide the dialog
},

    confirmDelete(user) {
      // Set the user to delete and show the confirmation dialog
      this.userToDelete = user;
      this.confirmDialog = true;
    },

    editUser(user) {
      // Populate editedUser with the user data
      this.editedUser = { ...user };
      // Show the edit user modal
      this.showEditUserModal = true;
    },
    deleteUser(user) {
      console.log('Deleting user:', user);
    },
    viewUser(user) {
      this.selectedUser = user;
      this.showUserDetailsDialog = true;
    },
    addUser() {
      this.users.push({ ...this.newUser });
      this.newUser = { name: '', email: '', role: '' };
      this.showAddUserDialog = false;
    },
    cancelAddUser() {
      this.newUser = { name: '', email: '', role: '' };
      this.showAddUserDialog = false;
    },
    selectItem(index) {
      this.selectedItem = index;
    },
    async logout() {
      try {
        await axios.post('http://127.0.0.1:8000/api/logout', {}, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        localStorage.removeItem('token');
        this.router.push('/login');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    },
    async fetchUsersData() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/getUser');
        this.users = response.data.users;
        console.log('Users fetched successfully:', this.users);
      } catch (error) {
        console.error('Error fetching users data:', error);
      }
    },

    async fetchRoles() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/getRoles');
        this.roles = response.data.roles.map(role => role.name);
        console.log('Roles fetched successfully:', this.roles);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    },

    async addUser() {
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/users', this.newUser);
        // Assuming the response contains the newly created user data
        const newUser = response.data;
        // Add the new user to the local users array or update the users list
        this.users.push(newUser);
        // Reset the newUser object and close the dialog
        this.newUser = { name: '', email: '', role: '' };
        this.showAddUserDialog = false;
        // Show success alert
        this.showSuccessAlert = true;
        // Hide the success alert after 3 seconds
        setTimeout(() => {
          this.showSuccessAlert = false;
        }, 3000);
        // Optionally, you can show a success message or perform other actions
        console.log('User added successfully:', newUser);
      } catch (error) {
        // Handle error if the request fails
        console.error('Error adding user:', error);
        // Show error alert
        this.showErrorAlert = true;
        // Hide the error alert after 3 seconds
        setTimeout(() => {
          this.showErrorAlert = false;
        }, 3000);
      }
    },
    
  cancelAddUser() {
    // Reset the newUser object and close the dialog
    this.newUser = { name: '', email: '', role: '' };
    this.showAddUserDialog = false;
  },


  

  

  async updateUser() {
  try {
    const userId = this.editedUser.id;
    const response = await axios.put(`http://127.0.0.1:8000/api/users/${userId}`, this.editedUser);
    console.log('User updated successfully:', response.data);
    this.showEditUserModal = false;

    // Show success alert
    this.alert = {
      show: true,
      message: 'User updated successfully',
      type: 'success'
    };

    // Hide the alert after 3 seconds
    setTimeout(() => {
      this.alert.show = false;
    }, 3000);

    // Optionally, emit an event or update the user list
  } catch (error) {
    console.error('Error updating user:', error);

    // Show error alert
    this.alert = {
      show: true,
      message: 'Error updating user',
      type: 'error'
    };

    // Hide the alert after 3 seconds
    setTimeout(() => {
      this.alert.show = false;
    }, 3000);
  }
},

    cancelEditUser() {
      this.showEditUserModal = false;
      // Optionally, reset editedUser object
    },

    async deleteUserConfirmed() {
  try {
    // Perform the delete operation using Axios or your preferred method
    const response = await axios.delete(`http://127.0.0.1:8000/api/users/${this.userToDelete.id}`);
    
    // Optionally, handle the response
    
    // Show success alert
    this.alert = {
      show: true,
      message: 'User deleted successfully',
      type: 'success'
    };

    // Close the confirmation dialog
    this.confirmDialog = false;

    // Hide the alert after 3 seconds
    setTimeout(() => {
      this.alert.show = false;
    }, 3000);

    // You may want to update the user list after deletion
  } catch (error) {
    // Handle errors
    console.error('Error deleting user:', error);

    // Show error alert
    this.alert = {
      show: true,
      message: 'Error deleting user',
      type: 'error'
    };

    // Close the confirmation dialog
    this.confirmDialog = false;

    // Hide the alert after 3 seconds
    setTimeout(() => {
      this.alert.show = false;
    }, 3000);
  }
},

    cancelDelete() {
      this.userToDelete = { name: '', email: '', role: '' };
      this.confirmDialog = false;
    }

    

  
  },
  mounted() {
    this.userName = this.user.name;
    this.userImage = this.user.image;
    this.fetchUsersData();
    this.fetchRoles(); // Call the method to fetch roles
  },

  computed: {
    filteredUsers() {
      // Filter users based on the search input value
      return this.users.filter(user =>
        user.name.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
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
  padding: 20px;
}
.wrap {
  display: flex;
  flex-wrap: wrap;
  margin-top: 120px;
  margin-right: 48px;
}
.left {
  flex: 0 0 15%;
  height: 100%;
}
.content {
  flex: 0 0 80%;
}
.v-list-item--active.active-orange {
background-color: orange !important;
border-radius: 10px;
margin:4px
}
</style>

