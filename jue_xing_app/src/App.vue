<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { NConfigProvider, darkTheme, NMessageProvider, NIcon } from "naive-ui";
import {
  HomeOutline,
  TrendingUpOutline,
  CalendarOutline,
  TrophyOutline,
} from "@vicons/ionicons5";

const router = useRouter();
const route = useRoute();

// 主题管理
type ThemeMode = "light" | "dark" | "auto";
const themeMode = ref<ThemeMode>("light");
const systemDark = ref(false);

// 计算当前主题
const theme = computed(() => {
  if (themeMode.value === "dark") return darkTheme;
  if (themeMode.value === "auto") return systemDark.value ? darkTheme : null;
  return null;
});

// 检测系统主题
const checkSystemTheme = () => {
  systemDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
};

// 监听系统主题变化
const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
mediaQuery.addListener(checkSystemTheme);

// 从本地存储加载主题设置
const loadThemeSettings = () => {
  const saved = localStorage.getItem("theme-mode");
  if (saved && ["light", "dark", "auto"].includes(saved)) {
    themeMode.value = saved as ThemeMode;
  }
};

// 保存主题设置
const saveThemeSettings = () => {
  localStorage.setItem("theme-mode", themeMode.value);
};

// 切换主题的方法（供子组件调用）
const switchTheme = (mode: ThemeMode) => {
  themeMode.value = mode;
  saveThemeSettings();
};

// 暴露给全局使用
(window as any).__themeController = {
  themeMode,
  switchTheme,
};

onMounted(() => {
  checkSystemTheme();
  loadThemeSettings();
});

const activeTab = computed(() => route.name as string);

const tabs = [
  { name: "Home", label: "首页", icon: HomeOutline },
  { name: "Goals", label: "计划", icon: TrendingUpOutline },
  { name: "Records", label: "记录", icon: CalendarOutline },
  { name: "Achievements", label: "我的", icon: TrophyOutline },
];

const navigateTo = (routeName: string) => {
  router.push({ name: routeName });
};
</script>

<template>
  <n-config-provider :theme="theme">
    <n-message-provider>
      <div class="app-container">
        <!-- 主要内容区域 -->
        <div class="main-content">
          <router-view />
        </div>

        <!-- 底部导航栏 -->
        <div class="bottom-navigation">
          <div
            v-for="tab in tabs"
            :key="tab.name"
            class="nav-item"
            :class="{ active: activeTab === tab.name }"
            @click="navigateTo(tab.name)"
          >
            <div class="nav-icon">
              <n-icon>
                <component :is="tab.icon" />
              </n-icon>
            </div>
            <div class="nav-label">{{ tab.label }}</div>
          </div>
        </div>
      </div>
    </n-message-provider>
  </n-config-provider>
</template>

<style scoped>
.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--n-body-color);
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 0;
}

.bottom-navigation {
  display: flex;
  height: 60px;
  background-color: var(--n-card-color);
  border-top: 1px solid var(--n-border-color);
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 8px 4px;
  color: var(--n-text-color);
}

.nav-item:hover {
  background-color: var(--n-button-color-hover);
}

.nav-item.active {
  color: var(--n-primary-color);
}

.nav-item.active .nav-icon {
  color: var(--n-primary-color);
}

.nav-icon {
  font-size: 20px;
  margin-bottom: 2px;
  transition: color 0.3s ease;
}

.nav-label {
  font-size: 10px;
  font-weight: 500;
  text-align: center;
  line-height: 1;
}

/* 移除深色主题的硬编码样式，让主题系统接管 */

/* 确保在安卓设备上的适配 */
@media (max-width: 768px) {
  .nav-label {
    font-size: 9px;
  }

  .nav-icon {
    font-size: 18px;
  }

  .bottom-navigation {
    height: 56px;
  }
}
</style>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  background-color: var(--n-body-color);
  overflow: hidden;
}

#app {
  height: 100vh;
}

/* 适配安卓安全区域 */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .bottom-navigation {
    padding-bottom: env(safe-area-inset-bottom);
  }
}
</style>
