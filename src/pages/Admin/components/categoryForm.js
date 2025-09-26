import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

function CategoryForm({ onSubmit, initialData = { name: "" }, submitLabel }) {
  const [name, setName] = useState(initialData.name);
  const [slug, setSlug] = useState(initialData.slug || "");
  const [error, setError] = useState("");

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  useEffect(() => {
    setName(initialData.name || "");
    setSlug(initialData.slug || "");
  }, [initialData]);

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    setSlug(generateSlug(value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Category name is required");
      return;
    }
    onSubmit({ name: name.trim(), slug });
    setName("");
    setSlug("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group mb-2">
        <label htmlFor="categoryName">Category Name</label>
        <input
          type="text"
          id="categoryName"
          value={name}
          onChange={handleNameChange}
          className="form-control"
          placeholder="Enter category name"
        />
        {error && <small className="text-danger">{error}</small>}
      </div>

      <div className="form-group mb-3">
        <label htmlFor="categorySlug">Slug (auto-generated)</label>
        <input
          type="text"
          id="categorySlug"
          value={slug}
          className="form-control"
          readOnly
        />
        <small className="text-muted">
          This slug is generated automatically.
        </small>
      </div>

      <button type="submit" className="btn btn-primary">
        {submitLabel || "Save"}
      </button>
    </form>
  );
}

// ✅ PropTypes
CategoryForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    name: PropTypes.string,
    slug: PropTypes.string,
  }),
  submitLabel: PropTypes.string,
};

export default CategoryForm;
