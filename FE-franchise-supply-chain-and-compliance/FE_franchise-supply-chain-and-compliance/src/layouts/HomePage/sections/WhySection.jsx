import { motion } from "framer-motion";
import { Coffee, TrendingUp, Users, MapPin } from "lucide-react";

function WhySection() {
  const items = [
    {
      icon: <TrendingUp size={28} />,
      title: "Lợi nhuận vượt trội",
      desc: "ROI từ 18-24 tháng – mô hình tối ưu chi phí vận hành, tối đa hoá lợi nhuận cho đối tác.",
      color: "#10b981",
      bg: "#ecfdf5",
    },
    {
      icon: <Users size={28} />,
      title: "Đào tạo chuyên sâu",
      desc: "Chương trình training toàn diện từ barista, vận hành tới marketing — mọi thứ bạn cần.",
      color: "#6366f1",
      bg: "#eef2ff",
    },
    {
      icon: <MapPin size={28} />,
      title: "Hỗ trợ chiến lược",
      desc: "Phân tích thị trường, chọn vị trí vàng, tư vấn thiết kế không gian chuyên nghiệp.",
      color: "#f59e0b",
      bg: "#fffbeb",
    },
    {
      icon: <Coffee size={28} />,
      title: "Nguyên liệu cao cấp",
      desc: "100% cà phê Arabica tuyển từ Đà Lạt, Buôn Ma Thuột — rang xay đúng chuẩn Specialty.",
      color: "#ef4444",
      bg: "#fef2f2",
    },
  ];

  return (
    <section className="why">
      <div className="why-inner">
        <div className="why-left">
          <motion.span
            className="section-tag"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            TẠI SAO CHỌN AROMA?
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
          >
            Hơn cả một thương hiệu,{" "}
            <span className="accent">đây là hệ sinh thái</span> kinh doanh
          </motion.h2>

          <motion.p
            className="why-desc"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            Aroma Coffee xây dựng một mô hình franchise hoàn chỉnh, giúp bạn
            khởi nghiệp với rủi ro thấp nhất và tiềm năng tăng trưởng cao nhất.
          </motion.p>

          <div className="why-image-wrap">
            <motion.img
              className="why-image"
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80"
              alt="Aroma Coffee"
              loading="lazy"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            />
            <div className="why-image-badge">
              <strong>150+</strong>
              <span>cửa hàng</span>
            </div>
          </div>
        </div>

        <div className="why-right">
          {items.map((item, i) => (
            <motion.div
              key={i}
              className="why-card"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
            >
              <div
                className="why-icon"
                style={{ background: item.bg, color: item.color }}
              >
                {item.icon}
              </div>
              <div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhySection;