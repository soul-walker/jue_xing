# 觉行助手 - Android 开发指南

## 环境要求

1. **Android Studio**: 确保已安装最新版本的 Android Studio
2. **Android SDK**: 通过 Android Studio 安装 Android SDK
3. **Java JDK**: 确保安装了 JDK 17 或更高版本
4. **Rust**: 确保安装了 Rust 工具链
5. **Android 目标**: 需要安装 Android Rust 目标

## 环境配置

### 1. 添加 Android Rust 目标

```bash
rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android
```

### 2. 安装 NDK

通过 Android Studio 的 SDK Manager 安装 Android NDK

### 3. 设置环境变量

确保以下环境变量正确设置：

- `ANDROID_HOME` 或 `ANDROID_SDK_ROOT`: Android SDK 路径
- `NDK_HOME`: Android NDK 路径
- `JAVA_HOME`: JDK 路径

## 开发命令

### 启动 Android 开发模式

```bash
pnpm run tauri:android
```

### 在 Android Studio 中打开项目

```bash
pnpm run tauri:android:open
```

### 构建 Android APK

```bash
pnpm run tauri:android:build
```

### 桌面开发模式（对比测试）

```bash
pnpm run tauri:desktop
```

## 调试设备

### 物理设备

1. 在手机上启用开发者选项和 USB 调试
2. 使用 USB 连接电脑
3. 确认设备授权

### 模拟器

1. 在 Android Studio 中创建 AVD (Android Virtual Device)
2. 启动模拟器

### 检查连接的设备

```bash
adb devices
```

## 项目结构

- `src-tauri/`: Rust 后端代码
- `src-tauri/gen/android/`: 生成的 Android 项目文件
- `src/`: Vue3 前端代码
- `dist/`: 构建后的前端文件

## 故障排除

### 1. 找不到 adb 命令

确保 Android SDK 的 platform-tools 目录已添加到 PATH 环境变量中。

### 2. 构建失败

- 检查 Android SDK 和 NDK 是否正确安装
- 确保所有 Rust 目标已安装
- 检查环境变量设置

### 3. 设备连接问题

- 确保 USB 调试已启用
- 重新授权设备
- 尝试重启 adb: `adb kill-server && adb start-server`

## 热重载

在开发模式下，前端代码会自动热重载。后端 Rust 代码修改后需要重新启动开发服务器。
