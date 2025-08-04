<template>
  <div class="achievements-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <n-text strong style="font-size: 20px; color: white">我的成就</n-text>
      <n-space>
        <n-button
          type="primary"
          size="small"
          @click="viewReports"
          style="background: rgba(255, 255, 255, 0.2); border: none"
        >
          <template #icon>
            <n-icon><BarChartOutline /></n-icon>
          </template>
          报告
        </n-button>
        <n-button
          type="primary"
          size="small"
          @click="showSettings = true"
          style="background: rgba(255, 255, 255, 0.2); border: none"
        >
          <template #icon>
            <n-icon><SettingsOutline /></n-icon>
          </template>
          设置
        </n-button>
      </n-space>
    </div>

    <!-- 成就总览 -->
    <n-card class="overview-card" :bordered="false">
      <n-space vertical size="medium">
        <n-text strong>成就总览</n-text>
        <n-grid cols="3" :x-gap="12">
          <n-grid-item>
            <n-statistic
              label="已获得"
              :value="achievementStats.earned"
              suffix="个"
            />
          </n-grid-item>
          <n-grid-item>
            <n-statistic
              label="总数"
              :value="achievementStats.total"
              suffix="个"
            />
          </n-grid-item>
          <n-grid-item>
            <n-statistic
              label="完成度"
              :value="achievementStats.percentage"
              suffix="%"
            />
          </n-grid-item>
        </n-grid>
      </n-space>
    </n-card>

    <!-- 最新获得的成就 -->
    <n-card
      class="recent-card"
      :bordered="false"
      v-if="recentAchievements.length > 0"
    >
      <n-space vertical size="medium">
        <n-text strong>最新成就</n-text>
        <n-space vertical size="small">
          <div
            v-for="achievement in recentAchievements"
            :key="achievement.id"
            class="achievement-item recent"
          >
            <n-space align="center">
              <div class="achievement-icon earned">
                <n-icon size="24" color="#f0a020">
                  <TrophyOutline />
                </n-icon>
              </div>
              <n-space vertical size="small" style="flex: 1">
                <n-text strong>{{ achievement.name }}</n-text>
                <n-text depth="3" style="font-size: 12px">
                  {{ achievement.description }}
                </n-text>
                <n-text depth="3" style="font-size: 11px">
                  获得时间: {{ formatDate(achievement.earnedAt!) }}
                </n-text>
              </n-space>
            </n-space>
          </div>
        </n-space>
      </n-space>
    </n-card>

    <!-- 成就列表 -->
    <n-card class="achievements-card" :bordered="false">
      <n-space vertical size="medium">
        <n-space justify="space-between" align="center">
          <n-text strong>全部成就</n-text>
          <n-select
            v-model:value="filterCategory"
            :options="categoryOptions"
            style="width: 120px"
            size="small"
          />
        </n-space>

        <div class="achievements-grid">
          <div
            v-for="achievement in filteredAchievements"
            :key="achievement.id"
            class="achievement-item"
            :class="{ earned: achievement.earned }"
          >
            <div
              class="achievement-icon"
              :class="{ earned: achievement.earned }"
            >
              <n-icon
                size="24"
                :color="achievement.earned ? '#f0a020' : '#ccc'"
              >
                <component :is="achievement.icon" />
              </n-icon>
            </div>
            <n-space vertical size="small" style="flex: 1">
              <n-text strong :depth="achievement.earned ? 1 : 3">
                {{ achievement.name }}
              </n-text>
              <n-text depth="3" style="font-size: 12px">
                {{ achievement.description }}
              </n-text>
              <n-progress
                v-if="!achievement.earned && achievement.progress !== undefined"
                :percentage="achievement.progress"
                :stroke-width="4"
                :show-indicator="false"
              />
              <n-text
                v-if="achievement.earned && achievement.earnedAt"
                depth="3"
                style="font-size: 11px"
              >
                {{ formatDate(achievement.earnedAt) }}
              </n-text>
            </n-space>
          </div>
        </div>
      </n-space>
    </n-card>

    <!-- 设置模态框 -->
    <n-modal v-model:show="showSettings">
      <n-card
        style="width: 90%; max-width: 500px"
        title="设置"
        :bordered="false"
        closable
        @close="showSettings = false"
      >
        <n-space vertical size="large">
          <!-- AI 设置 -->
          <n-card title="AI 设置" :bordered="false" embedded>
            <n-space vertical size="medium">
              <n-form-item label="AI 模型类型">
                <n-select
                  v-model:value="settings.aiModel"
                  :options="aiModelOptions"
                  placeholder="选择 AI 模型"
                />
              </n-form-item>

              <n-form-item label="API Key">
                <n-input
                  v-model:value="settings.apiKey"
                  type="password"
                  placeholder="输入 API Key"
                  show-password-on="click"
                />
              </n-form-item>

              <n-form-item label="AI 建议">
                <n-switch v-model:value="settings.aiSuggestions" />
                <n-text depth="3" style="margin-left: 8px; font-size: 12px">
                  启用 AI 个性化修行建议
                </n-text>
              </n-form-item>
            </n-space>
          </n-card>

          <!-- 提醒设置 -->
          <n-card title="提醒设置" :bordered="false" embedded>
            <n-space vertical size="medium">
              <n-form-item label="修行提醒">
                <n-switch v-model:value="settings.practiceReminders" />
              </n-form-item>

              <n-form-item label="提醒时间" v-if="settings.practiceReminders">
                <n-time-picker
                  v-model:value="settings.reminderTime"
                  format="HH:mm"
                  placeholder="选择提醒时间"
                />
              </n-form-item>

              <n-form-item label="目标提醒">
                <n-switch v-model:value="settings.goalReminders" />
              </n-form-item>
            </n-space>
          </n-card>

          <!-- 系统设置 -->
          <n-card title="系统设置" :bordered="false" embedded>
            <n-space vertical size="medium">
              <n-form-item label="主题模式">
                <n-radio-group v-model:value="settings.theme">
                  <n-radio value="light">浅色</n-radio>
                  <n-radio value="dark">深色</n-radio>
                  <n-radio value="auto">跟随系统</n-radio>
                </n-radio-group>
              </n-form-item>

              <n-form-item label="数据备份">
                <n-space>
                  <n-button size="small" @click="exportData">导出数据</n-button>
                  <n-button size="small" @click="importData">导入数据</n-button>
                </n-space>
              </n-form-item>
            </n-space>
          </n-card>

          <!-- 保存按钮 -->
          <n-space justify="end">
            <n-button @click="showSettings = false">取消</n-button>
            <n-button type="primary" @click="saveSettings">保存设置</n-button>
          </n-space>
        </n-space>
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
  NIcon,
  NGrid,
  NGridItem,
  NStatistic,
  NButton,
  NModal,
  NFormItem,
  NSelect,
  NInput,
  NSwitch,
  NTimePicker,
  NRadioGroup,
  NRadio,
  NProgress,
  useMessage,
} from "naive-ui";
import {
  SettingsOutline,
  TrophyOutline,
  FlameOutline,
  CalendarOutline,
  StarOutline,
  MedalOutline,
  RibbonOutline,
  BarChartOutline,
} from "@vicons/ionicons5";

