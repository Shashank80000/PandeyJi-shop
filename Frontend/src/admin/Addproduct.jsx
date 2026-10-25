import { useEffect, useState } from "react";
import api from "../api/axios";
import { getCatalogue, invalidateCatalogue } from "../services/resourceCache.js";
import { useNavigate } from "react-router";

export default function AddProduct() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    images: [],
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCatalogue();
        const availableCategories = Array.isArray(data?.categories)
          ? data.categories
          : [];
        setCategories(availableCategories);
      } catch {
        setCategories([]);
      }
    };

    loadCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "images") {
      setForm((prev) => ({
        ...prev,
        images: Array.from(files),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setErrorMessage("");

      if (form.images.length === 0) {
        setErrorMessage("Select at least one product image before submitting.");
        return;
      }

      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("price", Number(form.price));
      formData.append("category", form.category);
      formData.append("stock", form.stock === "" ? 0 : Number(form.stock));

      form.images.forEach((file) => {
        formData.append("images", file);
      });

      await api.post("/admin/add", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      invalidateCatalogue();

      alert("Product added successfully!");
      navigate("/admin/products");

    } catch (err) {
      console.error(err);

      setErrorMessage(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Error adding product"
      );
    }
  };

  return (
    <div className="bg-surface py-10">
      <div className="mx-auto w-full max-w-[900px] px-4 sm:px-6">
        <div className="rounded-3xl border-line bg-card p-6 shadow-sm sm:p-8">
          <h2 className="text-3xl font-black text-ink sm:text-4xl">
            Add New Product
          </h2>

          <p className="mt-2 text-sm text-ink-soft">
            Fill details and publish to catalog.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 grid gap-4 md:grid-cols-2"
          >
            <div>
              <label htmlFor="title" className="mb-2 block text-sm font-semibold text-ink">
                Product Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Product Title"
                value={form.title}
                onChange={handleChange}
                className="h-12 w-full rounded-xl border-line-strong px-4"
                required
              />
            </div>

            <div>
              <label htmlFor="price" className="mb-2 block text-sm font-semibold text-ink">
                Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                className="h-12 w-full rounded-xl border-line-strong px-4"
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="mb-2 block text-sm font-semibold text-ink">
                Category
              </label>
              <input
                type="text"
                id="category"
                name="category"
                list="product-categories"
                placeholder="Choose or type a category"
                value={form.category}
                onChange={handleChange}
                className="h-12 w-full rounded-xl border-line-strong px-4"
              />
              <datalist id="product-categories">
                {categories.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>
              <p className="mt-1 text-xs text-ink-soft">
                Existing categories are suggested; new names are saved automatically.
              </p>
            </div>

            <div>
              <label htmlFor="stock" className="mb-2 block text-sm font-semibold text-ink">
                Stock
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                placeholder="Stock"
                value={form.stock}
                onChange={handleChange}
                className="h-12 w-full rounded-xl border-line-strong px-4"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="mb-2 block text-sm font-semibold text-ink">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                className="w-full rounded-xl border-line-strong p-4"
                rows="5"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="images" className="mb-2 block text-sm font-semibold text-ink">
                Product Images
              </label>
              <input
                type="file"
                id="images"
                name="images"
                accept="image/*"
                multiple
                onChange={handleChange}
                className="w-full rounded-xl border-line-strong p-3"
              />
            </div>

            {form.images.length > 0 && (
              <div className="md:col-span-2">
                <p className="mb-2 font-medium">Image Preview</p>

                <div className="flex flex-wrap gap-4">
                  {form.images.map((file, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="h-32 w-32 rounded-lg border object-cover"
                    />
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              className="mt-2 h-12 rounded-xl bg-accent-strong text-base font-bold text-white hover:bg-accent-strong md:col-span-2"
            >
              Add Product
            </button>

            {errorMessage && (
              <p className="rounded-lg border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 md:col-span-2">
                {errorMessage}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
