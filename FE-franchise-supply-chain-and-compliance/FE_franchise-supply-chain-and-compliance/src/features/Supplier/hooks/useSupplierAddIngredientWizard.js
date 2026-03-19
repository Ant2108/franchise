import { useState } from "react";
import { Form, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import {
  createIngredient,
  createSupplierIngredients,
} from "../SupplierAPI/supplierApi";

export const useSupplierAddIngredientWizard = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [current, setCurrent] = useState(0);
  const [ingredientId, setIngredientId] = useState(null);
  
  const [ingredientForm] = Form.useForm();
  const [supplierForm] = Form.useForm();
  
  const [loading, setLoading] = useState(false);

  const next = async () => {
  if (current === 0) {
    try {
      const values = await ingredientForm.validateFields();
      setLoading(true);

      const formData = new FormData();

      // data thường
      formData.append("ingredientName", values.ingredientName);
      formData.append("unit", values.unit);
      formData.append("alertThreshold", values.alertThreshold);
      formData.append("description", values.description || "");

      // 🔥 FILE (QUAN TRỌNG NHẤT)
      const file = values.image?.[0]?.originFileObj;
      // hoặc nếu dùng hook:
      // const file = getFileForPayload();

      if (file) {
        formData.append("imageFile", file);
      }

      const res = await createIngredient(formData);
      const created = res?.data ?? res;

      setIngredientId(created?.id);
      message.success("Tạo nguyên liệu thành công");
      setCurrent(1);

    } catch (error) {
      console.error("createIngredient error:", error);

      if (!error?.errorFields) {
        const errMsg =
          error?.response?.data?.message ||
          error?.response?.data ||
          error?.message;

        message.error(errMsg || "Không thể tạo nguyên liệu");
      }
    } finally {
      setLoading(false);
    }
  }
};

  const finish = async () => {
  try {
    const values = await supplierForm.validateFields();
    setLoading(true);

    const formData = new FormData();

    // data thường
    formData.append("supplierId", id);
    formData.append("ingredientId", ingredientId);
    formData.append("unitPrice", values.unitPrice);
    formData.append("minimumOrderQuantity", values.minimumOrderQuantity);
    formData.append("stockQuantity", values.stockQuantity);
    formData.append("leadTimeDays", values.leadTimeDays);
    formData.append("status", values.status);

    // 🔥 FILE (QUAN TRỌNG NHẤT)
    const file = values.image?.[0]?.originFileObj; 
    // hoặc nếu bạn dùng hook:
    // const file = getFileForPayload();

    if (file) {
      formData.append("imageFile", file);
    }

    await createSupplierIngredients(formData);

    message.success("Thêm nguyên liệu cho supplier thành công");

    ingredientForm.resetFields();
    supplierForm.resetFields();
    setIngredientId(null);
    setCurrent(0);

    navigate(`/admin/supplier/${id}/view`);

  } catch (error) {
    console.error("createSupplierIngredients error:", error);
    if (!error?.errorFields) {
      message.error("Không thể thêm nguyên liệu cho supplier");
    }
  } finally {
    setLoading(false);
  }
};

  const goBack = () => {
    navigate(`/admin/supplier/${id}/view`);
  };

  return {
    id,
    current,
    setCurrent,
    ingredientForm,
    supplierForm,
    loading,
    next,
    finish,
    goBack,
  };
};
