import { motion } from "framer-motion";
import { useRef } from "react";

function ProductSection() {
  const scrollRef = useRef(null);

  const coffees = [
    {
      name: "Latte Signature",
      desc: "Hòa quyện espresso đậm đà với sữa mịn màng",
      img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80",
      price: "55.000₫",
    },
    {
      name: "Espresso Classic",
      desc: "Đậm vị, tinh chất cà phê nguyên bản",
      img: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&q=80",
      price: "45.000₫",
    },
    {
      name: "Cappuccino",
      desc: "Lớp foam mềm mịn, hoàn hảo mỗi buổi sáng",
      img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80",
      price: "55.000₫",
    },
    {
      name: "Mocha Fusion",
      desc: "Sự kết hợp tuyệt vời giữa cà phê và chocolate",
      img: "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=600&q=80",
      price: "60.000₫",
    },
    {
      name: "Cold Brew",
      desc: "Ủ lạnh 18 giờ, hương vị thanh mát tự nhiên",
      img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80",
      price: "50.000₫",
    },
  ];

  return (
    <section className="product">
      <div className="product-header">
        <motion.span
          className="section-tag"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          SẢN PHẨM NỔI BẬT
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          viewport={{ once: true }}
        >
          Hương vị <span className="accent">được yêu thích</span> nhất
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
        >
          Mỗi ly cà phê là một tác phẩm nghệ thuật — từ hạt Arabica tuyển chọn
          đến tay barista chuyên nghiệp.
        </motion.p>
      </div>

      <div className="product-scroll" ref={scrollRef}>
        <div className="product-track">
          {coffees.map((coffee, i) => (
            <motion.div
              key={i}
              className="product-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
            >
              <div className="product-img-wrap">
                <img src={coffee.img} alt={coffee.name} loading="lazy" />
                <div className="product-price">{coffee.price}</div>
              </div>
              <div className="product-info">
                <h3>{coffee.name}</h3>
                <p>{coffee.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductSection;