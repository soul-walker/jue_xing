<template>
  <div class="reports">
    <n-space vertical size="large">
      <!-- 页面标题 -->
      <n-page-header title="修行报告" subtitle="数据洞察您的修行成长">
        <template #extra>
          <n-select
            v-model:value="reportPeriod"
            :options="periodOptions"
            @update:value="updateReport"
          />
        </template>
      </n-page-header>

      <!-- 总览统计 -->
      <n-card title="修行总览">
        <n-grid cols="4" x-gap="12">
          <n-grid-item>
            <n-statistic
              label="修行天数"
              :value="overviewStats.totalDays"
              suffix="天"
            />
          </n-grid-item>
          <n-grid-item>
            <n-statistic
              label="总时长"
              :value="overviewStats.totalHours"
              suffix="小时"
            />
          </n-grid-item>
          <n-grid-item>
            <n-statistic
              label="平均评分"
              :value="overviewStats.avgRating"
              suffix="/5"
            />
          </n-grid-item>
          <n-grid-item>
            <n-statistic
              label="连续天数"
              :value="overviewStats.streakDays"
              suffix="天"
            />
          </n-grid-item>
        </n-grid>
      </n-card>

      <!-- 修行类型分布 -->
      <n-card title="修行类型分布">
        <n-space vertical>
          <div
            v-for="type in typeDistribution"
            :key="type.name"
            style="margin-bottom: 16px"
          >
            <n-space justify="space-between">
              <n-text>{{ type.name }}</n-text>
              <n-text>{{ type.count }}次 ({{ type.percentage }}%)</n-text>
            </n-space>
            <n-progress
              :percentage="type.percentage"
              :color="type.color"
              :show-indicator="false"
            />
          </div>
        </n-space>
      </n-card>

      <!-- 修行趋势 -->
      <n-card title="修行趋势">
        <div
          style="
            height: 300px;
            display: flex;
            align-items: center;
            justify-content: center;
          "
        >
          <n-text depth="3">图表组件待实现</n-text>
        </div>
      </n-card>

      <!-- 修行质量分析 -->
      <n-card title="修行质量分析">
        <n-grid cols="2" x-gap="12">
          <n-grid-item>
            <n-space vertical>
              <n-text strong>评分分布</n-text>
              <div v-for="rating in ratingDistribution" :key="rating.score">
                <n-space justify="space-between">
                  <n-space>
                    <n-rate :value="rating.score" readonly size="small" />
                    <n-text>{{ rating.score }}分</n-text>
                  </n-space>
                  <n-text>{{ rating.count }}次</n-text>
                </n-space>
              </div>
            </n-space>
          </n-grid-item>

          <n-grid-item>
            <n-space vertical>
              <n-text strong>修行建议</n-text>
              <div v-for="suggestion in suggestions" :key="suggestion.type">
                <n-alert :type="suggestion.level" style="margin-bottom: 8px">
                  <template #header>{{ suggestion.title }}</template>
                  {{ suggestion.content }}
                </n-alert>
              </div>
            </n-space>
          </n-grid-item>
        </n-grid>
      </n-card>

      <!-- 目标达成情况 -->
      <n-card title="目标达成情况">
        <n-list>
          <n-list-item v-for="goal in goalProgress" :key="goal.id">
            <n-thing :title="goal.name">
              <template #description>
                <n-space vertical size="small">
                  <n-progress :percentage="goal.progress" />
                  <n-text depth="3">
                    已完成 {{ goal.completed }} / {{ goal.target }} 次 ({{
                      goal.progress
                    }}%)
                  </n-text>
                </n-space>
              </template>

              <template #footer>
                <n-space>
                  <n-tag :type="goal.progress >= 100 ? 'success' : 'info'">
                    {{ goal.progress >= 100 ? "已完成" : "进行中" }}
                  </n-tag>
                  <n-text depth="3">目标日期: {{ goal.targetDate }}</n-text>
                </n-space>
              </template>
            </n-thing>
          </n-list-item>
        </n-list>
      </n-card>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  NSpace,
  NCard,
  NPageHeader,
  NSelect,
  NGrid,
  NGridItem,
  NStatistic,
  NText,
  NProgress,
  NList,
  NListItem,
  NThing,
  NRate,
  NAlert,
  NTag,
} from "naive-ui";

// 报告周期
const reportPeriod = ref("week");
const periodOptions = [
  { label: "本周", value: "week" },
  { label: "本月", value: "month" },
  { label: "本季度", value: "quarter" },
  { label: "本年", value: "year" },
];

// 总览统计
const overviewStats = ref({
  totalDays: 28,
  totalHours: 15.5,
  avgRating: 4.3,
  streakDays: 7,
});

// 修行类型分布
const typeDistribution = ref([
  { name: "冥想", count: 15, percentage: 40, color: "#52c41a" },
  { name: "运动", count: 10, percentage: 27, color: "#1890ff" },
  { name: "感恩", count: 8, percentage: 21, color: "#f5222d" },
  { name: "阅读", count: 3, percentage: 8, color: "#722ed1" },
  { name: "写作", count: 2, percentage: 5, color: "#fa8c16" },
]);

// 评分分布
const ratingDistribution = ref([
  { score: 5, count: 20 },
  { score: 4, count: 12 },
  { score: 3, count: 5 },
  { score: 2, count: 1 },
  { score: 1, count: 0 },
]);

// 修行建议
const suggestions = ref([
  {
    type: "consistency",
    level: "success" as "success" | "info" | "warning" | "error" | "default",
    title: "坚持度良好",
    content: "您已经连续修行7天，继续保持这个好习惯！",
  },
  {
    type: "diversity",
    level: "info" as "success" | "info" | "warning" | "error" | "default",
    title: "类型建议",
    content: "建议增加运动类型的修行，平衡身心发展。",
  },
  {
    type: "duration",
    level: "warning" as "success" | "info" | "warning" | "error" | "default",
    title: "时长提醒",
    content: "可以适当增加单次修行时长，提升修行效果。",
  },
]);

// 目标进度
const goalProgress = ref([
  {
    id: 1,
    name: "每日冥想习惯",
    completed: 18,
    target: 30,
    progress: 60,
    targetDate: "2025-03-01",
  },
  {
    id: 2,
    name: "感恩练习",
    completed: 25,
    target: 30,
    progress: 83,
    targetDate: "2025-02-15",
  },
]);

// 更新报告
const updateReport = () => {
  console.log("更新报告周期:", reportPeriod.value);
  // 这里应该根据周期重新获取数据
};
</script>

<style scoped>
.reports {
  padding: 16px;
}
</style>
