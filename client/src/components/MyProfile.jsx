import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { Card, CardTitle, CardText, CardAction } from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import {Link} from 'react-router-dom';
import Typography from 'material-ui';
import TutorRequestForm from './ModalForms/TutorRequestForm.jsx';
import TutorReqItem from './TutorReqItem.jsx';

import Auth from '../modules/Auth';
const axios = require('axios');

class MyProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props,
      bioFieldOpen: false,
      courseFieldOpen: false
    };
    this.addTutorRequestHandler = this.addTutorRequestHandler.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    this.setState({
      ...this.state,
      ...nextProps
    });
  }

  updateBio(e) {
    e.preventDefault();
    const bio = document.getElementById("bio").value;
    const newData = {
      shortBio: bio
    }
    axios.put('/api/users/updateBio', newData,
      {headers: {
        'Content-type': 'application/json',
        'Authorization': `bearer ${Auth.getToken()}`
      }})
      .then(resp => {this.setState({user: resp.data})});
    this.setState({...this.state, bioFieldOpen: false});
  }

  displayBio() {
    const bioView  = this.state.bioFieldOpen ? (
      <div>
      <TextField defaultValue={this.state.user.shortBio} id="bio" multiLine={true} rows={2} />
      <RaisedButton label="Submit" onClick={this.updateBio.bind(this)}/>
      </div>
    ) : (
      <div>
      <RaisedButton label="Edit Bio" onClick={() => this.setState({...this.state, bioFieldOpen: true})}/>
      <div>
      {this.state.user.shortBio ?
        this.state.user.shortBio.split('\n').map((line)=>(<div>{line}</div>))
        : (<div></div>)
      }
      </div>
      </div>
    );
    return (
      <div>
      {bioView}
      </div>
    );
  }

  addCourseAsTutee() {

    const courseAsTutee = ((document.getElementById("courseAsTutee").value).trim()).replace(/[^a-z0-9]/gi,'').toUpperCase();
    this.state.user.coursesAsTutee.push(courseAsTutee);
    const newData = {
      coursesAsTutee: this.state.user.coursesAsTutee
    }
    axios.post('/api/users/addTuteeCourse', newData,
      {headers: {
        'Content-type': 'application/json',
        'Authorization': `bearer ${Auth.getToken()}`
      }})
      .then(resp => {
        this.setState({user: resp.data})
      });
    this.setState({...this.state, courseFieldOpen: false});
  }


  displayCourseAsTutee() {
    const chevronRight = (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
      <path d="M7.5 4.5L6.44 5.56 9.88 9l-3.44 3.44L7.5 13.5 12 9z"/>
      </svg>
    );
    const addCourseField = this.state.courseFieldOpen ? (
      <div>
      <TextField id="courseAsTutee"/>
      <RaisedButton label="Submit" onClick={() => this.addCourseAsTutee()}/>
      <RaisedButton label="Cancel" onClick={() => this.setState({...this.state, courseFieldOpen: false})}/>
      </div>
    ) : (
      <div>
      <RaisedButton label="Add Course" onClick={() => this.setState({...this.state, courseFieldOpen: true})}/>
      </div>
    );
    return (
      <div>
        {addCourseField}
        <List style={{width:'75%'}}>
        {this.state.user.coursesAsTutee ?
          this.state.user.coursesAsTutee.map((course) => {
            const url = `/search?criteria=${course}`;
            return (
              <ListItem href={url} rightIcon={chevronRight}>{course}</ListItem>
            )
          }) : (
            <div>No courses to show...</div>
          )
      }
        </List>
      </div>
    );
  }

  addTutorRequestHandler(newState) {
    this.setState({
      user: newState
    })
  }

  render() {
    console.log(this.state);
    return (
      <div>
        <Card className="container">
          <CardText>
            <CardTitle title="Your Profile" />
            <CardTitle subtitle="Short Bio:" />
            {this.displayBio()}

            <CardTitle subtitle="Listed to tutor in these courses:" />
            <TutorRequestForm
              user={this.state.user}
              setProfileState={this.addTutorRequestHandler}
            />
            {
              this.state.user.coursesAsTutor &&
              this.state.user.coursesAsTutor.map((tutorReq) =><TutorReqItem profile={true} tutorReq={tutorReq}/>)
            }
            <CardTitle subtitle="Find a tutor for these courses:" />
            {this.displayCourseAsTutee()}
          </CardText>
        </Card>
      </div>
    );
  }
}
export default MyProfile;
