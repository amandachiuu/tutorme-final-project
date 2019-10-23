import React from 'react';
import TutorRequest from '../components/TutorRequest.jsx';

import Auth from '../modules/Auth.js'

class TutorRequestPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * This method will be executed after initial rendering.
   */
  componentDidMount() {
    const xhr = new XMLHttpRequest();
    xhr.open('get', '/api/myprofile');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    // set the authorization HTTP header
    xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        this.setState({
          user: xhr.response.user
        });
      }
    });
    xhr.send();
  }

  render() {
    return (
      <TutorRequest {...this.props}/>
    );
  }
}

export default TutorRequestPage;
