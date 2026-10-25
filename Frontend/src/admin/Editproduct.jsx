import { useEffect, useState } from "react";
import api from "../api/axios";
import { getProduct, invalidateCatalogue } from "../services/resourceCache.js";
import { useNavigate, useParams } from "react-router";

export default function EditProduct() {
 const { id } = useParams();
 const navigate = useNavigate();

 const [form, setForm] = useState({
  title: "",
  price: "",
  description: "",
  category: "",
  image: "",
  images: [],
  stock: "",
 });
 const [loading, setLoading] = useState(true);
 const [saving, setSaving] = useState(false);
 const [errorMessage, setErrorMessage] = useState("");
 const [imageFiles, setImageFiles] = useState([]);

 const loadProduct = async () => {
  try {
   setLoading(true);
   setErrorMessage("");

   const product = await getProduct(id, { force: true });

   if (!product) {
    throw new Error("Product not found");
   }

   setForm({
    title: product.title || "",
    price: product.price ?? "",
    description: product.description || "",
    category: product.category || "",
    image: product.images?.[0] || "",
    images: product.images || [],
    stock: product.stock ?? "",
   });
   setImageFiles([]);
  } catch (error) {
   setErrorMessage(error.response?.data?.message || error.message || "Unable to load product");
  } finally {
   setLoading(false);
  }
 };

 useEffect(() => {
  loadProduct();
 }, [id]);

 const handleChange = (e) => {
  setForm({ ...form, [e.target.name]: e.target.value });
 };

 const handleImageChange = (e) => {
  const files = Array.from(e.target.files || []);
  const nextFiles = [...imageFiles, ...files].slice(0, 5);
  setImageFiles(nextFiles);
  if (nextFiles.length > 0) {
   setForm((current) => ({
    ...current,
    image: current.image || URL.createObjectURL(nextFiles[0]),
    images: [
     ...(current.images || []),
     ...files.slice(0, 5 - imageFiles.length).map((file) => URL.createObjectURL(file)),
    ],
   }));
  }
  e.target.value = "";
 };

 const removeImage = () => {
  setImageFiles([]);
  setForm((current) => ({ ...current, image: "", images: [] }));
 };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setErrorMessage("");
  setSaving(true);

  try {
   const formData = new FormData();
   formData.append("title", form.title);
   formData.append("description", form.description);
   formData.append("price", form.price);
   formData.append("category", form.category);
   formData.append("stock", form.stock);

   if (imageFiles.length > 0) {
    imageFiles.forEach((file) => formData.append("images", file));
   }
   (form.images || [])
    .filter((image) => !image.startsWith("blob:"))
    .forEach((image) => formData.append("existingImage", image));

   await api.put(`/admin/update/${id}`, formData);
   invalidateCatalogue();
   alert("Product updated!");
   navigate("/admin/products");
  } catch (error) {
   setErrorMessage(
    error.response?.data?.message || error.message || "Unable to update product"
   );
  } finally {
   setSaving(false);
  }
 };

 const fieldLabels = { title: "Title", price: "Price", description: "Description", category: "Category", stock: "Stock" };

 return (
  <div className="bg-surface py-10">
   <div className="mx-auto w-full max-w-[900px] px-4 sm:px-6">
    <div className="rounded-3xl border-line bg-card p-6 shadow-sm sm:p-8">
     <h2 className="text-3xl font-black text-ink sm:text-4xl">Edit Product</h2>
     <p className="mt-2 text-sm text-ink-soft">Update content, pricing, and stock details.</p>

     {loading && <p className="mt-6 text-sm text-ink-soft">Loading product...</p>}

     {errorMessage && (
      <p className="mt-6 rounded-lg border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
       {errorMessage}
      </p>
     )}

     <form className="mt-8 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
      {["title", "price", "description", "category", "stock"].map((key) => (
       <div key={key} className={key === "description" ? "md:col-span-2" : ""}>
        <label htmlFor={`edit-${key}`} className="mb-2 block text-sm font-semibold text-ink">
         {fieldLabels[key]}
        </label>
        {key === "description" ? (
         <textarea
          id={`edit-${key}`}
          name={key}
          rows="5"
          value={form[key] || ""}
          onChange={handleChange}
          className="w-full rounded-xl border-line-strong p-4 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600"
         />
        ) : (
         <input
          id={`edit-${key}`}
          name={key}
          value={form[key] || ""}
          onChange={handleChange}
          className="h-12 w-full rounded-xl border-line-strong px-4 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600"
         />
        )}
       </div>
      ))}

      <div className="rounded-xl border-line bg-surface p-4 md:col-span-2">
       <p className="mb-3 text-sm font-semibold text-ink">Product image</p>
       {form.images?.length > 0 ? (
        <div className="mb-4 flex flex-wrap items-center gap-4">
         {form.images.map((image) => (
          <img
           key={image}
           src={image}
           alt={form.title || "Product preview"}
           className="h-28 w-28 rounded-xl border-line bg-card object-contain p-2"
          />
         ))}
         <button
          type="button"
          onClick={removeImage}
          className="rounded-lg border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700"
         >
          Remove image
         </button>
        </div>
       ) : (
        <p className="mb-4 text-sm text-ink-soft">No image selected.</p>
       )}
       <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        aria-label="Upload product images"
        className="w-full rounded-xl border-line-strong bg-card p-3"
       />
      </div>

      <button
       type="submit"
       disabled={loading || saving}
       className="mt-2 h-12 rounded-xl bg-accent-strong text-base font-bold text-white transition hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2"
      >
       {saving ? "Updating..." : "Update Product"}
      </button>
     </form>
    </div>
   </div>
  </div>
 );
}
