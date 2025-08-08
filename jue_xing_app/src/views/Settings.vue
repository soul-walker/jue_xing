<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  NCard,
  NButton,
  NIcon,
  NText,
  NSpace,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NSwitch,
  NTimePicker,
  useMessage,
} from "naive-ui";
import {
  ArrowBackOutline,
  SaveOutline,
  NotificationsOutline,
  ColorPaletteOutline,
  CloudOutline,
  ShieldCheckmarkOutline,
} from "@vicons/ionicons5";
import type { Settings } from "../types";

const router = useRouter();
const message = useMessage();

// 设置数据
const settings = ref<Settings>({
  aiModel: "openai-gpt-4",
  apiKey: "",
  reminderEnabled: true,
  reminderTime: "08:00",
  theme: "auto",
});

// AI模型选项
const aiModelOptions = [
  { label: "OpenAI GPT-4", value: "openai-gpt-4" },
  { label: "OpenAI GPT-3.5", value: "openai-gpt-3.5" },
  { label: "Claude 3", value: "claude-3" },
  { label: "Gemini Pro", value: "gemini-pro" },
  { label: "通义千问", value: "qwen" },
  { label: "文心一言", value: "ernie" },
  { label: "智谱 ChatGLM", value: "chatglm" },
];

// 主题选项
const themeOptions = [
  { label: "浅色模式", value: "light" },
  { label: "深色模式", value: "dark" },
  { label: "跟随系统", value: "auto" },
];

// 表单验证规则
const rules = {
  apiKey: {
    required: true,
    message: "请输入API密钥",
    trigger: ["blur", "input"],
  },
};

// 保存设置
const saveSettings = async () => {
  try {
    // 验证API密钥格式
    if (settings.value.apiKey && !isValidApiKey(settings.value.apiKey)) {
      message.error("API密钥格式不正确");
      return;
    }

    // 模拟保存到本地存储
    localStorage.setItem("app-settings", JSON.stringify(settings.value));

    // 应用主题设置
    const themeController = (window as any).__themeController;
    if (themeController) {
      themeController.switchTheme(settings.value.theme);
    }

    message.success("设置已保存");
  } catch (error) {
    message.error("保存设置失败，请重试");
  }
};

// 验证API密钥格式
const isValidApiKey = (apiKey: string) => {
  // 简单的API密钥格式验证
  return (
    apiKey.length > 10 &&
    (apiKey.startsWith("sk-") ||
      apiKey.startsWith("claude-") ||
      apiKey.startsWith("gsk_") ||
      /^[a-zA-Z0-9_-]+$/.test(apiKey))
  );
};

// 返回上一页
const goBack = () => {
  // 设置页面主要从个人页面进入
  router.push({ name: "Profile" });
};

// 测试API连接
const testApiConnection = async () => {
  if (!settings.value.apiKey) {
    message.error("请先输入API密钥");
    return;
  }

  message.loading("测试连接中...", { duration: 0 });

  try {
    // 模拟API测试
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 随机成功/失败（模拟）
    if (Math.random() > 0.3) {
      message.destroyAll();
      message.success("API连接测试成功");
    } else {
      message.destroyAll();
      message.error("API连接测试失败，请检查密钥");
    }
  } catch (error) {
    message.destroyAll();
    message.error("网络错误，请重试");
  }
};

// 重置设置
const resetSettings = () => {
  settings.value = {
    aiModel: "openai-gpt-4",
    apiKey: "",
    reminderEnabled: true,
    reminderTime: "08:00",
    theme: "auto",
  };
  message.info("已重置为默认设置");
};

// 加载设置
const loadSettings = () => {
  try {
    const saved = localStorage.getItem("app-settings");
    if (saved) {
      const parsed = JSON.parse(saved);
      settings.value = { ...settings.value, ...parsed };
    }
  } catch (error) {
    console.error("加载设置失败:", error);
  }
};

// 页面初始化
loadSettings();
</script>

