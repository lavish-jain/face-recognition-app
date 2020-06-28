import React from 'react';
import './FaceRecognition.css'

class FaceRecognition extends React.Component {
    render() {
        return (
            <div className='center ma'>
                <div className='absolute mt2'>
                    <img src={this.props.imageUrl} alt='' />
                </div>
            </div>
        )
    }
}

export default FaceRecognition;