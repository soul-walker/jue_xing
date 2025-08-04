<template>
  <div class="records-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <n-text strong style="font-size: 20px; color: white">修行记录</n-text>
      <n-button
        type="primary"
        size="small"
        @click="showAddModal = true"
        style="background: rgba(255, 255, 255, 0.2); border: none"
      >
        <template #icon>
          <n-icon><AddOutline /></n-icon>
        </template>
        添加记录
      </n-button>
    </div>

    <!-- 月度统计 -->
    <n-card class="stats-card" :bordered="false">
      <n-space vertical size="medium">
        <n-space justify="space-between" align="center">
          <n-text strong>{{ currentMonth }}月统计</n-text>
          <n-space>
            <n-button size="small" @click="prevMonth">
              <template #icon>
                <n-icon><ChevronBackOutline /></n-icon>
              </template>
            </n-button>
            <n-button size="small" @click="nextMonth">
              <template #icon>
                <n-icon><ChevronForwardOutline /></n-icon>
              </template>
            </n-button>
          </n-space>
        </n-space>

        <n-grid cols="3" :x-gap="12">
          <n-grid-item>
            <n-statistic
              label="修行天数"
              :value="monthStats.days"
              suffix="天"
            />
          </n-grid-item>
          <n-grid-item>
            <n-statistic
              label="总时长"
              :value="monthStats.hours"
              suffix="小时"
            />
          </n-grid-item>
          <n-grid-item>
            <n-statistic
              label="平均评分"
              :value="monthStats.rating"
              suffix="分"
            />
          </n-grid-item>
        </n-grid>
      </n-space>
    </n-card>

    <!-- 日历视图 -->
    <n-card class="calendar-card" :bordered="false">
      <n-space vertical size="medium">
        <n-text strong>修行日历</n-text>

        <!-- 星期标题 -->
        <div class="calendar-header">
          <div v-for="day in weekDays" :key="day" class="week-day">
            {{ day }}
          </div>
        </div>

        <!-- 日历网格 -->
        <div class="calendar-grid">
          <div
            v-for="date in calendarDates"
            :key="date.key"
            class="calendar-date"
            :class="{
              'other-month': !date.currentMonth,
              'has-record': date.hasRecord,
              today: date.isToday,
            }"
            @click="selectDate(date)"
          >
            <div class="date-number">{{ date.date }}</div>
            <div v-if="date.hasRecord" class="record-indicator">
              <div
                v-for="record in date.records"
                :key="record.id"
                class="record-dot"
                :style="{ backgroundColor: getTypeColor(record.type) }"
              ></div>
            </div>
          </div>
        </div>
      </n-space>
    </n-card>

    <!-- 选中日期的记录详情 -->
    <n-card
      v-if="selectedDateRecords.length > 0"
      class="date-details"
      :bordered="false"
    >
      <n-space vertical size="medium">
        <n-text strong>{{ formatDate(selectedDate) }} 的修行记录</n-text>

        <n-space vertical size="small">
          <div
            v-for="record in selectedDateRecords"
            :key="record.id"
            class="record-item"
          >
            <n-space justify="space-between" align="center">
              <n-space align="center">
                <div
                  class="type-indicator"
                  :style="{ backgroundColor: getTypeColor(record.type) }"
                ></div>
                <n-space vertical size="0">
                  <n-text strong>{{ record.type }}</n-text>
                  <n-text depth="3" style="font-size: 12px">
                    {{ record.duration }}分钟 | {{ record.time }}
                  </n-text>
                </n-space>
              </n-space>
              <n-rate :value="record.rating" readonly size="small" />
            </n-space>
            <n-text
              v-if="record.notes"
              depth="3"
              style="font-size: 12px; margin-top: 8px"
            >
              {{ record.notes }}
            </n-text>
          </div>
        </n-space>
      </n-space>
    </n-card>

    <!-- 添加记录模态框 -->
    <n-modal v-model:show="showAddModal">
      <n-card
        style="width: 90%; max-width: 400px"
        title="添加修行记录"
        :bordered="false"
        closable
        @close="closeAddModal"
      >
        <n-form :model="newRecord" :rules="rules">
          <n-form-item label="修行类型" path="type">
            <n-select
              v-model:value="newRecord.type"
              :options="typeOptions"
              placeholder="选择修行类型"
            />
          </n-form-item>

          <n-form-item label="日期" path="date">
            <n-date-picker
              v-model:value="newRecord.date"
              type="date"
              placeholder="选择日期"
            />
          </n-form-item>

          <n-form-item label="时长(分钟)" path="duration">
            <n-input-number
              v-model:value="newRecord.duration"
              :min="1"
              :max="120"
              placeholder="输入时长"
            />
          </n-form-item>

          <n-form-item label="评分" path="rating">
            <n-rate v-model:value="newRecord.rating" />
          </n-form-item>

          <n-form-item label="感悟笔记" path="notes">
            <n-input
              v-model:value="newRecord.notes"
              type="textarea"
              placeholder="记录您的修行感悟..."
              :rows="3"
            />
          </n-form-item>

          <n-space justify="end">
            <n-button @click="closeAddModal">取消</n-button>
            <n-button type="primary" @click="saveRecord">保存</n-button>
          </n-space>
        </n-form>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import {
  NCard,
  NSpace,
  NText,
  NIcon,
  NGrid,
  NGridItem,
  NStatistic,
  NButton,
  NModal,
  NForm,
  NFormItem,
  NSelect,
  NDatePicker,
  NInputNumber,
  NInput,
  NRate,
  useMessage,
} from "naive-ui";
import {
  AddOutline,
  ChevronBackOutline,
  ChevronForwardOutline,
} from "@vicons/ionicons5";

