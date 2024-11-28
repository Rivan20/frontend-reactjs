import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../helpers/config";
import { Link } from "react-router-dom";
import SortBy from "./SortyBy";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    const filtered = sortedProducts.filter((product) => {
      const query = searchQuery.toLowerCase();
      return (
        product.name.toLowerCase().includes(query) ||
        product.stock.toString().includes(query) ||
        product.price.toString().includes(query)
      );
    });
    setFilteredProducts(filtered);
  }, [searchQuery, sortedProducts]);

  async function handleDelete() {
    if (!productToDelete) return;

    axios
      .delete(`${BASE_URL}/products/${productToDelete.id}`)
      .then(() => {
        getProducts();
        setShowModal(false);
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
      setFilteredProducts(response.data.data || []);
    } catch (error) {
      console.error(error.response?.data?.message);
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
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name, stock, or price..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
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
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <tr key={product.id}>
                    <td>{index + 1}</td>
                    <td>{product.name}</td>
                    <td>{product.stock}</td>
                    <td>{product.price}</td>
                    <td>
                      <Link
                        to={`/product/edit/${product.id}`}
                        className="btn btn-sm btn-primary me-2"
                      >
                        <i className="bi bi-pencil-square"></i> Edit
                      </Link>
                      <button
                        onClick={() => {
                          setShowModal(true);
                          setProductToDelete(product);
                        }}
                        className="btn btn-sm btn-danger"
                      >
                        <i className="bi bi-trash"></i> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No products available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Confirmation</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to delete the product{" "}
                  <strong>{productToDelete?.name}</strong>?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
