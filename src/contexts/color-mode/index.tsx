import { ThemeProvider } from "@mui/material/styles";
import { RefineThemes } from "@refinedev/mui";
import React, { PropsWithChildren, createContext, useEffect, useState } from "react";

type ColorModeContextType = {
  mode: string;
  setMode: () => void;
};

export const ColorModeContext = createContext<ColorModeContextType>({} as ColorModeContextType);

export const ColorModeContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const colorModeFromLocalStorage = "light";
  // const isSystemPreferenceDark = window?.matchMedia("(prefers-color-scheme: dark)").matches;

  const systemPreference = "light";
  const [mode, setMode] = useState(colorModeFromLocalStorage || systemPreference);

  useEffect(() => {
    window.localStorage.setItem("colorMode", "light");
  }, [mode]);

  const setColorMode = () => {
    setMode("light");
  };

  return (
    <ColorModeContext.Provider
      value={{
        setMode: setColorMode,
        mode,
      }}
    >
      <ThemeProvider
        // you can change the theme colors here. example: mode === "light" ? RefineThemes.Magenta : RefineThemes.MagentaDark
        theme={mode === "light" ? RefineThemes.Green : RefineThemes.RedDark}
      >
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
