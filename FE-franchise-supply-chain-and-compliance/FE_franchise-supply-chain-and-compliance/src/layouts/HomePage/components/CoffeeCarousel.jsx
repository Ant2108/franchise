import { motion } from "framer-motion";

function CoffeeCarousel() {
  const coffees = [
    {
      name: "Latte",
      img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735",
    },
    {
      name: "Espresso",
      img: "https://images.unsplash.com/photo-1511920170033-f8396924c348",
    },
    {
      name: "Cappuccino",
      img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
    },
    {
      name: "Mocha",
      img: "https://images.unsplash.com/photo-1498804103079-a6351b050096",
    },
  ];

  return (
    <div className="carousel">
      {coffees.map((coffee, i) => (
        <motion.div
          key={i}
          className="coffee-card"
          whileHover={{ scale: 1.05 }}
        >
          <img src={coffee.img} />

          <h3>{coffee.name}</h3>
        </motion.div>
      ))}
    </div>
  );
}

export default CoffeeCarousel;