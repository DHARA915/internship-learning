const Button = ({ color, hover_color, text, icon }) => {
  return (
    <a
      className={`
        inline-flex items-center justify-center
        cursor-pointer
        min-h-[40px] sm:min-h-[48px]
        rounded-full
        ${color}
        px-4 py-2 sm:px-6 sm:py-3
        text-[14px] sm:text-[18px]
        font-semibold
        leading-5 sm:leading-6
        text-black
        whitespace-nowrap
        gap-1.5 sm:gap-2
        ${hover_color}
        focus:outline-none
        focus-visible:ring-2
      `}
    >
      {icon}
      {text}
    </a>
  );
};

export default Button;