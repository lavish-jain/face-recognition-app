import React from 'react';
import Particles from 'react-particles-js';
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import TelemetryProvider from './components/TelemetryProvider/TelemetryProvider';
import axios from 'axios';
import { getAppInsights } from './TelemetryService';
import { server, appInsightsIKey } from './constants';
import './App.css';

const initialState = {
  input: '',
  imageUrl: '',
  boxes: [],
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: '',
  }
};

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
    this.setState(newState, async () => {
      const { imageUrl } = this.state;
      const body = {
        image_url: imageUrl
      }
      const response = await axios.post(`${server}/predictface`, body);
      this.updateEntries();
      this.displayFaceBox(this.calculateFaceBoundary(response.data.outputs[0].data.regions))
    });
  }
  onRouteChange = route => {
    const state = this.state;
    const isSignedIn = route === 'signin' || route === 'register' ? false : true;
    if (!isSignedIn) {
      this.setState(initialState);
    }
    const newState = {
      ...state,
      route,
      isSignedIn,
      imageUrl: '',
    };
    this.setState(newState);
  }
  render() {
    const { isSignedIn, imageUrl, boxes } = this.state;
    return (
      <BrowserRouter>
        <div className="App">
          <TelemetryProvider instrumentationKey={ appInsightsIKey } after={() => {  getAppInsights() }}>
            <Particles
              params={particleOptions}
              className="particles"
            />
            <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
            <Switch>
              <Route path="/signin" >
                <Logo />
                <Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
              </Route>
              <Route path="/register">
                <Logo />
                <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} />  
              </Route> 
              <Route exact path="/">
                { isSignedIn ? 
                                  <div>
                                  <Logo />
                                  <Rank name={this.state.user.name} entries={this.state.user.entries} />
                                  <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
                                  <FaceRecognition imageUrl={imageUrl} boxes={boxes} />
                                </div>
                              :
                              <Redirect to="/signin"/>
              }

              </Route>
            </Switch>

            {/* {route === 'home' ?
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
            } */}
          </TelemetryProvider>
        </div>
      </BrowserRouter>
    );
  }

}

export default App;
