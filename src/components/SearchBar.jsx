import React, { useState } from "react";

function SearchBar({ categories, onSearch }) {
  const [keyword, setKeyword] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(keyword, categoryId);
  };

  return (
    <form className="d-flex gap-2 justify-content-center" onSubmit={handleSubmit}>
      <input
        type="text"
        className="form-control rounded-pill"
        style={{ maxWidth: "300px" }}
        placeholder="🔍 Tên sản phẩm..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      <select
        className="form-select rounded-pill"
        style={{ maxWidth: "220px" }}
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
      >
        <option value="">-- Thể loại --</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <button type="submit" className="btn btn-primary rounded-pill px-4">
        Tìm
      </button>
    </form>
  );
}

export default SearchBar;
