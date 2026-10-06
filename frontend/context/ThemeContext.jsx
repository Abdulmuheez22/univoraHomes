import { createContext, useState } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [sharedData, setSharedData] = useState(null);
  return (
    <ThemeContext.Provider value={{ sharedData, setSharedData }}>
      {children}
    </ThemeContext.Provider>
  );
};
