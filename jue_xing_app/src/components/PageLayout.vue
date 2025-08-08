<template>
  <div class="page-layout" :style="themeVars">
    <!-- 页面头部 -->
    <PageHeader
      v-if="showHeader"
      :title="title"
      :show-back="showBack"
      :show-action="showAction"
      :action-icon="actionIcon"
      @back="handleBack"
      @action="handleAction"
    />

    <!-- 页面内容 -->
    <div class="page-content" :class="{ 'has-header': showHeader }">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  defaultTheme,
  generateThemeVars,
  type AppTheme,
} from "../styles/theme";
import PageHeader from "./PageHeader.vue";

interface Props {
  title?: string;
  showHeader?: boolean;
  showBack?: boolean;
  showAction?: boolean;
  actionIcon?: string;
  backgroundColor?: "primary" | "secondary";
}

const props = withDefaults(defineProps<Props>(), {
  title: "",
  showHeader: true,
  showBack: true,
  showAction: false,
  actionIcon: "",
  backgroundColor: "primary",
});

const emit = defineEmits<{
  back: [];
  action: [];
}>();

const router = useRouter();

// 获取主题（可以从全局状态或context获取，这里先用默认主题）
const theme = inject<AppTheme>("appTheme", defaultTheme);

// 生成CSS变量
const themeVars = computed(() => generateThemeVars(theme));

// 事件处理
const handleBack = () => {
  emit("back");
  router.back();
};

const handleAction = () => {
  emit("action");
};

// 应用主题到根元素
onMounted(() => {
  const vars = themeVars.value;
  Object.entries(vars).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
});
</script>

<style scoped>
.page-layout {
  min-height: 100vh;
  background: var(--app-bg-gradient);
  display: flex;
  flex-direction: column;
}

.page-content {
  flex: 1;
  padding: var(--app-padding-page);
  overflow-y: auto;
}

.page-content.has-header {
  padding-top: var(--app-spacing-md);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .page-content {
    padding: 0 12px 80px 12px;
  }

  .page-content.has-header {
    padding-top: var(--app-spacing-md);
  }
}
</style>
