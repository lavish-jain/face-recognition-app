import React from 'react';
import './ImageLinkForm.css'
class ImageLinkForm extends React.Component {
    render() {
        return (
            <div>
                <p className='f3'>
                    {'This Magic Brain will detect faces in your pictures'}
                </p>
                <div className='center'>
                    <div className='form center pa4 br3 shadow-5'>
                        <input className='f4 pa2 w-70 center' type='text' />
                        <button className='w-30 grow link f4 ph3 pv2 dib white bg-light-purple'>{'Detect'}</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default ImageLinkForm;