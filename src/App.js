import React from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Clarifai from 'clarifai';

import './App.css';

const app = new Clarifai.App({ apiKey: '3229240997814b818fb4439c70c05b88' })

const particleOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enabled: true,
        value_area: 800,
      }
    },
    line_linked: {
      shadow: {
        enable: true,
        color: "#3CA9D1",
        blur: 5
      }
    }
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      boxes: [],
    };
  }
  calculateFaceBoundary = (data) => {
    const boxes = [];
    for (let region of data) {
      const faceBoundary = region.region_info.bounding_box;
      const image = document.getElementById('image');
      const width = Number(image.width);
      const height = Number(image.height);
      const box = {
        leftCol: width * faceBoundary.left_col,
        topRow: height * faceBoundary.top_row,
        rightCol: width - (width * faceBoundary.right_col),
        bottomRow: height - (height * faceBoundary.bottom_row),
      }
      boxes.push(box);
    }
    return boxes;
  }

  displayFaceBox = boxes => {
    const state = this.state;
    const newState = {
      ...state,
      boxes,
    };
    this.setState(newState);
  }

  onInputChange = event => {
    const state = this.state;
    const newState = {
      ...state,
      input: event.target.value,
    };
    this.setState(newState);
  }
  onButtonSubmit = () => {
    const url = this.state.input;
    const state = this.state;
    const newState = {
      ...state,
      imageUrl: url,
    };
    this.setState(newState, () => {
      app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.imageUrl)
        .then(response => this.displayFaceBox(this.calculateFaceBoundary(response.outputs[0].data.regions)))
        .catch(err => { console.log(err); })
    });
  }
  render() {
    return (
      <div className="App">
        <Particles
          params={particleOptions}
          className="particles"
        />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
        <FaceRecognition imageUrl={this.state.imageUrl} boxes={this.state.boxes} />
      </div>
    );
  }

}

export default App;
