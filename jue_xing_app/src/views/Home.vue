<template>
  <div class="home-container">
    <!-- 顶部欢迎区域 -->
    <div class="welcome-section">
      <n-space vertical size="small">
        <n-text style="font-size: 24px; font-weight: bold; color: white">
          早安，修行者
        </n-text>
        <n-text style="font-size: 14px; color: rgba(255, 255, 255, 0.8)">
          让我们开始今天的觉行之旅
        </n-text>
      </n-space>
    </div>

    <!-- 今日修行计划 -->
    <n-card class="plan-card" :bordered="false">
      <n-space vertical size="medium">
        <n-space justify="space-between" align="center">
          <n-text strong style="font-size: 16px">今日修行计划</n-text>
          <n-icon size="20" color="#18a058">
            <FlameOutline />
          </n-icon>
        </n-space>

        <div v-if="todayPlan.length > 0">
          <n-space vertical size="small">
            <div
              v-for="plan in todayPlan"
              :key="plan.id"
              class="plan-item"
              :class="{ completed: plan.completed }"
              @click="togglePlanCompletion(plan)"
            >
              <n-space justify="space-between" align="center">
                <n-space align="center">
                  <n-icon
                    size="16"
                    :color="plan.completed ? '#18a058' : '#666'"
                  >
                    <CheckmarkCircleOutline v-if="plan.completed" />
                    <EllipseOutline v-else />
                  </n-icon>
                  <n-text :depth="plan.completed ? 3 : 1">{{
                    plan.name
                  }}</n-text>
                </n-space>
                <n-text depth="3" style="font-size: 12px"
                  >{{ plan.duration }}分钟</n-text
                >
              </n-space>
            </div>
          </n-space>
        </div>
        <div v-else style="text-align: center; padding: 20px 0">
          <n-text depth="3">今日暂无修行计划</n-text>
          <br />
          <n-button
            type="primary"
            size="small"
            @click="router.push('/goals')"
            style="margin-top: 8px"
          >
            创建计划
          </n-button>
        </div>
      </n-space>
    </n-card>

    <!-- 修行进度概览 -->
    <n-card class="progress-card" :bordered="false">
      <n-space vertical size="medium">
        <n-text strong style="font-size: 16px">修行进度</n-text>

        <div style="text-align: center">
          <n-progress
            type="circle"
            :percentage="todayProgress"
            :width="80"
            :stroke-width="8"
            status="success"
          >
            {{ todayProgress }}%
          </n-progress>
        </div>

        <n-grid cols="3" :x-gap="12">
          <n-grid-item>
            <n-statistic label="连续天数" :value="weeklyStreak">
              <template #suffix>天</template>
            </n-statistic>
          </n-grid-item>
          <n-grid-item>
            <n-statistic label="总时长" :value="totalHours">
              <template #suffix>小时</template>
            </n-statistic>
          </n-grid-item>
          <n-grid-item>
            <n-statistic label="完成目标" :value="completedGoals">
              <template #suffix>个</template>
            </n-statistic>
          </n-grid-item>
        </n-grid>
      </n-space>
    </n-card>

    <!-- 快速修行 -->
    <div class="quick-practice">
      <n-text
        strong
        style="
          font-size: 16px;
          margin-bottom: 12px;
          display: block;
          color: white;
        "
      >
        快速修行
      </n-text>

      <n-space vertical size="small">
        <n-card
          v-for="practice in quickPractices"
          :key="practice.id"
          class="practice-card"
          :bordered="false"
          hoverable
          @click="startPractice(practice)"
        >
          <n-space align="center">
            <div
              class="practice-icon"
              :style="{ backgroundColor: practice.color + '20' }"
            >
              <n-icon size="small" :color="practice.color">
                <component :is="practice.icon" />
              </n-icon>
            </div>
            <n-space vertical size="small" style="flex: 1">
              <n-text strong>{{ practice.name }}</n-text>
              <n-text depth="3" style="font-size: 12px">{{
                practice.description
              }}</n-text>
            </n-space>
            <n-text depth="3" style="font-size: 12px"
              >{{ practice.duration }}分钟</n-text
            >
          </n-space>
        </n-card>
      </n-space>
    </div>

    <!-- 修行提醒 -->
    <n-card class="reminder-card" :bordered="false" v-if="nextReminder">
      <n-space align="center">
        <n-icon size="small" color="#f0a020">
          <NotificationsOutline />
        </n-icon>
        <n-space vertical size="small" style="flex: 1">
          <n-text strong style="font-size: 14px">下次提醒</n-text>
          <n-text depth="3" style="font-size: 12px">{{ nextReminder }}</n-text>
        </n-space>
      </n-space>
    </n-card>

    <!-- 今日名言 -->
    <n-card class="quote-card" :bordered="false">
      <n-space vertical size="small">
        <n-icon size="16" color="#f0a020">
          <TimeOutline />
        </n-icon>
        <n-text style="font-style: italic; font-size: 14px; line-height: 1.6">
          "身安不如心安，屋宽不如心宽。"
        </n-text>
        <n-text depth="3" style="font-size: 12px; text-align: right">
          — 星云大师
        </n-text>
      </n-space>
    </n-card>

    <!-- 修行计时器模态框 -->
    <n-modal v-model:show="showPracticeModal">
      <n-card
        style="width: 90%; max-width: 400px"
        :title="selectedPractice?.name"
        :bordered="false"
        closable
        @close="closePracticeModal"
      >
        <n-space vertical size="large" align="center">
          <!-- 计时器 -->
          <div style="text-align: center">
            <n-text style="font-size: 48px; font-weight: bold">
              {{ formatTime(currentTime) }}
            </n-text>
            <br />
            <n-text depth="3">{{ selectedPractice?.description }}</n-text>
          </div>

          <!-- 控制按钮 -->
          <n-space size="large">
            <n-button
              v-if="!isRunning"
              type="primary"
              size="large"
              @click="startTimer"
            >
              开始
            </n-button>
            <n-button
              v-if="isRunning"
              type="warning"
              size="large"
              @click="pauseTimer"
            >
              暂停
            </n-button>
            <n-button size="large" @click="resetTimer">重置</n-button>
          </n-space>

          <!-- 进度条 -->
          <div style="width: 100%">
            <n-progress :percentage="timerProgress" />
          </div>
        </n-space>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import {
  NCard,
  NSpace,
  NText,
  NIcon,
  NGrid,
  NGridItem,
  NStatistic,
  NProgress,
  NButton,
  NModal,
  useMessage,
} from "naive-ui";
import {
  FlameOutline,
  TimeOutline,
  CheckmarkCircleOutline,
  EllipseOutline,
  LeafOutline,
  FitnessOutline,
  BookOutline,
  HeartOutline,
  NotificationsOutline,
} from "@vicons/ionicons5";

