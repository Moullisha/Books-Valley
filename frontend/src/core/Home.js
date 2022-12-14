import React, { useState, useEffect } from 'react'
import Layout from './Layout';
import { getProductsByParam } from './apiCore'
import Card from './Card';
import Search from './Search';

const Home = () => {
    const [productsBySell, setProductsBySell] = useState([])
    const [productsByArrival, setProductsByArrival] = useState([])
    const [error, setError] = useState(false)

    const loadProductsBySell = () => {
        getProductsByParam('sold').then(data => {
            if(data.error) {
                setError(data.error)
            }
            else {
                setProductsBySell(data)
            }
        })
    }

    const loadProductsByArrival = () => {
        getProductsByParam('createdAt').then(data => {
            if(data.error) {
                setError(data.error)
            }
            else {
                setProductsByArrival(data)
            }
        })
    }

    useEffect(() => {
        loadProductsByArrival()
        loadProductsBySell()
    }, [])

    return (
        <Layout title="Home Page" description='Node React E-commerce App' className="container-fluid">
            <Search />
            <h2 className="mb-4">Best Sellers</h2>
            <div className="row">
                {productsBySell.map((product, index) => (
                    <Card key={index} product={product} />
                ))}
            </div>

            <h2 className="mb-4">New Arrivals</h2>
            <div className="row">
                {productsByArrival.map((product, index) => (
                    <Card key={index} product={product} />
                ))}
            </div>
        </Layout>
    )
}

export default Home;