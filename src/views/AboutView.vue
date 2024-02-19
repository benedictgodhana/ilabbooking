<template>
  <div>
    <DashboardHeader />
   </div>
</template>

<script>
import DashboardHeader from '@/components/DashboardHeader.vue';

export default {
  components: {
    DashboardHeader,
  },
  data() {
    return {
      roomAvailability: [
        { name: 'Kifaru', availableTimeSlots: ['10:00 AM - 11:00 AM', '1:00 PM - 2:00 PM'] },
        { name: 'Executive Boardroom', availableTimeSlots: ['9:00 AM - 10:00 AM', '2:00 PM - 3:00 PM'] },
        // Add more rooms and their available time slots as needed
      ]
    };
  },
  methods: {
    selectTimeSlot(roomName, timeSlot) {
      // Handle time slot selection
    }
  }
};
</script>

<style>
.card {
  width: 90%;
  margin: 12px auto;
}
</style>
