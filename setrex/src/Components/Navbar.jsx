import { ChevronDown, Menu, X } from "lucide-react";
import Button from "./Button";
import { useState } from "react";
import Logo from "./Logo";
import { motion } from "framer-motion";



function Navbar() {
    const [isOpen, setIsOpen] = useState(false);


    const navLinks = [
        { name: "Home", href: "/", hasDropdown: true },
        { name: "About", href: "/about" },
        { name: "Features", href: "/features" },
        { name: "Pricing", href: "/pricing" },
        { name: "Blog", href: "/blog" }
    ];

    return (
        <section className="bg-bgprimary relative z-9999 w-full ">

            {/* Header */}

            <motion.div
  initial={{
    opacity: 0,
    y: -80,
  }}
  animate={{
    opacity: 1,
    y: 0,
  }}
  transition={{
    duration: 1.5,
    ease: [0.16, 1, 0.3, 1],
  }} className="relative z-2 w-full max-w-[1320px] mx-auto">
                <div className="relative z-10 py-[20px]">

                    <nav id="navbar" className="   flex px-[20px] justify-between items-center gap-[20px]">

                        {/* Logo */}
                        <div className="w-1/3 items-center">
                        <Logo/>
                    </div>

                        {/* NavbarLink */}

                        <div className="flex w-1/3 items-center justify-center ">

                            <div className="relative flex justify-start items-center gap-[38px]">

                                <ul className="hidden items-center text-[16px] gap-8 text-sm  md:hidden sm:hidden  text-primary lg:flex">
                                    {navLinks.map((link) => (
                                        <li
                                            key={link.name}
                                            className="flex cursor-pointer items-center gap-1 hover:text-secondary"
                                        >
                                            <a href={link.href}>{link.name}</a>
                                            {
                                                link.hasDropdown && (
                                                    <ChevronDown className="h-4 w-4" />
                                                )
                                            }
                                        </li>
                                    ))}
                                </ul>
                            </div>

                        </div>

                        {/* Desktop right side */}
                        <div className="hidden w-1/3 items-center justify-end flex gap-5  md:hidden lg:flex ">
                            <div>

                                <a
                                    href="/pages"
                                    className="flex items-center gap-1 text-[16px] font-medium text-primary hover:text-lime-500"
                                >
                                    Pages
                                    <ChevronDown className="h-6 w-6" />
                                </a>
                            </div>

                            <Button color="bg-primary" hover_color="hover:bg-secondary" text="Contact Us" className="!text-[16px]"  />
                        </div>



                        {/* Mobile menu button */}
                        <button
                            className="text-primary lg:hidden text-[16px] relative z-[60]"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? (
                                <X className="h-7 w-7" />
                            ) : (
                                <Menu className="h-7 w-7" />
                            )}
                        </button>
                    </nav>
                </div>
            </motion.div>


            {/* Mobile Navbar */}

            <motion.div
  initial={{
    opacity: 0,
    y: -80,
  }}
  animate={{
    opacity: 1,
    y: 0,
  }}
  transition={{
    duration: 1.5,
    ease: [0.16, 1, 0.3, 1],
  }} id="mobile-navbar"
                className={` bg-black overflow-hidden border-t absolute top-full left-0 w-full z-50 border-gray-800 px-6 transition-all duration-500 ease-in-out lg:hidden ${isOpen
                    ? "h-screen translate-y-0 opacity-100 pb-6 pt-6  "
                    : "h-0  opacity-0 pb-0 pt-0"
                    }`}
            >

                <ul className="flex  flex-col gap-5 pt-6 text-primary">
                    {navLinks.map((link) => (
                        <div>

                            <li
                                key={link.name}
                                className="text-lg gap-2 group cursor-pointer hover:text-secondary"
                            >
                                <a
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="pb-3 block"
                                >
                                    {link.name}
                                </a>
                                <hr className="text-slate-900 transition-color duration-500 group-hover:border-secondary" />
                            </li>
                        </div>
                    ))}

                    {/* Mobile Pages */}
                    <li>
                        <a
                            href="/pages"
                            className="flex items-center gap-1  text-lg hover:text-secondary"
                            onClick={() => setIsOpen(false)}
                        >
                            Pages
                            <ChevronDown className="h-4 w-4" />
                        </a>
                    </li>
                </ul>

            </motion.div>



        </section>
    );
}

export default Navbar;