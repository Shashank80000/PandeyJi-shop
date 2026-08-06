import { useEffect, useState } from "react";
import api from "../api/axios";
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
    stock: "",
  });
  const allowedFields = ["title", "price", "description", "category", "image", "stock"];

  const loadProduct = async () => {
    const res = await api.get("/products");
    const product = res.data.find((p) => p._id === id);
    setForm(product);
  };

  useEffect(() => {
    loadProduct();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   
     
    await api.put(`/admin/update/${id}`, form);
    alert("Product updated!");
    navigate("/admin/products");
  };



  return (
    <div className="bg-slate-50 py-10">
      <div className="mx-auto w-full max-w-[900px] px-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-4xl font-black text-slate-900">Edit Product</h2>
          <p className="mt-2 text-sm text-slate-500">Update content, pricing, and stock details.</p>

          <form className="mt-8 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            {allowedFields.map((key) => (
              <input
                key={key}
                name={key}
                value={form[key]}
                onChange={handleChange}
                placeholder={key}
                className="h-12 rounded-xl border border-slate-300 px-4 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600"
              />
            ))}

            <button className="md:col-span-2 mt-2 h-12 rounded-xl bg-teal-700 text-base font-bold text-white transition hover:bg-teal-800">
              Update Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
