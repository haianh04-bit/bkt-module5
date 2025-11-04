import React, { useState } from "react";
import ProductList from "./components/ProductList";
import AddProduct from "./components/AddProduct";
import "./App.css";

function App() {
  const [view, setView] = useState("list");

  return (
    <div className="app-container container py-4">
      <div className="text-center mb-4">
        <h1 className="app-title text-primary fw-bold">
          💊 TIT Pharmacy Management
        </h1>
        <p className="text-secondary">Quản lý sản phẩm thuốc và thực phẩm chức năng</p>
      </div>

      <div className="card shadow-sm border-0 p-4">
        {view === "list" && (
          <>
            <div className="d-flex justify-content-end mb-3">
              <button
                className="btn btn-success btn-lg rounded-pill"
                onClick={() => setView("add")}
              >
                ➕ Thêm sản phẩm
              </button>
            </div>
            <ProductList />
          </>
        )}

        {view === "add" && (
          <>
            <button
              className="btn btn-outline-secondary mb-3 rounded-pill"
              onClick={() => setView("list")}
            >
              ← Quay lại danh sách
            </button>
            <AddProduct onSuccess={() => setView("list")} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
