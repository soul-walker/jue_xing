import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Practice from "../views/Practice.vue";
import Records from "../views/Records.vue";
import Profile from "../views/Profile.vue";
// 详情页面路由
import Reports from "../views/Reports.vue";
import GoalDetail from "../views/GoalDetail.vue";
import CreateGoal from "../views/CreateGoal.vue";
import EditGoal from "../views/EditGoal.vue";
import PlanDetail from "../views/PlanDetail.vue";
import RecordDetail from "../views/RecordDetail.vue";
import Settings from "../views/Settings.vue";

const routes = [
  // 主要页面
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/practice",
    name: "Practice",
    component: Practice,
  },
  {
    path: "/records",
    name: "Records",
    component: Records,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
  },
  // 详情页面 - 不在底部导航显示
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
  {
    path: "/goals/:id/edit",
    name: "EditGoal",
    component: EditGoal,
    props: true,
  },
  {
    path: "/plans/:id",
    name: "PlanDetail",
    component: PlanDetail,
    props: true,
  },
  {
    path: "/records/:date",
    name: "RecordDetail",
    component: RecordDetail,
    props: true,
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
