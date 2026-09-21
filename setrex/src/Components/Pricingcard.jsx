import React from 'react'
import { ArrowRight, CircleCheck } from 'lucide-react'
import Button from './Button'   // adjust path to your Button file

const Pricingcard = ({
    icon,                          // any React node, e.g. <Rocket size={20} />
    title,                         // "Starter Plan"
    description,                   // short text under the title
    price,                         // "$149"
    period = "/year",             // "/ year", "/ month"
    featuresTitle = "What's Included:",
    features = [],                 // ["Feature 1", "Feature 2", ...]
    buttonText = "Get Started Now",
    badge,                         // "Most Popular" (optional)
    highlighted = false,           // true = lime card, false = dark card
    className = "",
}) => {
    return (
        <div
            className={`relative flex flex-col w-full rounded-[8px] p-[24px] lg:p-[24px] ${
                highlighted
                    ? "bg-[#d0ff1f] text-black"
                    : "bg-gradient-to-br from-[#1c1c1c] to-[#0c0c0f] text-white border border-white/10"
            } ${className}`}
        >
            {/* Badge */}
            {badge && (
                <span className="absolute top-[24px] right-[24px] rounded-[6px] bg-white px-[10px] py-[4px] text-[12px] font-medium text-black">
                    {badge}
                </span>
            )}

            {/* Icon */}
            {icon && <div className="mb-[24px]">{icon}</div>}

            {/* Title + description */}
            <h3 className="text-[28px] font-medium leading-[36px]">{title}</h3>
            <p className={`mt-[12px] text-[14px] leading-[20px] ${highlighted ? "text-black/60" : "text-white/60"}`}>
                {description}
            </p>

            {/* Price */}
            <div className={`mt-[32px] flex items-end gap-2 border-y py-[16px] ${highlighted ? "border-black/10" : "border-white/10"}`}>
                <span className="text-[36px] font-medium leading-[44px]">{price}</span>
                <span className={`pb-[6px] text-[12px] ${highlighted ? "text-black/60" : "text-white/60"}`}>{period}</span>
            </div>

            {/* Features */}
            <h4 className="mt-[32px] text-[18px] font-medium">{featuresTitle}</h4>
            <ul className="mt-[16px] mb-[40px] flex flex-col gap-[12px] font-medium">
                {features.map((item, i) => (
                    <li key={i} className="flex items-center gap-[10px] text-[14px]">
                        <CircleCheck size={16} className="shrink-0" />
                        <span>{item}</span>
                    </li>
                ))}
            </ul>

            {/* Button (pushed to bottom so both cards align) */}
            <div className="mt-auto">
                <Button
                    text={buttonText}
                    icon={<ArrowRight size={16} />}
                   color={highlighted ? "bg-white" : "bg-black"}
hover_color={highlighted ? "hover:bg-black" : "hover:bg-secondary"}
className={`w-full !h-[52px] ${highlighted ? "!text-black hover:!text-white" : "!text-white hover:!text-black"}`}
                   
                />
            </div>
        </div>
    )
}

export default Pricingcard