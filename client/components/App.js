import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Home from './Home';
// import Navbar from './Navbar/index';
import Footer from './Footer';
import SignIn from './SignIn';
import SignUp from './SignUp';
import NavBar from './NavBar';
import { signOut } from '../actions/userActions';
import PrivateRoute from './PrivateRoute';
import AccountSettings from './Account';
import AllFriends from './AllFriends';
import FriendProfile from './FriendProfile';
import UserProfile from './UserProfile';

function App() {
  const userSignIn = useSelector((state) => state.userSignIn);
  const { userInfo } = userSignIn;
  const dispatch = useDispatch();
  const signOutHandler = () => {
    dispatch(signOut());
  };
  return (
    <Router>
      <div className="grid-container">
        <header className="row">
          <div>
            {userInfo ? (
              <div className="userInfo">
                <Link to="#">
                  {userInfo.username} <i className="fa fa-caret-down" />{' '}
                </Link>
                <Link to="#signout" onClick={signOutHandler}>
                  Sign Out
                </Link>
              </div>
            ) : (
              <Link to="/signin">Log In</Link>
            )}
          </div>
        </header>
      </div>
      <NavBar />
      <Switch>
        <Route path="/signIn" component={SignIn} exact />
        <Route path="/signUp" component={SignUp} exact />
        <Route exact path="/profile" component={UserProfile} />
        <Route exact path="/friends" component={AllFriends} />
        <Route exact path="/friends/:friendId" component={FriendProfile} />
        <Route exact path="/account" component={AccountSettings} />
        <PrivateRoute path="/profile" component={UserProfile} />
        <Route path="/" component={Home} exact />
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;
