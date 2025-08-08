<script setup lang="ts">
import { ref, computed, markRaw } from "vue";
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
  NTag,
  NEmpty,
  NThing,
  NButtonGroup,
} from "naive-ui";
import {
  AddOutline,
  FilterOutline,
  ListOutline,
  TrendingUpOutline,
  TimeOutline,
  CheckmarkCircleOutline,
  PlayCircleOutline,
  PauseCircleOutline,
} from "@vicons/ionicons5";
import type { Goal } from "../types";

const router = useRouter();

// 模拟数据
const goals = ref<Goal[]>([
  {
    id: "1",
    title: "保持身体健康",
    description: "通过日常运动保持身体力量、协调性和柔韧性",
    type: "long-term",
    category: "身",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date(),
    status: "active",
    plans: [
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
        records: [],
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
        records: [],
      },
    ],
  },
  {
    id: "2",
    title: "阅读《刀锋》",
    description: "深入阅读毛姆的经典小说《刀锋》",
    type: "short-term",
    category: "心",
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date(),
    targetDate: new Date("2025-03-01"),
    status: "active",
    plans: [
      {
        id: "2-1",
        goalId: "2",
        title: "每日阅读",
        description: "每天阅读《刀锋》50页",
        dailyTarget: "阅读50页",
        unit: "页",
        targetAmount: 50,
        createdAt: new Date("2025-01-15"),
        updatedAt: new Date(),
        isActive: true,
        records: [],
      },
    ],
  },
  {
    id: "3",
    title: "学习钢琴曲",
    description: "学会演奏《夜的钢琴曲 3》",
    type: "short-term",
    category: "灵",
    createdAt: new Date("2025-01-10"),
    updatedAt: new Date(),
    targetDate: new Date("2025-04-01"),
    status: "active",
    plans: [
      {
        id: "3-1",
        goalId: "3",
        title: "钢琴练习",
        description: "练习钢琴曲5个小节，速度80，不能出错20遍",
        dailyTarget: "练习5小节 × 20遍",
        unit: "遍",
        targetAmount: 20,
        createdAt: new Date("2025-01-10"),
        updatedAt: new Date(),
        isActive: true,
        records: [],
      },
    ],
  },
]);

// 过滤条件
const filterType = ref<"all" | "long-term" | "short-term">("all");
const filterCategory = ref<"all" | "身" | "心" | "灵">("all");

// 过滤后的目标
const filteredGoals = computed(() => {
  return goals.value.filter((goal) => {
    const typeMatch =
      filterType.value === "all" || goal.type === filterType.value;
    const categoryMatch =
      filterCategory.value === "all" || goal.category === filterCategory.value;
    return typeMatch && categoryMatch;
  });
});

// 统计数据
const totalGoals = computed(() => goals.value.length);
const activeGoals = computed(
  () => goals.value.filter((g) => g.status === "active").length
);
const totalPlans = computed(() =>
  goals.value.reduce((sum, goal) => sum + goal.plans.length, 0)
);
const activePlans = computed(() =>
  goals.value.reduce(
    (sum, goal) => sum + goal.plans.filter((p) => p.isActive).length,
    0
  )
);

// 本月进度（模拟数据）
const monthlyProgress = ref(68);

// 页面操作
const createGoal = () => {
  router.push({ name: "CreateGoal" });
};

const viewGoalDetail = (goalId: string) => {
  router.push({ name: "GoalDetail", params: { id: goalId } });
};

const viewPlanDetail = (planId: string) => {
  router.push({ name: "PlanDetail", params: { id: planId } });
};

// 获取目标类型标签颜色
const getTypeTagColor = (type: Goal["type"]) => {
  return type === "long-term" ? "info" : "warning";
};

// 获取分类标签颜色
const getCategoryTagColor = (
  category: string
): "default" | "primary" | "info" | "success" | "warning" | "error" => {
  const colors = {
    身: "success" as const,
    心: "primary" as const,
    灵: "info" as const,
  };
  return colors[category as keyof typeof colors] || "default";
};