interface Record {
  id: number;
  type: string;
  date: string;
  time: string;
  duration: number;
  rating: number;
  notes: string;
}

interface CalendarDate {
  key: string;
  date: number;
  fullDate: string;
  currentMonth: boolean;
  hasRecord: boolean;
  records: Record[];
  isToday: boolean;
}

const message = useMessage();

// 当前显示的年月
const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth() + 1);

// 星期标题
const weekDays = ["日", "一", "二", "三", "四", "五", "六"];

// 修行类型选项
const typeOptions = [
  { label: "冥想", value: "冥想" },
  { label: "运动", value: "运动" },
  { label: "感恩", value: "感恩" },
  { label: "阅读", value: "阅读" },
  { label: "写作", value: "写作" },
];

// 模拟记录数据
const records = ref<Record[]>([
  {
    id: 1,
    type: "冥想",
    date: "2025-08-01",
    time: "07:00",
    duration: 20,
    rating: 5,
    notes: "晨间冥想，感觉很平静",
  },
  {
    id: 2,
    type: "运动",
    date: "2025-08-01",
    time: "18:00",
    duration: 30,
    rating: 4,
    notes: "跑步锻炼，身体状态不错",
  },
  {
    id: 3,
    type: "感恩",
    date: "2025-08-02",
    time: "21:00",
    duration: 10,
    rating: 5,
    notes: "感恩家人的支持",
  },
  {
    id: 4,
    type: "冥想",
    date: "2025-08-04",
    time: "08:00",
    duration: 15,
    rating: 4,
    notes: "今天的修行",
  },
]);

// 选中的日期
const selectedDate = ref("");
const selectedDateRecords = computed(() => {
  if (!selectedDate.value) return [];
  return records.value.filter((r) => r.date === selectedDate.value);
});

// 月度统计
const monthStats = computed(() => {
  const monthStr = `${currentYear.value}-${currentMonth.value
    .toString()
    .padStart(2, "0")}`;
  const monthRecords = records.value.filter((r) => r.date.startsWith(monthStr));

  const uniqueDays = new Set(monthRecords.map((r) => r.date)).size;
  const totalMinutes = monthRecords.reduce((sum, r) => sum + r.duration, 0);
  const avgRating =
    monthRecords.length > 0
      ? (
          monthRecords.reduce((sum, r) => sum + r.rating, 0) /
          monthRecords.length
        ).toFixed(1)
      : 0;

  return {
    days: uniqueDays,
    hours: (totalMinutes / 60).toFixed(1),
    rating: avgRating,
  };
});

