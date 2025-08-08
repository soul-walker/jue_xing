<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  NCard,
  NButton,
  NIcon,
  NText,
  NSpace,
  NProgress,
  NTag,
  NStatistic,
  NGrid,
  NGridItem,
  NList,
  NListItem,
  NThing,
  NEmpty,
  NTime,
} from "naive-ui";
import {
  ArrowBackOutline,
  PlayOutline,
  PauseOutline,
  StatsChartOutline,
  CalendarOutline,
  TrendingUpOutline,
  CheckmarkCircleOutline,
  AddOutline,
} from "@vicons/ionicons5";
import type { Plan, Record } from "../types";

const router = useRouter();
const route = useRoute();

// 获取计划ID
const planId = computed(() => route.params.id as string);

// 模拟计划数据
const plan = ref<Plan>({
  id: "1-1",
  goalId: "1",
  title: "每日深蹲",
  description: "每天完成深蹲运动，增强腿部力量和耐力，保持身体健康",
  dailyTarget: "深蹲100个",
  unit: "个",
  targetAmount: 100,
  createdAt: new Date("2025-01-01"),
  updatedAt: new Date(),
  isActive: true,
  records: [],
});

// 模拟记录数据（最近7天）
const records = ref<Record[]>([
  {
    id: "r1",
    planId: "1-1",
    date: new Date("2025-01-07"),
    amount: 100,
    completed: true,
    reflection: "今天状态很好，完成得很轻松",
    mood: 4,
    createdAt: new Date("2025-01-07"),
    updatedAt: new Date("2025-01-07"),
  },
  {
    id: "r2",
    planId: "1-1",
    date: new Date("2025-01-06"),
    amount: 80,
    completed: false,
    reflection: "今天有点累，没能完成全部",
    mood: 3,
    createdAt: new Date("2025-01-06"),
    updatedAt: new Date("2025-01-06"),
  },
  {
    id: "r3",
    planId: "1-1",
    date: new Date("2025-01-05"),
    amount: 100,
    completed: true,
    reflection: "保持节奏，感觉身体越来越强壮",
    mood: 5,
    createdAt: new Date("2025-01-05"),
    updatedAt: new Date("2025-01-05"),
  },
]);

// 统计数据
const statistics = computed(() => {
  const totalRecords = records.value.length;
  const completedRecords = records.value.filter((r) => r.completed).length;
  const totalAmount = records.value.reduce((sum, r) => sum + r.amount, 0);
  const averageAmount =
    totalRecords > 0 ? Math.round(totalAmount / totalRecords) : 0;
  const completionRate =
    totalRecords > 0 ? Math.round((completedRecords / totalRecords) * 100) : 0;
  const currentStreak = calculateCurrentStreak();

  return {
    totalRecords,
    completedRecords,
    totalAmount,
    averageAmount,
    completionRate,
    currentStreak,
  };
});