// 获取状态图标
const getStatusIcon = (status: Goal["status"]) => {
  const icons = {
    active: markRaw(PlayCircleOutline),
    completed: markRaw(CheckmarkCircleOutline),
    paused: markRaw(PauseCircleOutline),
  };
  return icons[status];
};
</script>

<template>
  <div class="practice-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <n-space justify="space-between" align="center">
        <n-text strong style="font-size: 20px; color: white">修行计划</n-text>
        <n-button
          type="primary"
          size="small"
          @click="createGoal"
          style="background: rgba(255, 255, 255, 0.2); border: none"
        >
          <template #icon>
            <n-icon><AddOutline /></n-icon>
          </template>
          新增目标
        </n-button>
      </n-space>
    </div>

    <!-- 进度概览 -->
    <n-card class="overview-card" :bordered="false">
      <n-space vertical size="medium">
        <n-space justify="space-between" align="center">
          <n-text strong style="font-size: 16px">本月进度</n-text>
          <n-icon size="20" color="#18a058">
            <TrendingUpOutline />
          </n-icon>
        </n-space>

        <n-progress
          :percentage="monthlyProgress"
          :stroke-width="8"
          status="success"
          :show-indicator="true"
        />

        <n-grid cols="2" :x-gap="12" :y-gap="8">
          <n-grid-item>
            <n-statistic label="修行目标" :value="totalGoals" suffix="个" />
          </n-grid-item>
          <n-grid-item>
            <n-statistic label="活跃目标" :value="activeGoals" suffix="个" />
          </n-grid-item>
          <n-grid-item>
            <n-statistic label="修行计划" :value="totalPlans" suffix="个" />
          </n-grid-item>
          <n-grid-item>
            <n-statistic label="进行中" :value="activePlans" suffix="个" />
          </n-grid-item>
        </n-grid>
      </n-space>
    </n-card>

    <!-- 过滤选项 -->
    <n-card class="filter-card" :bordered="false">
      <n-space vertical size="small">
        <n-space align="center">
          <n-icon size="16">
            <FilterOutline />
          </n-icon>
          <n-text>筛选条件</n-text>
        </n-space>

        <n-space>
          <n-button-group>
            <n-button
              :type="filterType === 'all' ? 'primary' : 'default'"
              size="small"
              @click="filterType = 'all'"
            >
              全部
            </n-button>
            <n-button
              :type="filterType === 'long-term' ? 'primary' : 'default'"
              size="small"
              @click="filterType = 'long-term'"
            >
              长期目标
            </n-button>
            <n-button
              :type="filterType === 'short-term' ? 'primary' : 'default'"
              size="small"
              @click="filterType = 'short-term'"
            >
              短期目标
            </n-button>
          </n-button-group>

          <n-button-group>
            <n-button
              :type="filterCategory === 'all' ? 'primary' : 'default'"
              size="small"
              @click="filterCategory = 'all'"
            >
              全部
            </n-button>
            <n-button
              :type="filterCategory === '身' ? 'primary' : 'default'"
              size="small"
              @click="filterCategory = '身'"
            >
              身
            </n-button>
            <n-button
              :type="filterCategory === '心' ? 'primary' : 'default'"
              size="small"
              @click="filterCategory = '心'"
            >
              心
            </n-button>
            <n-button
              :type="filterCategory === '灵' ? 'primary' : 'default'"
              size="small"
              @click="filterCategory = '灵'"
            >
              灵
            </n-button>
          </n-button-group>
        </n-space>
      </n-space>
    </n-card>

    <!-- 目标列表 -->
    <div class="goals-list">
      <n-space vertical size="medium">
        <div v-if="filteredGoals.length === 0">
          <n-empty description="暂无修行目标" style="margin: 40px 0">
            <template #extra>
              <n-button type="primary" @click="createGoal">
                创建第一个目标
              </n-button>
            </template>
          </n-empty>
        </div>

        <n-card
          v-for="goal in filteredGoals"
          :key="goal.id"
          class="goal-card"
          :bordered="false"
          hoverable
          @click="viewGoalDetail(goal.id)"
        >
          <n-thing>
            <template #header>
              <n-space justify="space-between" align="center">
                <n-text strong>{{ goal.title }}</n-text>
                <n-icon
                  size="16"
                  :color="goal.status === 'active' ? '#18a058' : '#999'"
                >
                  <component :is="getStatusIcon(goal.status)" />
                </n-icon>
              </n-space>
            </template>

            <template #header-extra>
              <n-space size="small">
                <n-tag :type="getTypeTagColor(goal.type)" size="small">
                  {{ goal.type === "long-term" ? "长期" : "短期" }}
                </n-tag>
                <n-tag :type="getCategoryTagColor(goal.category)" size="small">
                  {{ goal.category }}
                </n-tag>
              </n-space>
            </template>

            <template #description>
              <n-space vertical size="small">
                <n-text depth="3">{{ goal.description }}</n-text>

                <div v-if="goal.targetDate">
                  <n-space align="center" size="small">
                    <n-icon size="14" color="#f0a020">
                      <TimeOutline />
                    </n-icon>
                    <n-text depth="3" style="font-size: 12px">
                      目标日期：{{ goal.targetDate.toLocaleDateString() }}
                    </n-text>
                  </n-space>
                </div>

                <!-- 计划列表预览 -->
                <div v-if="goal.plans.length > 0">
                  <n-space vertical size="small">
                    <n-space align="center" size="small">
                      <n-icon size="14">
                        <ListOutline />
                      </n-icon>
                      <n-text depth="2" style="font-size: 12px">
                        修行计划 ({{ goal.plans.length }}个)
                      </n-text>
                    </n-space>

                    <div class="plans-preview">
                      <div
                        v-for="plan in goal.plans.slice(0, 2)"
                        :key="plan.id"
                        class="plan-preview"
                        @click.stop="viewPlanDetail(plan.id)"
                      >
                        <n-space justify="space-between" align="center">
                          <n-text style="font-size: 12px">{{
                            plan.title
                          }}</n-text>
                          <n-tag
                            size="tiny"
                            :type="plan.isActive ? 'success' : 'default'"
                          >
                            {{ plan.dailyTarget }}
                          </n-tag>
                        </n-space>
                      </div>

                      <div v-if="goal.plans.length > 2" class="more-plans">
                        <n-text depth="3" style="font-size: 11px">
                          还有 {{ goal.plans.length - 2 }} 个计划...
                        </n-text>
                      </div>
                    </div>
                  </n-space>
                </div>
              </n-space>
            </template>
          </n-thing>
        </n-card>
      </n-space>
    </div>
  </div>
</template>

<style scoped>
.practice-container {
  padding: 0 16px 80px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.page-header {
  padding: 20px 0;
  background: transparent;
}

.overview-card,
.filter-card {
  margin-bottom: 16px;
  border-radius: 12px;
}

.goals-list {
  margin-bottom: 20px;
}

.goal-card {
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.goal-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.plans-preview {
  background: var(--n-color-target);
  border-radius: 6px;
  padding: 8px;
  margin-top: 4px;
}

.plan-preview {
  padding: 4px 0;
  border-bottom: 1px solid var(--n-border-color);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.plan-preview:last-child {
  border-bottom: none;
}

.plan-preview:hover {
  background-color: var(--n-button-color-hover);
  border-radius: 4px;
  padding: 4px 8px;
  margin: 0 -8px;
}

.more-plans {
  text-align: center;
  padding: 4px 0;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .practice-container {
    padding: 0 12px 80px 12px;
  }

  .page-header {
    padding: 16px 0;
  }
}
</style>
