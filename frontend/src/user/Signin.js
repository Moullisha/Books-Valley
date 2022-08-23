import React, {useState} from 'react'
import {Redirect} from "react-router-dom";
import Layout from '../core/Layout';
import { signin, authenticate, isAuthenticated } from '../auth' //since we're trying to import from index.js, mentioning index can be skipped
// import axios from 'axios';

const Signin = () => {
    const [formValues, setFormValues] = useState({
        email: "",
        password: "",
        error: "",
        loading: false,
        redirectToReferrer: false,
    })

    const {email, password, loading, error, redirectToReferrer} = formValues;
    const {user} = isAuthenticated();

    const handleChange = event => {
        // const {name, value} = event.target;
        setFormValues({...formValues, error: false, [event.target.name]: event.target.value})
    }    

    const handleSubmit = (event) => {
        event.preventDefault();
        setFormValues({...formValues, error: false, loading: true})
        signin({email, password})
        .then(data => {
          if(data.error) {
            console.log("Got error");
            setFormValues({...formValues, error: data.error, loading: false})
          }
          else {
            console.log("Signin success")
            authenticate(data, () => {
                setFormValues({
                    ...formValues,
                    redirectToReferrer: true
                  })
            })            
          }
        })
    }

    const signUpForm = () => (
        <form>            
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

    const showLoading = () => (
      loading && (
      <div className="alert alert-info">
        <h2>Loading...</h2>
      </div>)
    )

    const redirectUser = () => {
        if(redirectToReferrer) {
            if(user && user.role === 1) {
              return <Redirect to="/admin/dashboard"/>
            }
            else {
              return <Redirect to="/user/dashboard"/>
            }
        }
        if(isAuthenticated()) {
          return <Redirect to="/" />
        }
    }
    
    return (
        <Layout title="Signin" description="Signin to Node React E-commerce app" className="container col-md-6 offset-md-2">
            {showLoading()}
            {showError()}
            {signUpForm()} 
            {redirectUser()}           
        </Layout>
    )
}

export default Signin;
