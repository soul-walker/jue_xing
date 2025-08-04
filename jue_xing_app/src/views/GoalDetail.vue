<template>
  <div class="goal-detail">
    <!-- 顶部导航栏 -->
    <n-card :bordered="false" class="header-card">
      <div class="header-content">
        <n-button text @click="goBack" class="back-button">
          <template #icon>
            <n-icon size="20">
              <ArrowBack />
            </n-icon>
          </template>
        </n-button>
        <span class="page-title">目标详情</span>
        <n-button text @click="editGoal" class="edit-button">
          <template #icon>
            <n-icon size="20">
              <CreateOutline />
            </n-icon>
          </template>
        </n-button>
      </div>
    </n-card>

    <div class="detail-content">
      <!-- 目标基本信息 -->
      <n-card class="goal-info-card" :bordered="false">
        <div class="goal-header">
          <h2 class="goal-title">{{ goal.title }}</h2>
          <n-tag
            :type="getStatusType(goal.status)"
            :bordered="false"
            class="status-tag"
          >
            {{ getStatusText(goal.status) }}
          </n-tag>
        </div>

        <div class="goal-meta">
          <div class="meta-item">
            <n-icon size="16" color="#666">
              <CalendarOutline />
            </n-icon>
            <span
              >{{ formatDate(goal.startDate) }} -
              {{ formatDate(goal.endDate) }}</span
            >
          </div>
          <div class="meta-item">
            <n-icon size="16" color="#666">
              <TimeOutline />
            </n-icon>
            <span>{{ getDaysRemaining(goal.endDate) }}</span>
          </div>
        </div>

        <p class="goal-description">{{ goal.description }}</p>
      </n-card>

      <!-- 进度统计 -->
      <n-card class="progress-card" :bordered="false">
        <h3 class="card-title">完成进度</h3>

        <div class="progress-stats">
          <div class="stat-item">
            <span class="stat-number">{{ goal.completedDays }}</span>
            <span class="stat-label">已完成天数</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ goal.totalDays }}</span>
            <span class="stat-label">总天数</span>
          </div>
          <div class="stat-item">
            <span class="stat-number"
              >{{
                Math.round((goal.completedDays / goal.totalDays) * 100)
              }}%</span
            >
            <span class="stat-label">完成率</span>
          </div>
        </div>

        <n-progress
          type="line"
          :percentage="Math.round((goal.completedDays / goal.totalDays) * 100)"
          :show-indicator="false"
          :height="8"
          :border-radius="4"
          color="#18a058"
          class="progress-bar"
        />
      </n-card>

      <!-- 连续天数统计 -->
      <n-card class="streak-card" :bordered="false">
        <h3 class="card-title">连续记录</h3>

        <div class="streak-stats">
          <div class="streak-item">
            <n-icon size="24" color="#f0a020">
              <FlameOutline />
            </n-icon>
            <div class="streak-info">
              <span class="streak-number">{{ goal.currentStreak }}</span>
              <span class="streak-label">当前连续</span>
            </div>
          </div>
          <div class="streak-item">
            <n-icon size="24" color="#2080f0">
              <TrophyOutline />
            </n-icon>
            <div class="streak-info">
              <span class="streak-number">{{ goal.longestStreak }}</span>
              <span class="streak-label">最长连续</span>
            </div>
          </div>
        </div>
      </n-card>

      <!-- 日历视图 -->
      <n-card class="calendar-card" :bordered="false">
        <h3 class="card-title">完成日历</h3>

        <div class="calendar-grid">
          <div
            v-for="date in calendarDates"
            :key="date.date"
            class="calendar-day"
            :class="{
              completed: date.completed,
              today: date.isToday,
              future: date.isFuture,
              'other-month': date.isOtherMonth,
            }"
            @click="toggleDate(date)"
          >
            {{ date.day }}
          </div>
        </div>

        <div class="calendar-legend">
          <div class="legend-item">
            <div class="legend-dot completed"></div>
            <span>已完成</span>
          </div>
          <div class="legend-item">
            <div class="legend-dot today"></div>
            <span>今天</span>
          </div>
          <div class="legend-item">
            <div class="legend-dot"></div>
            <span>未完成</span>
          </div>
        </div>
      </n-card>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <n-button
          type="primary"
          size="large"
          :disabled="goal.status === 'completed'"
          @click="markTodayComplete"
          block
        >
          标记今日完成
        </n-button>

        <div class="button-group">
          <n-button
            type="warning"
            size="large"
            @click="pauseGoal"
            :disabled="goal.status === 'completed'"
          >
            {{ goal.status === "paused" ? "恢复目标" : "暂停目标" }}
          </n-button>
          <n-button type="error" size="large" @click="deleteGoal">
            删除目标
          </n-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useMessage, useDialog } from "naive-ui";
