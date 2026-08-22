const palette = {
  primary: "#0B3B8C",
  primaryDark: "#082a66",
  highlightBg: "#E8EEF9",
  background: "#F7F8FA",
  surface: "#FFFFFF",
  text: "#1A1C1E",
  textSecondary: "#5A6472",
  success: "#1B7A3D",
  error: "#B3261E",
  warning: "#8A5A00",
  border: "#DCE1E8",
};

const highContrastPalette = {
  primary: "#000000",
  primaryDark: "#000000",
  highlightBg: "#000000",
  background: "#000000",
  surface: "#000000",
  text: "#FFFFFF",
  textSecondary: "#FFFFFF",
  success: "#7CFC9A",
  error: "#FF6B60",
  warning: "#FFD400",
  border: "#FFFFFF",
  focus: "#FFD400",
};

const spacing = (multiplier = 1) => 8 * multiplier;

const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
};

const baseFontSizes = {
  caption: 13,
  body: 16,
  bodyLarge: 18,
  title: 20,
  heading: 24,
  display: 28,
};

// fontScale: 1 = 100%, 1.25 = 125%, 1.5 = 150% (ver AccessibilityContext)
export function buildTheme({ highContrast = false, fontScale = 1 } = {}) {
  const colors = highContrast
    ? { ...palette, ...highContrastPalette }
    : { ...palette, focus: "#0B3B8C" };

  const fontSizes = Object.fromEntries(
    Object.entries(baseFontSizes).map(([key, value]) => [key, Math.round(value * fontScale)])
  );

  return {
    colors,
    spacing,
    radii,
    fontSizes,
    fontScale,
    highContrast,
    minTouchSize: 44,
  };
}

export const defaultTheme = buildTheme();