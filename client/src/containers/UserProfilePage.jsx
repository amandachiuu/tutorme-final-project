import React from 'react';
import UserProfile from '../components/UserProfile.jsx';

import Auth from '../modules/Auth';

class UserProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    };
  }
  /**
   * This method will be executed after initial rendering.
   */
  componentDidMount() {
    const xhr = new XMLHttpRequest();
    xhr.open('get', '/api/dashboard');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    // set the authorization HTTP header
    xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        this.setState({
          secretData: xhr.response.message,
          user: xhr.response.user
        });
      }
    });
    xhr.send();
  }

  render() {
    return (
      <UserProfile {...this.props}/>
    );
  }
}

export default UserProfilePage;
