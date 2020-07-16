import React, { useEffect, createContext, useReducer, useContext } from 'react';
import Navbar from './components/Navbar'
import './App.css';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom'
import Home from './components/screens/Home';
import Signup from './components/screens/Signup';
import Signin from './components/screens/Signin';
import Profile from './components/screens/Profile';
import CreatePost from './components/screens/CreatePost';
import { reducer, initialState } from './reducers/userReducer'
import UserProfile from './components/screens/UserProfile';
import SubscribesUserPost from './components/screens/SubscribesUserPost';

export const UserContext = createContext()

const Routing = () => {
  const history = useHistory()
  const { state, dispatch } = useContext(UserContext)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      dispatch({ type: "USER", payload: user })
    } else {
      history.push('/signin')
    }
  }, [])
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/signup" component={Signup} />
      <Route path="/signin" component={Signin} />
      <Route exact path="/profile" component={Profile} />
      <Route path="/createpost" component={CreatePost} />
      <Route path="/profile/:userid" component={UserProfile} />
      <Route path="/myfollowingpost" component={SubscribesUserPost} />
    </Switch>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <Router>
        <Navbar />
        <Routing />
      </Router>
    </UserContext.Provider>
  );
}

export default App;
