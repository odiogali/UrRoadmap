import React, { Component } from "react";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";

export default class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (<Router>
      <Switch>
        <Route exact path='/' ><p>This is the homepage.</p></Route>
        <Route path='/login' component={LoginPage} />
        <Route path='/register' component={RegisterPage} />
      </Switch>
    </Router>);
  }
}
