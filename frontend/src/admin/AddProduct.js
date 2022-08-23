import React, { useState, useEffect } from 'react'
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import { createProduct, getCategories } from './apiAdmin';

const AddProduct = () => {
    
    const [values, setValues] = useState({
        name: '',
        description:'',
        price:'',
        categories: [],
        category: '',
        shipping: '',
        quantity: '',
        photo: '',
        loading: false,
        error: '',
        createdProduct: '',
        redirectToProfile: false,
        formData: ''
    })

    const { user, token } = isAuthenticated();
    const {
        name,
        description,
        price,
        categories,
        category,
        shipping,
        quantity,
        loading,
        error,
        createdProduct,
        redirectToProfile,
        formData
    } = values;

    //load categories and load form data
    const init = () => {
        getCategories().then(data => {
            if(data.error) {
                setValues({ ...values, error: data.error });
            }
            else {
                setValues({ ...values, 
                    categories: data,
                    formData: new FormData()
                })
            }
        })
    }

    useEffect(() => {
        init();
    }, [])

    const handleChange = (event) => {
        const value = event.target.name === 'photo' ? event.target.files[0] : event.target.value;
        formData.set(event.target.name, value)
        setValues({...values, [event.target.name] : value})
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setValues({...values, error: '', loading: true});

        createProduct(user._id, token, formData)
        .then(data => {
            if(data.error) {
                setValues({...values, error: data.error })
            }
            else {
                setValues({
                    ...values, 
                    name: '', 
                    description:'', 
                    photo: '', 
                    price: '', 
                    quantity: '', 
                    loading: false,
                    shipping: '',
                    createdProduct: data.name
                })
            }
        })
    }

    const newPostForm = () => (
        <form className='mb-3' onSubmit={handleSubmit}>
            <h4>Post Photo</h4>
            <div className='form-group'>
                <label className='btn btn-secondary'>
                    <input type="file" name="photo" onChange={handleChange} accept='image/*' />
                </label>
            </div>

            <div className="form-group">
                <label className='text-muted'>Name</label>
                <input onChange={handleChange} type="text" className='form-control'
                name='name' value={name} />
            </div>

            <div className="form-group">
                <label className='text-muted'>Description</label>
                <textarea onChange={handleChange} type="text" className='form-control'
                name='description' value={description} />
            </div>

            <div className="form-group">
                <label className='text-muted'>Price</label>
                <input onChange={handleChange} type="number" className='form-control'
                name='price' value={price} />
            </div>

            <div className="form-group">
                <label className='text-muted'>Category</label>
                <select onChange={handleChange} className='form-control'
                name='category' value={category} >
                    <option>Select an option</option>
                    {categories && categories.map((categ, index) => (
                        <option key={index} value={categ._id}>{categ.name}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label className='text-muted'>Shipping</label>
                <select onChange={handleChange} className='form-control'
                name='shipping' value={shipping} >
                    <option>Select an option</option>
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                </select>
            </div>

            <div className="form-group">
                <label className='text-muted'>Quantity</label>
                <input onChange={handleChange} type="number" className='form-control'
                name='quantity' value={quantity} />
            </div>

            <button className='btn btn-outline-primary'>Create Product</button>
        </form>
    )

    const showError = () => (
        <div className="alert alert-danger" style={{display: error ? '' : 'none'}}>
            {error}
        </div>
    )

    const showSuccess = () => (
        <div className='alert alert-info' style={{display: createdProduct ? '' : 'none' }}>
            <h3>{`${createdProduct}`} is created!</h3>
        </div>
    )

    const showLoading = () => (
        loading && (
            <div className="alert alert-success">
                <h3>Loading...</h3>
            </div>
        )
    )

    return (
        <Layout title = "Add new product" description="Add a new product">
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    {showLoading()}
                    {showSuccess()}
                    {showError()}
                    {newPostForm()}
                </div>
            </div>
        </Layout>
    )
}

export default AddProduct;