interface PlanItem {
  id: number;
  name: string;
  duration: number;
  completed: boolean;
}

interface PracticeType {
  id: number;
  name: string;
  description: string;
  duration: number;
  color: string;
  icon: any;
}

const router = useRouter();
const message = useMessage();

// 基础数据
const todayProgress = ref(65);
const weeklyStreak = ref(5);
const totalHours = ref(48.5);
const completedGoals = ref(12);

// 今日修行计划
const todayPlan = ref<PlanItem[]>([
  { id: 1, name: "晨起冥想", duration: 10, completed: true },
  { id: 2, name: "午间感恩", duration: 5, completed: false },
  { id: 3, name: "晚间反思", duration: 15, completed: false },
]);

// 快速修行类型
const quickPractices = ref<PracticeType[]>([
  {
    id: 1,
    name: "正念冥想",
    description: "专注呼吸，放松身心",
    duration: 10,
    color: "#18a058",
    icon: LeafOutline,
  },
  {
    id: 2,
    name: "运动修行",
    description: "通过运动锻炼身体",
    duration: 20,
    color: "#2080f0",
    icon: FitnessOutline,
  },
  {
    id: 3,
    name: "感恩练习",
    description: "记录三件感恩的事",
    duration: 5,
    color: "#f0a020",
    icon: HeartOutline,
  },
  {
    id: 4,
    name: "阅读冥想",
    description: "阅读启发性文章",
    duration: 15,
    color: "#722ed1",
    icon: BookOutline,
  },
]);

// 下次提醒
const nextReminder = ref("18:00 - 晚间反思");

// 修行计时器相关
const showPracticeModal = ref(false);
const selectedPractice = ref<PracticeType | null>(null);
const currentTime = ref(0);
const targetTime = ref(0);
const isRunning = ref(false);
const timer = ref<number | null>(null);

// 计算进度百分比
const timerProgress = computed(() => {
  if (targetTime.value === 0) return 0;
  return Math.min(100, (currentTime.value / targetTime.value) * 100);
});

// 切换计划完成状态
const togglePlanCompletion = (plan: PlanItem) => {
  plan.completed = !plan.completed;
  if (plan.completed) {
    message.success(`完成了 ${plan.name}！`);
  }
  updateTodayProgress();
};

// 更新今日进度
const updateTodayProgress = () => {
  const completed = todayPlan.value.filter((p) => p.completed).length;
  const total = todayPlan.value.length;
  todayProgress.value = total > 0 ? Math.round((completed / total) * 100) : 0;
};

// 开始修行
const startPractice = (practice: PracticeType) => {
  selectedPractice.value = practice;
  targetTime.value = practice.duration * 60; // 转换为秒
  currentTime.value = 0;
  showPracticeModal.value = true;
};

// 关闭修行模态框
const closePracticeModal = () => {
  showPracticeModal.value = false;
  resetTimer();
};

// 格式化时间显示
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

// 开始计时器
const startTimer = () => {
  if (isRunning.value) return;

  isRunning.value = true;
  timer.value = setInterval(() => {
    currentTime.value++;
    if (currentTime.value >= targetTime.value) {
      pauseTimer();
      message.success(`完成了 ${selectedPractice.value?.name}！`);
    }
  }, 1000);
};

// 暂停计时器
const pauseTimer = () => {
  isRunning.value = false;
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
};

// 重置计时器
const resetTimer = () => {
  pauseTimer();
  currentTime.value = 0;
};

// 清理定时器
onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value);
  }
});

// 初始化今日进度
updateTodayProgress();
</script>

<style scoped>
.home-container {
  padding: 16px;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.welcome-section {
  padding: 20px 0;
  text-align: center;
  color: white;
}

.plan-card,
.progress-card {
  margin: 16px 0;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.plan-item {
  padding: 12px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.02);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.plan-item:hover {
  background: rgba(0, 0, 0, 0.05);
}

.plan-item.completed {
  background: rgba(24, 160, 88, 0.1);
}

.quick-practice {
  margin: 24px 0;
}

.practice-card {
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.practice-card:hover {
  transform: translateY(-2px);
}

.practice-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reminder-card {
  margin: 16px 0;
  border-radius: 8px;
  background: rgba(240, 160, 32, 0.1);
  border-left: 4px solid #f0a020;
}

.quote-card {
  margin-top: 24px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}
</style>
