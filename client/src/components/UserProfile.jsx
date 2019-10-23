import React from 'react';
import {Card, CardText, CardTitle} from 'material-ui/Card';
import TutorReqItem from './TutorReqItem.jsx';
import Auth from '../modules/Auth';
const axios = require('axios');

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewUserId: this.props.match.params.userId
    };
  }

  componentDidMount() {
    axios.get(`/api/users/${this.state.viewUserId}`,
      {headers: {
        'Content-type': 'application/json',
        'Authorization': `bearer ${Auth.getToken()}`
      }}
    )
    .then(resp => this.setState({...this.state, viewUserData: resp.data}));
  }

  renderCards() {
    const userData = this.state.viewUserData;
    let tutor;
    let tutee;
    if (userData.coursesAsTutor) {
      tutor = (
        <Card>
          <CardText>
          <CardTitle title="Courses I can tutor in:"/>
          {
            userData.coursesAsTutor.map((tutorReq) => <TutorReqItem tutorReq={tutorReq} profile={true} />)
          }
          </CardText>
        </Card>
      );
    }
    if (userData.coursesAsTutee) {
      tutee = (
        <div>
        <Card>
          <CardText>
          <CardTitle title="Courses I need tutoring in:"/>
          <ul>
          {
            userData.coursesAsTutee.map((course) => <li>{course}</li>)
          }
          </ul>
          </CardText>
        </Card>
        </div>
      );
    }
    return (
      <div>
      {tutor}
      {tutee}
      </div>
    )
  }

  render() {
    console.log(this.state);

    const email = this.state.viewUserData ? `${this.state.viewUserData.netid}@nyu.edu` : "";
    const mailtoLink = this.state.viewUserData ? `mailto:${this.state.viewUserData.netid}@nyu.edu` : "";
    return (
      <div>
      {
        this.state.viewUserData ? (
        <div className="container">
        <h1>{`${this.state.viewUserData.firstName} ${this.state.viewUserData.lastName}`}</h1>
        <h3>Contact me at: <a href={mailtoLink}>{email}</a></h3>

        {this.renderCards()}
        </div>
      ) : (
        <h1>User not found</h1>
      )
      }
      </div>
    );
  }
}

export default UserProfile;