interface Achievement {
  id: number;
  name: string;
  description: string;
  category: string;
  icon: any;
  earned: boolean;
  earnedAt?: string;
  progress?: number;
}

const message = useMessage();
const router = useRouter();

// 设置相关
const showSettings = ref(false);
const settings = ref({
  aiModel: "gpt-3.5",
  apiKey: "",
  aiSuggestions: true,
  practiceReminders: true,
  reminderTime: null,
  goalReminders: true,
  theme: "auto",
});

// AI 模型选项
const aiModelOptions = [
  { label: "GPT-3.5", value: "gpt-3.5" },
  { label: "GPT-4", value: "gpt-4" },
  { label: "Claude", value: "claude" },
  { label: "Gemini", value: "gemini" },
];

// 筛选相关
const filterCategory = ref("all");
const categoryOptions = [
  { label: "全部", value: "all" },
  { label: "时长", value: "duration" },
  { label: "坚持", value: "consistency" },
  { label: "质量", value: "quality" },
  { label: "特殊", value: "special" },
];

// 成就数据
const achievements = ref<Achievement[]>([
  {
    id: 1,
    name: "初心者",
    description: "完成第一次修行",
    category: "special",
    icon: StarOutline,
    earned: true,
    earnedAt: "2025-07-15",
  },
  {
    id: 2,
    name: "坚持不懈",
    description: "连续修行7天",
    category: "consistency",
    icon: FlameOutline,
    earned: true,
    earnedAt: "2025-07-22",
  },
  {
    id: 3,
    name: "时间大师",
    description: "累计修行100小时",
    category: "duration",
    icon: CalendarOutline,
    earned: false,
    progress: 65,
  },
  {
    id: 4,
    name: "完美主义者",
    description: "连续10次5星评分",
    category: "quality",
    icon: TrophyOutline,
    earned: false,
    progress: 30,
  },
  {
    id: 5,
    name: "月度冠军",
    description: "单月修行30天",
    category: "consistency",
    icon: MedalOutline,
    earned: false,
    progress: 80,
  },
  {
    id: 6,
    name: "修行达人",
    description: "掌握5种修行类型",
    category: "special",
    icon: RibbonOutline,
    earned: true,
    earnedAt: "2025-08-01",
  },
]);

// 计算属性
const achievementStats = computed(() => {
  const total = achievements.value.length;
  const earned = achievements.value.filter((a) => a.earned).length;
  return {
    total,
    earned,
    percentage: total > 0 ? Math.round((earned / total) * 100) : 0,
  };
});

const recentAchievements = computed(() => {
  return achievements.value
    .filter((a) => a.earned && a.earnedAt)
    .sort(
      (a, b) =>
        new Date(b.earnedAt!).getTime() - new Date(a.earnedAt!).getTime()
    )
    .slice(0, 3);
});

const filteredAchievements = computed(() => {
  if (filterCategory.value === "all") {
    return achievements.value;
  }
  return achievements.value.filter((a) => a.category === filterCategory.value);
});

// 方法
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};

const saveSettings = () => {
  // 这里应该保存设置到本地存储或服务器
  message.success("设置保存成功");
  showSettings.value = false;
};

const exportData = () => {
  // 导出数据功能
  message.info("数据导出功能开发中...");
};

const importData = () => {
  // 导入数据功能
  message.info("数据导入功能开发中...");
};

const viewReports = () => {
  router.push("/reports");
};
</script>

<style scoped>
.achievements-container {
  padding: 16px;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  color: white;
}

.overview-card,
.recent-card,
.achievements-card {
  margin: 16px 0;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.achievements-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.achievement-item {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.02);
  transition: all 0.2s ease;
}

.achievement-item.earned {
  background: rgba(240, 160, 32, 0.1);
  border-left: 4px solid #f0a020;
}

.achievement-item.recent {
  background: linear-gradient(
    90deg,
    rgba(240, 160, 32, 0.1) 0%,
    rgba(240, 160, 32, 0.05) 100%
  );
  border-left: 4px solid #f0a020;
}

.achievement-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.05);
  margin-right: 12px;
  flex-shrink: 0;
}

.achievement-icon.earned {
  background: rgba(240, 160, 32, 0.2);
}
</style>
