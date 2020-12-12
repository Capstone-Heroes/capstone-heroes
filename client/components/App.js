import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './Home';
import Footer from './Footer';
import SignIn from './SignIn';
import SignUp from './SignUp';
import AllFriends from './AllFriends';
import FriendProfile from './FriendProfile';
import UserProfile from './UserProfile';
import RiskForm from './RiskForm';
import Navbar from './Navbar';
import PrivateRoute from './PrivateRoute';

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path="/signIn" component={SignIn} exact />
        <Route path="/signup" component={SignUp} exact />
        <PrivateRoute exact path="/profile" component={UserProfile} />
        <PrivateRoute exact path="/friends" component={AllFriends} />
        <PrivateRoute exact path="/friends/:friendId" component={FriendProfile} />
        <PrivateRoute exact path="/my-risk" component={RiskForm} />
        <Route path="/" component={Home} />
      </Switch>
      <Footer />
    </Router>
  );
}


  export default App;
