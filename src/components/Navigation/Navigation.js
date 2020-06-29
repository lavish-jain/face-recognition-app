import React from 'react';
import './Navigation.css'

class Navigation extends React.Component {
    render() {
        const {isSignedIn, onRouteChange} = this.props;
        if (isSignedIn) {
            return (
                <nav>
                    <p className='f3 link dim white underline pa3 pointer' onClick={() => onRouteChange('signin')}>Sign Out</p>
                </nav>
            );
        } else {
            return (
                <nav>
                    <p className='f3 link dim white underline pa3 pointer' onClick={() => onRouteChange('signin')}>Sign In</p>
                    <p className='f3 link dim white underline pa3 pointer' onClick={() => onRouteChange('register')}>Register</p>
                </nav>
            );
        }

    }
}

export default Navigation;