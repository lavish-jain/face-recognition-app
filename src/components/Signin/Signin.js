import React from 'react';
import axios from 'axios';
import { server } from '../../constants';
import { Redirect } from 'react-router-dom';

class Signin extends React.Component {

    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            redirect: false,
        }
    }

    onEmailChange = (event) => {
        const state = this.state;
        const newState = {
            ...state,
            email: event.target.value,
        }
        this.setState(newState);
    }
    onPasswordChange = (event) => {
        const state = this.state;
        const newState = {
            ...state,
            password: event.target.value,
        }
        this.setState(newState);
    }
    authenticate = async (email, password) => {
        const body = {
            email,
            password
        }
        try {
            const response = await axios.post(`${server}/signin`, body);
            return response.data;

        } catch (err) {
            return null;
        }
    }
    onSubmitSignIn = async () => {
        const user = await this.authenticate(this.state.email, this.state.password);
        if (user) {
            this.props.loadUser(user);
            this.props.onRouteChange('home');
            const state = this.state;
            const newState = {
                ...state,
                redirect: true,
            }
            this.setState(newState);
        }
        else {
            console.log('Unauthorized');
        }
    }
    render() {
        // const { onRouteChange } = this.props;
        const { redirect } = this.state;
        if (redirect) {
            return (
                <Redirect to='/'/>
            )
        }
        return (
            <article className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
                <main className="pa4 black-80">
                    <div className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                            <legend className="f1 fw6 ph0 mh0">Sign In</legend>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                                <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="email" name="email-address" id="email-address" onChange={this.onEmailChange} />
                            </div>
                            <div className="mv3">
                                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                                <input className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" name="password" id="password" onChange={this.onPasswordChange} />
                            </div>
                        </fieldset>
                        <div className="">
                            <input className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" onClick={this.onSubmitSignIn} type="submit" value="Sign in" />
                        </div>
                        {/* <div className="lh-copy mt3">
                            <p className="f6 link dim black db pointer" onClick={() => onRouteChange('register')}>Register</p>
                        </div> */}
                    </div>
                </main >
            </article>
        )
    }
}

export default Signin;