# 觉行助手 (Jue Xing) - AI Coding Instructions

## Project Overview

觉行助手 is a cross-platform mindfulness and personal development application built with Tauri + Vue 3 + TypeScript. Born from the need to address modern life's fast pace and entertainment-driven culture, this app helps users combat inner emptiness and anxiety through comprehensive body-mind-spirit practice.

The app enables users to set practice goals (long-term like maintaining physical strength/coordination/flexibility, or short-term like reading specific books or learning piano pieces), create detailed practice plans, and track their daily progress with reflections. It's designed as a mobile-first experience with Android as the primary target.

## Architecture & Tech Stack

### Core Structure

- **Frontend**: Vue 3 + TypeScript + Naive UI + Vue Router
- **Backend**: Rust via Tauri (local SQLite planned)
- **Build System**: Vite + Tauri CLI
- **Package Manager**: pnpm
- **Workspace**: Rust workspace with single Tauri app member

### Key Directories

```
jue_xing_app/
├── src/
│   ├── views/          # Page components (Home, Practice, Records, Profile)
│   ├── components/     # Reusable components
│   ├── router/         # Vue Router configuration
│   └── types/          # TypeScript declarations
├── src-tauri/          # Rust backend code
└── specs/              # Requirements documentation (Chinese)
```

## Development Workflows

### Essential Commands

```bash
# Development (mobile-first Android)
cd jue_xing_app && pnpm tauri:android

# Desktop development
cd jue_xing_app && pnpm tauri:desktop

# Web development (debugging UI only)
cd jue_xing_app && pnpm dev

# Build for Android
cd jue_xing_app && pnpm tauri:android:build
```

### Tauri Configuration

- App identifier: `com.sheng.jue_xing_app`
- Dev server: http://localhost:1420
- Mobile-first design with safe area considerations
- Chinese product name: "觉行助手"

## Code Patterns & Conventions

### Vue Component Structure

**Standard pattern for views:**

```vue
<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { NCard, NButton, etc } from "naive-ui";
import { IconName } from "@vicons/ionicons5";

// State management with refs
const data = ref([]);
const router = useRouter();

// Functions
const handleAction = () => {
  // Implementation
};
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <!-- Page title with white text -->
    </div>
    <n-card class="content-card" :bordered="false">
      <!-- Main content -->
    </n-card>
  </div>
</template>

<style scoped>
/* Mobile-first responsive design */
</style>
```

### Navigation & Routing

- **Bottom navigation pattern**: 4 main tabs (Home/首页, Practice/计划, Records/记录, Profile/我的)
- **Route naming**: Use PascalCase route names that match view component names
- **Navigation method**: `router.push({ name: "RouteName" })` for consistency
- **Active state**: Computed based on `route.name`

### UI Component Usage

- **Design system**: Naive UI with green primary color (`#18a058`)
- **Icons**: @vicons/ionicons5 with `Outline` suffix variants
- **Theme**: Dark/light theme support via `NConfigProvider`
- **Mobile adaptations**: Safe area padding, responsive font sizes

### State Management

- **Local state**: Vue 3 Composition API with `ref()` and `computed()`
- **No global store**: Each view manages its own data (future: consider Pinia)
- **Mock data**: Currently using static data arrays in components

### Styling Conventions

- **Mobile-first**: Base styles for mobile, desktop adaptations via media queries
- **Class naming**: kebab-case with descriptive prefixes (`.page-header`, `.nav-item`)
- **Colors**: White text on gradient backgrounds, neutral grays for content
- **Safe areas**: Support for `env(safe-area-inset-bottom)` on mobile

## Integration Points

### Tauri Backend

- **Current state**: Basic Tauri setup with single `greet` command
- **Planned**: SQLite integration for data persistence
- **Commands**: Use `#[tauri::command]` for Rust functions callable from frontend
- **AI Integration**: Future integration for personalized practice recommendations

### Module Declarations

- **Type safety**: Custom declarations in `src/types/declarations.d.ts`
- **Required for**: naive-ui, @vicons/ionicons5, vue-router compatibility

## Core Data Models & Features

### Data Architecture

The app follows a hierarchical data model:

- **修行目标 (Practice Goals)**: Long-term (physical strength, coordination, flexibility) or short-term (read specific books, learn piano pieces)
- **修行计划 (Practice Plans)**: Specific, measurable plans (e.g., "read 50 pages of '刀锋' daily", "100 squats daily", "20 min meditation daily")
- **修行记录 (Practice Records)**: Daily logs with specific quantities and reflections
- **修行报告 (Practice Reports)**: Generated periodic reports (monthly, quarterly, semi-annual, annual)
- **修行成就 (Practice Achievements)**: Accumulated accomplishments and milestones

### Core Features

1. **Goal & Plan Management**: Set personal goals and create specific practice plans with system guidance
2. **Practice Reminders**: Regular notifications for meditation, exercise, and other practice activities
3. **Practice Recording**: Log daily practice with quantities and personal reflections
4. **Progress Reports**: Automated generation of practice analysis and improvement suggestions
5. **Achievement Display**: Showcase practice results (meditation time, exercise volume) for motivation

### UI Pages & Functions

1. **首页 (Home)**: Display practice plans, reminders, and execution records
2. **计划 (Practice)**: Create, edit, delete goals and plans with system recommendations
3. **记录 (Records)**: Calendar view of practice records with daily detail access
4. **我的 (Profile)**: View achievements, settings (AI model configuration, API keys), system preferences

## Project-Specific Context

### Business Domain

- **Chinese UX**: Interface is in Chinese, targeting Chinese-speaking users
- **Mindfulness focus**: Features around meditation, goal setting, habit tracking
- **Mobile experience**: Android-first, touch-friendly interactions
- **Practice-oriented**: Focus on body-mind-spirit cultivation with specific, measurable activities

### Development Notes

- **Responsive breakpoint**: 768px for mobile/desktop distinction
- **Icon requirement**: Use Outline variants from Ionicons5 for consistency
- **Navigation pattern**: Bottom tab bar with active state highlighting
- **Progress visualization**: Heavy use of progress bars and statistics
- **Data specificity**: Practice plans must be concrete with measurable goals
- **Reflection integration**: All practice records should include both quantities and personal insights

When working on this codebase, prioritize mobile experience, maintain the Chinese language interface, and follow the established navigation patterns. The app is in active development with plans for data persistence and AI integration.
