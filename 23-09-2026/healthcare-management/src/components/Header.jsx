// // import React from 'react'
// // import { SidebarTrigger } from './ui/sidebar'
// // import { NAV_ITEMS } from './sidebar/config'
// // import { useLocation } from 'react-router-dom'
// // import { Moon, Sun } from "lucide-react";
// // import { useTheme } from '@/context/ThemeContext';

// // const Header = () => {

// //   const location = useLocation();
  
// //   const {theme, toggleTheme} = useTheme()


// //   const currentItem = NAV_ITEMS.find(
// //     (item)=>item.to===location.pathname
    
// //   )

// //   console.log("Current Item:" , currentItem)

// //   return (
// //    <header className="flex h-16 items-center border-b px-6">
// //       <SidebarTrigger />

// //       <h1 className="ml-4 text-xl font-semibold">
// //       {currentItem.label}
// //       </h1>
// //     </header>
// //   )
// // }

// // export default Header

// import { SidebarTrigger } from "./ui/sidebar";
// import { NAV_ITEMS } from "./sidebar/config";
// import { useLocation } from "react-router-dom";
// import { Moon, Sun } from "lucide-react";
// import { useTheme } from "@/context/ThemeContext";

// const Header = () => {
//   const location = useLocation();

//   const { theme, toggleTheme } = useTheme();

//   const currentItem = NAV_ITEMS.find(
//     (item) => item.to === location.pathname
//   );

//   return (
//     <header className="flex h-17 items-center justify-between border-b px-6 dark:border-slate-800 border-slate-100 
//         dark:bg-slate-950
//         dark:text-white">
//       {/* Left Section */}
//       <div className="flex items-center">
//         <SidebarTrigger />

//         <h1 className="ml-4 text-xl font-semibold">
//           {currentItem?.label || "Dashboard"}
//         </h1>
//       </div>

//       {/* Right Section */}
//       <button
//         type="button"
//         onClick={toggleTheme}
//         className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
//         aria-label="Toggle theme"
//       >
//         {theme === "dark" ? (
//           <Sun className="h-4 w-4" />
//         ) : (
//           <Moon className="h-4 w-4" />
//         )}
//       </button>
//     </header>
//   );
// };

// export default Header;


import { SidebarTrigger } from "./ui/sidebar";
import { NAV_ITEMS } from "./sidebar/config";
import { useLocation } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";z

const Header = () => {
  const location = useLocation();

  const { theme, toggleTheme } = useTheme();

  const currentItem = NAV_ITEMS.find(
    (item) => item.to === location.pathname
  );

  return (
    <header className="flex h-17 items-center justify-between border-b border-border bg-background px-6 text-foreground">
      {/* Left Section */}
      <div className="flex items-center">
        <SidebarTrigger
          className="
            text-foreground
            hover:bg-secondary
            hover:text-secondary-foreground
          "
        />

        <h1 className="ml-4 text-xl font-semibold">
          {currentItem?.label || "Dashboard"}
        </h1>
      </div>

      {/* Right Section */}
      <button
        type="button"
        onClick={toggleTheme}
        className="
          flex h-9 w-9 items-center justify-center
          rounded-md
          border border-border
          bg-secondary
          text-secondary-foreground
          transition-colors
          hover:bg-secondary/80
        "
        aria-label="Toggle theme"
      >
        {theme === "dark" ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </button>
    </header>
  );
};

export default Header;

