import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginPage from '../views/LoginPage.vue';
import UserDashboard from '../views/UserDashboard.vue';
import DashboardView from '../views/admin/Dashboardview.vue';
import ManageRooms from '../views/admin/ManageRooms.vue';
import ManageAmenities from '../views/admin/ManageAmenities.vue';
import ManageUsers from '../views/admin/ManageUsers.vue';
import ManageReservations from '../views/admin/ManageReservations.vue';
import ManageBookings from '../views/admin/ManageBookings.vue';
import AnalyticsReporting from '../views/admin/AnalyticsView.vue';
import SystemLogs from '../views/admin/SystemLogs.vue';
import HelpSupport from '../views/admin/HelpSupport.vue';
import SystemSettings from '../views/admin/SystemSettings.vue';





const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginPage
    },
    {
      path: '/admin/dashboard',
      name: 'AdminDashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/managerooms',
      name: 'Managerooms',
      component: ManageRooms,
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/manageusers',
      name: 'ManageUsers',
      component: ManageUsers,
      meta: { requiresAuth: true }
    }, {
      path: '/admin/manageamenities',
      name: 'Manageamenities',
      component: ManageAmenities,
      meta: { requiresAuth: true }
    }, 
    {
      path: '/admin/managebookings',
      name: 'Managebookings',
      component: ManageBookings,
      meta: { requiresAuth: true }
    }, 
    {
      path: '/admin/managereservations',
      name: 'Managereservations',
      component: ManageReservations,
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/analytics&reporting',
      name: 'Analytics&Reporting',
      component:AnalyticsReporting,
      meta: { requiresAuth: true }
    },

    {
      path: '/admin/systemlogs&audit',
      name: 'SystemLogs',
      component:SystemLogs,
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/system_settings',
      name: 'SystemSettings',
      component:SystemSettings,
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/help&support',
      name: 'HelpSupport',
      component:HelpSupport,
      meta: { requiresAuth: true }
    },
    {
      path: '/user_dashboard',
      name: 'UserDashboard',
      component: UserDashboard,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'profile',
          name: 'UserProfile',
          component: () => import('../views/UserProfile.vue')
        },
        {
          path: 'settings',
          name: 'UserSettings',
          component: () => import('../views/UserSettings.vue')
        },
        {
          path: 'viewbookings',
          name: 'ViewBookings',
          component: () => import('../views/ViewBookings.vue')
        }
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token');
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    // If the route doesn't require authentication or the user is authenticated, proceed
    next();
  }
});

export default router;
