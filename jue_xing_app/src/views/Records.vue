<script setup lang="ts">
import { ref, computed } from "vue";
import {
  NCard,
  NButton,
  NIcon,
  NText,
  NSpace,
  NGrid,
  NGridItem,
  NStatistic,
  NTag,
  NTime,
} from "naive-ui";
import {
  CalendarOutline,
  TrendingUpOutline,
  FlameOutline,
  TimeOutline,
  ChevronBackOutline,
  ChevronForwardOutline,
  BookOutline,
} from "@vicons/ionicons5";
import type { Record } from "../types";

// 当前选中的日期
const selectedDate = ref(new Date());
const currentMonth = ref(new Date());

// 模拟记录数据
const records = ref<Record[]>([
  {
    id: "r1",
    planId: "1-1",
    date: new Date(),
    amount: 100,
    completed: true,
    reflection: "今天的深蹲感觉很好，身体状态不错",
    mood: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "r2",
    planId: "1-2",
    date: new Date(),
    amount: 20,
    completed: true,
    reflection: "冥想时心很静，感觉很平和",
    mood: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "r3",
    planId: "2-1",
    date: new Date(Date.now() - 86400000), // 昨天
    amount: 45,
    completed: false,
    reflection: "今天只读了45页，明天要继续努力",
    mood: 3,
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 86400000),
  },
]);

// 星期标题
const weekDays = ["日", "一", "二", "三", "四", "五", "六"];

// 本月统计
const monthStats = computed(() => {
  const currentMonthRecords = records.value.filter((record) => {
    const recordDate = new Date(record.date);
    return (
      recordDate.getMonth() === currentMonth.value.getMonth() &&
      recordDate.getFullYear() === currentMonth.value.getFullYear()
    );
  });

  const completedRecords = currentMonthRecords.filter((r) => r.completed);
  const totalDays = new Set(
    currentMonthRecords.map((r) => new Date(r.date).toDateString())
  ).size;

  return {
    totalRecords: currentMonthRecords.length,
    completedRecords: completedRecords.length,
    practicesDays: totalDays,
    completionRate:
      currentMonthRecords.length > 0
        ? Math.round(
            (completedRecords.length / currentMonthRecords.length) * 100
          )
        : 0,
    avgMood:
      currentMonthRecords.length > 0
        ? Math.round(
            (currentMonthRecords.reduce((sum, r) => sum + r.mood, 0) /
              currentMonthRecords.length) *
              10
          ) / 10
        : 0,
  };
});

// 当前选中日期的记录
const selectedDateRecords = computed(() => {
  return records.value.filter((record) => {
    const recordDate = new Date(record.date);
    return recordDate.toDateString() === selectedDate.value.toDateString();
  });
});

// 生成日历数据
const calendarData = computed(() => {
  const year = currentMonth.value.getFullYear();
  const month = currentMonth.value.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const days = [];

  // 添加上个月的天数（填充）
  const prevMonth = new Date(year, month - 1, 0);
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, prevMonth.getDate() - i),
      isCurrentMonth: false,
      hasRecords: false,
      records: [],
    });
  }

  // 添加当前月的天数
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayRecords = records.value.filter((record) => {
      const recordDate = new Date(record.date);
      return recordDate.toDateString() === date.toDateString();
    });

    days.push({
      date,
      isCurrentMonth: true,
      hasRecords: dayRecords.length > 0,
      records: dayRecords,
      completion:
        dayRecords.length > 0
          ? Math.round(
              (dayRecords.filter((r) => r.completed).length /
                dayRecords.length) *
                100
            )
          : 0,
    });
  }

  // 添加下个月的天数（填充到42天）
  const remainingDays = 42 - days.length;
  for (let day = 1; day <= remainingDays; day++) {
    days.push({
      date: new Date(year, month + 1, day),
      isCurrentMonth: false,
      hasRecords: false,
      records: [],
    });
  }

  return days;
});

// 获取心情图标
const getMoodIcon = (mood: number) => {
  if (mood >= 4) return "😊";
  if (mood >= 3) return "😐";
  return "😔";
};

