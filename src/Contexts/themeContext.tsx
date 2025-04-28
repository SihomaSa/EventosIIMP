import { createContext, useContext, useEffect, useState } from "react";

interface ThemeContextType {
  theme: string;
  colors: {
    primary: string;
    secondary: string;
  };
  setTheme: (themeName: string, color?: string, subcolor?: string) => void;
  resetTheme: () => void;
  applyEventColors: (color: string, subcolor: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const baseThemeStyles = {
  '--radius': '0.625rem',
  '--background': 'oklch(1 0 0)',
  '--foreground': 'oklch(0.147 0.004 49.25)',
  '--card': 'oklch(1 0 0)',
  '--card-foreground': 'oklch(0.147 0.004 49.25)',
  '--popover': 'oklch(1 0 0)',
  '--popover-foreground': 'oklch(0.147 0.004 49.25)',
  '--primary-foreground': 'oklch(0.985 0.001 106.423)',
  '--secondary-foreground': 'oklch(6.18% 0.0154 67.65)',
  '--muted': 'oklch(0.97 0.001 106.424)',
  '--muted-foreground': 'oklch(0.553 0.013 58.071)',
  '--accent': 'oklch(0.97 0.001 106.424)',
  '--accent-foreground': 'oklch(0.216 0.006 56.043)',
  '--destructive': 'oklch(0.577 0.245 27.325)',
  '--border': 'oklch(0.923 0.003 48.717)',
  '--input': 'oklch(0.923 0.003 48.717)',
  '--ring': 'oklch(0.709 0.01 56.259)',
  '--chart-1': 'oklch(0.646 0.222 41.116)',
  '--chart-2': 'oklch(0.6 0.118 184.704)',
  '--chart-3': 'oklch(0.398 0.07 227.392)',
  '--chart-4': 'oklch(0.828 0.189 84.429)',
  '--chart-5': 'oklch(0.769 0.188 70.08)',
  '--sidebar-foreground': 'oklch(1 0 0)',
  '--sidebar-primary-foreground': 'oklch(0.985 0.001 106.423)',
  '--sidebar-accent-foreground': 'oklch(1 0 0)',
  '--sidebar-border': 'oklch(0.923 0.003 48.717)',
  '--sidebar-ring': 'oklch(0.709 0.01 56.259)'
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<string>(() => localStorage.getItem("theme") || "");
  const [colors, setColors] = useState(() => ({
    primary: localStorage.getItem("primaryColor") || 'oklch(68.32% 0.162 56.49)',
    secondary: localStorage.getItem("secondaryColor") || 'oklch(97.17% 0.0154 67.65)'
  }));

  useEffect(() => {
    const root = document.documentElement;
    
    // Aplica estilos base
    Object.entries(baseThemeStyles).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Aplica tema y colores
    root.className = theme;
    applyColorsToRoot(colors.primary, colors.secondary);
    
  }, [theme, colors]);

  const applyColorsToRoot = (primary: string, secondary: string) => {
    const root = document.documentElement;
    root.style.setProperty('--primary', primary);
    root.style.setProperty('--secondary', secondary);
    root.style.setProperty('--sidebar', primary);
    root.style.setProperty('--sidebar-primary', primary);
    root.style.setProperty('--sidebar-accent', secondary);
  };

  const applyEventColors = (color: string, subcolor: string) => {
    const newColors = {
      primary: color,
      secondary: subcolor
    };
    setColors(newColors);
    localStorage.setItem("primaryColor", color);
    localStorage.setItem("secondaryColor", subcolor);
    applyColorsToRoot(color, subcolor);
  };

  const setTheme = (themeName: string, color?: string, subcolor?: string) => {
    setThemeState(themeName);
    localStorage.setItem("theme", themeName);
    if (color && subcolor) {
      applyEventColors(color, subcolor);
    }
  };

  const resetTheme = () => {
    setThemeState("");
    setColors({
      primary: 'oklch(68.32% 0.162 56.49)',
      secondary: 'oklch(97.17% 0.0154 67.65)'
    });
    localStorage.removeItem("theme");
    localStorage.removeItem("primaryColor");
    localStorage.removeItem("secondaryColor");
    document.documentElement.className = "";
    applyColorsToRoot(
      'oklch(68.32% 0.162 56.49)',
      'oklch(97.17% 0.0154 67.65)'
    );
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      colors, 
      setTheme, 
      resetTheme, 
      applyEventColors 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme debe ser usado dentro de ThemeProvider");
  }
  return context;
};