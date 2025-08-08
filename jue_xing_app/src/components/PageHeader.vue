<template>
  <div class="page-header">
    <n-card :bordered="false" class="header-card">
      <div class="header-content">
        <!-- 返回按钮 -->
        <n-button v-if="showBack" text @click="handleBack" class="back-button">
          <template #icon>
            <n-icon size="20">
              <ArrowBack />
            </n-icon>
          </template>
        </n-button>
        <div v-else class="header-spacer"></div>

        <!-- 标题 -->
        <span class="page-title">{{ title }}</span>

        <!-- 操作按钮 -->
        <n-button
          v-if="showAction"
          text
          @click="handleAction"
          class="action-button"
        >
          <template #icon>
            <n-icon size="20">
              <component :is="actionIconComponent" />
            </n-icon>
          </template>
        </n-button>
        <div v-else class="header-spacer"></div>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { NCard, NButton, NIcon } from "naive-ui";
import {
  ArrowBack,
  CreateOutline,
  CheckmarkOutline,
  SettingsOutline,
  AddOutline,
} from "@vicons/ionicons5";

interface Props {
  title: string;
  showBack?: boolean;
  showAction?: boolean;
  actionIcon?: string;
}

const props = withDefaults(defineProps<Props>(), {
  showBack: true,
  showAction: false,
  actionIcon: "create",
});

const emit = defineEmits<{
  back: [];
  action: [];
}>();

// 图标映射
const iconMap = {
  create: CreateOutline,
  check: CheckmarkOutline,
  settings: SettingsOutline,
  add: AddOutline,
};

const actionIconComponent = computed(() => {
  return iconMap[props.actionIcon as keyof typeof iconMap] || CreateOutline;
});

const handleBack = () => {
  emit("back");
};

const handleAction = () => {
  emit("action");
};
</script>

<style scoped>
.page-header {
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-card {
  box-shadow: var(--app-shadow-header);
  border-radius: 0 0 var(--app-radius-card) var(--app-radius-card);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--app-spacing-sm) 0;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--app-text-primary);
  text-align: center;
  flex: 1;
}

.back-button,
.action-button {
  padding: var(--app-spacing-sm);
  min-width: 40px;
}

.header-spacer {
  width: 40px;
  height: 40px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .page-title {
    font-size: 16px;
  }

  .back-button,
  .action-button {
    padding: 6px;
    min-width: 36px;
  }

  .header-spacer {
    width: 36px;
    height: 36px;
  }
}
</style>