// 获取计划名称（模拟）
const getPlanName = (planId: string) => {
  const plans: { [key: string]: string } = {
    "1-1": "每日深蹲",
    "1-2": "晨间冥想",
    "2-1": "阅读《刀锋》",
  };
  return plans[planId] || "未知计划";
};

// 获取计划图标
const getPlanIcon = (planId: string) => {
  if (planId.includes("1-1")) return FlameOutline; // 运动
  if (planId.includes("1-2")) return TimeOutline; // 冥想
  if (planId.includes("2-1")) return BookOutline; // 阅读
  return CalendarOutline;
};

// 点击日历日期
const selectDate = (day: any) => {
  if (!day.isCurrentMonth) return;
  selectedDate.value = new Date(day.date);
};

// 切换月份
const changeMonth = (offset: number) => {
  const newMonth = new Date(currentMonth.value);
  newMonth.setMonth(newMonth.getMonth() + offset);
  currentMonth.value = newMonth;
};

// 今天
const goToToday = () => {
  const today = new Date();
  currentMonth.value = new Date(today.getFullYear(), today.getMonth(), 1);
  selectedDate.value = today;
};

// 展开/收起记录详情
const expandedRecords = ref(new Set<string>());

const toggleRecordDetail = (recordId: string) => {
  if (expandedRecords.value.has(recordId)) {
    expandedRecords.value.delete(recordId);
  } else {
    expandedRecords.value.add(recordId);
  }
};

