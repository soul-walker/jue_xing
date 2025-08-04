<template>
  <div class="goals-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <n-text strong style="font-size: 20px; color: white">我的目标</n-text>
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
    </div>

    <!-- 目标进度概览 -->
    <n-card class="overview-card" :bordered="false">
      <n-space vertical size="medium">
        <n-text strong>本月进度</n-text>
        <n-progress
          :percentage="monthlyProgress"
          :stroke-width="8"
          status="success"
        />
        <n-grid cols="2" :x-gap="12">
          <n-grid-item>
            <n-statistic label="已完成" :value="completedGoals" suffix="个" />
          </n-grid-item>
          <n-grid-item>
            <n-statistic label="进行中" :value="activeGoals" suffix="个" />
          </n-grid-item>
        </n-grid>
      </n-space>
    </n-card>

    <!-- 目标列表 -->
    <div class="goals-list">
      <n-space vertical size="small">
        <n-card
          v-for="goal in goals"
          :key="goal.id"
          class="goal-card"
          :bordered="false"
          hoverable
          @click="viewGoalDetail(goal.id)"
        >
          <n-space vertical size="small">
            <n-space justify="space-between" align="center">
              <n-text strong>{{ goal.name }}</n-text>
              <n-tag :type="getGoalStatusType(goal.status)">
                {{ getGoalStatusText(goal.status) }}
              </n-tag>
            </n-space>

            <n-text depth="3" style="font-size: 12px">{{
              goal.description
            }}</n-text>

            <n-progress
              :percentage="goal.progress"
              :stroke-width="6"
              :status="goal.progress === 100 ? 'success' : 'default'"
            />

            <n-space justify="space-between" align="center">
              <n-text depth="3" style="font-size: 11px">
                目标期限: {{ goal.deadline }}
              </n-text>
              <n-space size="small">
                <n-button
                  size="tiny"
                  type="primary"
                  text
                  @click="updateGoal(goal)"
                >
                  更新进度
                </n-button>
                <n-button
                  size="tiny"
                  type="error"
                  text
                  @click="deleteGoal(goal.id)"
                >
                  删除
                </n-button>
              </n-space>
            </n-space>
          </n-space>
        </n-card>
      </n-space>
    </div>

    <!-- 新增目标模态框 -->
    <n-modal v-model:show="showCreateModal">
      <n-card
        style="width: 90%; max-width: 400px"
        title="新增目标"
        :bordered="false"
      >
        <n-form ref="formRef" :model="newGoal">
          <n-form-item label="目标名称" path="name">
            <n-input
              v-model:value="newGoal.name"
              placeholder="请输入目标名称"
            />
          </n-form-item>
          <n-form-item label="目标描述" path="description">
            <n-input
              v-model:value="newGoal.description"
              type="textarea"
              placeholder="请输入目标描述"
              :rows="3"
            />
          </n-form-item>
          <n-form-item label="目标期限" path="deadline">
            <n-date-picker
              v-model:value="newGoal.deadline"
              type="date"
              placeholder="选择目标期限"
              style="width: 100%"
            />
          </n-form-item>
        </n-form>

        <template #footer>
          <n-space justify="end">
            <n-button @click="showCreateModal = false">取消</n-button>
            <n-button type="primary" @click="createGoal">创建</n-button>
          </n-space>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import {
  NCard,
  NSpace,
  NText,
  NButton,
  NIcon,
  NGrid,
  NGridItem,
  NStatistic,
  NProgress,
  NTag,
  NModal,
  NForm,
  NFormItem,
  NInput,
  NDatePicker,
  useMessage,
} from "naive-ui";
import { AddOutline } from "@vicons/ionicons5";

const message = useMessage();
const router = useRouter();

// 响应式数据
const showCreateModal = ref(false);
const goals = ref([
  {
    id: 1,
    name: "每日冥想",
    description: "每天进行20分钟的正念冥想",
    progress: 75,
    status: "active",
    deadline: "2025-02-28",
  },
  {
    id: 2,
    name: "阅读经典",
    description: "每周阅读一本修行相关书籍",
    progress: 40,
    status: "active",
    deadline: "2025-03-31",
  },
  {
    id: 3,
    name: "感恩练习",
    description: "每天记录三件感恩的事情",
    progress: 100,
    status: "completed",
    deadline: "2025-01-31",
  },
]);

const newGoal = ref({
  name: "",
  description: "",
  deadline: null,
});

// 计算属性
const completedGoals = computed(
  () => goals.value.filter((goal) => goal.status === "completed").length
);

const activeGoals = computed(
  () => goals.value.filter((goal) => goal.status === "active").length
);

const monthlyProgress = computed(() => {
  const total = goals.value.length;
  const completed = completedGoals.value;
  return total > 0 ? Math.round((completed / total) * 100) : 0;
});

// 方法
const getGoalStatusType = (status: string) => {
  switch (status) {
    case "completed":
      return "success";
    case "active":
      return "info";
    case "paused":
      return "warning";
    default:
      return "default";
  }
};

const getGoalStatusText = (status: string) => {
  switch (status) {
    case "completed":
      return "已完成";
    case "active":
      return "进行中";
    case "paused":
      return "已暂停";
    default:
      return "未知";
  }
};

const createGoal = () => {
  router.push("/goals/create");
};

const viewGoalDetail = (goalId: number) => {
  router.push(`/goals/${goalId}`);
};

const updateGoal = (goal: any) => {
  if (goal.progress < 100) {
    goal.progress = Math.min(goal.progress + 10, 100);
    if (goal.progress === 100) {
      goal.status = "completed";
    }
    message.success("进度更新成功！");
  }
};

const deleteGoal = (goalId: number) => {
  const index = goals.value.findIndex((goal) => goal.id === goalId);
  if (index > -1) {
    goals.value.splice(index, 1);
    message.success("目标删除成功！");
  }
};
</script>

<style scoped>
.goals-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.page-header {
  padding: 20px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.overview-card {
  margin: 0 16px 16px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.goals-list {
  padding: 0 16px 16px;
}

.goal-card {
  border-radius: 8px;
  margin-bottom: 8px;
}
</style>
