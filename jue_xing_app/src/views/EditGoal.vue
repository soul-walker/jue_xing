<template>
  <PageLayout
    title="编辑目标"
    :show-back="true"
    :show-action="true"
    action-icon="check"
    @back="goBack"
    @action="saveGoal"
  >
    <n-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-placement="top"
    >
      <!-- 基本信息 -->
      <AppCard title="基本信息" variant="primary">
        <!-- 目标标题 -->
        <n-form-item label="目标名称" path="title">
          <n-input
            v-model:value="formData.title"
            placeholder="请输入目标名称"
            maxlength="50"
            show-count
            size="large"
          />
        </n-form-item>

        <!-- 目标描述 -->
        <n-form-item label="目标描述" path="description">
          <n-input
            v-model:value="formData.description"
            type="textarea"
            placeholder="详细描述你的目标..."
            :rows="4"
            maxlength="200"
            show-count
            size="large"
          />
        </n-form-item>

        <!-- 目标类型 -->
        <n-form-item label="目标类型" path="goalType">
          <n-radio-group v-model:value="formData.goalType">
            <div class="goal-type-options">
              <n-radio value="lifelong">
                <div class="type-item">
                  <div class="type-title">终身目标</div>
                  <div class="type-desc">长期的人生追求</div>
                </div>
              </n-radio>
              <n-radio value="long-term">
                <div class="type-item">
                  <div class="type-title">长期目标</div>
                  <div class="type-desc">1年以上的目标</div>
                </div>
              </n-radio>
              <n-radio value="short-term">
                <div class="type-item">
                  <div class="type-title">短期目标</div>
                  <div class="type-desc">1年内的目标</div>
                </div>
              </n-radio>
            </div>
          </n-radio-group>
        </n-form-item>
      </AppCard>

      <!-- 时间设置 -->
      <AppCard title="时间设置" icon="CalendarOutline">
        <!-- 是否设置截止日期 -->
        <n-form-item label="设置截止日期">
          <n-switch v-model:value="formData.hasDeadline" />
          <div
            style="
              margin-top: 8px;
              font-size: 12px;
              color: var(--app-text-secondary);
            "
          >
            {{
              formData.hasDeadline
                ? "设置明确的截止时间"
                : "没有明确截止时间的长期目标"
            }}
          </div>
        </n-form-item>

        <div v-if="formData.hasDeadline">
          <!-- 开始日期 -->
          <n-form-item label="开始日期" path="startDate">
            <n-date-picker
              v-model:value="formData.startDate"
              type="date"
              placeholder="选择开始日期"
              size="large"
              style="width: 100%"
            />
          </n-form-item>

          <!-- 结束日期 -->
          <n-form-item label="截止日期" path="endDate">
            <n-date-picker
              v-model:value="formData.endDate"
              type="date"
              placeholder="选择截止日期"
              size="large"
              style="width: 100%"
              :is-date-disabled="(ts: number) => !!(formData.startDate && ts < formData.startDate)"
            />
          </n-form-item>

          <!-- 总天数显示 -->
          <div
            v-if="formData.startDate && formData.endDate"
            class="duration-info"
          >
            <n-icon size="16" color="var(--app-color-secondary)">
              <CalendarOutline />
            </n-icon>
            <span>总计 {{ calculateDays() }} 天</span>
          </div>
        </div>
      </AppCard>

      <!-- 修行计划 -->
      <AppCard title="修行计划" icon="RemoveOutline" variant="accent">
        <div class="plans-section">
          <div class="plans-header">
            <div
              style="
                font-size: 14px;
                color: var(--app-text-secondary);
                margin-bottom: 16px;
              "
            >
              为这个目标创建具体的修行计划，每个计划都有明确的日常任务和目标数量
            </div>
          </div>

          <div
            v-for="(plan, index) in formData.plans"
            :key="index"
            class="plan-item"
          >
            <div class="plan-header">
              <span class="plan-title">计划 {{ index + 1 }}</span>
              <n-button
                v-if="formData.plans.length > 1"
                quaternary
                type="error"
                size="small"
                @click="removePlan(index)"
              >
                <template #icon>
                  <n-icon :component="RemoveOutline" />
                </template>
                删除
              </n-button>
            </div>

            <div class="plan-fields">
              <n-form-item
                :label="`计划${index + 1}名称`"
                :path="`plans[${index}].name`"
              >
                <n-input
                  v-model:value="plan.name"
                  placeholder="如：每日深蹲、晨间冥想等"
                  maxlength="50"
                  size="large"
                />
              </n-form-item>

              <n-form-item
                :label="`计划${index + 1}描述`"
                :path="`plans[${index}].description`"
              >
                <n-input
                  v-model:value="plan.description"
                  type="textarea"
                  placeholder="详细描述这个计划的内容和要求"
                  :rows="2"
                  maxlength="200"
                />
              </n-form-item>

              <div style="display: flex; gap: 12px">
                <n-form-item
                  label="目标数量"
                  :path="`plans[${index}].targetAmount`"
                  style="flex: 1"
                >
                  <n-input-number
                    v-model:value="plan.targetAmount"
                    placeholder="目标数量"
                    :min="1"
                    size="large"
                    style="width: 100%"
                  />
                </n-form-item>

                <n-form-item
                  label="单位"
                  :path="`plans[${index}].unit`"
                  style="flex: 1"
                >
                  <n-input
                    v-model:value="plan.unit"
                    placeholder="如：个、页、分钟"
                    maxlength="10"
                    size="large"
                  />
                </n-form-item>
              </div>
            </div>
          </div>

          <n-button
            type="primary"
            ghost
            @click="addPlan"
            style="width: 100%; margin-top: 16px"
            size="large"
          >
            <template #icon>
              <n-icon :component="CalendarOutline" />
            </template>
            添加计划
          </n-button>
        </div>
      </AppCard>
    </n-form>

    <!-- 保存按钮 -->
    <AppCard>
      <div class="action-buttons">
        <n-button
          type="primary"
          size="large"
          @click="saveGoal"
          :loading="saving"
          :disabled="!isFormValid"
          block
        >
          保存修改
        </n-button>

        <n-button size="large" @click="goBack" block> 取消 </n-button>
      </div>
    </AppCard>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  useMessage,
  NForm,
  NFormItem,
  NInput,
  NDatePicker,
  NSwitch,
  NInputNumber,
  NRadioGroup,
  NRadio,
  NButton,
  NIcon,
} from "naive-ui";
import { CalendarOutline, RemoveOutline } from "@vicons/ionicons5";
import PageLayout from "../components/PageLayout.vue";
import AppCard from "../components/AppCard.vue";

