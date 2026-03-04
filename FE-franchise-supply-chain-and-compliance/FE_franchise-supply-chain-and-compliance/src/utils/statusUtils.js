// Map dịch trạng thái
export const STATUS_LABEL = {
  ACTIVE: "Hoạt động",
  INACTIVE: "Ngừng hoạt động",
  MAINTAIN: "Bảo trì",
  CLOSE: "Đóng cửa",
};

// Hàm lấy label hiển thị
export const getStatusLabel = (status) => {
  return STATUS_LABEL[status] || status;
};

// Hàm lấy class CSS (nếu cần chuẩn hóa)
export const getStatusClass = (status) => {
  return status?.toLowerCase() || "";
};