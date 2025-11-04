import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi } from "date-fns/locale";

function AddProduct() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    categoryId: "",
    price: "",
    quantity: "",
    importDate: null,
  });

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, description, categoryId, price, quantity, importDate } = form;

    if (!name || !description || !categoryId || !price || !quantity || !importDate) {
      alert("⚠️ Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (!Number.isInteger(Number(quantity)) || Number(quantity) <= 0) {
      alert("⚠️ Số lượng phải là số nguyên dương!");
      return;
    }

    if (importDate > new Date()) {
      alert("⚠️ Ngày nhập không được lớn hơn ngày hiện tại!");
      return;
    }

    const newProduct = {
      code: generateProductCode(),
      name,
      description,
      categoryId: Number(categoryId),
      price: Number(price),
      quantity: Number(quantity),
      importDate: importDate.toISOString(),
    };

    const res = await fetch("http://localhost:3001/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    });

    if (res.ok) {
      alert(`✅ Thêm sản phẩm thành công! Mã: ${newProduct.code}`);

      setTimeout(() => {
        navigate("/");
      }, 1500);
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
          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label className="form-label fw-semibold">Tên sản phẩm</label>
              <input
                type="text"
                className="form-control form-control-lg shadow-sm"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nhập tên sản phẩm..."
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Mô tả</label>
              <textarea
                className="form-control shadow-sm"
                name="description"
                rows="3"
                value={form.description}
                onChange={handleChange}
                placeholder="Nhập mô tả sản phẩm..."
                required
              ></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Thể loại</label>
              <select
                className="form-select shadow-sm"
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                required
              >
                <option value="">-- Chọn thể loại --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Giá (VNĐ)</label>
                <input
                  type="number"
                  className="form-control shadow-sm"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Nhập giá..."
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Số lượng</label>
                <input
                  type="number"
                  className="form-control shadow-sm"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="Nhập số lượng..."
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Ngày nhập (dd/MM/yyyy)</label>
              <DatePicker
                selected={form.importDate}
                onChange={(date) => setForm({ ...form, importDate: date })}
                dateFormat="dd/MM/yyyy"
                locale={vi}
                className="form-control shadow-sm"
                placeholderText="Chọn ngày nhập..."
                required
              />
            </div>

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
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
