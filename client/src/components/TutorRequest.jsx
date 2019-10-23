import React from 'react';
import {Card, CardText, CardTitle} from 'material-ui/Card';
import {Link} from 'react-router-dom';

import Auth from '../modules/Auth';
const axios = require('axios');

class TutorRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewTutorReqSlug: this.props.match.params.tutorReqSlug
    };
  }

  componentDidMount() {
    axios.get(`/api/tutorreq/${this.state.viewTutorReqSlug}`,
      {headers: {
        'Content-type': 'application/json',
        'Authorization': `bearer ${Auth.getToken()}`
      }}
    ).then(resp => this.setState({
      ...this.state,
      viewTutorReqData: resp.data
    }));
  }

  generateUserLink() {
    const link = `/profile/${this.state.viewTutorReqData.tutorId}`;
    const email = `${this.state.viewTutorReqData.tutorId}@nyu.edu`;
    const mailtoLink = `mailto:${this.state.viewTutorReqData.tutorId}@nyu.edu`;
    return (
      <div>
      <h1><Link to={link}>{this.state.viewTutorReqData.tutorId}</Link></h1>
      <div>[Click the link above to view my profile]</div>
      <h3>If interested in being tutored for {this.state.viewTutorReqData.courseCode}, contact me at: <a href={mailtoLink}>{email}</a></h3>
      </div>
    );
  }

  render() {
    console.log(this.state);
    return (
      <div className="container">
      {
        this.state.viewTutorReqData ? (
          <div>
          {this.generateUserLink()}
          <Card>
          <CardText>
            <CardTitle title={this.state.viewTutorReqData.courseCode}/>
            <div style={{margin: 'auto 25px'}}>
              <div>
              <span style={{fontWeight: 'bold'}}>Professor: </span>
              {this.state.viewTutorReqData.professor}
              </div>
              <div>
              <span style={{fontWeight: 'bold'}}>Minimum tutoring wage: </span>
              {this.state.viewTutorReqData.wage}
              </div>
              <span style={{fontWeight: 'bold'}}>Notes:</span>
              <div>
                {this.state.viewTutorReqData.notes}
              </div>
            </div>
          </CardText>
          </Card>
          </div>
        ) : (
          <div>
          Tutor Request not found.
          </div>
        )
      }
    </div>
    );
  }
}

export default TutorRequest;
