import React, { useState} from 'react'

const Checkbox = ({categories, handleFilters }) => {
    const [checked, setChecked] = useState([])

    // Higher order function, a function returning another function
    const handleToggle = (categoryId) => () => {
        const categoryIndexInChecked = checked.indexOf(categoryId);
        const newCheckedCategoryId = [...checked];

        // if currently checked id was not already present in checked then push
        // else remove 
        if(categoryIndexInChecked === -1) {
            newCheckedCategoryId.push(categoryId)
        }
        else {
            // removing 1 item from the index at which category was already present
            newCheckedCategoryId.splice(categoryIndexInChecked, 1);
        }

        // console.log(newCheckedCategoryId);
        setChecked(newCheckedCategoryId);
        // passing selected categories to parent
        handleFilters(newCheckedCategoryId);
    }

    return categories.map((category, index) => (
        <li key={index} onChange={handleToggle(category._id)} value={checked.indexOf(category._id) === -1} className='list-unstyled'>
            <input type="checkbox" className="form-check-input"/>
            <label className='form-check-label'>{category.name}</label>
        </li>
    ))
}

export default Checkbox;
