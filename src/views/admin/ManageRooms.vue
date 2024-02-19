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


<!-- Dialog for Adding a Room -->
<v-dialog v-model="showAddRoomDialog" max-width="500px" style="margin-top: -30px;">
  <v-card>
    <v-card-title>Add New Room</v-card-title>
    <v-card-text>
      <v-text-field v-model="newRoom.name" label="Room Name"></v-text-field>
      <v-text-field v-model="newRoom.capacity" label="Capacity"></v-text-field>
    </v-card-text>
    <v-card-actions>
  <v-chip color="green" @click="addRoom" style="border-radius:2px;margin: 8px;" elevation="2">
    <v-icon left>mdi-plus</v-icon> Add
  </v-chip>
  <v-chip @click="cancelAddRoom" style="border-radius:2px;" elevation="2" color="red">
    <v-icon left>mdi-close</v-icon> Cancel
  </v-chip>
</v-card-actions>

  </v-card>
</v-dialog>

<v-card elevation="4">
  <v-chip color="pink" @click="showAddRoomDialog = true" style="margin-left: 20px; margin: 8px;border-radius: 2px;" elevation="1">
  <v-icon left>mdi-plus</v-icon>
  Add Room
</v-chip>
    <v-data-table
  :headers="headers"
  :items="rooms"
  :items-per-page="5"
  class="elevation-4"
>

  <template v-slot:item.name="{ item }">
    {{ item.name }}
  </template>

  <template v-slot:item.capacity="{ item }">
    {{ item.capacity }}
  </template>

  <template v-slot:item.actions="{ item }">
  <v-chip color="green" small class="mr-2" @click="viewRoom(item)">
    <v-icon>mdi-eye</v-icon>
  </v-chip>
  <v-chip color="orange" small class="mr-2" @click="editRoom(item)">
    <v-icon>mdi-pencil</v-icon>
  </v-chip>
  <v-chip color="red" small @click="deleteRoom(item)">
    <v-icon>mdi-delete</v-icon>
  </v-chip>

  <v-dialog v-model="showRoomDetailsDialog" max-width="800px">
    <v-card>
      <v-card-title>Room Details</v-card-title>
      <v-card-text>
        <div>Name: {{ selectedRoom.name }}</div>
        <div>Capacity: {{ selectedRoom.capacity }}</div>
        <div>Description: {{ selectedRoom.description }}</div>

        <!-- Add more details here as needed -->
      </v-card-text>
      <v-card-actions>
        <v-chip style="border-radius: 2px;" elevation="3" color="primary" @click="showRoomDetailsDialog = false">  <v-icon left>mdi-close</v-icon>Close</v-chip>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


</v-data-table>
</v-card>
<!-- Data Table -->

    </v-main>
    </v-layout>
  </template>        
  
  <script>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

  // Register Chart.js components
  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

  // Define reactive data
  export default {
    data() {
      return {
        headers: [
          { title: 'Room Name', value: 'name' },
          { title: 'Capacity', value: 'capacity' },
          { title: 'Description', value: 'description' }, // Corrected 'Description' to 'description'
          { title: 'Actions', value: 'actions', sortable: false },
        ],
        showRoomDetailsDialog: false,
        selectedRoom: {},
        rooms: [],
        newRoom: { name: '', capacity: '' },
        showAddRoomDialog: false,
        chartData: {
          labels: ['Kifaru', 'Safaricom', 'Oracle', 'Shark Tank', 'Executive Boardroom', 'Ericson', 'Samsung', 'Small Meeting Room'],
          datasets: [
            {
              label: 'Number of Bookings',
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',  
                'rgba(54, 12, 235, 0.2)',   
                'rgba(255, 206, 86, 0.2)',   
                'rgba(75, 192, 192, 0.2)',   
                'rgba(153, 32, 55, 0.2)',  
                'rgba(255, 159, 64, 0.2)',   
                'rgba(255, 25, 86, 0.2)',   
                'rgba(44, 172, 25, 0.2)'    
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',  
                'rgba(54, 162, 235, 1)',   
                'rgba(255, 206, 86, 1)',   
                'rgba(75, 192, 192, 1)',   
                'rgba(153, 102, 255, 1)',  
                'rgba(255, 159, 64, 1)',   
                'rgba(255, 205, 86, 1)',   
                'rgba(54, 162, 235, 1)'    
              ],
              borderWidth: 1,
              data: [20, 15, 30, 25, 10, 18, 22, 12] // Example booking data for each room
            }
          ]
        },
        chartOptions: { responsive: true },
        drawer: true,
        notificationCount: 10,
        user: JSON.parse(localStorage.getItem('user')),
        userName: '',
        userImage: '',
        totalUsers: 100,
        totalBookings: 250,
        totalRooms: 50,
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
      editRoom(room) {
        console.log('Editing room:', room);
      },
      deleteRoom(room) {
        console.log('Deleting room:', room);
      },
      viewRoom(room) {
        console.log('Viewing room:', room);
      },
      addRoom() {
        this.rooms.push({ ...this.newRoom });
        this.newRoom = { name: '', capacity: '' };
        this.showAddRoomDialog = false;
      },
      cancelAddRoom() {
        this.newRoom = { name: '', capacity: '' };
        this.showAddRoomDialog = false;
      },
      selectItem(index) {
        this.selectedItem = index;
      },

      viewRoom(room) {
      // Set the selected room data and show the dialog
      this.selectedRoom = room;
      this.showRoomDetailsDialog = true;
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
      async fetchRoomsData() {
        try {
          const response = await axios.get('http://127.0.0.1:8000/api/getRooms');
          this.rooms = response.data.rooms;
          console.log('Rooms fetched successfully:', this.rooms);
        } catch (error) {
          console.error('Error fetching rooms data:', error);
        }
      },
    },
    mounted() {
      this.userName = this.user.name;
      this.userImage = this.user.image;
      this.fetchRoomsData();
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
  