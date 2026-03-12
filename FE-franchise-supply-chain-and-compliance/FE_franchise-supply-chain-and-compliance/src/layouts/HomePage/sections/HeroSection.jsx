import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "80%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 4,
  }));

  return (
    <section ref={ref} className="hero">
      <motion.img
        className="hero-bg"
        src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1920&q=80"
        style={{ y: bgY }}
        alt=""
      />

      <div className="hero-overlay" />

      {/* Floating particles */}
      <div className="hero-particles">
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      <motion.div className="hero-content" style={{ y: textY, opacity }}>
        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, y: 20 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          ☕ Franchise #1 Việt Nam
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <span className="hero-line-1">Cà phê là</span>
          <span className="hero-line-2">
            <span className="gradient-text">nghệ thuật</span>
          </span>
          <span className="hero-line-3">kinh doanh là đam mê</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          Tham gia hệ thống franchise Aroma Coffee — nơi biến đam mê thành cơ
          hội kinh doanh bền vững với lợi nhuận vượt trội.
        </motion.p>

        <motion.div
          className="hero-buttons"
          initial={{ opacity: 0, y: 40 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          <button className="btn-primary">Nhượng quyền ngay</button>
          <button className="btn-outline">Tìm hiểu thêm</button>
        </motion.div>
      </motion.div>

      <motion.div
        className="scroll-indicator"
        animate={{ y: [0, 12, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <span>Cuộn xuống</span>
        <ChevronDown size={20} />
      </motion.div>
    </section>
  );
}

export default HeroSection;