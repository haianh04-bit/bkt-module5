import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi } from "date-fns/locale";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function AddProduct() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:3001/categories").then((r) => r.json()),
      fetch("http://localhost:3001/products").then((r) => r.json()),
    ]).then(([cats, prods]) => {
      setCategories(cats);
      setProducts(prods);
    });
  }, []);

  const generateProductCode = () => {
    if (products.length === 0) return "PROD-0001";
    const maxNum = Math.max(
      ...products.map((p) => Number(p.code.replace("PROD-", "")))
    );
    const nextNum = (maxNum + 1).toString().padStart(4, "0");
    return `PROD-${nextNum}`;
  };

  // ✅ Schema kiểm tra dữ liệu
  const validationSchema = Yup.object({
    name: Yup.string().required("Tên sản phẩm là bắt buộc"),
    description: Yup.string().required("Mô tả là bắt buộc"),
    categoryId: Yup.string().required("Phải chọn thể loại"),
    price: Yup.number()
      .positive("Giá phải lớn hơn 0")
      .required("Giá là bắt buộc"),
    quantity: Yup.number()
      .integer("Số lượng phải là số nguyên")
      .positive("Số lượng phải > 0")
      .required("Số lượng là bắt buộc"),
    importDate: Yup.date()
      .required("Ngày nhập là bắt buộc")
      .max(new Date(), "Ngày nhập không được lớn hơn hôm nay"),
  });

  // ✅ Xử lý submit Formik
  const handleSubmit = async (values, { resetForm }) => {
    const newProduct = {
      code: generateProductCode(),
      name: values.name,
      description: values.description,
      categoryId: Number(values.categoryId),
      price: Number(values.price),
      quantity: Number(values.quantity),
      importDate: values.importDate.toISOString(),
    };

    const res = await fetch("http://localhost:3001/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    });

    if (res.ok) {
      alert(`✅ Thêm sản phẩm thành công! Mã: ${newProduct.code}`);
      resetForm();
      setTimeout(() => navigate("/"), 1500);
    } else {
      alert("❌ Lỗi khi thêm sản phẩm!");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "700px" }}>
      <div className="card shadow-lg border-0 rounded-4">
        <div
          className="card-header text-black text-center py-3 rounded-top-4"
          style={{
            background: "linear-gradient(90deg, #007bff, #00c6ff)",
            color: "white",
          }}
        >
          <h4 className="mb-0 fw-bold">💊 Thêm sản phẩm mới</h4>
        </div>

        <div className="card-body p-4">
          <Formik
            initialValues={{
              name: "",
              description: "",
              categoryId: "",
              price: "",
              quantity: "",
              importDate: null,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form>
                {/* Tên sản phẩm */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Tên sản phẩm</label>
                  <Field
                    name="name"
                    className="form-control form-control-lg shadow-sm"
                    placeholder="Nhập tên sản phẩm..."
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-danger mt-1"
                  />
                </div>

                {/* Mô tả */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Mô tả</label>
                  <Field
                    as="textarea"
                    name="description"
                    className="form-control shadow-sm"
                    rows="3"
                    placeholder="Nhập mô tả sản phẩm..."
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-danger mt-1"
                  />
                </div>

                {/* Thể loại */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Thể loại</label>
                  <Field
                    as="select"
                    name="categoryId"
                    className="form-select shadow-sm"
                  >
                    <option value="">-- Chọn thể loại --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="categoryId"
                    component="div"
                    className="text-danger mt-1"
                  />
                </div>

                {/* Giá và Số lượng */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Giá (VNĐ)</label>
                    <Field
                      type="number"
                      name="price"
                      className="form-control shadow-sm"
                      placeholder="Nhập giá..."
                    />
                    <ErrorMessage
                      name="price"
                      component="div"
                      className="text-danger mt-1"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Số lượng</label>
                    <Field
                      type="number"
                      name="quantity"
                      className="form-control shadow-sm"
                      placeholder="Nhập số lượng..."
                    />
                    <ErrorMessage
                      name="quantity"
                      component="div"
                      className="text-danger mt-1"
                    />
                  </div>
                </div>

                {/* Ngày nhập */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Ngày nhập (dd/MM/yyyy)
                  </label>
                  <DatePicker
                    selected={values.importDate}
                    onChange={(date) => setFieldValue("importDate", date)}
                    dateFormat="dd/MM/yyyy"
                    locale={vi}
                    className="form-control shadow-sm"
                    placeholderText="Chọn ngày nhập..."
                  />
                  <ErrorMessage
                    name="importDate"
                    component="div"
                    className="text-danger mt-1"
                  />
                </div>

                {/* Nút hành động */}
                <div className="text-center mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg px-5 me-2 shadow-sm"
                    style={{
                      background: "linear-gradient(90deg, #007bff, #00c6ff)",
                      border: "none",
                    }}
                  >
                    💾 Lưu sản phẩm
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
