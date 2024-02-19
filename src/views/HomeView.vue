<template>
  <div>
    <DashboardHeader />
    <v-stepper
      editable
      hide-actions
      :items="['Calendar', 'Select Room', 'Complete Booking']"
      style="margin:10px"
      v-model="currentStep"
    >
      <!-- Calendar -->
      <template v-slot:item.1>
        <div style="height: 100%; width: 100%;">
          <v-sheet tile height="100%" class="d-flex">
            <v-select
              v-model="type"
              :items="types"
              dense
              variant="outlined"
              hide-details
              class="ma-2"
              label="View Mode"
            ></v-select>
            <v-select
              v-model="weekday"
              :items="weekdays"
              dense
              variant="outlined"
              hide-details
              label="Weekdays"
              class="ma-2"
            ></v-select>
          </v-sheet>
          <v-sheet style="height: calc(100% - 54px);">
            <v-calendar
              ref="calendar"
              v-model="value"
              :weekdays="weekday"
              :view-mode="type"
              :events="events"
              event-overlap-mode="stack"
              :event-overlap-threshold="30"
              style="height: 100%;" 
            >
             
            </v-calendar>
          </v-sheet>
        </div>
      </template>

      <!-- Room Availability -->
      <template v-slot:item.2>
        <v-card  flat elevation="4" >
          <v-row>
            <v-col v-for="(room, index) in roomAvailability" :key="index" cols="12" md="4">
              <v-card class="mx-auto" outlined style="background: darkblue; color: white" @click="selectRoom(room)">
                <v-card-title>{{ room.name }}</v-card-title>
                <v-card-actions>
                  <v-btn
                    v-for="(slot, slotIndex) in room.availableTimeSlots"
                    :key="slotIndex"
                    outlined
                    color="orange"
                    class="ma-2"
                    style="color: white;"
                  >
                    {{ slot }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </template>

      <template v-slot:item.3>
  <v-card flat>
    <!-- Form for completing booking -->
    <v-form v-model="valid">
  <v-container>
    <v-row>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="booking.startDate"
          label="Booking Start Date"
          required
          hide-details
          dense
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="4">
        <v-text-field
          v-model="booking.endDate"
          label="Booking End Date"
          required
          hide-details
          dense
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="4">
        <v-text-field
          v-model="booking.startTime"
          label="Booking Start Time"
          required
          hide-details
          dense
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="4">
        <v-text-field
          v-model="booking.endTime"
          label="Booking End Time"
          required
          hide-details
          dense
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="4">
        <v-text-field
          v-model="booking.capacity"
          label="Capacity"
          required
          type="number"
          hide-details
          dense
        ></v-text-field>
      </v-col>
    </v-row>
  </v-container>
</v-form>

  </v-card>
</template>

      

    </v-stepper>
  </div>
</template>

<script>
import DashboardHeader from '@/components/DashboardHeader.vue';
import { useDate } from 'vuetify'

export default {
  components: {
    DashboardHeader,
  },
  data() {
    return {
      currentStep: 0,
      currentStep: 0,
      // Other data properties as before
      selectedRoom: null,
      isSlotAlreadyBooked: false,
      booking: {
        // Initialize booking object with form fields
        name: '',
        email: '',
        date: '',
        time: '',
        // Add other form fields as needed
      },
      type: 'month',
      types: ['month', 'week', 'day'],
      weekday: [0, 1, 2, 3, 4, 5, 6],
      weekdays: [
        { title: 'Sun - Sat', value: [0, 1, 2, 3, 4, 5, 6] },
        { title: 'Mon - Sun', value: [1, 2, 3, 4, 5, 6, 0] },
        { title: 'Mon - Fri', value: [1, 2, 3, 4, 5] },
        { title: 'Mon, Wed, Fri', value: [1, 3, 5] },
      ],
      value: [new Date()],
      events: [],
      roomAvailability: [
        { name: 'Kifaru', availableTimeSlots: ['10:00 AM - 11:00 AM', '1:00 PM - 2:00 PM'] },
        { name: 'Safaricom', availableTimeSlots: ['9:00 AM - 10:00 AM', '2:00 PM - 3:00 PM'] },
        { name: 'Ericson', availableTimeSlots: ['11:00 AM - 12:00 PM', '3:00 PM - 4:00 PM'] },
        { name: 'Oracle', availableTimeSlots: ['1:00 PM - 2:00 PM', '4:00 PM - 5:00 PM'] },
        { name: 'Samsung', availableTimeSlots: ['10:00 AM - 11:00 AM', '3:00 PM - 4:00 PM'] },
        { name: 'Boardroom', availableTimeSlots: ['9:00 AM - 10:00 AM', '2:00 PM - 3:00 PM'] },
        { name: 'Shark Tank', availableTimeSlots: ['11:00 AM - 12:00 PM', '4:00 PM - 5:00 PM'] },
        { name: 'Small Meeting Room', availableTimeSlots: ['10:00 AM - 11:00 AM', '1:00 PM - 2:00 PM'] },
        // Add more rooms and their available time slots as needed
      ]
      
    };
  },
  mounted () {
    const adapter = useDate()
    this.getEvents({ start: adapter.startOfDay(adapter.startOfMonth(new Date())), end: adapter.endOfDay(adapter.endOfMonth(new Date())) })
  },

  methods: {
    getEvents ({ start, end }) {
      const events = []

      for (const room of this.roomAvailability) {
        for (const slot of room.availableTimeSlots) {
          const [startTimeStr, endTimeStr] = slot.split(' - ')
          const startTime = new Date(`2000-01-01T${startTimeStr}`)
          const endTime = new Date(`2000-01-01T${endTimeStr}`)

          events.push({
            title: room.name,
            room: room.name,
            start: startTime,
            end: endTime,
            color: 'blue',
          })
        }
      }

      this.events = events
    },
    formatEventTime(time) {
      return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },

    selectRoom(room) {
      // Set selected room
      this.selectedRoom = room;
      // Move to step three
      this.currentStep = 2;
    },

    submitBookingForm() {
      // Check if the slot for the selected room is already booked
      if (this.isSlotAlreadyBooked) {
        // If already booked, display alert and return
        return;
      }
      // Logic to submit booking form
      // Example: validate form fields, send data to server, etc.
      // After successful submission, you can move to the next step
      // Example: this.currentStep = 3;
    },
    bookRoom(room) {
      // Logic to book the room
      this.currentStep = 2; // Move to step 3 for booking details
    },
  },
};
</script>

<style>
.card {
  width: 90%;
  margin: 12px auto;
}
.event-title {
  font-weight: bold;
}
.event-room {
  font-style: italic;
}
.event-time {
  font-style: italic;
}
</style>
