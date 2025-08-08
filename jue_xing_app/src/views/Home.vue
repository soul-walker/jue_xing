<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  NCard,
  NButton,
  NIcon,
  NText,
  NSpace,
  NProgress,
  NGrid,
  NGridItem,
  NStatistic,
  NList,
  NListItem,
  NThing,
  NTag,
  NTime,
} from "naive-ui";
import {
  TimeOutline,
  FlameOutline,
  CheckmarkCircleOutline,
  PlayCircleOutline,
  TrendingUpOutline,
  CalendarOutline,
  AddOutline,
  BookOutline,
} from "@vicons/ionicons5";
import type { Plan } from "../types";

const router = useRouter();

// 今日计划数据
const todayPlans = ref<Plan[]>([
  {
    id: "1-1",
    goalId: "1",
    title: "每日深蹲",
    description: "每天完成深蹲运动，增强腿部力量",
    dailyTarget: "深蹲100个",
    unit: "个",
    targetAmount: 100,
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date(),
    isActive: true,
    records: [
      {
        id: "r1",
        planId: "1-1",
        date: new Date(),
        amount: 100,
        completed: true,
        reflection: "今天完成了深蹲训练",
        mood: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
  {
    id: "1-2",
    goalId: "1",
    title: "晨间冥想",
    description: "每天早晨进行冥想练习，平静心灵",
    dailyTarget: "冥想20分钟",
    unit: "分钟",
    targetAmount: 20,
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date(),
    isActive: true,
    records: [
      {
        id: "r2",
        planId: "1-2",
        date: new Date(),
        amount: 20,
        completed: true,
        reflection: "冥想很放松",
        mood: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "r3",
        planId: "1-2",
        date: new Date(),
        amount: 15,
        completed: true,
        reflection: "晚上又冥想了15分钟",
        mood: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
  {
    id: "2-1",
    goalId: "2",
    title: "阅读《刀锋》",
    description: "每天阅读《刀锋》50页",
    dailyTarget: "阅读50页",
    unit: "页",
    targetAmount: 50,
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date(),
    isActive: true,
    records: [],
  },
]);

// 每日名言
const dailyQuotes = ref([
  {
    text: "为学日益，为道日损，损之又损，以至于无为。无为而无不为。",
    source: "道德经",
  },
  {
    text: "行者常至，为者常成。",
    source: "晏子春秋",
  },
  {
    text: "不积跬步，无以至千里；不积小流，无以成江海。",
    source: "荀子",
  },
  {
    text: "千里之行，始于足下。",
    source: "道德经",
  },
  {
    text: "博观而约取，厚积而薄发。",
    source: "苏轼",
  },
]);

// 今日名言（随机选择）
const todayQuote = computed(() => {
  const today = new Date();
  const index = today.getDate() % dailyQuotes.value.length;
  return dailyQuotes.value[index];
});

// 时间问候语
const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 6) return "夜深了，修行者";
  if (hour < 12) return "早安，修行者";
  if (hour < 18) return "午好，修行者";
  return "晚上好，修行者";
});

// 今日进度统计 - 基于记录数量计算
const todayProgress = computed(() => {
  const totalPlans = todayPlans.value.length;
  const recordedPlans = todayPlans.value.filter(
    (p) => p.records && p.records.length > 0
  ).length;
  return totalPlans > 0 ? Math.round((recordedPlans / totalPlans) * 100) : 0;
});

// 连续天数（模拟数据）
const streakDays = ref(15);

// 本月统计（模拟数据）
const monthStats = ref({
  practicesDays: 22,
  totalGoals: 8,
  completionRate: 78,
});

// 获取计划今日记录数量
const getTodayRecordCount = (plan: Plan) => {
  if (!plan.records) return 0;
  const today = new Date().toDateString();
  return plan.records.filter((record) => {
    const recordDate = new Date(record.date);
    return recordDate.toDateString() === today;
  }).length;
};

// 检查计划是否有今日记录
const hasTodayRecord = (plan: Plan) => {
  return getTodayRecordCount(plan) > 0;
};

// 快速记录
const quickRecord = (plan: Plan) => {
  const today = new Date().toISOString().split("T")[0];
  router.push({
    name: "RecordDetail",
    params: { date: today },
    query: {
      planId: plan.id,
      planTitle: plan.title,
      unit: plan.unit,
      targetAmount: plan.targetAmount.toString(),
      dailyTarget: plan.dailyTarget,
    },
  });
};

// 页面导航
const goToPractice = () => {
  router.push({ name: "Practice" });
};

const goToRecords = () => {
  router.push({ name: "Records" });
};

// 获取计划类型图标
const getPlanIcon = (planId: string) => {
  if (planId.includes("1-1")) return FlameOutline; // 运动
  if (planId.includes("1-2")) return TimeOutline; // 冥想
  if (planId.includes("2-1")) return BookOutline; // 阅读
  return PlayCircleOutline;
};

onMounted(() => {
  // 页面初始化时的逻辑
  console.log("觉行助手首页加载完成");
});
</script>

<template>
  <div class="home-container">
    <!-- 顶部欢迎区域 -->
    <div class="welcome-section">
      <n-space vertical size="small">
        <n-text style="font-size: 24px; font-weight: bold; color: white">
          {{ greeting }}
        </n-text>
        <n-text style="font-size: 14px; color: rgba(255, 255, 255, 0.8)">
          让我们开始今天的觉行之旅
        </n-text>
      </n-space>
    </div>

    <!-- 今日名言 -->
    <n-card class="quote-card" :bordered="false">
      <n-space vertical size="small">
        <n-icon size="16" color="#f0a020">
          <TimeOutline />
        </n-icon>
        <n-text style="font-style: italic; font-size: 14px; line-height: 1.6">
          "{{ todayQuote.text }}"
        </n-text>
        <n-text depth="3" style="font-size: 12px; text-align: right">
          — {{ todayQuote.source }}
        </n-text>
      </n-space>
    </n-card>

    <!-- 今日进度概览 -->
    <n-card class="progress-overview-card" :bordered="false">
      <n-space vertical size="medium">
        <n-space justify="space-between" align="center">
          <n-space align="center">
            <n-icon size="18" color="#18a058">
              <TrendingUpOutline />
            </n-icon>
            <n-text strong style="font-size: 16px">今日概览</n-text>
          </n-space>
          <n-time format="M月d日" style="font-size: 12px" />
        </n-space>

        <n-grid cols="3" :x-gap="12">
          <n-grid-item>
            <n-space vertical size="small" align="center">
              <n-progress
                type="circle"
                :percentage="todayProgress"
                :width="60"
                :stroke-width="6"
                status="success"
                :show-indicator="false"
              />
              <n-text depth="3" style="font-size: 11px">今日进度</n-text>
              <n-text strong style="font-size: 16px"
                >{{ todayProgress }}%</n-text
              >
            </n-space>
          </n-grid-item>
          <n-grid-item>
            <n-space vertical size="small" align="center">
              <n-icon size="32" color="#f0a020">
                <FlameOutline />
              </n-icon>
              <n-text depth="3" style="font-size: 11px">连续天数</n-text>
              <n-text strong style="font-size: 16px">{{ streakDays }}天</n-text>
            </n-space>
          </n-grid-item>
          <n-grid-item>
            <n-space vertical size="small" align="center">
              <n-icon size="32" color="#722ed1">
                <CalendarOutline />
              </n-icon>
              <n-text depth="3" style="font-size: 11px">本月天数</n-text>
              <n-text strong style="font-size: 16px"
                >{{ monthStats.practicesDays }}天</n-text
              >
            </n-space>
          </n-grid-item>
        </n-grid>
      </n-space>
    </n-card>

    <!-- 今日修行计划 -->
    <n-card class="plan-card" :bordered="false">
      <n-space vertical size="medium">
        <n-space justify="space-between" align="center">
          <n-space align="center">
            <n-icon size="18" color="#18a058">
              <PlayCircleOutline />
            </n-icon>
            <n-text strong style="font-size: 16px">今日修行计划</n-text>
          </n-space>
          <n-button text size="small" @click="goToPractice">
            查看全部
          </n-button>
        </n-space>

        <div v-if="todayPlans.length > 0">
          <n-list>
            <n-list-item
              v-for="plan in todayPlans"
              :key="plan.id"
              class="plan-item"
              :class="{ 'has-record': hasTodayRecord(plan) }"
            >
              <n-thing>
                <template #avatar>
                  <n-icon
                    size="20"
                    :color="hasTodayRecord(plan) ? '#18a058' : '#666'"
                  >
                    <CheckmarkCircleOutline v-if="hasTodayRecord(plan)" />
                    <component :is="getPlanIcon(plan.id)" v-else />
                  </n-icon>
                </template>

                <template #header>
                  <n-space justify="space-between" align="center">
                    <n-text :depth="hasTodayRecord(plan) ? 3 : 1">
                      {{ plan.title }}
                    </n-text>
                    <n-space size="small">
                      <n-tag
                        size="small"
                        :type="hasTodayRecord(plan) ? 'success' : 'default'"
                      >
                        {{ plan.dailyTarget }}
                      </n-tag>
                      <n-tag
                        v-if="getTodayRecordCount(plan) > 0"
                        size="tiny"
                        type="info"
                      >
                        已记录{{ getTodayRecordCount(plan) }}次
                      </n-tag>
                      <n-icon
                        size="16"
                        :color="hasTodayRecord(plan) ? '#18a058' : '#666'"
                      >
                        <component :is="getPlanIcon(plan.id)" />
                      </n-icon>
                    </n-space>
                  </n-space>
                </template>

                <template #description>
                  <n-space justify="space-between" align="center">
                    <n-text depth="3" style="font-size: 12px">
                      {{ plan.description }}
                    </n-text>
                    <n-button
                      text
                      size="tiny"
                      @click="quickRecord(plan)"
                      type="primary"
                    >
                      {{
                        getTodayRecordCount(plan) > 0 ? "继续记录" : "开始记录"
                      }}
                    </n-button>
                  </n-space>
                </template>
              </n-thing>
            </n-list-item>
          </n-list>
        </div>

        <div v-else style="text-align: center; padding: 20px 0">
          <n-text depth="3">今日暂无修行计划</n-text>
          <br />
          <n-button
            type="primary"
            size="small"
            @click="goToPractice"
            style="margin-top: 8px"
          >
            <template #icon>
              <n-icon><AddOutline /></n-icon>
            </template>
            创建计划
          </n-button>
        </div>
      </n-space>
    </n-card>

    <!-- 快速操作 -->
    <n-card class="quick-actions-card" :bordered="false">
      <n-space vertical size="medium">
        <n-text strong style="font-size: 16px">快速操作</n-text>

        <n-grid cols="2" :x-gap="12" :y-gap="12">
          <n-grid-item>
            <n-button
              size="large"
              block
              @click="goToPractice"
              style="height: 60px"
            >
              <template #icon>
                <n-icon size="20">
                  <PlayCircleOutline />
                </n-icon>
              </template>
              管理计划
            </n-button>
          </n-grid-item>
          <n-grid-item>
            <n-button
              size="large"
              block
              @click="goToRecords"
              style="height: 60px"
            >
              <template #icon>
                <n-icon size="20">
                  <CalendarOutline />
                </n-icon>
              </template>
              查看记录
            </n-button>
          </n-grid-item>
        </n-grid>
      </n-space>
    </n-card>

    <!-- 本月统计 -->
    <n-card class="month-stats-card" :bordered="false">
      <n-space vertical size="medium">
        <n-text strong style="font-size: 16px">本月统计</n-text>

        <n-grid cols="3" :x-gap="12">
          <n-grid-item>
            <n-statistic
              label="修行天数"
              :value="monthStats.practicesDays"
              suffix="天"
            />
          </n-grid-item>
          <n-grid-item>
            <n-statistic
              label="修行目标"
              :value="monthStats.totalGoals"
              suffix="个"
            />
          </n-grid-item>
          <n-grid-item>
            <n-statistic
              label="完成率"
              :value="monthStats.completionRate"
              suffix="%"
            />
          </n-grid-item>
        </n-grid>

        <n-progress
          :percentage="monthStats.completionRate"
          :stroke-width="8"
          status="success"
          :show-indicator="true"
        />
      </n-space>
    </n-card>
  </div>
</template>

<style scoped>
.home-container {
  padding: 0 16px 80px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.welcome-section {
  padding: 20px 0;
  background: transparent;
}

.quote-card,
.progress-overview-card,
.plan-card,
.quick-actions-card,
.month-stats-card {
  margin-bottom: 16px;
  border-radius: 12px;
}

.plan-item {
  border-radius: 8px;
  padding: 8px;
  margin: 4px 0;
  transition: all 0.2s ease;
}

.plan-item:hover {
  background-color: var(--n-button-color-hover);
}

.plan-item.has-record {
  opacity: 0.8;
  background-color: rgba(24, 160, 88, 0.1);
}

.plan-item.has-record .n-text {
  color: var(--n-text-color-disabled);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .home-container {
    padding: 0 12px 80px 12px;
  }

  .welcome-section {
    padding: 16px 0;
  }
}
</style>
