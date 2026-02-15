import { createRouter, createWebHistory } from 'vue-router';
import AllPlans from '../views/AllPlans.vue';
import PlanRecords from '../views/PlanRecords.vue';

const routes = [
  {
    path: '/',
    name: 'AllPlans',
    component: AllPlans
  },
  {
    path: '/plan-records',
    name: 'PlanRecords',
    component: PlanRecords
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
