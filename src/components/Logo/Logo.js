import React from 'react';
import Tilt from 'react-tilt'
import './Logo.css'
import logo from './logo.png';

class Logo extends React.Component {
    render() {
        return (
            <div className='ma4 mt0'>
                <Tilt className="Tilt" options={{ max: 55 }} style={{ height: 150, width: 150 }} >
                    <div className="Tilt-inner pa3">
                        <img src={logo} alt='logo'/>
                    </div>
                </Tilt>
            </div>
        );
    }
}

export default Logo;