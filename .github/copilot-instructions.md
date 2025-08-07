# 觉行助手 (Jue Xing) - AI Coding Instructions

## Project Overview

觉行助手 is a cross-platform mindfulness and personal development application built with Tauri + Vue 3 + TypeScript. The app helps users manage spiritual/mental practice goals, track daily meditation/exercise records, and view progress reports. It's designed as a mobile-first experience with Android as the primary target.

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
│   ├── views/          # Page components (Home, Goals, Records, Achievements)
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

- **Bottom navigation pattern**: 4 main tabs (Home/首页, Goals/目标, Records/记录, Achievements/成就)
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

### Module Declarations

- **Type safety**: Custom declarations in `src/types/declarations.d.ts`
- **Required for**: naive-ui, @vicons/ionicons5, vue-router compatibility

## Project-Specific Context

### Business Domain

- **Chinese UX**: Interface is in Chinese, targeting Chinese-speaking users
- **Mindfulness focus**: Features around meditation, goal setting, habit tracking
- **Mobile experience**: Android-first, touch-friendly interactions

### Development Notes

- **Responsive breakpoint**: 768px for mobile/desktop distinction
- **Icon requirement**: Use Outline variants from Ionicons5 for consistency
- **Navigation pattern**: Bottom tab bar with active state highlighting
- **Progress visualization**: Heavy use of progress bars and statistics

When working on this codebase, prioritize mobile experience, maintain the Chinese language interface, and follow the established navigation patterns. The app is in active development with plans for data persistence and AI integration.
