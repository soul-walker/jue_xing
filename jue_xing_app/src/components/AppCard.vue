<template>
  <n-card
    :bordered="false"
    class="app-card"
    :class="[`app-card--${variant}`, { 'app-card--hoverable': hoverable }]"
    @click="handleClick"
  >
    <!-- 卡片标题 -->
    <div v-if="title || $slots.header" class="app-card__header">
      <slot name="header">
        <div class="app-card__title-wrapper">
          <n-icon
            v-if="icon"
            size="18"
            :color="iconColor"
            class="app-card__icon"
          >
            <component :is="icon" />
          </n-icon>
          <h3 class="app-card__title">{{ title }}</h3>
        </div>
        <div v-if="$slots.extra" class="app-card__extra">
          <slot name="extra" />
        </div>
      </slot>
    </div>

    <!-- 卡片内容 -->
    <div
      class="app-card__content"
      :class="{ 'app-card__content--no-header': !title && !$slots.header }"
    >
      <slot />
    </div>

    <!-- 卡片底部 -->
    <div v-if="$slots.footer" class="app-card__footer">
      <slot name="footer" />
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { NCard, NIcon } from "naive-ui";

interface Props {
  title?: string;
  icon?: any;
  iconColor?: string;
  variant?: "default" | "primary" | "accent";
  hoverable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: "",
  iconColor: "var(--app-color-primary)",
  variant: "default",
  hoverable: false,
});

const emit = defineEmits<{
  click: [MouseEvent];
}>();

const handleClick = (event: MouseEvent) => {
  if (props.hoverable) {
    emit("click", event);
  }
};
</script>

<style scoped>
.app-card {
  margin-bottom: var(--app-spacing-md);
  border-radius: var(--app-radius-card);
  box-shadow: var(--app-shadow-card);
  overflow: hidden;
}

.app-card--primary {
  border-left: 4px solid var(--app-color-primary);
}

.app-card--accent {
  border-left: 4px solid var(--app-color-accent);
}

.app-card--hoverable {
  cursor: pointer;
  transition: all 0.2s ease;
}

.app-card--hoverable:hover {
  transform: translateY(-2px);
  box-shadow: var(--app-shadow-floating);
}

.app-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--app-spacing-md);
  padding-bottom: var(--app-spacing-sm);
  border-bottom: 1px solid #f0f0f0;
}

.app-card__title-wrapper {
  display: flex;
  align-items: center;
  gap: var(--app-spacing-sm);
}

.app-card__icon {
  flex-shrink: 0;
}

.app-card__title {
  font-size: 16px;
  font-weight: 600;
  color: var(--app-text-primary);
  margin: 0;
}

.app-card__extra {
  flex-shrink: 0;
}

.app-card__content {
  color: var(--app-text-primary);
}

.app-card__content--no-header {
  /* 当没有头部时的样式调整 */
}

.app-card__footer {
  margin-top: var(--app-spacing-md);
  padding-top: var(--app-spacing-sm);
  border-top: 1px solid #f0f0f0;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .app-card {
    margin-bottom: 12px;
  }

  .app-card__title {
    font-size: 15px;
  }

  .app-card__header {
    margin-bottom: 12px;
  }
}
</style>
