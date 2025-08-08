<script setup lang="ts">
import { ref, computed, markRaw } from "vue";
import { useRouter } from "vue-router";
import {
  NCard,
  NButton,
  NIcon,
  NText,
  NSpace,
  NAvatar,
  NStatistic,
  NGrid,
  NGridItem,
  NList,
  NListItem,
  NThing,
  NTag,
  NSwitch,
  NProgress,
} from "naive-ui";
import {
  PersonOutline,
  SettingsOutline,
  TrendingUpOutline,
  TrophyOutline,
  BarChartOutline,
  MoonOutline,
  NotificationsOutline,
  KeyOutline,
} from "@vicons/ionicons5";
import type { Achievement, Statistics } from "../types";

const router = useRouter();

// 用户信息
const userProfile = ref({
  name: "修行者",
  avatar: "",
  joinDate: new Date("2025-01-01"),
  level: 5,
  experience: 2350,
  nextLevelExp: 3000,
});

// 统计数据
const statistics = ref<Statistics>({
  totalPracticeTime: 1250, // 分钟
  totalGoals: 12,
  completedGoals: 7,
  currentStreak: 15,
  longestStreak: 28,
  totalRecords: 156,
});

// 成就数据
const achievements = ref<Achievement[]>([
  {
    id: "1",
    title: "初心不改",
    description: "连续修行7天",
    icon: "🎯",
    category: "连续修行",
    unlockedAt: new Date("2025-01-08"),
    progress: 100,
    target: 7,
    current: 7,
  },
  {
    id: "2",
    title: "持之以恒",
    description: "连续修行30天",
    icon: "🔥",
    category: "连续修行",
    unlockedAt: new Date(),
    progress: 50,
    target: 30,
    current: 15,
  },
  {
    id: "3",
    title: "冥想大师",
    description: "累计冥想100小时",
    icon: "🧘",
    category: "冥想练习",
    unlockedAt: new Date(),
    progress: 78,
    target: 6000, // 分钟
    current: 4680,
  },
  {
    id: "4",
    title: "阅读爱好者",
    description: "完成5本书籍阅读",
    icon: "📚",
    category: "读书学习",
    unlockedAt: new Date(),
    progress: 40,
    target: 5,
    current: 2,
  },
]);

// 设置选项
const settingsOptions = ref([
  {
    id: "notifications",
    title: "修行提醒",
    description: "开启每日修行提醒通知",
    icon: markRaw(NotificationsOutline),
    value: true,
    type: "switch" as const,
  },
  {
    id: "theme",
    title: "深色模式",
    description: "切换应用主题外观",
    icon: markRaw(MoonOutline),
    value: false,
    type: "switch" as const,
  },
  {
    id: "ai-settings",
    title: "AI 设置",
    description: "配置AI模型和API密钥",
    icon: markRaw(KeyOutline),
    type: "navigation" as const,
    route: "Settings",
  },
  {
    id: "reports",
    title: "修行报告",
    description: "查看详细的修行分析报告",
    icon: markRaw(BarChartOutline),
    type: "navigation" as const,
    route: "Reports",
  },
]);

// 计算经验值进度
const experienceProgress = computed(() => {
  return Math.round(
    (userProfile.value.experience / userProfile.value.nextLevelExp) * 100
  );
});

