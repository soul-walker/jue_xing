<template>
  <n-button-group>
    <n-button
      size="small"
      :type="currentTheme === 'light' ? 'primary' : 'default'"
      @click="switchTheme('light')"
    >
      浅色
    </n-button>
    <n-button
      size="small"
      :type="currentTheme === 'dark' ? 'primary' : 'default'"
      @click="switchTheme('dark')"
    >
      深色
    </n-button>
    <n-button
      size="small"
      :type="currentTheme === 'auto' ? 'primary' : 'default'"
      @click="switchTheme('auto')"
    >
      自动
    </n-button>
  </n-button-group>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { NButton, NButtonGroup } from "naive-ui";

const currentTheme = ref<"light" | "dark" | "auto">("light");

const getThemeController = () => {
  return (window as any).__themeController;
};

const switchTheme = (mode: "light" | "dark" | "auto") => {
  currentTheme.value = mode;
  const controller = getThemeController();
  if (controller) {
    controller.switchTheme(mode);
  }
};

onMounted(() => {
  const controller = getThemeController();
  if (controller) {
    currentTheme.value = controller.themeMode.value;
  }
});
</script>