<template>
  <div class="settings-container">
    <!-- 顶部导航 -->
    <div class="page-header">
      <n-space justify="space-between" align="center">
        <n-button text @click="goBack" style="color: white">
          <template #icon>
            <n-icon size="20">
              <ArrowBackOutline />
            </n-icon>
          </template>
        </n-button>

        <n-text strong style="font-size: 18px; color: white"> 设置 </n-text>

        <div style="width: 40px"></div>
      </n-space>
    </div>

    <!-- AI 设置 -->
    <n-card class="settings-card" :bordered="false">
      <n-space vertical size="medium">
        <n-space align="center">
          <n-icon size="18" color="#18a058">
            <CloudOutline />
          </n-icon>
          <n-text strong>AI 配置</n-text>
        </n-space>

        <n-form :model="settings" :rules="rules">
          <!-- AI模型选择 -->
          <n-form-item label="AI模型" path="aiModel">
            <n-select
              v-model:value="settings.aiModel"
              :options="aiModelOptions"
              placeholder="选择AI模型"
            />
          </n-form-item>

          <!-- API密钥 -->
          <n-form-item label="API密钥" path="apiKey">
            <n-space vertical size="small" style="width: 100%">
              <n-input
                v-model:value="settings.apiKey"
                type="password"
                placeholder="输入API密钥"
                show-password-on="click"
              />
              <n-space justify="space-between">
                <n-text depth="3" style="font-size: 11px">
                  密钥将安全存储在本地，不会上传到服务器
                </n-text>
                <n-button
                  text
                  size="tiny"
                  type="primary"
                  @click="testApiConnection"
                  :disabled="!settings.apiKey"
                >
                  测试连接
                </n-button>
              </n-space>
            </n-space>
          </n-form-item>
        </n-form>
      </n-space>
    </n-card>

    <!-- 提醒设置 -->
    <n-card class="settings-card" :bordered="false">
      <n-space vertical size="medium">
        <n-space align="center">
          <n-icon size="18" color="#f0a020">
            <NotificationsOutline />
          </n-icon>
          <n-text strong>提醒设置</n-text>
        </n-space>

        <n-form :model="settings">
          <!-- 启用提醒 -->
          <n-form-item label="修行提醒">
            <n-space align="center" size="medium">
              <n-switch
                v-model:value="settings.reminderEnabled"
                size="medium"
              />
              <n-text depth="3" style="font-size: 12px">
                {{ settings.reminderEnabled ? "已开启每日提醒" : "已关闭提醒" }}
              </n-text>
            </n-space>
          </n-form-item>

          <!-- 提醒时间 -->
          <n-form-item v-if="settings.reminderEnabled" label="提醒时间">
            <n-space align="center" size="medium">
              <n-time-picker
                v-model:formatted-value="settings.reminderTime"
                format="HH:mm"
                value-format="HH:mm"
              />
              <n-text depth="3" style="font-size: 12px">
                每天这个时间提醒您修行
              </n-text>
            </n-space>
          </n-form-item>
        </n-form>
      </n-space>
    </n-card>

    <!-- 外观设置 -->
    <n-card class="settings-card" :bordered="false">
      <n-space vertical size="medium">
        <n-space align="center">
          <n-icon size="18" color="#722ed1">
            <ColorPaletteOutline />
          </n-icon>
          <n-text strong>外观设置</n-text>
        </n-space>

        <n-form :model="settings">
          <!-- 主题选择 -->
          <n-form-item label="主题模式">
            <n-select
              v-model:value="settings.theme"
              :options="themeOptions"
              placeholder="选择主题模式"
            />
          </n-form-item>
        </n-form>
      </n-space>
    </n-card>

    <!-- 数据与隐私 -->
    <n-card class="settings-card" :bordered="false">
      <n-space vertical size="medium">
        <n-space align="center">
          <n-icon size="18" color="#d03050">
            <ShieldCheckmarkOutline />
          </n-icon>
          <n-text strong>数据与隐私</n-text>
        </n-space>

        <n-space vertical size="small">
          <n-text depth="3" style="font-size: 12px; line-height: 1.5">
            • 所有修行数据存储在您的设备本地<br />
            • API密钥仅用于AI功能，不会被泄露<br />
            • 应用不会收集或上传您的个人信息<br />
            • 您可以随时导出或删除所有数据
          </n-text>
        </n-space>
      </n-space>
    </n-card>

    <!-- 操作按钮 -->
    <n-card class="actions-card" :bordered="false">
      <n-space vertical size="medium">
        <n-button type="primary" size="large" block @click="saveSettings">
          <template #icon>
            <n-icon>
              <SaveOutline />
            </n-icon>
          </template>
          保存设置
        </n-button>

        <n-button text size="medium" block @click="resetSettings">
          重置为默认设置
        </n-button>
      </n-space>
    </n-card>
  </div>
</template>

<style scoped>
.settings-container {
  padding: 0 16px 80px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.page-header {
  padding: 20px 0;
  background: transparent;
}

.settings-card,
.actions-card {
  margin-bottom: 16px;
  border-radius: 12px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .settings-container {
    padding: 0 12px 80px 12px;
  }

  .page-header {
    padding: 16px 0;
  }
}
</style>
