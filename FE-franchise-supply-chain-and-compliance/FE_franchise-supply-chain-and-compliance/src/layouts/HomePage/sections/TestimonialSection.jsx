import { motion } from "framer-motion";
import { Star } from "lucide-react";

function TestimonialSection() {
  const testimonials = [
    {
      name: "Nguyễn Minh Tuấn",
      role: "Chủ chi nhánh Quận 7, TP.HCM",
      text: "Đầu tư vào Aroma là quyết định sáng suốt nhất. Chỉ sau 14 tháng mình đã hoàn vốn và bắt đầu mở chi nhánh thứ 2.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5,
    },
    {
      name: "Trần Thị Hương",
      role: "Đối tác Franchise Đà Nẵng",
      text: "Đội ngũ hỗ trợ cực kỳ chuyên nghiệp, từ training barista tới marketing — mình chỉ cần tập trung vận hành.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5,
    },
    {
      name: "Lê Hoàng Phúc",
      role: "Chủ chi nhánh Hà Nội",
      text: "Nguyên liệu chất lượng cao, thương hiệu mạnh và hệ thống quản lý bài bản — Aroma thực sự là nơi đáng để đầu tư.",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
      rating: 5,
    },
  ];

  return (
    <section className="testimonial">
      <motion.span
        className="section-tag"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        ĐỐI TÁC NÓI GÌ?
      </motion.span>

      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Nghe từ những người đã{" "}
        <span className="accent">thành công</span>
      </motion.h2>

      <div className="testimonial-grid">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            className="testimonial-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, duration: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ y: -6 }}
          >
            <div className="testimonial-stars">
              {[...Array(t.rating)].map((_, j) => (
                <Star key={j} size={16} fill="#f59e0b" color="#f59e0b" />
              ))}
            </div>

            <p className="testimonial-text">"{t.text}"</p>

            <div className="testimonial-author">
              <img src={t.avatar} alt={t.name} loading="lazy" />
              <div>
                <strong>{t.name}</strong>
                <span>{t.role}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default TestimonialSection;
