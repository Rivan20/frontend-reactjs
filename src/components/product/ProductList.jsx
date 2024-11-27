import axios from "axios";
import { useEffect } from "react";
import { useState } from "react"
import { BASE_URL } from "../../helpers/config";
import { Link } from "react-router-dom";
import SortBy from "./SortyBy";


export default function ProductList() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortedProducts, setSortedProducts] = useState([]); 

  useEffect(() => {
    getProducts();
  }, [])
  
  async function onDeleteClick(product) {
    if (!window.confirm(`Are you sure you want to delete the product "${product.name}"?`)) {
      return;
    }
    axios
      .delete(`${BASE_URL}/products/${product.id}`)
      .then(() => {
        getProducts();
      })
      .catch((error) => {
        console.error(error.response?.data?.message);
      });

  }

  async function getProducts() {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/products`);
      setProducts(response.data.data || []); 
      setSortedProducts(response.data.data || []);
    } catch (error) {
      console.error(
        error.response?.data?.message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h4">Product List</h1>
        <div className="d-flex align-items-center">
          <SortBy products={products} setSortedProducts={setSortedProducts} />
          <Link to="/product/add" className="btn btn-success m-3">
            <i className="bi bi-plus-circle"></i> Add Product
          </Link>
        </div>
      </div>
      <div className="card shadow-sm">
        <div className="card-body">
          <table className="table table-hover table-bordered">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Stock</th>
                <th>Price (per pc)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : sortedProducts.length > 0 ? (
                sortedProducts.map((product, index) => (
                  <tr key={product.id}>
                    <td>{index + 1}</td>
                    <td>{product.name}</td>
                    <td>{product.stock}</td>
                    <td>{product.price}</td>
                    <td>
                      <Link to={`/product/edit/${product.id}`} className="btn btn-sm btn-primary me-2">
                        <i className="bi bi-pencil-square"></i> Edit
                      </Link>
                      <button
                        onClick={() => onDeleteClick(product)}
                        className="btn btn-sm btn-danger"
                      >
                        <i className="bi bi-trash"></i> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">No products available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
