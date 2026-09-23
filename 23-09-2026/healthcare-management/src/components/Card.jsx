
// import React from "react";

// const Card = () => {
//   return (
//     <div 
//       className="
//         block max-w-sm
//         rounded-lg
//         border border-slate-200
//         bg-white
//         p-6
//         shadow-sm
//         transition-colors

//         dark:border-slate-800
//         dark:bg-slate-950
//       "
//     >
//       <h5
//         className="
//           mb-3
//           text-2xl
//           font-semibold
//           leading-8
//           tracking-tight
//           text-slate-900

//           dark:text-white
//         "
//       >
//         Noteworthy technology acquisitions 2021
//       </h5>

//       <p
//         className="
//           mb-6
//           text-slate-600

//           dark:text-slate-400
//         "
//       >
//         Here are the biggest technology acquisitions of 2025 so far, in
//         reverse chronological order.
//       </p>

//       <a
//         href="#"
//         className="
//           inline-flex
//           items-center
//           rounded-md
//           border
//           border-transparent
//           bg-teal-600
//           px-4
//           py-2.5
//           text-sm
//           font-medium
//           leading-5
//           text-white
//           shadow-sm
//           transition-colors

//           hover:bg-teal-700

//           focus:outline-none
//           focus:ring-4
//           focus:ring-teal-200

//           dark:bg-teal-500
//           dark:hover:bg-teal-400
//           dark:focus:ring-teal-800
//         "
//       >
//         Read more

//         <svg
//           className="ms-1.5 h-4 w-4 -me-0.5 rtl:rotate-180"
//           aria-hidden="true"
//           xmlns="http://www.w3.org/2000/svg"
//           width="24"
//           height="24"
//           fill="none"
//           viewBox="0 0 24 24"
//         >
//           <path
//             stroke="currentColor"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth="2"
//             d="M19 12H5m14 0-4 4m4-4-4-4"
//           />
//         </svg>
//       </a>
//     </div>
//   );
// };

// export default Card;

import React from "react";

const Card = () => {
  return (
    <div
      className="
        block max-w-sm
        rounded-lg
        border border-border
        bg-card
        p-6
        shadow-sm
        transition-colors
      "
    >
      <h5
        className="
          mb-3
          text-2xl
          font-semibold
          leading-8
          tracking-tight
          text-card-foreground
        "
      >
        Noteworthy technology acquisitions 2021
      </h5>

      <p
        className="
          mb-6
          text-muted-foreground
        "
      >
        Here are the biggest technology acquisitions of 2025 so far, in
        reverse chronological order.
      </p>

      <a
        href="#"
        className="
          inline-flex
          items-center
          rounded-md
          border
          border-transparent
          bg-primary
          px-4
          py-2.5
          text-sm
          font-medium
          leading-5
          text-primary-foreground
          shadow-sm
          transition-colors

          hover:bg-secondary
          hover:text-secondary-foreground

          focus:outline-none
          focus:ring-4
          focus:ring-primary/30
        "
      >
        Read more

        <svg
          className="ms-1.5 h-4 w-4 -me-0.5 rtl:rotate-180"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 12H5m14 0-4 4m4-4-4-4"
          />
        </svg>
      </a>
    </div>
  );
};

export default Card;