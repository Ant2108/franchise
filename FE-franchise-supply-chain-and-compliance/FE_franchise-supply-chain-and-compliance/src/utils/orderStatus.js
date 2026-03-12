export const INBOUND_STATUS_CONFIG = {
    PENDING: { label: "Chờ xử lý", color: "orange" },
    APPROVED: { label: "Đã duyệt", color: "blue" },
    DELIVERING: { label: "Đang giao", color: "cyan" },
    COMPLETED: { label: "Hoàn tất", color: "green" },
    CANCELLED: { label: "Đã hủy", color: "red" },
};

export const OUTBOUND_STATUS_CONFIG = {
    PENDING: { label: "Chờ xử lý", color: "orange" },
    PACKING: { label: "Đang chuẩn bị hàng", color: "blue" },
    SHIPPING: { label: "Đang giao hàng", color: "cyan" },
    DELIVERED: { label: "Đã giao hàng", color: "green" },
    CANCELED: { label: "Đã hủy", color: "red" },
    CANCELLED: { label: "Đã hủy", color: "red" },
};

export const INBOUND_FILTER_STATUS_OPTIONS = [
    { value: "PENDING", label: "Chờ xử lý" },
    { value: "APPROVED", label: "Đã duyệt" },
    { value: "DELIVERING", label: "Đang giao" },
    { value: "COMPLETED", label: "Hoàn tất" },
    { value: "CANCELLED", label: "Đã hủy" },
];

export const OUTBOUND_FILTER_STATUS_OPTIONS = [
    { value: "PENDING", label: "Chờ xử lý" },
    { value: "PACKING", label: "Đang chuẩn bị hàng" },
    { value: "SHIPPING", label: "Đang giao hàng" },
    { value: "DELIVERED", label: "Đã giao hàng" },
    { value: "CANCELED", label: "Đã hủy" },
];

const normalizeStatus = (status) => String(status || "").toUpperCase();

export const getInboundStatusMeta = (status) => INBOUND_STATUS_CONFIG[normalizeStatus(status)];

export const getOutboundStatusMeta = (status) => OUTBOUND_STATUS_CONFIG[normalizeStatus(status)];
