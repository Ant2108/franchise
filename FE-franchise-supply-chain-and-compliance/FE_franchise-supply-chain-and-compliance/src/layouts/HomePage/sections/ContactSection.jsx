import { Phone, Mail, MapPin, Send } from "lucide-react";
import { motion } from "framer-motion";

function ContactSection() {
  const contactItems = [
    { icon: <Phone size={22} />, label: "Hotline", value: "1900-1234" },
    { icon: <Mail size={22} />, label: "Email", value: "franchise@aroma.vn" },
    { icon: <MapPin size={22} />, label: "Trụ sở", value: "Quận 1, TP. Hồ Chí Minh" },
  ];

  return (
    <section className="contact">
      <div className="contact-inner">
        <div className="contact-left">
          <motion.span
            className="section-tag section-tag-light"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            LIÊN HỆ
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Bắt đầu hành trình kinh doanh cùng Aroma
          </motion.h2>

          <motion.p
            className="contact-sub"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            Liên hệ ngay để nhận tư vấn miễn phí từ đội ngũ chuyên gia.
          </motion.p>

          <div className="contact-info">
            {contactItems.map((item, i) => (
              <motion.div
                key={i}
                className="contact-item"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.12 }}
                viewport={{ once: true }}
              >
                <div className="contact-icon">{item.icon}</div>
                <div>
                  <div className="contact-label">{item.label}</div>
                  <div className="contact-value">{item.value}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.form
          className="contact-form"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
          onSubmit={(e) => e.preventDefault()}
        >
          <h3>Gửi thông tin tư vấn</h3>
          <input placeholder="Họ tên" />
          <input placeholder="Email" type="email" />
          <input placeholder="Số điện thoại" type="tel" />
          <textarea placeholder="Bạn quan tâm gói nào? Hãy cho chúng tôi biết..."></textarea>
          <button type="submit">
            <Send size={18} /> Gửi ngay
          </button>
        </motion.form>
      </div>
    </section>
  );
}

export default ContactSection;