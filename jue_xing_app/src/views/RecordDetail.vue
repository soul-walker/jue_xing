<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  NCard,
  NButton,
  NIcon,
  NText,
  NSpace,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NRate,
  NTag,
  NTime,
  NList,
  NListItem,
  NThing,
  useMessage,
} from "naive-ui";
import {
  ArrowBackOutline,
  SaveOutline,
  CalendarOutline,
  CheckmarkCircleOutline,
  TimeOutline,
} from "@vicons/ionicons5";
import type { Record, Plan } from "../types";

const router = useRouter();
const route = useRoute();
const message = useMessage();

// 获取路由参数
const dateParam = computed(() => route.params.date as string);
const recordDate = computed(() => new Date(dateParam.value));

// 获取查询参数（从首页传递的计划信息）
const planIdParam = computed(() => route.query.planId as string);
const planTitleParam = computed(() => route.query.planTitle as string);
const planUnitParam = computed(() => route.query.unit as string);
const targetAmountParam = computed(() => {
  const amount = route.query.targetAmount as string;
  return amount ? parseInt(amount) : 1;
});
const dailyTargetParam = computed(() => route.query.dailyTarget as string);

// 表单数据
const formData = ref({
  amount: 0,
  reflection: "",
  mood: 3,
});

// 模拟当日的计划列表
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
]);

// 当前选中的计划
const selectedPlan = ref<Plan | null>(null);

// 检查是否是直接记录模式（从首页传入计划信息）
const isDirectRecord = computed(() => !!planIdParam.value);

// 直接记录模式的计划信息
const directPlan = computed(() => {
  if (!isDirectRecord.value) return null;

  return {
    id: planIdParam.value,
    title: planTitleParam.value || "修行计划",
    unit: planUnitParam.value || "次",
    targetAmount: targetAmountParam.value,
    dailyTarget: dailyTargetParam.value || "每日目标",
    goalId: "",
    description: "",
    category: "",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    records: [],
  } as Plan;
});

// 当前使用的计划（直接记录模式或选中的计划）
const currentPlan = computed(() =>
  isDirectRecord.value ? directPlan.value : selectedPlan.value
);

