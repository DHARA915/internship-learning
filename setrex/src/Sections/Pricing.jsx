import React from 'react'
import { useState } from 'react';
import { Rocket, Zap } from 'lucide-react'
import Pricingcard from '../Components/Pricingcard';

const Pricing = () => {

    const [yearly, setYearly] = useState(false);

    const plans = [
  {
    icon: <Rocket size={20} />,
    title: "Starter Plan",
    description: "Perfect for small businesses and startups looking to establish their digital presence.",
    price: "$149",
    period: "/monthly",
    features: ["Basic strategy consultation", "Social media setup", "Monthly performance reports", "Dedicated Support Team"],
  },
  {
    icon: <Zap size={20} />,
    title: "Enterprise Plan",
    description: "Solutions tailored for large businesses to optimize performance and drive innovation.",
    price: "$599",
    period: "/monthly",
    badge: "Most Popular",
    highlighted: true,
    features: ["For large businesses with complex needs", "Full-service marketing strategy and execution", "Advanced analytics and custom reporting", "24/7 priority support"],
  },
  {
    icon: <Rocket size={20} />,
    title: "Starter Plan",
    description: "Perfect for small businesses and startups looking to establish their digital presence.",
    price: "$149",
    period: "/yearly",
    features: ["Basic strategy consultation", "Social media setup", "Monthly performance reports", "Dedicated Support Team"],
  },
  {
    icon: <Zap size={20} />,
    title: "Enterprise Plan",
    description: "Solutions tailored for large businesses to optimize performance and drive innovation.",
    price: "$599",
    period: "/yearly",
    badge: "Most Popular",
    highlighted: true,
    features: ["For large businesses with complex needs", "Full-service marketing strategy and execution", "Advanced analytics and custom reporting", "24/7 priority support"],
  },
]

const billing = yearly ? "/yearly" : "/monthly";


    return (
        <section id="Testimonial-section" className="lg:pt-[100px] pt-[40px] px-[16px] lg:px-0 bg-[#010104]">

            <div className="lg:mt-[80px] uppersection px-[16px] lg:p-0">
                <div className="content-wrapper lg:px-[20px] mx-auto max-w-full lg:max-w-[80%]">
                    <div id="content" className="flex flex-col max-w-[100%] pt-[100px] lg:pt-0 gap-[18px] lg:max-w-[67%] mx-auto lg:gap-[20px]">

                        <div className="max-w-[80%] mx-auto lg:max-w-full">
                            <h2 className="lg:big-text big-text text-center lg:max-w-full text-4xl md:text-[44px]">
                                Flexible pricing for every stage
                            </h2>
                        </div>

                        <div className="max-w-full text-center lg:max-w-[88%] md:max-w-[80%] mx-auto small-text bg-tertairy">
                            Fintech is its potential to promote financial inclusion. In many parts of the world, millions of people lack access to traditional banking services.                            </div>

                    </div>
                </div>

            </div>

            <div id="content-wrap" className=" max-w-full lg:mt-[80px] mt-[40px] ">
                <div id="content" className="lg:max-w-[80%] mx-auto max-w-full">
                    <div id="toggle" className="flex items-center justify-center gap-3">
                        <span className={`text-[16px] font-medium transition-colors duration-300 ${!yearly ? "text-white" : "text-gray-500"}`}>
                            Monthly
                        </span>

                        <button
                            type="button"
                            role="switch"
                            aria-checked={yearly}
                            aria-label="Toggle yearly billing"
                            onClick={() => setYearly((yearly) => !yearly)}
                            className="relative h-[20px] w-[38px] rounded-full bg-white cursor-pointer"
                        >
                            <span
                                className={`absolute top-[3px] left-[3px] h-[14px] w-[14px] rounded-full bg-black transition-transform duration-300 ease-in-out ${yearly ? "translate-x-[18px]" : "translate-x-0"}`}
                            />
                        </button>

                        <span className={`text-[16px] font-medium transition-colors duration-300 ${yearly ? "text-white" : "text-gray-500"}`}>
                            Yearly
                        </span>
                    </div>

                    <div id="pricingcards" className="lg:px-[20px] lg:pb-[20px] lg:mt-[60px] rounded-2xl ">



                    <div className="grid lg:grid-cols-2 grid-col-1 gap-6">
  {plans.map((plan) => <Pricingcard key={plan.title} {...plan} />)}
</div>
                    </div>



                </div>

            </div>

        </section>
    )
}

export default Pricing
