import React, {Fragment} from 'react'
import { Link, withRouter } from 'react-router-dom';
//using withRouter to access props history
//using Link because we don't want to re-load the page each time we click on a link 
import { signout, isAuthenticated } from '../auth'

const isActive = (history, path) => {
    if(history.location.pathname === path) {
        return {color : "#ff9900"}
    }
    else {
        return {color : "#ffffff"}
    }
}

const Menu = ({ history }) => (
    <div>
        <ul className="nav nav-tabs bg-primary">
            <li className="nav-item">
                <Link className='nav-link' style={isActive(history, '/')} to="/">Home</Link>
            </li>

            <li className="nav-item">
                <Link className='nav-link' style={isActive(history, '/shop')} to="/shop">Shop</Link>
            </li>

            {isAuthenticated() && isAuthenticated().user.role === 0 && (
                <li className="nav-item">
                <Link className='nav-link' style={isActive(history, '/user/dashboard')} to="/user/dashboard">Dashboard</Link>
            </li>
            )}

            {isAuthenticated() && isAuthenticated().user.role === 1 && (
                <li className="nav-item">
                <Link className='nav-link' style={isActive(history, '/admin/dashboard')} to="/admin/dashboard">Dashboard</Link>
            </li>
            )}
            
            {!isAuthenticated() && (
                <Fragment>
                    <li className="nav-item">
                        <Link className='nav-link' style={isActive(history, '/signup')} to="/signup">Signup</Link>
                    </li>
                    <li className="nav-item">
                        <Link className='nav-link' style={isActive(history, '/signin')} to="/signin">Signin</Link>
                    </li>
                </Fragment>
            )}
            
            {isAuthenticated() && (
                <li className="nav-item">
                <span className='nav-link' style={{cursor: 'pointer', color: '#ffffff'}} onClick={() => signout(() => {
                    history.push("/");
                })} >Sign out</span>
            </li>
            )}
        </ul>
    </div>
)

export default withRouter(Menu);


//--------- Notes------
// Anchor tags will reload the page and re-render all the components. While <Link> and <NavLink> 
// will only re-render updated components matched with the URL path of the Route without reloading. 
// It helps the Single-Page Applications to work faster while routing.

// ----------
// used withRouter to access props history. Some common components such as Headers appear on every page,
// hence are not wrapped in <Route>. This means header cannot the user. To resolve this, we can wrap
//     Header in withRouter. This gives it access to this.history.props.push!