// 模拟已有记录
const existingRecords = ref<Record[]>([
  {
    id: "r1",
    planId: "1-1",
    date: recordDate.value,
    amount: 100,
    completed: true,
    reflection: "今天状态很好，完成得很轻松",
    mood: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]);

// 检查是否已有记录
const hasExistingRecord = (planId: string) => {
  return existingRecords.value.some((r) => r.planId === planId);
};

// 获取已有记录
const getExistingRecord = (planId: string) => {
  return existingRecords.value.find((r) => r.planId === planId);
};

// 选择计划
const selectPlan = (plan: Plan) => {
  selectedPlan.value = plan;

  // 如果已有记录，加载数据
  const existing = getExistingRecord(plan.id);
  if (existing) {
    formData.value = {
      amount: existing.amount,
      reflection: existing.reflection,
      mood: existing.mood,
    };
  } else {
    // 重置表单
    formData.value = {
      amount: 0,
      reflection: "",
      mood: 3,
    };
  }
};

// 保存记录
const saveRecord = async () => {
  const currentPlan = isDirectRecord.value
    ? directPlan.value
    : selectedPlan.value;

  if (!currentPlan) {
    message.error(
      isDirectRecord.value ? "计划信息错误" : "请先选择一个修行计划"
    );
    return;
  }

  if (formData.value.amount <= 0) {
    message.error("请输入有效的完成数量");
    return;
  }

  try {
    // 模拟保存逻辑
    const recordData: Record = {
      id: `r_${Date.now()}`,
      planId: currentPlan.id,
      date: recordDate.value,
      amount: formData.value.amount,
      completed: formData.value.amount >= currentPlan.targetAmount,
      reflection: formData.value.reflection,
      mood: formData.value.mood as 1 | 2 | 3 | 4 | 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log("保存记录:", recordData);

    message.success("修行记录已保存");
    router.push({ name: "Records" });
  } catch (error) {
    message.error("保存失败，请重试");
  }
};

// 返回上一页
const goBack = () => {
  // 记录详情主要从记录页面进入
  router.push({ name: "Records" });
};

// 获取心情标签
const getMoodLabel = (mood: number) => {
  const labels = ["很糟糕", "不太好", "一般", "不错", "很棒"];
  return labels[mood - 1] || "一般";
};

// 获取心情表情
const getMoodEmoji = (mood: number) => {
  const emojis = ["😢", "😕", "😐", "😊", "😄"];
  return emojis[mood - 1] || "😐";
};

onMounted(() => {
  // 如果是直接记录模式，设置选中的计划
  if (isDirectRecord.value && directPlan.value) {
    selectedPlan.value = directPlan.value;
  }
  // 如果只有一个计划，自动选中
  else if (todayPlans.value.length === 1) {
    selectPlan(todayPlans.value[0]);
  }
});
</script>

<template>
  <div class="record-detail-container">
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

        <n-space vertical size="small" align="center">
          <n-text strong style="font-size: 18px; color: white">
            修行记录
          </n-text>
          <n-time
            :time="recordDate"
            format="yyyy年MM月dd日"
            style="color: rgba(255, 255, 255, 0.8); font-size: 12px"
          />
        </n-space>

        <div style="width: 40px"></div>
      </n-space>
    </div>

    <!-- 当前计划信息 -->
    <n-card class="plan-info-card" :bordered="false">
      <n-space vertical size="medium">
        <n-space align="center">
          <n-icon size="18" color="#18a058">
            <CalendarOutline />
          </n-icon>
          <n-text strong>
            {{ isDirectRecord ? "修行计划" : "选择修行计划" }}
          </n-text>
        </n-space>

        <!-- 直接记录模式：显示当前计划信息 -->
        <div v-if="isDirectRecord && directPlan">
          <n-card embedded class="current-plan-card">
            <n-thing>
              <template #avatar>
                <n-icon size="24" color="#18a058">
                  <CheckmarkCircleOutline />
                </n-icon>
              </template>

              <template #header>
                <n-space justify="space-between" align="center">
                  <n-text strong style="font-size: 16px">{{
                    directPlan.title
                  }}</n-text>
                  <n-tag type="primary" size="small">
                    目标: {{ directPlan.targetAmount }}{{ directPlan.unit }}
                  </n-tag>
                </n-space>
              </template>

              <template #description>
                <n-text depth="3" style="font-size: 13px">
                  {{ directPlan.dailyTarget || "正在为此计划记录修行数据" }}
                </n-text>
              </template>
            </n-thing>
          </n-card>
        </div>

        <!-- 选择模式：显示计划列表 -->
        <div v-else>
          <n-list>
            <n-list-item
              v-for="plan in todayPlans"
              :key="plan.id"
              class="plan-item"
              :class="{ selected: selectedPlan?.id === plan.id }"
              @click="selectPlan(plan)"
            >
              <n-thing>
                <template #avatar>
                  <n-icon
                    size="20"
                    :color="selectedPlan?.id === plan.id ? '#18a058' : '#666'"
                  >
                    <CheckmarkCircleOutline v-if="hasExistingRecord(plan.id)" />
                    <TimeOutline v-else />
                  </n-icon>
                </template>

                <template #header>
                  <n-space justify="space-between" align="center">
                    <n-text>{{ plan.title }}</n-text>
                    <n-tag
                      v-if="hasExistingRecord(plan.id)"
                      type="success"
                      size="small"
                    >
                      已记录
                    </n-tag>
                  </n-space>
                </template>

                <template #description>
                  <n-text depth="3" style="font-size: 12px">
                    {{ plan.dailyTarget }}
                  </n-text>
                </template>
              </n-thing>
            </n-list-item>
          </n-list>
        </div>
      </n-space>
    </n-card>

    <!-- 记录表单 -->
    <n-card
      v-if="selectedPlan || isDirectRecord"
      class="form-card"
      :bordered="false"
    >
      <n-space vertical size="medium">
        <n-space align="center">
          <n-icon size="18" color="#f0a020">
            <SaveOutline />
          </n-icon>
          <n-text strong>记录详情</n-text>
        </n-space>

        <n-form>
          <!-- 完成数量 -->
          <n-form-item label="完成数量">
            <n-space align="center" size="medium" style="width: 100%">
              <n-input-number
                v-model:value="formData.amount"
                :min="0"
                style="flex: 1"
              >
                <template #suffix>{{ currentPlan?.unit || "次" }}</template>
              </n-input-number>

              <n-text depth="3" style="font-size: 12px">
                / {{ currentPlan?.targetAmount || 1 }}
                {{ currentPlan?.unit || "次" }}
              </n-text>
            </n-space>
          </n-form-item>

          <!-- 心情评分 -->
          <n-form-item label="心情评分">
            <n-space vertical size="small" style="width: 100%">
              <n-rate
                v-model:value="formData.mood"
                :count="5"
                size="large"
                allow-half
              />
              <n-space align="center" size="small">
                <span style="font-size: 20px">{{
                  getMoodEmoji(formData.mood)
                }}</span>
                <n-text depth="3" style="font-size: 12px">
                  {{ getMoodLabel(formData.mood) }}
                </n-text>
              </n-space>
            </n-space>
          </n-form-item>

          <!-- 感想反思 -->
          <n-form-item label="感想反思">
            <n-input
              v-model:value="formData.reflection"
              type="textarea"
              placeholder="记录你的修行感悟、遇到的困难或收获..."
              :rows="4"
              maxlength="500"
              show-count
            />
          </n-form-item>
        </n-form>

        <!-- 保存按钮 -->
        <n-button type="primary" size="large" block @click="saveRecord">
          <template #icon>
            <n-icon>
              <SaveOutline />
            </n-icon>
          </template>
          保存记录
        </n-button>
      </n-space>
    </n-card>

    <!-- 选择提示 (仅在非直接记录模式且未选择计划时显示) -->
    <n-card v-else-if="!isDirectRecord" class="empty-card" :bordered="false">
      <n-space vertical size="medium" align="center">
        <n-icon size="48" color="#d0d0d0">
          <CalendarOutline />
        </n-icon>
        <n-text depth="3">请选择要记录的修行计划</n-text>
      </n-space>
    </n-card>
  </div>
</template>

<style scoped>
.record-detail-container {
  padding: 0 16px 80px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.page-header {
  padding: 20px 0;
  background: transparent;
}

.plan-info-card,
.form-card,
.empty-card {
  margin-bottom: 16px;
  border-radius: 12px;
}

.current-plan-card {
  border: 2px solid var(--n-primary-color);
  border-radius: 8px;
  background: rgba(24, 160, 88, 0.05);
}

.plan-item {
  border-radius: 8px;
  padding: 12px;
  margin: 4px 0;
  transition: all 0.2s ease;
  cursor: pointer;
  border: 2px solid transparent;
}

.plan-item:hover {
  background-color: var(--n-button-color-hover);
}

.plan-item.selected {
  background-color: var(--n-primary-color-suppl);
  border-color: var(--n-primary-color);
}

.empty-card {
  padding: 40px 20px;
  text-align: center;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .record-detail-container {
    padding: 0 12px 80px 12px;
  }

  .page-header {
    padding: 16px 0;
  }
}
</style>