// 获取连续修行天数
const getStreakDays = () => {
  let streak = 0;
  const today = new Date();
  let currentDate = new Date(today);

  while (streak < 365) {
    // 最多检查一年
    const dateStr = currentDate.toDateString();
    const hasRecord = records.value.some((record) => {
      const recordDate = new Date(record.date);
      return recordDate.toDateString() === dateStr && record.completed;
    });

    if (!hasRecord) {
      break;
    }

    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return streak;
};

// 连续天数
const streakDays = computed(() => getStreakDays());
</script>

<template>
  <div class="records-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <n-text strong style="font-size: 20px; color: white">修行记录</n-text>
    </div>

    <!-- 统计卡片 -->
    <n-card class="stats-card" :bordered="false">
      <n-space vertical size="medium">
        <n-space justify="space-between" align="center">
          <n-text strong style="font-size: 16px">本月统计</n-text>
          <n-icon size="20" color="#18a058">
            <TrendingUpOutline />
          </n-icon>
        </n-space>

        <n-grid cols="4" :x-gap="12">
          <n-grid-item>
            <n-statistic
              label="修行天数"
              :value="monthStats.practicesDays"
              suffix="天"
            />
          </n-grid-item>
          <n-grid-item>
            <n-statistic
              label="总记录"
              :value="monthStats.totalRecords"
              suffix="条"
            />
          </n-grid-item>
          <n-grid-item>
            <n-statistic
              label="完成率"
              :value="monthStats.completionRate"
              suffix="%"
            />
          </n-grid-item>
          <n-grid-item>
            <n-statistic
              label="平均评分"
              :value="monthStats.avgMood"
              suffix="分"
            />
          </n-grid-item>
        </n-grid>
      </n-space>
    </n-card>

    <!-- 日历视图 -->
    <n-card class="calendar-card" :bordered="false">
      <n-space vertical size="medium">
        <!-- 日历标题 -->
        <n-space justify="space-between" align="center">
          <n-space align="center">
            <n-text strong>修行日历</n-text>
            <n-tag size="small" type="success" v-if="streakDays > 0">
              连续 {{ streakDays }} 天
            </n-tag>
          </n-space>
          <n-space>
            <n-button text size="small" @click="goToToday"> 今天 </n-button>
          </n-space>
        </n-space>

        <!-- 月份导航 -->
        <n-space justify="space-between" align="center">
          <n-button text @click="changeMonth(-1)">
            <template #icon>
              <n-icon><ChevronBackOutline /></n-icon>
            </template>
          </n-button>

          <n-text strong style="font-size: 16px">
            {{ currentMonth.getFullYear() }}年{{
              currentMonth.getMonth() + 1
            }}月
          </n-text>

          <n-button text @click="changeMonth(1)">
            <template #icon>
              <n-icon><ChevronForwardOutline /></n-icon>
            </template>
          </n-button>
        </n-space>

        <!-- 星期标题 -->
        <div class="calendar-header">
          <div v-for="day in weekDays" :key="day" class="week-day">
            {{ day }}
          </div>
        </div>

        <!-- 日历网格 -->
        <div class="calendar-grid">
          <div
            v-for="(day, index) in calendarData"
            :key="index"
            class="calendar-date"
            :class="{
              'current-month': day.isCurrentMonth,
              'other-month': !day.isCurrentMonth,
              today:
                day.isCurrentMonth &&
                day.date.toDateString() === new Date().toDateString(),
              selected:
                day.isCurrentMonth &&
                day.date.toDateString() === selectedDate.toDateString(),
              'has-records': day.hasRecords,
            }"
            @click="selectDate(day)"
          >
            <div class="date-number">{{ day.date.getDate() }}</div>
            <div v-if="day.hasRecords" class="record-dots">
              <div
                v-for="n in Math.min(day.records.length, 3)"
                :key="n"
                class="record-dot"
                :class="{
                  completed: day.records[n - 1]?.completed,
                  incomplete: !day.records[n - 1]?.completed,
                }"
              ></div>
              <div v-if="day.records.length > 3" class="more-indicator">+</div>
            </div>
          </div>
        </div>
      </n-space>
    </n-card>

    <!-- 选中日期的记录 -->
    <n-card class="selected-records-card" :bordered="false">
      <n-space vertical size="medium">
        <n-space justify="space-between" align="center">
          <n-text strong>
            <n-time :time="selectedDate" format="M月d日" /> 的记录
          </n-text>
          <n-text depth="3" style="font-size: 12px">
            {{ selectedDateRecords.length }} 条记录
          </n-text>
        </n-space>

        <div v-if="selectedDateRecords.length > 0">
          <n-space vertical size="small">
            <div
              v-for="record in selectedDateRecords"
              :key="record.id"
              class="record-item"
              :class="{ expanded: expandedRecords.has(record.id) }"
              @click="toggleRecordDetail(record.id)"
            >
              <div class="record-header">
                <n-space justify="space-between" align="center">
                  <n-space align="center" size="small">
                    <n-icon
                      size="18"
                      :color="record.completed ? '#18a058' : '#666'"
                    >
                      <component :is="getPlanIcon(record.planId)" />
                    </n-icon>
                    <n-text strong>{{ getPlanName(record.planId) }}</n-text>
                  </n-space>

                  <n-space size="small" align="center">
                    <n-tag
                      size="small"
                      :type="record.completed ? 'success' : 'warning'"
                    >
                      {{ record.amount
                      }}{{
                        record.planId.includes("1-1")
                          ? "个"
                          : record.planId.includes("1-2")
                          ? "分钟"
                          : "页"
                      }}
                    </n-tag>
                    <n-text style="font-size: 16px">
                      {{ getMoodIcon(record.mood) }}
                    </n-text>
                    <n-text depth="3" style="font-size: 12px">
                      {{ record.mood }}/5
                    </n-text>
                  </n-space>
                </n-space>
              </div>

              <div v-if="expandedRecords.has(record.id)" class="record-details">
                <n-space vertical size="small">
                  <div class="detail-row">
                    <n-text depth="2" style="font-size: 12px">状态:</n-text>
                    <n-tag
                      size="tiny"
                      :type="record.completed ? 'success' : 'warning'"
                    >
                      {{ record.completed ? "已完成" : "未完成" }}
                    </n-tag>
                  </div>

                  <div class="detail-row">
                    <n-text depth="2" style="font-size: 12px">时间:</n-text>
                    <n-time :time="record.createdAt" format="HH:mm" />
                  </div>

                  <div v-if="record.reflection" class="detail-row">
                    <n-text depth="2" style="font-size: 12px">反思:</n-text>
                    <n-text style="font-size: 13px">{{
                      record.reflection
                    }}</n-text>
                  </div>
                </n-space>
              </div>

              <div v-else class="record-preview">
                <n-text depth="3" style="font-size: 12px" class="preview-text">
                  {{ record.reflection ? record.reflection : "暂无反思记录" }}
                </n-text>
              </div>
            </div>
          </n-space>
        </div>

        <div v-else style="text-align: center; padding: 20px 0">
          <n-text depth="3">当日暂无修行记录</n-text>
        </div>
      </n-space>
    </n-card>
  </div>
