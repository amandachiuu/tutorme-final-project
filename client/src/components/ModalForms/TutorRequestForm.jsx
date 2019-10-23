import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

import Auth from '../../modules/Auth';
const axios = require('axios');

/**
 * Dialog with action buttons. The actions are passed in as an array of React objects,
 * in this example [FlatButtons](/#/components/flat-button).
 *
 * You can also close this dialog by clicking outside the dialog, or with the 'Esc' key.
 */

export default class TutorRequestForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props,
      open: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({...nextProps, open: this.state.open});
  }

  addTutorRequest() {
    const courseCode = (((document.getElementById("courseCode").value).trim()).replace(/[^a-z0-9]/gi,'')).toUpperCase();
    const professor = (document.getElementById("professor").value).trim();
    const wage = (document.getElementById("wage").value).trim();
    const notes = (document.getElementById("notes").value).trim();

    if (courseCode.length === 0 || professor.length === 0 || notes.length === 0) {
      console.log("required field error")
      this.setState({...this.state, errorText: "ERROR: Please check that all required fields are filled out."});
      return;
    } else if (wage && !parseInt(wage)) {
      console.log("not valid number");
      this.setState({...this.state, errorText: "ERROR: Wage is not a valid number."});
      return;
    }
    const newData = {
      courseCode: courseCode,
      tutorId: this.props.user.netid,
      professor: professor,
      wage: wage,
      notes: notes
    }
    axios.post('/api/users/addTutorCourse', newData,
    {headers: {
      'Content-type': 'application/json',
      'Authorization': `bearer ${Auth.getToken()}`
    }})
    .then(resp => this.props.setProfileState(resp.data));
    this.setState({...this.state, open: false});
  }

  handleOpen() {
    this.setState({...this.state, open: true});
  }

  handleClose() {
    this.setState({...this.state, open: false});
  }

  handleSubmit() {
    this.addTutorRequest();
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose.bind(this)}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleSubmit.bind(this)}
      />
    ];
    const errorStyle= {
      marginTop: '20px',
      backgroundColor: '#F1A9A0'
    }
    return (
      <div>
        <RaisedButton label="Add Course" onClick={this.handleOpen.bind(this)} />
        <Dialog
          title="What course do you want to tutor for?"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose.bind(this)}
          autoScrollBodyContent={true}
        >
          <div>
          {this.state.errorText && (
            <div style={errorStyle}>{this.state.errorText}</div>
          )}
          <TextField
            floatingLabelText="Course Code"
            hintText="CSCI-UA 201"
            id="courseCode"
            errorText="* Required"
          />
          </div>
          <div>
          <TextField
            floatingLabelText="Professor"
            hintText="Jane Doe"
            id="professor"
            errorText="* Required"
          />
          </div>
          <div>
          <TextField
            floatingLabelText="Minimum hourly wage"
            hintText="$"
            id="wage"
          />
          </div>
          <div>
          <TextField
            floatingLabelText="Qualification(s) to tutor this course"
            id="notes"
            multiLine={true}
            rows={4}
            errorText="* Required"
          />
          </div>
        </Dialog>
      </div>
    );
  }
}
