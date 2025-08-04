import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Goals from "../views/Goals.vue";
import Records from "../views/Records.vue";
import Achievements from "../views/Achievements.vue";
// 新页面路由
import Reports from "../views/Reports.vue";
import GoalDetail from "../views/GoalDetail.vue";
import CreateGoal from "../views/CreateGoal.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/goals",
    name: "Goals",
    component: Goals,
  },
  {
    path: "/records",
    name: "Records",
    component: Records,
  },
  {
    path: "/achievements",
    name: "Achievements",
    component: Achievements,
  },
  // 新页面路由 - 不在底部导航显示
  {
    path: "/reports",
    name: "Reports",
    component: Reports,
  },
  {
    path: "/goals/create",
    name: "CreateGoal",
    component: CreateGoal,
  },
  {
    path: "/goals/:id",
    name: "GoalDetail",
    component: GoalDetail,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