import {
  ArrowBack,
  CreateOutline,
  CalendarOutline,
  TimeOutline,
  FlameOutline,
  TrophyOutline,
} from "@vicons/ionicons5";

interface Goal {
  id: string;
  title: string;
  description: string;
  status: "active" | "paused" | "completed";
  startDate: string;
  endDate: string;
  completedDays: number;
  totalDays: number;
  currentStreak: number;
  longestStreak: number;
  completedDates: string[];
}

interface CalendarDate {
  date: string;
  day: number;
  completed: boolean;
  isToday: boolean;
  isFuture: boolean;
  isOtherMonth: boolean;
}

const router = useRouter();
const route = useRoute();
const message = useMessage();
const dialog = useDialog();

const goal = ref<Goal>({
  id: "",
  title: "",
  description: "",
  status: "active",
  startDate: "",
  endDate: "",
  completedDays: 0,
  totalDays: 0,
  currentStreak: 0,
  longestStreak: 0,
  completedDates: [],
});

// 日历数据
const calendarDates = ref<CalendarDate[]>([]);

onMounted(() => {
  loadGoalDetail();
  generateCalendar();
});

// 加载目标详情
const loadGoalDetail = () => {
  const goalId = route.params.id as string;
  // 模拟数据加载
  goal.value = {
    id: goalId,
    title: "每日冥想练习",
    description:
      "建立稳定的冥想习惯，每天至少进行10分钟的正念冥想练习，提升专注力和内心平静。",
    status: "active",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    completedDays: 45,
    totalDays: 90,
    currentStreak: 7,
    longestStreak: 15,
    completedDates: [
      "2024-01-01",
      "2024-01-02",
      "2024-01-03",
      // ... 更多日期
    ],
  };
};

// 生成日历
const generateCalendar = () => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // 获取当月第一天
  const firstDay = new Date(currentYear, currentMonth, 1);

  // 获取第一周的起始日期（包含上月日期）
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  const dates: CalendarDate[] = [];
  const current = new Date(startDate);

  // 生成6周的日期
  for (let week = 0; week < 6; week++) {
    for (let day = 0; day < 7; day++) {
      const dateStr = current.toISOString().split("T")[0];
      const isToday = dateStr === today.toISOString().split("T")[0];
      const isOtherMonth = current.getMonth() !== currentMonth;
      const isFuture = current > today;
      const completed = goal.value.completedDates.includes(dateStr);

      dates.push({
        date: dateStr,
        day: current.getDate(),
        completed,
        isToday,
        isFuture,
        isOtherMonth,
      });

      current.setDate(current.getDate() + 1);
    }
  }

  calendarDates.value = dates;
};

// 状态相关方法
const getStatusType = (status: string) => {
  switch (status) {
    case "active":
      return "success";
    case "paused":
      return "warning";
    case "completed":
      return "info";
    default:
      return "default";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "active":
      return "进行中";
    case "paused":
      return "已暂停";
    case "completed":
      return "已完成";
    default:
      return "未知";
  }
};

// 日期格式化
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};

// 计算剩余天数
const getDaysRemaining = (endDate: string) => {
  const end = new Date(endDate);
  const today = new Date();
  const diffTime = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 0) {
    return `还剩 ${diffDays} 天`;
  } else if (diffDays === 0) {
    return "今天是最后一天";
  } else {
    return "已结束";
  }
};

