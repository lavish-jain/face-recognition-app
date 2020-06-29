import React from 'react';
import './Navigation.css'

class Navigation extends React.Component {
    render() {
        return (
            <nav>
                <p className='f3 link dim white underline pa3 pointer' onClick={() => this.props.onRouteChange('signin')}>Sign Out</p>
            </nav>
        );
    }
}

export default Navigation;