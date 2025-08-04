<template>
  <div class="create-goal">
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
        <span class="page-title">创建目标</span>
        <n-button
          text
          @click="saveGoal"
          class="save-button"
          :disabled="!isFormValid"
        >
          <template #icon>
            <n-icon size="20">
              <CheckmarkOutline />
            </n-icon>
          </template>
        </n-button>
      </div>
    </n-card>

    <div class="form-content">
      <n-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-placement="top"
      >
        <!-- 目标标题 -->
        <n-form-item label="目标标题" path="title">
          <n-input
            v-model:value="formData.title"
            placeholder="请输入目标标题"
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
        <n-form-item label="目标类型" path="type">
          <n-select
            v-model:value="formData.type"
            :options="goalTypeOptions"
            placeholder="选择目标类型"
            size="large"
          />
        </n-form-item>

        <!-- 练习方式 -->
        <n-form-item label="练习方式" path="practiceType" v-if="formData.type">
          <n-select
            v-model:value="formData.practiceType"
            :options="getPracticeOptions(formData.type)"
            placeholder="选择具体练习方式"
            size="large"
          />
        </n-form-item>

        <!-- 时间设置 -->
        <n-card title="时间设置" :bordered="false" class="section-card">
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
          <n-form-item label="结束日期" path="endDate">
            <n-date-picker
              v-model:value="formData.endDate"
              type="date"
              placeholder="选择结束日期"
              size="large"
              style="width: 100%"
              :is-date-disabled="(ts: number) => ts < formData.startDate"
            />
          </n-form-item>

          <!-- 总天数显示 -->
          <div
            v-if="formData.startDate && formData.endDate"
            class="duration-info"
          >
            <n-icon size="16" color="#2080f0">
              <CalendarOutline />
            </n-icon>
            <span>总计 {{ calculateDays() }} 天</span>
          </div>
        </n-card>

        <!-- 提醒设置 -->
        <n-card title="提醒设置" :bordered="false" class="section-card">
          <n-form-item label="开启提醒">
            <n-switch v-model:value="formData.reminderEnabled" />
          </n-form-item>

          <div v-if="formData.reminderEnabled">
            <n-form-item label="提醒时间" path="reminderTime">
              <n-time-picker
                v-model:value="formData.reminderTime"
                placeholder="选择提醒时间"
                size="large"
                style="width: 100%"
              />
            </n-form-item>

            <n-form-item label="提醒方式">
              <n-checkbox-group v-model:value="formData.reminderMethods">
                <div class="reminder-methods">
                  <n-checkbox value="notification" label="应用通知" />
                  <n-checkbox value="sound" label="声音提醒" />
                  <n-checkbox value="vibration" label="振动提醒" />
                </div>
              </n-checkbox-group>
            </n-form-item>
          </div>
        </n-card>

        <!-- 目标设置 -->
        <n-card title="目标设置" :bordered="false" class="section-card">
          <!-- 每日目标时长 -->
          <n-form-item label="每日目标时长（分钟）" path="dailyTargetMinutes">
            <n-input-number
              v-model:value="formData.dailyTargetMinutes"
              :min="1"
              :max="120"
              placeholder="输入每日目标时长"
              size="large"
              style="width: 100%"
            />
          </n-form-item>

          <!-- 优先级 -->
          <n-form-item label="优先级" path="priority">
            <n-radio-group v-model:value="formData.priority">
              <div class="priority-options">
                <n-radio value="low">
                  <div class="priority-item">
                    <n-icon size="20" color="#909399">
                      <RemoveOutline />
                    </n-icon>
                    <span>低</span>
                  </div>
                </n-radio>
                <n-radio value="medium">
                  <div class="priority-item">
                    <n-icon size="20" color="#f0a020">
                      <RemoveOutline />
                    </n-icon>
                    <span>中</span>
                  </div>
                </n-radio>
                <n-radio value="high">
                  <div class="priority-item">
                    <n-icon size="20" color="#e74c3c">
                      <RemoveOutline />
                    </n-icon>
                    <span>高</span>
                  </div>
                </n-radio>
              </div>
            </n-radio-group>
          </n-form-item>

          <!-- 是否公开 -->
          <n-form-item label="目标可见性">
            <n-radio-group v-model:value="formData.isPublic">
              <div class="visibility-options">
                <n-radio :value="false">
                  <div class="visibility-item">
                    <n-icon size="20" color="#666">
                      <LockClosedOutline />
                    </n-icon>
                    <div>
                      <div class="option-title">私人目标</div>
                      <div class="option-desc">只有你能看到</div>
                    </div>
                  </div>
                </n-radio>
                <n-radio :value="true">
                  <div class="visibility-item">
                    <n-icon size="20" color="#18a058">
                      <PeopleOutline />
                    </n-icon>
                    <div>
                      <div class="option-title">公开目标</div>
                      <div class="option-desc">他人可以看到并激励</div>
                    </div>
                  </div>
                </n-radio>
              </div>
            </n-radio-group>
          </n-form-item>
        </n-card>
      </n-form>

      <!-- 保存按钮 -->
      <div class="action-buttons">
        <n-button
          type="primary"
          size="large"
          @click="saveGoal"
          :loading="saving"
          :disabled="!isFormValid"
          block
        >
          创建目标
        </n-button>

        <n-button size="large" @click="goBack" block> 取消 </n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useMessage } from "naive-ui";
import {
  ArrowBack,
  CheckmarkOutline,
  CalendarOutline,
  RemoveOutline,
  LockClosedOutline,
  PeopleOutline,
} from "@vicons/ionicons5";

