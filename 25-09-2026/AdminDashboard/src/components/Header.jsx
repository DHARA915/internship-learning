
// import { SidebarTrigger } from "./ui/sidebar";
// import { NAV_ITEMS } from "./sidebar/config";
// import { useLocation } from "react-router-dom";
// import { Moon, Sun } from "lucide-react";
// // import { useTheme } from "@/context/ThemeContext";

// const Header = () => {
//   const location = useLocation();

//   // const { theme, toggleTheme } = useTheme();

//   const currentItem = NAV_ITEMS.find(
//     (item) => item.to === location.pathname
//   );

//   return (
//     <header className="flex h-17 items-center justify-between border-b border-border bg-background px-6 text-foreground">
//       {/* Left Section */}
//       <div className="flex items-center">
//         <SidebarTrigger
//           className="
//             text-foreground
//             hover:bg-secondary
//             hover:text-secondary-foreground
//           "
//         />

//         <h1 className="ml-4 text-xl font-semibold">
//           {currentItem?.label || "Dashboard"}
//         </h1>
//       </div>

//     </header>
//   );
// };

// export default Header;

import { SidebarTrigger } from "./ui/sidebar";
import { NAV_ITEMS } from "./sidebar/config";
import { useLocation } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
// import { useTheme } from "@/context/ThemeContext";

const Header = () => {
  const location = useLocation();

  // const { theme, toggleTheme } = useTheme();

  const currentItem = NAV_ITEMS.find(
    (item) => item.to === location.pathname
  );

  return (
    <header className="flex h-20 items-center border-b border-border bg-background px-4 text-tertiary">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="h-9 w-9 rounded-lg text-secondary hover:bg-secondary hover:text-tertiary" />

        <h1 className="text-lg font-semibold text-tertiary">
          {currentItem?.label || "Dashboard"}
        </h1>
      </div>
    </header>
  );
};

export default Header;