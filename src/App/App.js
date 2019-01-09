import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import {
  BrowserRouter, Route, Redirect, Switch,
} from 'react-router-dom';

import connection from '../helpers/data/connection';

import Auth from '../components/pages/Auth/Auth';
import Home from '../components/pages/Home/Home';
import Friends from '../components/pages/Friends/Friends';
import Weather from '../components/pages/Weather/Weather';
import Articles from '../components/pages/Articles/Articles';
import Messages from '../components/pages/Messages/Messages';
import Events from '../components/pages/Events/Events';
import MyNavBar from '../components/MyNavbar/MyNavbar';

import './App.scss';
import authRequests from '../helpers/data/authRequests';

const PublicRoute = ({ component: Component, authed, ...rest }) => {
  const routeChecker = props => (authed === false
    ? (<Component {...props} />)
    : (<Redirect to={{ pathname: '/home', state: { from: props.location } }} />));
  return <Route {...rest} render={props => routeChecker(props)} />;
};

const PrivateRoute = ({ component: Component, authed, ...rest }) => {
  const routeChecker = props => (authed === true
    ? (<Component {...props} />)
    : (<Redirect to={{ pathname: '/auth', state: { from: props.location } }} />));
  return <Route {...rest} render={props => routeChecker(props)} />;
};

class App extends React.Component {
  state = {
    authed: false,
    pendingUser: true,
  }

  componentDidMount() {
    connection();
    this.removeListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          authed: true,
          pendingUser: false,
        });
      } else {
        this.setState({
          authed: false,
          pendingUser: false,
        });
      }
    });
  }

  componentWillUnmount() {
    this.removeListener();
  }

  render() {
    const { authed, pendingUser } = this.state;
    const logoutClickEvent = () => {
      authRequests.logoutUser();
      this.setState({ authed: false });
    };

    if (pendingUser) {
      return null;
    }
    return (
      <div className="App">
        <BrowserRouter>
          <React.Fragment>
            <MyNavBar isAuthed={authed} logoutClickEvent={logoutClickEvent} />
            <div className='container'>
            <div className='row'>
                <Switch>
                  <PrivateRoute path='/' exact component={Home} authed={this.state.authed} />
                  <PrivateRoute path='/home' component={Home} authed={this.state.authed} />
                  <PrivateRoute path="/friends" authed={this.state.authed} component={Friends} />
                  <PrivateRoute path="/articles" authed={this.state.authed} component={Articles} />
                  <PrivateRoute path="/weather" authed={this.state.authed} component={Weather} />
                  <PrivateRoute path="/events" authed={this.state.authed} component={Events} />
                  <PrivateRoute path="/messages" authed={this.state.authed} component={Messages} />
                  <PublicRoute path='/auth' component={Auth} authed={this.state.authed} />
                </Switch>
              </div>
            </div>
          </React.Fragment>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