interface GoalFormData {
  title: string;
  description: string;
  type: string;
  practiceType: string;
  startDate: number;
  endDate: number;
  reminderEnabled: boolean;
  reminderTime: number;
  reminderMethods: string[];
  dailyTargetMinutes: number;
  priority: "low" | "medium" | "high";
  isPublic: boolean;
}

const router = useRouter();
const message = useMessage();
const formRef = ref<any>(null);
const saving = ref(false);

// 表单数据
const formData = ref<GoalFormData>({
  title: "",
  description: "",
  type: "",
  practiceType: "",
  startDate: Date.now(),
  endDate: Date.now() + 30 * 24 * 60 * 60 * 1000, // 默认30天后
  reminderEnabled: true,
  reminderTime: Date.now(),
  reminderMethods: ["notification"],
  dailyTargetMinutes: 10,
  priority: "medium",
  isPublic: false,
});

// 表单验证规则
const rules = {
  title: {
    required: true,
    message: "请输入目标标题",
    trigger: ["input", "blur"],
  },
  description: {
    required: true,
    message: "请输入目标描述",
    trigger: ["input", "blur"],
  },
  type: {
    required: true,
    message: "请选择目标类型",
    trigger: ["change", "blur"],
  },
  practiceType: {
    required: true,
    message: "请选择练习方式",
    trigger: ["change", "blur"],
  },
  startDate: {
    required: true,
    type: "number",
    message: "请选择开始日期",
    trigger: ["change", "blur"],
  },
  endDate: {
    required: true,
    type: "number",
    message: "请选择结束日期",
    trigger: ["change", "blur"],
  },
  dailyTargetMinutes: {
    required: true,
    type: "number",
    message: "请输入每日目标时长",
    trigger: ["input", "blur"],
  },
  reminderTime: {
    required: false,
    type: "number",
    message: "请选择提醒时间",
    trigger: ["change", "blur"],
  },
};

// 目标类型选项
const goalTypeOptions = [
  { label: "冥想练习", value: "meditation" },
  { label: "正念练习", value: "mindfulness" },
  { label: "呼吸练习", value: "breathing" },
  { label: "瑜伽练习", value: "yoga" },
  { label: "读经典", value: "reading" },
  { label: "禅修", value: "zen" },
];

// 获取练习方式选项
const getPracticeOptions = (type: string) => {
  const options: Record<string, { label: string; value: string }[]> = {
    meditation: [
      { label: "专注冥想", value: "concentration" },
      { label: "观想冥想", value: "visualization" },
      { label: "慈心冥想", value: "loving-kindness" },
      { label: "行走冥想", value: "walking" },
    ],
    mindfulness: [
      { label: "正念呼吸", value: "mindful-breathing" },
      { label: "身体扫描", value: "body-scan" },
      { label: "正念饮食", value: "mindful-eating" },
      { label: "日常正念", value: "daily-mindfulness" },
    ],
    breathing: [
      { label: "数息法", value: "counting-breath" },
      { label: "深呼吸", value: "deep-breathing" },
      { label: "腹式呼吸", value: "abdominal-breathing" },
      { label: "交替鼻孔呼吸", value: "alternate-nostril" },
    ],
    yoga: [
      { label: "哈他瑜伽", value: "hatha" },
      { label: "阴瑜伽", value: "yin" },
      { label: "流瑜伽", value: "vinyasa" },
      { label: "恢复瑜伽", value: "restorative" },
    ],
    reading: [
      { label: "佛经阅读", value: "buddhist-texts" },
      { label: "禅宗经典", value: "zen-classics" },
      { label: "现代灵性书籍", value: "modern-spiritual" },
      { label: "冥想指导书", value: "meditation-guides" },
    ],
    zen: [
      { label: "坐禅", value: "zazen" },
      { label: "行禅", value: "walking-zen" },
      { label: "工作禅", value: "work-zen" },
      { label: "茶禅", value: "tea-zen" },
    ],
  };

  return options[type] || [];
};

// 计算表单是否有效
const isFormValid = computed(() => {
  return (
    formData.value.title.trim() !== "" &&
    formData.value.description.trim() !== "" &&
    formData.value.type !== "" &&
    formData.value.practiceType !== "" &&
    formData.value.startDate > 0 &&
    formData.value.endDate > formData.value.startDate &&
    formData.value.dailyTargetMinutes > 0
  );
});

// 计算总天数
const calculateDays = () => {
  if (!formData.value.startDate || !formData.value.endDate) return 0;

  const diffTime = formData.value.endDate - formData.value.startDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// 返回上一页
const goBack = () => {
  router.back();
};

// 保存目标
const saveGoal = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    saving.value = true;

    // 模拟保存过程
    await new Promise((resolve) => setTimeout(resolve, 1000));

    message.success("目标创建成功！");
    router.push("/goals");
  } catch (error) {
    message.error("请检查表单信息");
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
.create-goal {
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
.save-button {
  padding: 8px;
}

.form-content {
  padding: 16px;
  padding-bottom: 100px;
}

.section-card {
  margin-bottom: 24px;
  border-radius: 12px;
}

.duration-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background-color: #f0f9ff;
  border-radius: 8px;
  font-size: 14px;
  color: #2080f0;
  margin-top: 16px;
}

.reminder-methods {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.priority-options {
  display: flex;
  gap: 24px;
}

.priority-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.visibility-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.visibility-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.option-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.option-desc {
  font-size: 12px;
  color: #666;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 32px;
}
</style>
