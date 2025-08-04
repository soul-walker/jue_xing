<template>
  <n-grid cols="2" x-gap="12" y-gap="12">
    <n-grid-item v-for="achievement in achievements" :key="achievement.id">
      <n-card
        :class="{
          'earned-achievement': achievement.earned,
          'locked-achievement': !achievement.earned,
        }"
        hoverable
        @click="showDetails(achievement)"
        style="cursor: pointer"
      >
        <n-space vertical align="center" size="small">
          <!-- 成就图标 -->
          <div class="achievement-icon" :class="{ earned: achievement.earned }">
            {{ achievement.icon }}
          </div>

          <!-- 成就名称 -->
          <n-text strong :class="{ 'earned-text': achievement.earned }">
            {{ achievement.name }}
          </n-text>

          <!-- 成就描述 -->
          <n-text depth="3" style="text-align: center; font-size: 12px">
            {{ achievement.description }}
          </n-text>

          <!-- 进度条 -->
          <n-progress
            v-if="!achievement.earned"
            :percentage="achievement.progress"
            :show-indicator="false"
            size="small"
            style="width: 100%"
          />

          <!-- 获得日期 -->
          <n-text v-if="achievement.earned" depth="3" style="font-size: 10px">
            {{ formatDate(achievement.earnedDate) }}
          </n-text>

          <!-- 进度文字 -->
          <n-text v-else depth="3" style="font-size: 10px">
            {{ achievement.progress }}% 完成
          </n-text>
        </n-space>
      </n-card>
    </n-grid-item>
  </n-grid>

  <!-- 成就详情弹窗 -->
  <n-modal v-model:show="showDetailModal" title="成就详情">
    <n-card
      v-if="selectedAchievement"
      style="width: 90%; max-width: 400px"
      :title="selectedAchievement.name"
      :bordered="false"
      size="huge"
    >
      <n-space vertical align="center" size="large">
        <div
          class="achievement-icon large"
          :class="{ earned: selectedAchievement.earned }"
        >
          {{ selectedAchievement.icon }}
        </div>

        <n-text>{{ selectedAchievement.description }}</n-text>

        <n-divider />

        <n-space vertical style="width: 100%">
          <n-text strong>解锁条件:</n-text>
          <n-text depth="2">{{ selectedAchievement.requirement }}</n-text>

          <n-text strong>当前进度:</n-text>
          <n-progress
            :percentage="selectedAchievement.progress"
            :status="selectedAchievement.earned ? 'success' : 'default'"
          />

          <n-text
            v-if="selectedAchievement.earned"
            strong
            style="color: #52c41a"
          >
            🎉 已获得！获得时间:
            {{ formatDate(selectedAchievement.earnedDate) }}
          </n-text>

          <n-text v-else depth="3">
            还需要 {{ 100 - selectedAchievement.progress }}% 即可解锁
          </n-text>
        </n-space>
      </n-space>

      <template #footer>
        <n-space justify="end">
          <n-button @click="showDetailModal = false">关闭</n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  NGrid,
  NGridItem,
  NCard,
  NSpace,
  NText,
  NProgress,
  NModal,
  NDivider,
  NButton,
} from "naive-ui";

// 定义props
defineProps<{
  achievements: Array<{
    id: number;
    name: string;
    description: string;
    category: string;
    icon: string;
    earned: boolean;
    earnedDate?: string;
    progress: number;
    requirement: string;
  }>;
}>();

// 弹窗控制
const showDetailModal = ref(false);
const selectedAchievement = ref<any>(null);

// 显示详情
const showDetails = (achievement: any) => {
  selectedAchievement.value = achievement;
  showDetailModal.value = true;
};

// 格式化日期
const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};
</script>

<style scoped>
.achievement-icon {
  font-size: 40px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f0f0f0;
  transition: all 0.3s ease;
}

.achievement-icon.large {
  font-size: 60px;
  width: 100px;
  height: 100px;
}

.achievement-icon.earned {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
}

.earned-achievement {
  border: 2px solid #52c41a;
  background: linear-gradient(135deg, #f6ffed, #ffffff);
}

.locked-achievement {
  border: 1px solid #d9d9d9;
  opacity: 0.8;
}

.earned-text {
  color: #52c41a;
}

.locked-achievement .achievement-icon {
  filter: grayscale(70%);
}
</style>
