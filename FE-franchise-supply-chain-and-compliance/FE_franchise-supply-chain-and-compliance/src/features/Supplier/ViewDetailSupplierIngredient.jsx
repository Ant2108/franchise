import { useEffect, useRef, useState } from "react";
import {
  Card,
  Table,
  Tag,
  Spin,
  Button,
  message,
  Modal,
  Form,
  Select,
  InputNumber,
  Input,
  Space,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import {
  getSupplierDetail,
  getSupplierIngredients,
  createSupplierIngredients,
  getIngredientAvailable,
  createIngredient,
} from "./SupplierAPI/supplierApi";

const { TextArea } = Input;

const ViewDetailSupplierIngredient = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [addForm] = Form.useForm();
  const [createIngredientForm] = Form.useForm();

  const [loading, setLoading] = useState(true);
  const [supplier, setSupplier] = useState(null);
  const [ingredients, setIngredients] = useState([]);

  const [ingredientOptions, setIngredientOptions] = useState([]);
  const [loadingIngredientOptions, setLoadingIngredientOptions] = useState(false);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openCreateIngredientModal, setOpenCreateIngredientModal] = useState(false);

  const [submittingAdd, setSubmittingAdd] = useState(false);
  const [submittingCreateIngredient, setSubmittingCreateIngredient] = useState(false);

  const addSubmittingRef = useRef(false);
  const createIngredientSubmittingRef = useRef(false);

  const unwrapResponse = (res) => res?.data ?? res;

  const normalizeSupplierIngredients = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.supplierIngredients)) return data.supplierIngredients;
    return [];
  };

  const fetchSupplierDetail = async () => {
    const res = await getSupplierDetail(id);
    const data = unwrapResponse(res);
    setSupplier(data);
  };

  const fetchSupplierIngredients = async () => {
    const res = await getSupplierIngredients(id);
    const data = unwrapResponse(res);
    const normalized = normalizeSupplierIngredients(data);
    setIngredients(normalized);
    return normalized;
  };

  const fetchIngredientAvailable = async () => {
    try {
      setLoadingIngredientOptions(true);

      const res = await getIngredientAvailable();
      const data = unwrapResponse(res);
      const list = Array.isArray(data) ? data : [];

      const mappedOptions = list.map((item) => ({
        label: item?.ingredientName || item?.name || "Không tên",
        value: item?.id,
        raw: item,
      }));

      setIngredientOptions(mappedOptions);
      return mappedOptions;
    } catch (error) {
      console.error("fetchIngredientAvailable error:", error);
      message.error("Không tải được danh sách nguyên liệu");
      setIngredientOptions([]);
      return [];
    } finally {
      setLoadingIngredientOptions(false);
    }
  };

  const fetchPageData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchSupplierDetail(),
        fetchSupplierIngredients(),
        fetchIngredientAvailable(),
      ]);
    } catch (error) {
      console.error("fetchPageData error:", error);
      message.error("Không tải được chi tiết supplier");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPageData();
    }
  }, [id]);

  const handleOpenAddModal = async () => {
    addForm.resetFields();
    addForm.setFieldsValue({ status: "ACTIVE" });

    const options = await fetchIngredientAvailable();
    setOpenAddModal(true);

    if (options.length === 0) {
      message.info("Không còn nguyên liệu khả dụng để thêm");
    }
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    addForm.resetFields();
  };

  const handleOpenCreateIngredientModal = () => {
    createIngredientForm.resetFields();
    setOpenCreateIngredientModal(true);
  };

  const handleCloseCreateIngredientModal = () => {
    setOpenCreateIngredientModal(false);
    createIngredientForm.resetFields();
  };

  const buildLocalSupplierIngredientRow = (values) => {
    const selectedIngredient = ingredientOptions.find(
      (item) => item.value === values.ingredientId
    );

    return {
      id: `local-${values.ingredientId}-${Date.now()}`,
      ingredientId: values.ingredientId,
      ingredientName: selectedIngredient?.label || "—",
      ingredient: selectedIngredient?.raw
        ? {
            ...selectedIngredient.raw,
            name:
              selectedIngredient.raw?.name ||
              selectedIngredient.raw?.ingredientName ||
              selectedIngredient?.label,
            ingredientName:
              selectedIngredient.raw?.ingredientName ||
              selectedIngredient.raw?.name ||
              selectedIngredient?.label,
          }
        : {
            id: values.ingredientId,
            name: selectedIngredient?.label || "—",
            ingredientName: selectedIngredient?.label || "—",
          },
      unitPrice: values.unitPrice,
      minimumOrderQuantity: values.minimumOrderQuantity,
      stockQuantity: values.stockQuantity,
      leadTimeDays: values.leadTimeDays,
      status: values.status,
    };
  };

  const appendIngredientIfMissing = (values) => {
    const ingredientId = values.ingredientId;

    setIngredients((prev) => {
      const existed = prev.some(
        (item) =>
          (item?.ingredient?.id || item?.ingredientId || item?.idIngredient) === ingredientId
      );

      if (existed) return prev;

      return [...prev, buildLocalSupplierIngredientRow(values)];
    });
  };

  const handleAddIngredient = async () => {
    if (addSubmittingRef.current) return;

    addSubmittingRef.current = true;
    setSubmittingAdd(true);

    try {
      const values = await addForm.validateFields();

      const alreadyExists = ingredients.some(
        (item) =>
          (item?.ingredient?.id || item?.ingredientId || item?.idIngredient) ===
          values.ingredientId
      );

      if (alreadyExists) {
        message.warning("Nguyên liệu này đã được thêm cho supplier rồi");
        handleCloseAddModal();
        return;
      }

      const payload = {
        supplierId: id,
        ingredientId: values.ingredientId,
        unitPrice: values.unitPrice,
        minimumOrderQuantity: values.minimumOrderQuantity,
        stockQuantity: values.stockQuantity,
        leadTimeDays: values.leadTimeDays,
        status: values.status,
      };

      await createSupplierIngredients(payload);

      appendIngredientIfMissing(values);
      message.success("Thêm nguyên liệu cho supplier thành công");
      handleCloseAddModal();

      await fetchIngredientAvailable();
    } catch (error) {
      console.error("handleAddIngredient error:", error);

      if (error?.errorFields) return;

      const errMsg =
        error?.message ||
        error?.response?.data?.message ||
        error?.response?.data ||
        "";

      if (
        String(errMsg).includes("duplicate key") ||
        String(errMsg).includes("already exists") ||
        String(errMsg).includes("đã được gán") ||
        String(errMsg).includes("already assigned") ||
        String(errMsg).includes("belongs to another supplier")
      ) {
        const values = addForm.getFieldsValue();
        appendIngredientIfMissing(values);
        message.warning("Nguyên liệu này đã được thêm hoặc đã thuộc supplier khác");
        handleCloseAddModal();
        await fetchIngredientAvailable();
      } else {
        message.error("Không thể thêm nguyên liệu cho supplier");
      }
    } finally {
      addSubmittingRef.current = false;
      setSubmittingAdd(false);
    }
  };

  const handleCreateIngredient = async () => {
    if (createIngredientSubmittingRef.current) return;

    createIngredientSubmittingRef.current = true;
    setSubmittingCreateIngredient(true);

    try {
      const values = await createIngredientForm.validateFields();

      const payload = {
        ingredientName: values.ingredientName,
        unit: values.unit,
        alertThreshold: values.alertThreshold,
        description: values.description,
      };

      const res = await createIngredient(payload);
      const createdData = unwrapResponse(res);

      message.success("Tạo nguyên liệu thành công");
      const options = await fetchIngredientAvailable();

      handleCloseCreateIngredientModal();
      setOpenAddModal(true);
      addForm.setFieldsValue({ status: "ACTIVE" });

      const createdId = createdData?.id || createdData?.data?.id || null;

      if (createdId && options.some((item) => item.value === createdId)) {
        addForm.setFieldsValue({
          ingredientId: createdId,
        });
      }
    } catch (error) {
      console.error("handleCreateIngredient error:", error);

      if (error?.errorFields) return;

      const errMsg =
        error?.message ||
        error?.response?.data?.message ||
        error?.response?.data ||
        "";

      if (
        String(errMsg).toLowerCase().includes("already exists") ||
        String(errMsg).toLowerCase().includes("duplicate")
      ) {
        message.warning("Nguyên liệu này đã tồn tại");
        await fetchIngredientAvailable();
      } else {
        message.error("Không thể tạo nguyên liệu");
      }
    } finally {
      createIngredientSubmittingRef.current = false;
      setSubmittingCreateIngredient(false);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (value) => (typeof value === "string" ? value.slice(0, 8) : "—"),
    },
    {
      title: "Tên nguyên liệu",
      render: (_, record) =>
        record?.ingredient?.ingredientName ||
        record?.ingredient?.name ||
        record?.ingredientName ||
        "—",
    },
    {
      title: "Đơn giá",
      dataIndex: "unitPrice",
      render: (val) => (val != null ? `${val}` : "—"),
    },
    {
      title: "MOQ",
      dataIndex: "minimumOrderQuantity",
      render: (val) => (val != null ? val : "—"),
    },
    {
      title: "Tồn kho",
      dataIndex: "stockQuantity",
      render: (val) => (val != null ? val : "—"),
    },
    {
      title: "Lead Time (ngày)",
      dataIndex: "leadTimeDays",
      render: (val) => (val != null ? val : "—"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "ACTIVE" ? "green" : "default"}>
          {status || "—"}
        </Tag>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <Card>
          <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
            <Spin size="large" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Card style={{ marginBottom: 20 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/admin/supplier")}
          style={{ marginBottom: 16 }}
        >
          Quay lại
        </Button>

        <h2>Chi tiết Supplier</h2>

        <p><b>Tên supplier:</b> {supplier?.name || "—"}</p>
        <p><b>Người liên hệ:</b> {supplier?.contactName || "—"}</p>
        <p><b>Email:</b> {supplier?.email || "—"}</p>
        <p><b>Số điện thoại:</b> {supplier?.phone || "—"}</p>
        <p><b>Địa chỉ:</b> {supplier?.address || "—"}</p>
        <p>
          <b>Trạng thái:</b>{" "}
          <Tag color={supplier?.status === "ACTIVE" ? "green" : "default"}>
            {supplier?.status || "—"}
          </Tag>
        </p>
      </Card>

      <Card
        title={`Danh sách nguyên liệu (${ingredients.length})`}
        extra={
          <Space>
            <Button onClick={handleOpenCreateIngredientModal}>
              Tạo nguyên liệu
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleOpenAddModal}
            >
              Thêm nguyên liệu
            </Button>
          </Space>
        }
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={ingredients}
          pagination={{ pageSize: 5 }}
        />
      </Card>

      <Modal
        title="Thêm nguyên liệu cho supplier"
        open={openAddModal}
        onCancel={submittingAdd ? undefined : handleCloseAddModal}
        onOk={handleAddIngredient}
        okText="Thêm"
        cancelText="Hủy"
        confirmLoading={submittingAdd}
        maskClosable={!submittingAdd}
        keyboard={!submittingAdd}
        okButtonProps={{
          disabled: submittingAdd || ingredientOptions.length === 0,
        }}
        cancelButtonProps={{ disabled: submittingAdd }}
      >
        <Form form={addForm} layout="vertical">
          <Form.Item
            label="Nguyên liệu"
            name="ingredientId"
            rules={[{ required: true, message: "Vui lòng chọn nguyên liệu" }]}
          >
            <Select
              showSearch
              placeholder={
                ingredientOptions.length === 0
                  ? "Không còn nguyên liệu để thêm"
                  : "Chọn nguyên liệu"
              }
              options={ingredientOptions}
              loading={loadingIngredientOptions}
              optionFilterProp="label"
            />
          </Form.Item>

          <Form.Item
            label="Đơn giá"
            name="unitPrice"
            rules={[{ required: true, message: "Vui lòng nhập đơn giá" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} placeholder="Nhập đơn giá" />
          </Form.Item>

          <Form.Item
            label="MOQ"
            name="minimumOrderQuantity"
            rules={[{ required: true, message: "Vui lòng nhập MOQ" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} placeholder="Nhập MOQ" />
          </Form.Item>

          <Form.Item
            label="Tồn kho"
            name="stockQuantity"
            rules={[{ required: true, message: "Vui lòng nhập tồn kho" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} placeholder="Nhập tồn kho" />
          </Form.Item>

          <Form.Item
            label="Lead Time (ngày)"
            name="leadTimeDays"
            rules={[{ required: true, message: "Vui lòng nhập lead time" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} placeholder="Nhập lead time" />
          </Form.Item>

          <Form.Item
            label="Trạng thái"
            name="status"
            initialValue="ACTIVE"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select
              options={[
                { label: "ACTIVE", value: "ACTIVE" },
                { label: "INACTIVE", value: "INACTIVE" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Tạo nguyên liệu mới"
        open={openCreateIngredientModal}
        onCancel={submittingCreateIngredient ? undefined : handleCloseCreateIngredientModal}
        onOk={handleCreateIngredient}
        okText="Tạo"
        cancelText="Hủy"
        confirmLoading={submittingCreateIngredient}
        maskClosable={!submittingCreateIngredient}
        keyboard={!submittingCreateIngredient}
        okButtonProps={{ disabled: submittingCreateIngredient }}
        cancelButtonProps={{ disabled: submittingCreateIngredient }}
      >
        <Form form={createIngredientForm} layout="vertical">
          <Form.Item
            label="Tên nguyên liệu"
            name="ingredientName"
            rules={[{ required: true, message: "Vui lòng nhập tên nguyên liệu" }]}
          >
            <Input placeholder="Ví dụ: Sữa tươi" />
          </Form.Item>

          <Form.Item
            label="Đơn vị"
            name="unit"
            rules={[{ required: true, message: "Vui lòng nhập đơn vị" }]}
          >
            <Input placeholder="Ví dụ: kg, lít, gói" />
          </Form.Item>

          <Form.Item
            label="Ngưỡng cảnh báo"
            name="alertThreshold"
            rules={[{ required: true, message: "Vui lòng nhập ngưỡng cảnh báo" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              placeholder="Nhập alert threshold"
            />
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <TextArea rows={4} placeholder="Nhập mô tả nguyên liệu" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ViewDetailSupplierIngredient;