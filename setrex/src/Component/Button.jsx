const Button = ({ text, href = "/contact" }) => {
    return (
        <a
            href={href}
            className="inline-flex items-center justify-center rounded-full
                       bg-primary px-4 py-2
                       text-[15px] font-bold     text-black
                       transition-colors duration-300
                       hover:bg-lime-400"
        >
            {text}
        </a>
    );
};

export default Button;