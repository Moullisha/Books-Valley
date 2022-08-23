import React, {useState} from 'react'
import {Link} from "react-router-dom";
import Layout from '../core/Layout';
import { signup } from '../auth' //since we're trying to import from index.js, mentioning index can be skipped
// import axios from 'axios';

const Signup = () => {
    const [formValues, setFormValues] = useState({
        name: "",
        email: "",
        password: "",
        error: "",
        success: false
    })

    const {name, email, password, success, error} = formValues;

    const handleChange = event => {
        // const {name, value} = event.target;
        setFormValues({...formValues, error: false, [event.target.name]: event.target.value})
    }    

    const handleSubmit = (event) => {
        event.preventDefault();
        setFormValues({...formValues, error: false})
        signup({name, email, password})
        .then(data => {
          if(data.error) {
            setFormValues({...formValues, error: data.error, success: false})
          }
          else {
            setFormValues({
              ...formValues,
              name: "",
              email: "",
              password: "",
              error: "",
              success: true
            })
          }
        })
    }

    const signUpForm = () => (
        <form>
            <div className='form-group'>
                <label className='text-muted'>Name</label>
                <input onChange={handleChange} type="text" name="name" value={formValues.name} className="form-control" />
            </div>

            <div className='form-group'>
                <label className='text-muted'>Email</label>
                <input onChange={handleChange} type="email" name="email" value={formValues.email} className="form-control" />
            </div>

            <div className='form-group'>
                <label className='text-muted'>Password</label>
                <input onChange={handleChange} type="password" name="password" value={formValues.password} className="form-control" />
            </div>

            <button className='btn btn-primary' onClick={handleSubmit}>Submit</button>
        </form>
    )

    const showError = () => (
      <div className="alert alert-danger" style={{display: error ? '' : 'none'}}>
        {error}
      </div>
    )

    const showSuccess = () => (
      <div className="alert alert-info" style={{display: success ? '' : 'none'}} >
        Account successfully created! Please <Link to="/signin">signin</Link> to continue.
      </div>
    )
    
    return (
        <Layout title="Signup" description="Signup to Node React E-commerce app" className="container col-md-6 offset-md-2">
            {showSuccess()}
            {showError()}
            {signUpForm()}            
        </Layout>
    )
}

export default Signup;