interface PlanFormData {
  name: string;
  description: string;
  targetAmount: number;
  unit: string;
}

interface GoalFormData {
  title: string | null;
  description: string | null;
  goalType: "lifelong" | "long-term" | "short-term";
  hasDeadline: boolean;
  startDate: number | null;
  endDate: number | null;
  plans: PlanFormData[];
}

const router = useRouter();
const route = useRoute();
const message = useMessage();
const formRef = ref<any>(null);
const saving = ref(false);

// 获取目标ID
const goalId = computed(() => route.params.id as string);

// 表单数据
const formData = ref<GoalFormData>({
  title: "",
  description: "",
  goalType: "short-term",
  hasDeadline: false,
  startDate: null,
  endDate: null,
  plans: [
    {
      name: "",
      description: "",
      targetAmount: 1,
      unit: "",
    },
  ],
});

// 表单验证规则
const rules = {
  title: {
    required: true,
    message: "请输入目标名称",
    trigger: ["input", "blur"],
  },
  description: {
    required: true,
    message: "请输入目标描述",
    trigger: ["input", "blur"],
  },
  goalType: {
    required: true,
    message: "请选择目标类型",
    trigger: ["change", "blur"],
  },
};

// 添加计划
const addPlan = () => {
  formData.value.plans.push({
    name: "",
    description: "",
    targetAmount: 1,
    unit: "",
  });
};

