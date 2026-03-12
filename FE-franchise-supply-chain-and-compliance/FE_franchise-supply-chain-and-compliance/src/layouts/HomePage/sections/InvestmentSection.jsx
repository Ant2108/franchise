import { motion } from "framer-motion";
import { Check } from "lucide-react";

function InvestmentSection() {
  const plans = [
    {
      name: "Gói Mini",
      price: "500 triệu",
      area: "30–50m²",
      features: [
        "Thiết kế không gian",
        "Đào tạo cơ bản",
        "Marketing online",
        "Hỗ trợ 6 tháng",
      ],
    },
    {
      name: "Gói Standard",
      price: "800 triệu",
      area: "50–80m²",
      highlight: true,
      features: [
        "Thiết kế cao cấp",
        "Đào tạo chuyên sâu",
        "Marketing tổng thể",
        "Hỗ trợ 12 tháng",
        "Phân tích thị trường",
      ],
    },
    {
      name: "Gói Premium",
      price: "1.2 tỷ",
      area: "80–150m²",
      features: [
        "Thiết kế VIP",
        "Đào tạo toàn diện",
        "Chiến lược Marketing",
        "Hỗ trợ 24 tháng",
        "Quản lý chuyên biệt",
      ],
    },
  ];

  return (
    <section className="investment">
      <motion.span
        className="section-tag"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        GÓI ĐẦU TƯ
      </motion.span>

      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Chọn gói phù hợp với <span className="accent">tầm nhìn</span> của bạn
      </motion.h2>

      <div className="investment-grid">
        {plans.map((p, i) => (
          <motion.div
            key={i}
            className={`plan ${p.highlight ? "highlight" : ""}`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, duration: 0.6 }}
            viewport={{ once: true }}
          >
            {p.highlight && <div className="popular">🔥 Phổ biến nhất</div>}

            <h3>{p.name}</h3>
            <div className="price">{p.price}</div>
            <p className="area">Diện tích: {p.area}</p>

            <ul className="features">
              {p.features.map((f, idx) => (
                <li key={idx}>
                  <Check size={16} /> {f}
                </li>
              ))}
            </ul>

            <button>Tìm hiểu thêm</button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default InvestmentSection;