// 操作方法
const goBack = () => {
  router.back();
};

const editGoal = () => {
  // 跳转到编辑页面
  router.push(`/goals/${goal.value.id}/edit`);
};

const toggleDate = (date: CalendarDate) => {
  if (date.isFuture || date.isOtherMonth) return;

  const index = calendarDates.value.findIndex((d) => d.date === date.date);
  if (index !== -1) {
    calendarDates.value[index].completed =
      !calendarDates.value[index].completed;

    // 更新目标数据
    if (calendarDates.value[index].completed) {
      if (!goal.value.completedDates.includes(date.date)) {
        goal.value.completedDates.push(date.date);
        goal.value.completedDays++;
      }
    } else {
      const dateIndex = goal.value.completedDates.indexOf(date.date);
      if (dateIndex !== -1) {
        goal.value.completedDates.splice(dateIndex, 1);
        goal.value.completedDays--;
      }
    }

    message.success(
      calendarDates.value[index].completed ? "标记完成" : "取消标记"
    );
  }
};

const markTodayComplete = () => {
  const today = new Date().toISOString().split("T")[0];
  const todayDate = calendarDates.value.find((d) => d.date === today);

  if (todayDate && !todayDate.completed) {
    toggleDate(todayDate);
  } else {
    message.info("今天已经标记完成了");
  }
};

const pauseGoal = () => {
  const action = goal.value.status === "paused" ? "恢复" : "暂停";

  dialog.warning({
    title: `${action}目标`,
    content: `确定要${action}这个目标吗？`,
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: () => {
      goal.value.status = goal.value.status === "paused" ? "active" : "paused";
      message.success(`目标已${action}`);
    },
  });
};

const deleteGoal = () => {
  dialog.error({
    title: "删除目标",
    content: "确定要删除这个目标吗？此操作不可撤销。",
    positiveText: "删除",
    negativeText: "取消",
    onPositiveClick: () => {
      message.success("目标已删除");
      router.push("/goals");
    },
  });
};
</script>

<style scoped>
.goal-detail {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.header-card {
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.back-button,
.edit-button {
  padding: 8px;
}

.detail-content {
  padding: 16px;
  padding-bottom: 100px;
}

/* 目标信息卡片 */
.goal-info-card {
  margin-bottom: 16px;
}

.goal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
}

.goal-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
  flex: 1;
  margin-right: 12px;
}

.status-tag {
  flex-shrink: 0;
}

.goal-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.goal-description {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  margin: 0;
}

/* 进度卡片 */
.progress-card,
.streak-card,
.calendar-card {
  margin-bottom: 16px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
}

.progress-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.stat-item {
  text-align: center;
  flex: 1;
}

.stat-number {
  display: block;
  font-size: 24px;
  font-weight: 600;
  color: #18a058;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

.progress-bar {
  margin-top: 8px;
}

/* 连续天数卡片 */
.streak-stats {
  display: flex;
  gap: 24px;
}

.streak-item {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.streak-info {
  display: flex;
  flex-direction: column;
}

.streak-number {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.streak-label {
  font-size: 12px;
  color: #666;
}

/* 日历视图 */
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 16px;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: #f5f5f5;
  color: #333;
}

.calendar-day.completed {
  background-color: #18a058;
  color: white;
}

.calendar-day.today {
  border: 2px solid #2080f0;
  font-weight: 600;
}

.calendar-day.future {
  opacity: 0.3;
  cursor: not-allowed;
}

.calendar-day.other-month {
  opacity: 0.3;
  cursor: not-allowed;
}

.calendar-day:not(.future):not(.other-month):hover {
  transform: scale(1.1);
}

.calendar-legend {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #666;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background-color: #f5f5f5;
}

.legend-dot.completed {
  background-color: #18a058;
}

.legend-dot.today {
  border: 2px solid #2080f0;
  background-color: white;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
}

.button-group {
  display: flex;
  gap: 12px;
}

.button-group .n-button {
  flex: 1;
}
</style>
