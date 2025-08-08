<template>
  <PageLayout
    title="目标详情"
    :show-back="true"
    :show-action="true"
    action-icon="create"
    @back="goBack"
    @action="editGoal"
  >
    <!-- 目标基本信息 -->
    <AppCard title="目标信息" icon="CalendarOutline" variant="primary">
      <div class="goal-header">
        <div class="goal-title-section">
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
            <n-icon size="16" color="var(--app-text-secondary)">
              <CalendarOutline />
            </n-icon>
            <span
              >{{ formatDate(goal.startDate) }} -
              {{ formatDate(goal.endDate) }}</span
            >
          </div>
          <div class="meta-item">
            <n-icon size="16" color="var(--app-text-secondary)">
              <TimeOutline />
            </n-icon>
            <span>{{ getDaysRemaining(goal.endDate) }}</span>
          </div>
        </div>

        <p class="goal-description">{{ goal.description }}</p>
      </div>
    </AppCard>

    <!-- 进度统计 -->
    <AppCard title="完成进度" icon="TrendingUpOutline" variant="accent">
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
        color="var(--app-color-success)"
        class="progress-bar"
      />
    </AppCard>

    <!-- 连续天数统计 -->
    <AppCard
      title="连续记录"
      icon="FlameOutline"
      icon-color="var(--app-color-warning)"
    >
      <div class="streak-stats">
        <div class="streak-item">
          <n-icon size="24" color="var(--app-color-warning)">
            <FlameOutline />
          </n-icon>
          <div class="streak-info">
            <span class="streak-number">{{ goal.currentStreak }}</span>
            <span class="streak-label">当前连续</span>
          </div>
        </div>
        <div class="streak-item">
          <n-icon size="24" color="var(--app-color-secondary)">
            <TrophyOutline />
          </n-icon>
          <div class="streak-info">
            <span class="streak-number">{{ goal.longestStreak }}</span>
            <span class="streak-label">最长连续</span>
          </div>
        </div>
      </div>
    </AppCard>

    <!-- 日历视图 -->
    <AppCard title="完成日历" icon="CalendarOutline">
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
    </AppCard>

    <!-- 操作按钮 -->
    <AppCard>
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
    </AppCard>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  useMessage,
  useDialog,
  NTag,
  NIcon,
  NProgress,
  NButton,
} from "naive-ui";
import {
  CalendarOutline,
  TimeOutline,
  FlameOutline,
  TrophyOutline,
} from "@vicons/ionicons5";
import PageLayout from "../components/PageLayout.vue";
import AppCard from "../components/AppCard.vue";

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
  // 直接返回到计划页面，因为目标详情主要从计划页进入
  router.push({ name: "Practice" });
};

const editGoal = () => {
  // 跳转到编辑页面
  router.push({ name: "EditGoal", params: { id: goal.value.id } });
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
      router.push({ name: "Practice" });
    },
  });
};
</script>

<style scoped>
/* 目标信息样式 */
.goal-header {
  display: flex;
  flex-direction: column;
  gap: var(--app-spacing-md);
}

.goal-title-section {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--app-spacing-sm);
}

.goal-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--app-text-primary);
  margin: 0;
  flex: 1;
}

.status-tag {
  flex-shrink: 0;
}

.goal-meta {
  display: flex;
  flex-direction: column;
  gap: var(--app-spacing-sm);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: var(--app-spacing-sm);
  font-size: 14px;
  color: var(--app-text-secondary);
}

.goal-description {
  font-size: 14px;
  line-height: 1.6;
  color: var(--app-text-primary);
  margin: 0;
}

/* 进度统计样式 */
.progress-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--app-spacing-md);
}

.stat-item {
  text-align: center;
  flex: 1;
}

.stat-number {
  display: block;
  font-size: 24px;
  font-weight: 600;
  color: var(--app-color-success);
}

.stat-label {
  font-size: 12px;
  color: var(--app-text-secondary);
}

.progress-bar {
  margin-top: var(--app-spacing-sm);
}

/* 连续天数样式 */
.streak-stats {
  display: flex;
  gap: var(--app-spacing-lg);
}

.streak-item {
  display: flex;
  align-items: center;
  gap: var(--app-spacing-sm);
  flex: 1;
}

.streak-info {
  display: flex;
  flex-direction: column;
}

.streak-number {
  font-size: 20px;
  font-weight: 600;
  color: var(--app-text-primary);
}

.streak-label {
  font-size: 12px;
  color: var(--app-text-secondary);
}

/* 日历样式 */
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: var(--app-spacing-md);
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  border-radius: var(--app-radius-button);
  cursor: pointer;
  transition: all 0.2s;
  background-color: #f5f5f5;
  color: var(--app-text-primary);
}

.calendar-day.completed {
  background-color: var(--app-color-success);
  color: var(--app-text-on-primary);
}

.calendar-day.today {
  border: 2px solid var(--app-color-secondary);
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
  gap: var(--app-spacing-md);
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--app-text-secondary);
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background-color: #f5f5f5;
}

.legend-dot.completed {
  background-color: var(--app-color-success);
}

.legend-dot.today {
  border: 2px solid var(--app-color-secondary);
  background-color: white;
}

/* 操作按钮样式 */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: var(--app-spacing-sm);
}

.button-group {
  display: flex;
  gap: var(--app-spacing-sm);
}

.button-group .n-button {
  flex: 1;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .goal-title {
    font-size: 18px;
  }

  .stat-number {
    font-size: 20px;
  }

  .streak-number {
    font-size: 18px;
  }

  .streak-stats {
    gap: var(--app-spacing-md);
  }

  .calendar-legend {
    gap: var(--app-spacing-sm);
  }
}
</style>
