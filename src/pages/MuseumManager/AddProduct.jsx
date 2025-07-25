import React from 'react'
import Navbar from '../../components/Navbar'

function AddProduct() {
  return (
    <div>
        <Navbar />
    <div style={{ backgroundColor: '#fdf6ec', padding: '20px' }}>
    <div className="add-product-page d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 product-form-card shadow-sm">
        <h2 className="text-center mb-4 form-title">Add Museum Product</h2>
        <form>
          <div className="mb-3">
            <label className="form-label">Name of the Product</label>
            <input type="text" className="form-control" placeholder="Enter product name" />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea className="form-control" rows="3" placeholder="Enter product description"></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label">Country of Origin</label>
            <input type="text" className="form-control" placeholder="Enter country" />
          </div>

          <div className="mb-3">
            <label className="form-label">Category</label>
            <input type="text" className="form-control" placeholder="Enter category" />
          </div>

          <div className="mb-3">
            <label className="form-label">Year of Manufacture</label>
            <input type="number" className="form-control" placeholder="Enter year" />
          </div>

          <div className="mb-4">
            <label className="form-label">Add Photos</label>
            <input type="file" className="form-control" multiple />
          </div>

          <div className="text-end">
            <button type="submit" className="btn btn-dark px-4">Submit</button>
          </div>
        </form>
      </div>
    </div>
    </div>
    </div>
  )
}

export default AddProduct