// 计算修行天数
const practicesDays = computed(() => {
  const joinDate = userProfile.value.joinDate;
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - joinDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// 格式化修行时间
const formatPracticeTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}小时${mins}分钟`;
};

// 页面导航
const navigateToPage = (routeName: string) => {
  router.push({ name: routeName });
};

// 设置切换处理
const handleSettingToggle = (id: string, value: boolean) => {
  const setting = settingsOptions.value.find((s) => s.id === id);
  if (setting && setting.type === "switch") {
    setting.value = value;

    // 根据设置类型进行相应处理
    if (id === "theme") {
      // 切换主题
      const themeController = (window as any).__themeController;
      if (themeController) {
        themeController.switchTheme(value ? "dark" : "light");
      }
    } else if (id === "notifications") {
      // 处理通知设置
      console.log("通知设置已", value ? "开启" : "关闭");
    }
  }
};
</script>

<template>
  <div class="profile-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <n-text strong style="font-size: 20px; color: white">我的</n-text>
    </div>

    <!-- 用户信息卡片 -->
    <n-card class="profile-card" :bordered="false">
      <n-space vertical size="medium">
        <!-- 用户基本信息 -->
        <n-space align="center" size="medium">
          <n-avatar round size="large" style="background-color: #18a058">
            <n-icon size="24">
              <PersonOutline />
            </n-icon>
          </n-avatar>

          <n-space vertical size="small">
            <n-text strong style="font-size: 18px">{{
              userProfile.name
            }}</n-text>
            <n-space size="small">
              <n-tag type="primary" size="small"
                >Lv.{{ userProfile.level }}</n-tag
              >
              <n-text depth="3" style="font-size: 12px">
                修行第 {{ practicesDays }} 天
              </n-text>
            </n-space>
          </n-space>
        </n-space>

        <!-- 经验值进度 -->
        <n-space vertical size="small">
          <n-space justify="space-between">
            <n-text depth="2" style="font-size: 12px">修行经验</n-text>
            <n-text depth="2" style="font-size: 12px">
              {{ userProfile.experience }}/{{ userProfile.nextLevelExp }}
            </n-text>
          </n-space>
          <n-progress
            :percentage="experienceProgress"
            :stroke-width="6"
            status="success"
            :show-indicator="false"
          />
        </n-space>
      </n-space>
    </n-card>

    <!-- 统计数据 -->
    <n-card class="statistics-card" :bordered="false">
      <n-space vertical size="medium">
        <n-space align="center">
          <n-icon size="18" color="#18a058">
            <TrendingUpOutline />
          </n-icon>
          <n-text strong>修行数据</n-text>
        </n-space>

        <n-grid cols="2" :x-gap="12" :y-gap="16">
          <n-grid-item>
            <n-statistic
              label="总修行时间"
              :value="formatPracticeTime(statistics.totalPracticeTime)"
            />
          </n-grid-item>
          <n-grid-item>
            <n-statistic
              label="完成目标"
              :value="statistics.completedGoals"
              suffix="个"
            />
          </n-grid-item>
          <n-grid-item>
            <n-statistic
              label="当前连续"
              :value="statistics.currentStreak"
              suffix="天"
            />
          </n-grid-item>
          <n-grid-item>
            <n-statistic
              label="最长连续"
              :value="statistics.longestStreak"
              suffix="天"
            />
          </n-grid-item>
          <n-grid-item>
            <n-statistic
              label="修行记录"
              :value="statistics.totalRecords"
              suffix="条"
            />
          </n-grid-item>
          <n-grid-item>
            <n-statistic
              label="修行目标"
              :value="statistics.totalGoals"
              suffix="个"
            />
          </n-grid-item>
        </n-grid>
      </n-space>
    </n-card>

    <!-- 成就展示 -->
    <n-card class="achievements-card" :bordered="false">
      <n-space vertical size="medium">
        <n-space justify="space-between" align="center">
          <n-space align="center">
            <n-icon size="18" color="#f0a020">
              <TrophyOutline />
            </n-icon>
            <n-text strong>最近成就</n-text>
          </n-space>
          <n-button text size="small" @click="navigateToPage('Achievements')">
            查看全部
          </n-button>
        </n-space>

        <n-list>
          <n-list-item
            v-for="achievement in achievements.slice(0, 3)"
            :key="achievement.id"
          >
            <n-thing>
              <template #avatar>
                <span style="font-size: 24px">{{ achievement.icon }}</span>
              </template>

              <template #header>
                <n-space justify="space-between" align="center">
                  <n-text>{{ achievement.title }}</n-text>
                  <n-text depth="3" style="font-size: 12px">
                    {{ Math.round(achievement.progress) }}%
                  </n-text>
                </n-space>
              </template>

              <template #description>
                <n-space vertical size="small">
                  <n-text depth="3" style="font-size: 12px">
                    {{ achievement.description }}
                  </n-text>
                  <n-progress
                    :percentage="achievement.progress"
                    :stroke-width="4"
                    :status="
                      achievement.progress === 100 ? 'success' : 'default'
                    "
                    :show-indicator="false"
                  />
                </n-space>
              </template>
            </n-thing>
          </n-list-item>
        </n-list>
      </n-space>
    </n-card>

    <!-- 设置菜单 -->
    <n-card class="settings-card" :bordered="false">
      <n-space vertical size="medium">
        <n-space align="center">
          <n-icon size="18" color="#666">
            <SettingsOutline />
          </n-icon>
          <n-text strong>设置</n-text>
        </n-space>

        <n-list>
          <n-list-item v-for="option in settingsOptions" :key="option.id">
            <n-thing>
              <template #avatar>
                <n-icon size="20" color="#666">
                  <component :is="option.icon" />
                </n-icon>
              </template>

              <template #header>
                <n-space justify="space-between" align="center">
                  <n-text>{{ option.title }}</n-text>

                  <!-- 开关类型 -->
                  <n-switch
                    v-if="option.type === 'switch'"
                    :value="option.value"
                    @update:value="
                      (value) => handleSettingToggle(option.id, value)
                    "
                    size="small"
                  />

                  <!-- 导航类型 -->
                  <n-button
                    v-else-if="option.type === 'navigation'"
                    text
                    size="small"
                    @click="navigateToPage(option.route!)"
                  >
                    进入
                  </n-button>
                </n-space>
              </template>

              <template #description>
                <n-text depth="3" style="font-size: 12px">
                  {{ option.description }}
                </n-text>
              </template>
            </n-thing>
          </n-list-item>
        </n-list>
      </n-space>
    </n-card>
  </div>
</template>

<style scoped>
.profile-container {
  padding: 0 16px 80px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.page-header {
  padding: 20px 0;
  background: transparent;
}

.profile-card,
.statistics-card,
.achievements-card,
.settings-card {
  margin-bottom: 16px;
  border-radius: 12px;
}

.profile-card {
  background: linear-gradient(135deg, #18a058 0%, #36ad6a 100%);
  color: white;
}

.profile-card .n-text {
  color: white;
}

.achievements-card .n-list-item,
.settings-card .n-list-item {
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-radius: 8px;
  padding: 8px;
  margin: 4px 0;
}

.achievements-card .n-list-item:hover,
.settings-card .n-list-item:hover {
  background-color: var(--n-button-color-hover);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .profile-container {
    padding: 0 12px 80px 12px;
  }

  .page-header {
    padding: 16px 0;
  }
}
</style>
