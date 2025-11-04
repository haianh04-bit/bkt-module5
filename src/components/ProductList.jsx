import React, { useEffect, useState } from "react";
import { getProducts, getCategories } from "../services/api";
import SearchBar from "./SearchBar";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    Promise.all([getProducts(), getCategories()]).then(([p, c]) => {
      const catMap = Object.fromEntries(c.map((cat) => [cat.id, cat.name]));
      const enriched = p.map((item) => ({
        ...item,
        categoryName: catMap[item.categoryId] || "",
      }));
      enriched.sort((a, b) => a.name.localeCompare(b.name));
      setProducts(enriched);
      setFiltered(enriched);
      setCategories(c);
    });
  }, []);

  const handleSearch = (keyword, categoryId) => {
    let result = products;
    if (keyword)
      result = result.filter((p) =>
        p.name.toLowerCase().includes(keyword.toLowerCase())
      );
    if (categoryId)
      result = result.filter((p) => p.categoryId === Number(categoryId));
    setFiltered(result);
  };

  return (
    <div>
      <SearchBar categories={categories} onSearch={handleSearch} />

      {filtered.length === 0 ? (
        <div className="alert alert-warning mt-4 text-center">
          Không có kết quả tìm kiếm phù hợp 😢
        </div>
      ) : (
        <div className="table-responsive mt-4">
          <table className="table table-hover table-bordered align-middle shadow-sm">
            <thead className="table-primary text-center">
              <tr>
                <th>STT</th>
                <th>Mã sản phẩm</th>
                <th>Tên sản phẩm</th>
                <th>Thể loại</th>
                <th>Số lượng</th>
                <th>Giá</th>
                <th>Ngày nhập</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id}>
                  <td className="text-center fw-semibold">{i + 1}</td>
                  <td>{p.code}</td>
                  <td>{p.name}</td>
                  <td>
                    <span className="badge text-bg-info">{p.categoryName}</span>
                  </td>
                  <td className="text-center">{p.quantity}</td>
                  <td className="text-end text-success fw-bold">
                    {p.price.toLocaleString("vi-VN")} ₫
                  </td>
                  <td className="text-center">
                    {new Date(p.importDate).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProductList;
