const Button = ({
  color,
  hover_color,
  text,
  icon,
  slide = true,
  shadow = false,
  className=""
}) => {
  return (
    <a
      className={`
        inline-flex items-center justify-center
        cursor-pointer
        min-h-[40px] sm:min-h-[48px]
        !font-[600]
        rounded-full
        ${color}
       py-[11px] px-[24px]
        text-[18px]
        font-medium
        leading-5 sm:leading-6
        text-black
        whitespace-nowrap
        gap-1.5 sm:gap-2
        ${hover_color}

        ${shadow
         ? "group-hover/feature:shadow-[0_0_30px_rgba(207,254,37,0.65)]"
  : ""
        }

        ${className}

        focus:outline-none
        focus-visible:ring-2
        group
        relative
        overflow-hidden
        transition-all duration-300
      `}
    >
      {/* ICON */}
      {icon && (
        <div className="relative h-5 sm:h-6 w-6 overflow-hidden">
          
          {/* Original icon */}
          <span
            className={`
              absolute inset-0
              flex items-center justify-center
              ${
                slide
                  ? "translate-x-0 transition-transform duration-300 ease-out group-hover:translate-x-full"
                  : ""
              }
            `}
          >
            {icon}
          </span>

          {/* New icon */}
          {slide && (
            <span
              className="
                absolute inset-0
                flex items-center justify-center
                -translate-x-full
                transition-transform duration-300 ease-out
                group-hover:translate-x-0
              "
            >
              {icon}
            </span>
          )}
        </div>
      )}

      {/* TEXT */}
      <div className="relative h-[24px] overflow-hidden block">
        
        {/* Current text */}
        <span
          className={`
            block
            ${
              slide
                ? "transition-transform duration-200 ease-out group-hover:-translate-y-full"
                : ""
            }
          `}
        >
          {text}
        </span>

        {/* Sliding text */}
        {slide && (
          <span
            className="
              absolute inset-0
              flex items-center justify-center
              translate-y-full
              transition-transform duration-200 ease-out
              group-hover:translate-y-0
            "
          >
            {text}
          </span>
        )}
      </div>
    </a>
  );
};

export default Button;