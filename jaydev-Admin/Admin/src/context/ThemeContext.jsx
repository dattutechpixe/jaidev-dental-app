import { createContext, useEffect, useState } from "react";
export const ThemeContext = createContext(null);
export const ThemeProvider = ({children}) => {
    const [sideBar,setsideBar]= useState("#121212");
    const [Header,setHeader]= useState("#121212");
    const changeSiderBar = (color) => {
        setsideBar(color);
        localStorage.setItem("sidebarColor",color);
    }
    const changeHeader = (color) => {
        setHeader(color);
        localStorage.setItem("headerColor",color);
    }
    useEffect(() => {
     const sidebarColor = localStorage.getItem("sidebarColor");
     const headerColor = localStorage.getItem("headerColor");
        if (sidebarColor) setsideBar(sidebarColor);
        if (headerColor) setHeader(headerColor);
    },[]);

    return <ThemeContext.Provider value={{sideBar,Header,changeSiderBar,changeHeader}}>
        {children}
    </ThemeContext.Provider>;
};