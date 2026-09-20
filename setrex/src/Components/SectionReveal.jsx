import React from "react";
import { motion } from "framer-motion";

const SectionReveal = ({ children }) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 80,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        amount: 0.1,
      }}
      transition={{
        duration: 1,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
};

export default SectionReveal;