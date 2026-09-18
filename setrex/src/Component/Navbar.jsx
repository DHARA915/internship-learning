import { ChevronDown, Menu, X } from "lucide-react";
import Button from "./Button";
import { useState } from "react";

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
        <section className="bg-black relative z-9999 w-full ">

            {/* Header */}

            <div className="relative z-2 w-full max-w-[1320px] mx-auto">
                <div className="relative z-10 py-[20px]">

                    <nav id="navbar" className="  bg-gradient-to-r from-slate-950 to black  flex px-[20px] justify-between items-center gap-[20px]">

                        {/* Logo */}
                        <div className="flex w-1/3 justify-start items-center gap-[30px]">

                            <img className="h-10 w-auto"
                                src="https://cdn.prod.website-files.com/68b6ff99deb8a7b82b41a88b/68bf22b84f1d6c96a46932fc_832071e89378345f11dbea20b8e9d9aa_Logo.svg"
                                alt="SetreX Logo"

                            />
                        </div>

                        {/* NavbarLink */}

                        <div className="flex w-1/3 items-center justify-center">

                            <div className="relative flex justify-start items-center gap-[38px]">

                                <ul className="hidden items-center gap-8 text-sm  md:hidden sm:hidden  text-primary lg:flex">
                                    {navLinks.map((link) => (
                                        <li
                                            key={link.name}
                                            className="flex cursor-pointer items-center gap-1 text-lg hover:text-secondary"
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
                                    className="flex items-center gap-1 text-lg font-medium text-primary hover:text-lime-500"
                                >
                                    Pages
                                    <ChevronDown className="h-6 w-6" />
                                </a>
                            </div>

                            <Button color="bg-primary" hover_color="hover:bg-secondary" text="Contact Us" />
                        </div>



                        {/* Mobile menu button */}
                        <button
                            className="text-primary lg:hidden relative z-[60]"
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
            </div>


            {/* Mobile Navbar */}

            <div id="mobile-navbar"
                className={` bg-black overflow-hidden border-t absolute top-full left-0 w-full z-50 border-gray-800 px-6 transition-all duration-500 ease-in-out lg:hidden ${isOpen
                    ? "h-screen translate-y-0 opacity-100 pb-6 pt-6"
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

            </div>



        </section>
    );
}

export default Navbar;