import React from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Clarifai from 'clarifai';

import './App.css';

const app = new Clarifai.App({apiKey: 'API_KEY'})

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
    };
  }
  onInputChange = event => {
    console.log(event.target.value);
  }
  onButtonSubmit = () => {
    app.models.predict(Clarifai.GENERAL_MODEL, 'https://samples.clarifai.com/metro-north.jpg')
    .then(response => {
      console.log(response);
    })
    .catch(err => {
      console.log(err);
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
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
        {/* <FaceRecognition /> */}
      </div>
    );
  }

}

export default App;
