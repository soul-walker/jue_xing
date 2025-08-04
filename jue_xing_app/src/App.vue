<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { NConfigProvider, darkTheme, NMessageProvider } from "naive-ui";
import {
  HomeOutline,
  TrendingUpOutline,
  CalendarOutline,
  TrophyOutline,
} from "@vicons/ionicons5";

const router = useRouter();
const route = useRoute();

const isDark = ref(false);
const theme = computed(() => (isDark.value ? darkTheme : null));

const activeTab = computed(() => route.name as string);

const tabs = [
  { name: "Home", label: "首页", icon: HomeOutline },
  { name: "Goals", label: "目标", icon: TrendingUpOutline },
  { name: "Records", label: "记录", icon: CalendarOutline },
  { name: "Achievements", label: "成就", icon: TrophyOutline },
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
              <component :is="tab.icon" />
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
  background-color: #f5f5f5;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 0;
}

.bottom-navigation {
  display: flex;
  height: 60px;
  background-color: white;
  border-top: 1px solid #e0e0e0;
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
}

.nav-item:hover {
  background-color: #f0f0f0;
}

.nav-item.active {
  color: #18a058;
}

.nav-item.active .nav-icon {
  color: #18a058;
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

/* 深色主题适配 */
.dark .bottom-navigation {
  background-color: #1f1f1f;
  border-top-color: #333;
}

.dark .nav-item:hover {
  background-color: #333;
}

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
  background-color: #f5f5f5;
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
