import { useState, useEffect } from "react";

/**
 * Custom Hook: useImageUpload
 * Quản lý trạng thái và UI của khung Upload hình ảnh (Multipart / Cloudinary).
 * Bao gồm cả việc map URL ảnh cũ từ BE thành định dạng fileList của Ant Design.
 * 
 * @param {string} initialImageUrl - URL ảnh hiện tại lấy từ backend (nếu có)
 * @returns {Object} Các props cần thiết để ném vào thẻ <Upload> và hàm lấy File (nếu up ảnh mới)
 */
export const useImageUpload = (initialImageUrl = null) => {
  const [fileList, setFileList] = useState([]);

  // Hàm chuyển đổi string URL thành dạng object file list để Antd Upload hiển thị ảnh cũ
  useEffect(() => {
    if (initialImageUrl) {
      setFileList([
        {
          uid: "-1",
          name: "current-image.png",
          status: "done",
          url: initialImageUrl, // Map đúng URL lên thẻ ảnh
        },
      ]);
    } else {
      setFileList([]);
    }
  }, [initialImageUrl]);

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const beforeUpload = () => {
    // Trả về false để chặn thẻ Upload không tự gửi HTTP request, bắt buộc qua form submit
    return false;
  };

  /**
   * Lọc ra File thực tế người dùng vừa upload (originFileObj).
   * Nếu người dùng không upload ảnh mới (giữ ảnh cũ hoặc xóa hết) thì trả về null.
   */
  const getFileForPayload = () => {
    if (fileList.length > 0 && fileList[0].originFileObj) {
      return fileList[0].originFileObj; // Đây là ảnh mới (File object multipart thực tế)
    }
    return null; // Không có ảnh mới
  };

  return {
    fileList,
    onChange,
    beforeUpload,
    getFileForPayload,
  };
};