</template>

<style scoped>
.records-container {
  padding: 0 16px 80px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.page-header {
  padding: 20px 0;
  background: transparent;
}

.stats-card,
.calendar-card,
.selected-records-card {
  margin-bottom: 16px;
  border-radius: 12px;
}

.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
}

.week-day {
  text-align: center;
  padding: 8px 4px;
  font-size: 12px;
  font-weight: bold;
  color: var(--n-text-color-disabled);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 12px;
  padding: 8px;
}

.calendar-date {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  min-height: 40px;
  background: var(--n-card-color);
  border: 2px solid var(--n-border-color);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.calendar-date.current-month {
  background-color: var(--n-card-color);
  border-color: var(--n-border-color);
}

.calendar-date.other-month {
  background-color: var(--n-body-color);
  opacity: 0.4;
  border-color: transparent;
  box-shadow: none;
}

.calendar-date.today {
  background: var(--n-card-color);
  color: var(--n-primary-color);
  font-weight: bold;
  border: 2px solid var(--n-primary-color);
  box-shadow: 0 2px 8px rgba(24, 160, 88, 0.3);
}

.calendar-date.selected {
  background: linear-gradient(
    135deg,
    var(--n-primary-color),
    var(--n-primary-color-hover)
  ) !important;
  font-weight: bold;
  border: 3px solid var(--n-primary-color) !important;
  box-shadow: 0 4px 16px rgba(24, 160, 88, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.3) inset !important;
  z-index: 10;
  position: relative;
  transform: scale(1.05);
}

.calendar-date.has-records {
  background: linear-gradient(
    135deg,
    var(--n-success-color-suppl),
    rgba(24, 160, 88, 0.1)
  );
  border-color: var(--n-success-color);
  box-shadow: 0 2px 6px rgba(24, 160, 88, 0.2);
}

.calendar-date.has-records.selected {
  background: linear-gradient(
    135deg,
    var(--n-primary-color),
    var(--n-primary-color-hover)
  ) !important;
  border: 3px solid var(--n-primary-color) !important;
  box-shadow: 0 4px 16px rgba(24, 160, 88, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.3) inset !important;
  z-index: 10;
  transform: scale(1.05);
}

.calendar-date.has-records.today {
  background: linear-gradient(
    135deg,
    var(--n-success-color-suppl),
    rgba(24, 160, 88, 0.1)
  );
  color: var(--n-primary-color);
  border-color: var(--n-success-color);
  font-weight: bold;
}

.calendar-date.has-records.today.selected {
  background: linear-gradient(
    135deg,
    var(--n-primary-color),
    var(--n-primary-color-hover)
  ) !important;
  border: 3px solid var(--n-primary-color) !important;
  box-shadow: 0 4px 16px rgba(24, 160, 88, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.3) inset !important;
  z-index: 10;
  transform: scale(1.05);
}

.calendar-date.has-records:hover {
  background: linear-gradient(
    135deg,
    var(--n-success-color-hover),
    var(--n-success-color-suppl)
  );
  box-shadow: 0 3px 10px rgba(24, 160, 88, 0.3);
}

.calendar-date:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.date-number {
  font-size: 14px;
  line-height: 1;
  font-weight: 500;
  margin-bottom: 2px;
}

.record-dots {
  display: flex;
  gap: 2px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 100%;
}

.record-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.record-dot.completed {
  background-color: var(--n-success-color);
  box-shadow: 0 0 4px rgba(24, 160, 88, 0.6);
}

.record-dot.incomplete {
  background-color: var(--n-warning-color);
  box-shadow: 0 0 4px rgba(240, 138, 0, 0.6);
}

.more-indicator {
  font-size: 8px;
  color: var(--n-text-color);
  margin-left: 1px;
  font-weight: bold;
}

/* 记录项样式 */
.record-item {
  background: var(--n-card-color);
  border: 1px solid var(--n-border-color);
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.record-item:hover {
  border-color: var(--n-primary-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.record-item.expanded {
  border-color: var(--n-primary-color);
  box-shadow: 0 2px 12px rgba(24, 160, 88, 0.15);
}

.record-header {
  margin-bottom: 4px;
}

.record-details {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--n-divider-color);
}

.record-preview {
  margin-top: 4px;
}

.preview-text {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .records-container {
    padding: 0 12px 80px 12px;
  }

  .page-header {
    padding: 16px 0;
  }

  .calendar-grid {
    gap: 8px;
    padding: 4px;
  }

  .calendar-date {
    min-height: 36px;
    border-radius: 8px;
    /* 增强移动端选中效果 */
    -webkit-tap-highlight-color: transparent;
  }

  .calendar-date.selected {
    border: 2px solid var(--n-primary-color) !important;
    box-shadow: 0 2px 12px rgba(24, 160, 88, 0.6),
      0 0 0 1px rgba(255, 255, 255, 0.5) inset, 0 0 20px rgba(24, 160, 88, 0.3) !important;
    transform: scale(1.1);
    animation: pulse-select 0.3s ease;
  }

  .calendar-date.has-records.selected,
  .calendar-date.has-records.today.selected {
    border: 2px solid var(--n-primary-color) !important;
    box-shadow: 0 2px 12px rgba(24, 160, 88, 0.6),
      0 0 0 1px rgba(255, 255, 255, 0.5) inset, 0 0 20px rgba(24, 160, 88, 0.3) !important;
    transform: scale(1.1);
    animation: pulse-select 0.3s ease;
  }

  .date-number {
    font-size: 12px;
  }

  .record-dot {
    width: 3px;
    height: 3px;
  }

  .week-day {
    padding: 6px 2px;
  }
}

/* 选中动画 */
@keyframes pulse-select {
  0% {
    transform: scale(1);
    box-shadow: 0 2px 8px rgba(24, 160, 88, 0.3);
  }
  50% {
    transform: scale(1.15);
    box-shadow: 0 4px 20px rgba(24, 160, 88, 0.8);
  }
  100% {
    transform: scale(1.1);
    box-shadow: 0 2px 12px rgba(24, 160, 88, 0.6),
      0 0 0 1px rgba(255, 255, 255, 0.5) inset, 0 0 20px rgba(24, 160, 88, 0.3);
  }
}

/* 亮色主题优化 */
[data-theme="light"] .calendar-date.selected,
.n-config-provider[data-theme="light"] .calendar-date.selected {
  background: linear-gradient(135deg, #18a058, #36ad6a) !important;
  color: white !important;
  border: 3px solid #18a058 !important;
  box-shadow: 0 4px 16px rgba(24, 160, 88, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.8) inset !important;
}

[data-theme="light"] .calendar-date.has-records.selected,
[data-theme="light"] .calendar-date.has-records.today.selected,
.n-config-provider[data-theme="light"] .calendar-date.has-records.selected,
.n-config-provider[data-theme="light"]
  .calendar-date.has-records.today.selected {
  background: linear-gradient(135deg, #18a058, #36ad6a) !important;
  color: white !important;
  border: 3px solid #18a058 !important;
  box-shadow: 0 4px 16px rgba(24, 160, 88, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.8) inset !important;
}

/* 暗色主题优化 */
[data-theme="dark"] .calendar-date.selected,
.n-config-provider[data-theme="dark"] .calendar-date.selected {
  background: linear-gradient(135deg, #18a058, #36ad6a) !important;
  color: white !important;
  border: 3px solid #18a058 !important;
  box-shadow: 0 4px 16px rgba(24, 160, 88, 0.6),
    0 0 0 1px rgba(255, 255, 255, 0.3) inset, 0 0 20px rgba(24, 160, 88, 0.2) !important;
}
</style>
