import React from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Clarifai from 'clarifai';
import axios from 'axios';
import { server } from './constants';
import './App.css';

const app = new Clarifai.App({ apiKey: 'api_key' })

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
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: '',
      }
    };
  }
  loadUser = user => {
    const state = this.state;
    const newState = {
      ...state,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        entries: user.entries,
        joined: user.joined,
      }
    }
    this.setState(newState);
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
  updateEntries = async () => {
    const body = {
      id: this.state.user.id,
    };
    try {
      const response = await axios.put(`${server}/image`, body);
      this.loadUser(response.data);
    } catch (err) {
      console.log(err);
    }
  }
  onButtonSubmit = () => {
    const { input } = this.state;
    const state = this.state;
    const newState = {
      ...state,
      imageUrl: input,
    };
    this.setState(newState, () => {
      const { imageUrl } = this.state;
      app.models.predict(Clarifai.FACE_DETECT_MODEL, imageUrl)
        .then(response => {
          this.updateEntries();
          this.displayFaceBox(this.calculateFaceBoundary(response.outputs[0].data.regions))
        })
        .catch(err => { console.log(err); })
    });
  }
  onRouteChange = route => {
    const state = this.state;
    const isSignedIn = route === 'signin' || route === 'register' ? false : true;
    const newState = {
      ...state,
      route,
      isSignedIn,
      imageUrl: '',
    };
    this.setState(newState);
  }
  render() {
    const { isSignedIn, imageUrl, boxes, route } = this.state;
    return (
      <div className="App">
        <Particles
          params={particleOptions}
          className="particles"
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {route === 'home' ?
          <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries} />
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
            <FaceRecognition imageUrl={imageUrl} boxes={boxes} />
          </div>
          :
          (
            route === 'signin' ?
              <Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
              :
              <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
          )
        }
      </div>
    );
  }

}

export default App;
