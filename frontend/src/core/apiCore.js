import { API } from '../config';
import queryString from 'query-string';

export const getProductsByParam = sortBy => {
    return fetch(`${API}/products?sortBy=${sortBy}&order=desc&limit=5`, {
        method: 'GET'
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err))
}

export const getCategories = () => {
    return fetch(`${API}/categories`, {
        method: "GET"
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));
}

export const getFilteredProducts = (skip, limit, filters = {}) => {
    const data = {
        limit, skip, filters
    }

    return fetch(`${API}/products/by/search`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        return response.json();
    })
    .catch(err => {
        console.log(err);
    })
}

export const list = params => {
    const query = queryString.stringify(params);
    console.log('query', query);
    return fetch(`${API}/products/search?${query}`, {
        method: 'GET',
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err))
}