import React from 'react';
import {Link} from 'react-router-dom';
import './Navigation.css'

class Navigation extends React.Component {
    render() {
        const {isSignedIn, onRouteChange} = this.props;
        if (isSignedIn) {
            return (
                <nav>
                    <Link to="/"><p className='f3 link dim white underline pa3 pointer' onClick={() => onRouteChange('signin')}>Sign Out</p></Link>
                </nav>
            );
        } else {
            return (
                <nav>
                    <Link to="/"><p className='f3 link dim white underline pa3 pointer' onClick={() => onRouteChange('signin')}>Sign In</p></Link>
                    <Link to="/register"><p className='f3 link dim white underline pa3 pointer' onClick={() => onRouteChange('register')}>Register</p></Link>
                </nav>
            );
        }

    }
}

export default Navigation;