import { useEffect, useRef } from "react";

function CoffeeBeans() {
  const beansRef = useRef([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;

      const x = (e.clientX - innerWidth / 2) / innerWidth;
      const y = (e.clientY - innerHeight / 2) / innerHeight;

      beansRef.current.forEach((bean, index) => {
        if (!bean) return;

        const speed = (index + 1) * 10;

        const moveX = x * speed;
        const moveY = y * speed;

        bean.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const beans = [
    { top: "20%", left: "10%" },
    { top: "60%", left: "15%" },
    { top: "30%", right: "15%" },
    { bottom: "25%", right: "10%" },
    { top: "10%", right: "30%" },
    { bottom: "10%", left: "25%" },
  ];

  return (
    <>
      {beans.map((pos, i) => (
        <img
          key={i}
          ref={(el) => (beansRef.current[i] = el)}
          src="https://cdn-icons-png.flaticon.com/512/924/924514.png"
          className="bean"
          style={pos}
          alt="coffee bean"
        />
      ))}
    </>
  );
}

export default CoffeeBeans;