// 删除计划
const removePlan = (index: number) => {
  if (formData.value.plans.length > 1) {
    formData.value.plans.splice(index, 1);
  }
};

// 计算表单是否有效
const isFormValid = computed(() => {
  const title = formData.value.title;
  const description = formData.value.description;

  // 基本信息验证
  const basicValid =
    title != null &&
    title.trim() !== "" &&
    description != null &&
    description.trim() !== "";

  // 时间验证（如果设置了截止日期）
  const timeValid =
    !formData.value.hasDeadline ||
    (formData.value.startDate != null &&
      formData.value.endDate != null &&
      formData.value.endDate > formData.value.startDate);

  // 计划验证（至少有一个有效的计划）
  const plansValid = formData.value.plans.some(
    (plan) =>
      plan.name.trim() !== "" &&
      plan.description.trim() !== "" &&
      plan.targetAmount > 0 &&
      plan.unit.trim() !== ""
  );

  return basicValid && timeValid && plansValid;
});

// 计算总天数
const calculateDays = () => {
  if (!formData.value.startDate || !formData.value.endDate) return 0;

  const diffTime = formData.value.endDate - formData.value.startDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// 加载目标数据
const loadGoalData = async () => {
  try {
    // 这里应该从API获取目标数据，目前用模拟数据
    // 根据goalId获取目标详情

    // 模拟数据
    const mockGoal = {
      id: goalId.value,
      title: "保持身体健康",
      description: "通过日常运动保持身体力量、协调性和柔韧性",
      goalType: "long-term" as const,
      hasDeadline: true,
      startDate: Date.now(),
      endDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
      plans: [
        {
          name: "每日深蹲",
          description: "每天完成深蹲运动，增强腿部力量",
          targetAmount: 100,
          unit: "个",
        },
        {
          name: "晨间冥想",
          description: "每天早晨进行冥想练习，平静心灵",
          targetAmount: 20,
          unit: "分钟",
        },
      ],
    };

    // 填充表单数据
    formData.value = {
      title: mockGoal.title,
      description: mockGoal.description,
      goalType: mockGoal.goalType,
      hasDeadline: mockGoal.hasDeadline,
      startDate: mockGoal.startDate,
      endDate: mockGoal.endDate,
      plans: mockGoal.plans,
    };
  } catch (error) {
    message.error("加载目标数据失败");
    router.back();
  }
};

// 返回上一页
const goBack = () => {
  // 编辑目标通常从目标详情页进入，返回到目标详情页
  router.push({ name: "GoalDetail", params: { id: goalId.value } });
};

// 保存目标
const saveGoal = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    saving.value = true;

    // 模拟保存过程
    await new Promise((resolve) => setTimeout(resolve, 1000));

    message.success("目标修改成功！");
    router.push({ name: "GoalDetail", params: { id: goalId.value } });
  } catch (error) {
    message.error("请检查表单信息");
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  loadGoalData();
});
</script>

<style scoped>
.duration-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background-color: var(--app-background-light);
  border-radius: var(--app-border-radius);
  font-size: 14px;
  color: var(--app-color-secondary);
  margin-top: 16px;
}

.goal-type-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.type-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.type-title {
  font-weight: 600;
  color: var(--app-text-primary);
}

.type-desc {
  font-size: 12px;
  color: var(--app-text-secondary);
}

.plans-section {
  width: 100%;
}

.plan-item {
  border: 1px solid var(--app-border-color);
  border-radius: var(--app-border-radius);
  padding: 16px;
  margin-bottom: 16px;
  background-color: var(--app-background-light);
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.plan-title {
  font-weight: 600;
  color: var(--app-text-primary);
  font-size: 16px;
}

.plan-fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 32px;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .goal-type-options {
    gap: 12px;
  }

  .duration-info {
    font-size: 13px;
    padding: 10px;
  }

  .plan-item {
    padding: 12px;
  }

  .plan-header {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
}
</style>