// 计算当前连续天数
const calculateCurrentStreak = () => {
  let streak = 0;
  const sortedRecords = [...records.value].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  for (const record of sortedRecords) {
    if (record.completed) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

// 获取心情表情
const getMoodEmoji = (mood: number) => {
  const emojis = ["😢", "😕", "😐", "😊", "😄"];
  return emojis[mood - 1] || "😐";
};

// 页面操作
const goBack = () => {
  // 计划详情主要从首页或计划页面进入，返回到计划页面
  router.push({ name: "Practice" });
};

const togglePlanStatus = () => {
  plan.value.isActive = !plan.value.isActive;
};

const addRecord = () => {
  // 跳转到记录添加页面（今天的日期）
  const today = new Date().toISOString().split("T")[0];
  router.push({ name: "RecordDetail", params: { date: today } });
};

const viewAllRecords = () => {
  router.push({ name: "Records" });
};

onMounted(() => {
  // 根据实际的planId加载数据
  console.log("加载计划详情:", planId.value);
});
</script>

<template>
  <div class="plan-detail-container">
    <!-- 顶部导航 -->
    <div class="page-header">
      <n-space justify="space-between" align="center">
        <n-button text @click="goBack" style="color: white">
          <template #icon>
            <n-icon size="20">
              <ArrowBackOutline />
            </n-icon>
          </template>
        </n-button>

        <n-text strong style="font-size: 18px; color: white"> 计划详情 </n-text>

        <div style="width: 40px"></div>
      </n-space>
    </div>

    <!-- 计划基本信息 -->
    <n-card class="plan-info-card" :bordered="false">
      <n-space vertical size="medium">
        <n-space justify="space-between" align="start">
          <n-space vertical size="small">
            <n-text strong style="font-size: 20px">{{ plan.title }}</n-text>
            <n-text depth="2">{{ plan.description }}</n-text>
          </n-space>

          <n-tag :type="plan.isActive ? 'success' : 'default'" size="medium">
            {{ plan.isActive ? "进行中" : "已暂停" }}
          </n-tag>
        </n-space>

        <n-space align="center" size="large">
          <n-space vertical size="small" align="center">
            <n-text depth="3" style="font-size: 12px">每日目标</n-text>
            <n-text strong style="font-size: 18px">{{
              plan.dailyTarget
            }}</n-text>
          </n-space>

          <n-space vertical size="small" align="center">
            <n-text depth="3" style="font-size: 12px">目标数量</n-text>
            <n-text strong style="font-size: 18px"
              >{{ plan.targetAmount }} {{ plan.unit }}</n-text
            >
          </n-space>
        </n-space>

        <n-space justify="space-between">
          <n-button
            :type="plan.isActive ? 'warning' : 'primary'"
            @click="togglePlanStatus"
          >
            <template #icon>
              <n-icon>
                <component :is="plan.isActive ? PauseOutline : PlayOutline" />
              </n-icon>
            </template>
            {{ plan.isActive ? "暂停计划" : "恢复计划" }}
          </n-button>

          <n-button type="primary" @click="addRecord">
            <template #icon>
              <n-icon>
                <AddOutline />
              </n-icon>
            </template>
            添加记录
          </n-button>
        </n-space>
      </n-space>
    </n-card>

    <!-- 统计数据 -->
    <n-card class="statistics-card" :bordered="false">
      <n-space vertical size="medium">
        <n-space align="center">
          <n-icon size="18" color="#18a058">
            <StatsChartOutline />
          </n-icon>
          <n-text strong>执行统计</n-text>
        </n-space>

        <n-grid cols="2" :x-gap="12" :y-gap="16">
          <n-grid-item>
            <n-statistic
              label="总记录数"
              :value="statistics.totalRecords"
              suffix="天"
            />
          </n-grid-item>
          <n-grid-item>
            <n-statistic
              label="完成天数"
              :value="statistics.completedRecords"
              suffix="天"
            />
          </n-grid-item>
          <n-grid-item>
            <n-statistic
              label="完成率"
              :value="statistics.completionRate"
              suffix="%"
            />
          </n-grid-item>
          <n-grid-item>
            <n-statistic
              label="连续天数"
              :value="statistics.currentStreak"
              suffix="天"
            />
          </n-grid-item>
          <n-grid-item>
            <n-statistic
              label="累计完成"
              :value="statistics.totalAmount"
              :suffix="plan.unit"
            />
          </n-grid-item>
          <n-grid-item>
            <n-statistic
              label="平均完成"
              :value="statistics.averageAmount"
              :suffix="plan.unit"
            />
          </n-grid-item>
        </n-grid>
      </n-space>
    </n-card>

    <!-- 完成率进度 -->
    <n-card class="progress-card" :bordered="false">
      <n-space vertical size="medium">
        <n-space align="center">
          <n-icon size="18" color="#f0a020">
            <TrendingUpOutline />
          </n-icon>
          <n-text strong>完成进度</n-text>
        </n-space>

        <n-progress
          :percentage="statistics.completionRate"
          :stroke-width="12"
          status="success"
          :show-indicator="true"
        />

        <n-text depth="3" style="text-align: center; font-size: 12px">
          {{ statistics.completedRecords }}/{{ statistics.totalRecords }}
          天完成目标
        </n-text>
      </n-space>
    </n-card>

    <!-- 最近记录 -->
    <n-card class="records-card" :bordered="false">
      <n-space vertical size="medium">
        <n-space justify="space-between" align="center">
          <n-space align="center">
            <n-icon size="18" color="#666">
              <CalendarOutline />
            </n-icon>
            <n-text strong>最近记录</n-text>
          </n-space>

          <n-button text size="small" @click="viewAllRecords">
            查看全部
          </n-button>
        </n-space>

        <div v-if="records.length === 0">
          <n-empty description="暂无修行记录" style="margin: 20px 0">
            <template #extra>
              <n-button type="primary" @click="addRecord">
                添加第一条记录
              </n-button>
            </template>
          </n-empty>
        </div>

        <n-list v-else>
          <n-list-item v-for="record in records.slice(0, 5)" :key="record.id">
            <n-thing>
              <template #avatar>
                <n-icon
                  size="24"
                  :color="record.completed ? '#18a058' : '#d03050'"
                >
                  <CheckmarkCircleOutline v-if="record.completed" />
                  <span v-else style="font-size: 20px">⏸</span>
                </n-icon>
              </template>

              <template #header>
                <n-space justify="space-between" align="center">
                  <n-time :time="record.date" format="MM-dd" />
                  <n-space size="small">
                    <n-text>{{ record.amount }} {{ plan.unit }}</n-text>
                    <span style="font-size: 16px">{{
                      getMoodEmoji(record.mood)
                    }}</span>
                  </n-space>
                </n-space>
              </template>

              <template #description>
                <n-space vertical size="small">
                  <n-text
                    :depth="record.completed ? 3 : 2"
                    style="font-size: 12px"
                  >
                    {{ record.reflection || "无感想" }}
                  </n-text>

                  <n-progress
                    :percentage="
                      Math.round((record.amount / plan.targetAmount) * 100)
                    "
                    :stroke-width="4"
                    :status="record.completed ? 'success' : 'warning'"
                    :show-indicator="false"
                  />
                </n-space>
              </template>
            </n-thing>
          </n-list-item>
        </n-list>
      </n-space>
    </n-card>
  </div>
</template>

<style scoped>
.plan-detail-container {
  padding: 0 16px 80px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.page-header {
  padding: 20px 0;
  background: transparent;
}

.plan-info-card,
.statistics-card,
.progress-card,
.records-card {
  margin-bottom: 16px;
  border-radius: 12px;
}

.records-card .n-list-item {
  border-radius: 8px;
  padding: 8px;
  margin: 4px 0;
  transition: background-color 0.2s ease;
}

.records-card .n-list-item:hover {
  background-color: var(--n-button-color-hover);
  cursor: pointer;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .plan-detail-container {
    padding: 0 12px 80px 12px;
  }

  .page-header {
    padding: 16px 0;
  }
}
</style>
