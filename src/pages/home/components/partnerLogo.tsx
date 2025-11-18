import { motion } from "framer-motion";
import schneiderLogoName from "@src/assets/schneiderName.png";
import upcLogo from "@src/assets/upcLogo.png";

interface PartnerLogoProps {
  name: string;
  width?: number;
  height?: number;
  className?: string;
}

function PartnerLogo({ name, width, height, className = "" }: PartnerLogoProps) {
  return (
    <div className={`relative group ${className}`}>
      <div className="absolute -inset-[2px] rounded-xl bg-gradient-to-r from-[#2b39c0] via-[#5e69d2] to-[#2b39c0] blur-sm transition-opacity duration-500 animate-gradient-xy" />
      
      <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-[#2b39c0] via-cyan-400 to-[#2b39c0] transition-opacity duration-500 animate-spin-slow" 
           style={{ backgroundSize: '200% 200%' }} 
      />

      {/* 3. The Inner Content Card */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="relative flex items-center justify-center p-6 bg-white rounded-xl border border-slate-100 shadow-sm group-hover:border-transparent transition-colors duration-300 h-full w-full"
      >
        <img
          style={{
            ...(width !== undefined && { width: `${width}rem` }),
            ...(height !== undefined && { height: `${height}rem` }),
          }}
          src={name === "Schneider Electric" ? schneiderLogoName : upcLogo}
          alt={`${name} logo`}
          className="object-contain opacity-100 transition-all duration-500"
        />
      </motion.div>
    </div>
  );
}

export default PartnerLogo;