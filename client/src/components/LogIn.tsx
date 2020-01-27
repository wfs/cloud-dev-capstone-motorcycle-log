import * as React from "react";
import Auth from "../auth/Auth";
import { Button } from "semantic-ui-react";

interface LogInProps {
  auth: Auth;
}

interface LogInState {}

export class LogIn extends React.PureComponent<LogInProps, LogInState> {
  onLogin = () => {
    this.props.auth.login();
  };

  render() {
    return (
      <div>
        {/* <img src="../motorcycle-log-small-banner.png" alt="small banner" />
        <h3>Your Motorcycle Log</h3> */}

        <Button onClick={this.onLogin} size="huge" inverted color="orange">
          Log in
        </Button>
      </div>
    );
  }
}
