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
        group
        relative
        overflow-hidden
        transition-all duration-200
      `}
    >
  
    {
      icon && (

      <div className="relative h-5 sm:h-6 w-6 overflow-hidden">
        {/* Original icon */}
        <span
          className="
            absolute inset-0
            flex items-center justify-center
            translate-x-0
            transition-transform duration-300 ease-out
            group-hover:translate-x-full
          "
        >
          {icon}
        </span>

        {/* New icon */}
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
      </div>
      )
    }



      <div className="relative h-[24px] overflow-hidden block">
        {/* For current text */}
        <span className="block transition-transform duration-200 ease-out group-hover:-translate-y-full">
          {text}
        </span>
        {/* for slide up text */}
        <span className="absolute inset-0 flex items-center justify-center translate-y-full transition-transform duration-200 ease-out group-hover:translate-y-0">
          {text}
        </span>
      </div>
    </a>
  );
};

export default Button;

<button
  class="group relative h-12 px-6 font-semibold text-white bg-green-600 rounded-lg overflow-hidden transition-all duration-300 hover:bg-gray-500 active:scale-95"
>
  {/* <!-- Default Text: fades + moves upward --> */}
  <span
    class="block transition-all duration-300 ease-out group-hover:-translate-y-8 group-hover:opacity-0"
  >
    Hover Me
  </span>

  {/* <!-- Hover Text: fades + moves upward from below --> */}
  <span
    class="absolute inset-0 flex items-center justify-center translate-y-8 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100"
  >
    Goodbye!
  </span>
</button>