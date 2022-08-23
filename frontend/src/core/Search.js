import React, { useState, useEffect } from 'react';
import { getCategories, list } from "./apiCore";
import Card from './Card';

const Search = () => {
    const [data, setData] = useState({
        categories: [],
        category: "",
        search: "",
        results: [],
        searched: false
    });

    const {categories, category, search, results, searched} = data;

    const loadCategories = () => {
        getCategories().then(data => {
            if(data.error) {
                console.log(data.error);
            }
            else {
                setData({...data, categories: data})
            }
        })
    }

    useEffect(() => {
        loadCategories()
    }, [])

    const handleChange = (name) => event =>{
        setData({...data, [name]: event.target.value, searched: false});
    }

    const searchData = () => {
        // console.log(search, category)
        if(search) {
            list({search: search || undefined, category: category})
            .then(response => {
                if(response.err) {
                    console.log(response.err);
                }
                else {
                    setData({ ...data, results: response, searched: true });
                }
            })
        }
    }

    const handlesubmit = (event) => {
        event.preventDefault();
        searchData()
    }

    const searchProducts = (results = []) => {
        return (
            <div className="row">
                {results.map((product, index) => (
                    <Card key={index} product={product} />
                ))}
            </div>
        )
    }

    const searchForm = () => (
        <form onSubmit={handlesubmit}>
            <span className="input-group-text">
                <div className="input-group input-group-lg">
                    <div className="input-group-prepend">
                        <select className="btn mr-2" onChange={handleChange("category")}>
                            <option value="All">Pick category</option>
                            {categories.map((category, index) => (
                                <option key={index} value={category._id}>{category.name}</option>
                            ))}
                        </select>
                    </div>
                    <input 
                        type="search" 
                        className='form-control' 
                        onChange={handleChange("search")} 
                        placeholder="Search by name" 
                    />
                </div>
                <div className='btn input-group-append' style={{border: 'none'}}>
                    <button className="input-group-text">Search</button>
                </div>
            </span>
        </form>
    )
    

    return (
        <div className='row'>
            <div className="container mb-3">
                {searchForm()}
            </div>
            <div className="container-fluid mb-3">
                {searchProducts(results)}
            </div>
        </div>
    )
}

export default Search;