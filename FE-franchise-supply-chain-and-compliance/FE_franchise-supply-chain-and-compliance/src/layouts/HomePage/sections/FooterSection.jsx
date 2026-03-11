import { Coffee } from "lucide-react";

function FooterSection() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <Coffee size={24} />
            <span>Aroma <strong>Coffee</strong></span>
          </div>
          <p>
            Hệ thống franchise cà phê hàng đầu Việt Nam. Biến đam mê thành sự
            nghiệp bền vững.
          </p>
        </div>

        <div className="footer-links">
          <h4>Khám phá</h4>
          <a href="#">Giới thiệu</a>
          <a href="#">Sản phẩm</a>
          <a href="#">Gói đầu tư</a>
          <a href="#">Tin tức</a>
        </div>

        <div className="footer-links">
          <h4>Hỗ trợ</h4>
          <a href="#">Câu hỏi thường gặp</a>
          <a href="#">Chính sách</a>
          <a href="#">Điều khoản</a>
          <a href="#">Liên hệ</a>
        </div>

        <div className="footer-links">
          <h4>Kết nối</h4>
          <a href="#">Facebook</a>
          <a href="#">Instagram</a>
          <a href="#">LinkedIn</a>
          <a href="#">YouTube</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Aroma Coffee. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default FooterSection;
