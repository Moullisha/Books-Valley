import React, { useState, useEffect } from 'react';
import Layout from "./Layout";
import { getCategories, getFilteredProducts } from './apiCore';
import Checkbox from './Checkbox';
import { prices } from './fixedPrices';
import RadioBox from './RadioBox';
import Card from './Card';

const Shop = () => {
    const [myFilters, setMyFilters] = useState({
        filters: { category: [], price: [] }
    })
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(false);
    const [limit, setLimit] = useState(5);
    const [skip, setSkip] = useState(0);
    const [size, setSize] = useState(0);
    const [filteredResults, setFilteredResults] = useState([]);

    const init = () => {
        getCategories()
        .then(data => {
            if(data.error) {
                setError(data.error)
            }
            else {
                setCategories(data)
            }
        })
    }    

    const loadFilteredResults = newFilters => {
        getFilteredProducts(skip, limit, newFilters).then(data => {
            if(data.error) {
                setError(data.error)
            }
            else {
                setFilteredResults(data.data);
                setSize(data.size);
                setSkip(0);
            }
        })
    }

    const loadMore = () => {
        let toSkip = skip + limit;
        getFilteredProducts(toSkip, limit, myFilters.filters).then(data => {
            if(data.error) {
                setError(data.error);
            }
            else {
                setFilteredResults([...filteredResults, ...data.data]);
                setSize(data.size);
                setSkip(0);
            }
        })
    }

    const loadMoreButton = () => {
        return (
            size > 0 && size >= limit && (
                <button onClick={loadMore} className="btn btn-warning mb-5">Load More</button>
            )
        )
    }

    useEffect(() => {
        init();
        loadFilteredResults(skip, limit, myFilters.filters)
    }, [])

    const handleFilters = (filters, filterBy) => {
        // console.log("Shop", filters, filterBy);
        const newFilters = {...myFilters}
        newFilters.filters[filterBy] = filters;

        if(filterBy === 'price') {
            let priceRange = handlePrice(filters);
            newFilters.filters[filterBy] = priceRange;
        }

        loadFilteredResults(myFilters.filters);
        setMyFilters(newFilters);
    }

    const handlePrice = value => {
        const data = prices;
        let array = [];

        for(let index in data) {
            if(data[index]._id === parseInt(value)) {
                array = data[index].array;
            }
        }
        return array;
    }

    return (
        <Layout title="Shop Page" description='Search and find books of your choice' className="container-fluid">
            <div className="row">
                <div className="col-4">
                    <h6>Filter by Category</h6>
                    <ul>
                    <Checkbox 
                        categories={categories} 
                        handleFilters={filters => handleFilters(filters, "category")}/>
                    </ul>
                    <h6>Filter by Price</h6>
                    <div>
                    <RadioBox 
                        prices={prices} 
                        handleFilters={filters => handleFilters(filters, "price")}/>
                    </div>
                </div>

                <div className="col-8">
                    <h2 className="mb-4">Products</h2>
                    <div className="row">
                        {filteredResults.map((product, index) => (
                            <Card key={index} product = {product} />
                        ))}
                    </div>
                    <hr></hr>
                {loadMoreButton()}
                </div>                
            </div>
        </Layout>
    )
}

export default Shop;