// 日历日期计算
const calendarDates = computed(() => {
  const dates: CalendarDate[] = [];
  const firstDay = new Date(currentYear.value, currentMonth.value - 1, 1);
  const lastDay = new Date(currentYear.value, currentMonth.value, 0);
  const daysInMonth = lastDay.getDate();
  const startWeekDay = firstDay.getDay();

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${(today.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

  // 添加上月末尾的日期
  const prevMonth = new Date(currentYear.value, currentMonth.value - 2, 0);
  const prevMonthDays = prevMonth.getDate();
  for (let i = startWeekDay - 1; i >= 0; i--) {
    const date = prevMonthDays - i;
    const fullDate = `${currentYear.value}-${(currentMonth.value - 1)
      .toString()
      .padStart(2, "0")}-${date.toString().padStart(2, "0")}`;
    dates.push({
      key: `prev-${date}`,
      date,
      fullDate,
      currentMonth: false,
      hasRecord: false,
      records: [],
      isToday: false,
    });
  }

  // 添加当月日期
  for (let date = 1; date <= daysInMonth; date++) {
    const fullDate = `${currentYear.value}-${currentMonth.value
      .toString()
      .padStart(2, "0")}-${date.toString().padStart(2, "0")}`;
    const dayRecords = records.value.filter((r) => r.date === fullDate);

    dates.push({
      key: `current-${date}`,
      date,
      fullDate,
      currentMonth: true,
      hasRecord: dayRecords.length > 0,
      records: dayRecords,
      isToday: fullDate === todayStr,
    });
  }

  // 添加下月开头的日期
  const remainingDays = 42 - dates.length; // 6行 x 7天
  for (let date = 1; date <= remainingDays; date++) {
    const fullDate = `${currentYear.value}-${(currentMonth.value + 1)
      .toString()
      .padStart(2, "0")}-${date.toString().padStart(2, "0")}`;
    dates.push({
      key: `next-${date}`,
      date,
      fullDate,
      currentMonth: false,
      hasRecord: false,
      records: [],
      isToday: false,
    });
  }

  return dates;
});

// 添加记录相关
const showAddModal = ref(false);
const newRecord = ref({
  type: "",
  date: Date.now(),
  duration: 10,
  rating: 5,
  notes: "",
});

const rules = {
  type: { required: true, message: "请选择修行类型" },
  date: { required: true, message: "请选择日期" },
  duration: { required: true, message: "请输入时长" },
  rating: { required: true, message: "请评分" },
};

// 方法
const prevMonth = () => {
  if (currentMonth.value === 1) {
    currentMonth.value = 12;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};

const nextMonth = () => {
  if (currentMonth.value === 12) {
    currentMonth.value = 1;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};

const selectDate = (date: CalendarDate) => {
  if (date.currentMonth) {
    selectedDate.value = date.fullDate;
  }
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};

const getTypeColor = (type: string) => {
  const colors: { [key: string]: string } = {
    冥想: "#18a058",
    运动: "#2080f0",
    感恩: "#f0a020",
    阅读: "#722ed1",
    写作: "#d03050",
  };
  return colors[type] || "#666";
};

const closeAddModal = () => {
  showAddModal.value = false;
  newRecord.value = {
    type: "",
    date: Date.now(),
    duration: 10,
    rating: 5,
    notes: "",
  };
};

const saveRecord = () => {
  if (!newRecord.value.type) {
    message.error("请选择修行类型");
    return;
  }

  const date = new Date(newRecord.value.date);
  const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  const timeStr = `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  const record: Record = {
    id: Date.now(),
    type: newRecord.value.type,
    date: dateStr,
    time: timeStr,
    duration: newRecord.value.duration,
    rating: newRecord.value.rating,
    notes: newRecord.value.notes,
  };

  records.value.push(record);
  message.success("记录保存成功");
  closeAddModal();
};
</script>

<style scoped>
.records-container {
  padding: 16px;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  color: white;
}

.stats-card,
.calendar-card,
.date-details {
  margin: 16px 0;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
}

.week-day {
  text-align: center;
  padding: 8px;
  font-weight: bold;
  color: #666;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.calendar-date {
  aspect-ratio: 1;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.calendar-date:hover {
  background-color: rgba(32, 128, 240, 0.1);
  border-color: #2080f0;
}

.calendar-date.other-month {
  color: #ccc;
  cursor: default;
}

.calendar-date.other-month:hover {
  background-color: transparent;
  border-color: #e0e0e0;
}

.calendar-date.has-record {
  background-color: rgba(24, 160, 88, 0.1);
  border-color: #18a058;
}

.calendar-date.today {
  background-color: rgba(32, 128, 240, 0.2);
  border-color: #2080f0;
  font-weight: bold;
}

.date-number {
  font-size: 14px;
  margin-bottom: 4px;
}

.record-indicator {
  display: flex;
  gap: 2px;
  flex-wrap: wrap;
  justify-content: center;
}

.record-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.record-item {
  padding: 12px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.02);
  border-left: 4px solid transparent;
}

.type-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
</style>
