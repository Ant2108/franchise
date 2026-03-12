import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

function Counter({ end, suffix = "", duration = 2 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

function StatsSection() {
  const stats = [
    { value: 150, suffix: "+", label: "Cửa hàng toàn quốc" },
    { value: 50, suffix: "+", label: "Tỉnh thành phủ sóng" },
    { value: 98, suffix: "%", label: "Đối tác hài lòng" },
    { value: 24, suffix: " tháng", label: "Hoàn vốn trung bình" },
  ];

  return (
    <section className="stats-section">
      <div className="stats-grid">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            className="stat-item"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="stat-number">
              <Counter end={s.value} suffix={s.suffix} />
            </div>
            <div className="stat-label">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default StatsSection;
