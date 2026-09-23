import { ReceiptEuroIcon } from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react";

const themeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "light";
    })


    useEffect(() => {
        const root = document.documentElement;

        if (theme === "dark") {
            root.setAttribute("data-dark", "");
        }
        else {
            root.removeAttribute("data-dark");
        }

        localStorage.setItem("theme", theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme((currentTheme) =>
            currentTheme === "light" ? "dark" : "light"
        );
    }

    return (
        <themeContext.Provider
            value={{
                theme,
                setTheme,
                toggleTheme,
            }}
        >
            {children}
        </themeContext.Provider>
    )

}

export const useTheme = () => {
    const context = useContext(themeContext);
    if (!context) {
        throw new Error("useTheme must be used inside ThemeProvider");
    }

    return context;
}