import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../helpers/config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProductForm() {
  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  async function fetchProduct(productId) {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/products/${productId}`);
      const product = response.data.data;
      setName(product.name);
      setStock(product.stock);
      setPrice(product.price);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch product details.");
      console.error(
        error.response?.data?.message
      );
    } finally {
      setLoading(false);
    } 
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        await axios.put(`${BASE_URL}/products/${id}`, { name, stock, price });
        toast.success("Product updated successfully!");
      } else {
        const checkResponse = await axios.get(`${BASE_URL}/products`);
        const existingProduct = checkResponse.data.data.find(
          (product) => product.name.toLowerCase() === name.toLowerCase()
        );

        if (existingProduct) {
          toast.error(`Product with name "${name}" already exists!`);
          setLoading(false);
          return;
        }

        await axios.post(`${BASE_URL}/products`, { name, stock, price });
        toast.success("Product added successfully!");
      }
      navigate("/product");
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong. Please try again.");
      console.log(error)
    }
  }

  return (
    <div className="container mt-4">
      <h1 className="h4 mb-4">{id ? "Edit Product" : "Add New Product"}</h1>
      <div className="card shadow-sm">
        <div className="card-body">
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Product Name
              </label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="stock" className="form-label">
                Stock
              </label>
              <input
                type="number"
                className="form-control"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
                min="0"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="price" className="form-label">
                Price (per pc)
              </label>
              <input
                type="number"
                className="form-control"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="0"
              />
            </div>
            <div className="d-flex justify-content-between">
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? "Saving..." : id ? "Update" : "Save"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/product")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
