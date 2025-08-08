// 觉行助手主题配置
export interface AppTheme {
  // 背景配置
  background: {
    primary: string;
    secondary: string;
    gradient: string;
  };
  // 颜色配置
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    text: {
      primary: string;
      secondary: string;
      light: string;
      onPrimary: string;
    };
  };
  // 布局配置
  layout: {
    padding: {
      page: string;
      card: string;
      section: string;
    };
    borderRadius: {
      card: string;
      button: string;
      input: string;
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
  };
  // 阴影配置
  shadows: {
    card: string;
    header: string;
    floating: string;
  };
}

// 默认主题（觉行风格）
export const defaultTheme: AppTheme = {
  background: {
    primary: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    secondary: "#f8f9fa",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  colors: {
    primary: "#18a058",
    secondary: "#667eea",
    accent: "#f0a020",
    success: "#18a058",
    warning: "#f0a020",
    error: "#e74c3c",
    text: {
      primary: "#333333",
      secondary: "#666666",
      light: "#999999",
      onPrimary: "#ffffff",
    },
  },
  layout: {
    padding: {
      page: "0 16px 80px 16px",
      card: "20px",
      section: "16px",
    },
    borderRadius: {
      card: "12px",
      button: "8px",
      input: "6px",
    },
    spacing: {
      xs: "4px",
      sm: "8px",
      md: "16px",
      lg: "24px",
      xl: "32px",
    },
  },
  shadows: {
    card: "0 2px 8px rgba(0, 0, 0, 0.1)",
    header: "0 2px 4px rgba(0, 0, 0, 0.1)",
    floating: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
};

// 主题CSS变量生成器
export const generateThemeVars = (theme: AppTheme): Record<string, string> => {
  return {
    "--app-bg-primary": theme.background.primary,
    "--app-bg-secondary": theme.background.secondary,
    "--app-bg-gradient": theme.background.gradient,
    "--app-color-primary": theme.colors.primary,
    "--app-color-secondary": theme.colors.secondary,
    "--app-color-accent": theme.colors.accent,
    "--app-color-success": theme.colors.success,
    "--app-color-warning": theme.colors.warning,
    "--app-color-error": theme.colors.error,
    "--app-text-primary": theme.colors.text.primary,
    "--app-text-secondary": theme.colors.text.secondary,
    "--app-text-light": theme.colors.text.light,
    "--app-text-on-primary": theme.colors.text.onPrimary,
    "--app-padding-page": theme.layout.padding.page,
    "--app-padding-card": theme.layout.padding.card,
    "--app-padding-section": theme.layout.padding.section,
    "--app-radius-card": theme.layout.borderRadius.card,
    "--app-radius-button": theme.layout.borderRadius.button,
    "--app-radius-input": theme.layout.borderRadius.input,
    "--app-spacing-xs": theme.layout.spacing.xs,
    "--app-spacing-sm": theme.layout.spacing.sm,
    "--app-spacing-md": theme.layout.spacing.md,
    "--app-spacing-lg": theme.layout.spacing.lg,
    "--app-spacing-xl": theme.layout.spacing.xl,
    "--app-shadow-card": theme.shadows.card,
    "--app-shadow-header": theme.shadows.header,
    "--app-shadow-floating": theme.shadows.floating,
  };
};
