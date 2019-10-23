import React from 'react';
import PropTypes from 'prop-types';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import SearchBar from 'material-ui-search-bar';
import {
  Card,
  CardTitle,
  CardText,
  CardAction
} from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import {List, ListItem} from 'material-ui/List';
import { withRouter } from "react-router-dom";

import TutorReqItem from './TutorReqItem.jsx'

import Auth from '../modules/Auth';
const qs = require('query-string');
const axios = require('axios');

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props,
      results: []
    };
  }

  componentDidMount() {
    if (this.props.location.search) {
      const criteria = qs.parse(this.props.location.search).criteria;
      this.setState({...this.state, searchVal: criteria});
      this.search();
    }
  }

  onClickSearch() {
    const criteria = document.getElementById("filterText").value;
    this.props.history.push({
      pathname: '/search',
      search: `?criteria=${criteria}`
    });
    this.search();
  }

  search() {
    const criteria = qs.parse(this.props.history.location.search).criteria;
    const finalSearchVal = criteria.replace(/[^a-z0-9]/gi,'').toUpperCase();
    console.log(finalSearchVal)
    axios.get(`api/search?criteria=${finalSearchVal}`, {
      headers: {
        'Content-type': 'application/json',
        'Authorization': `bearer ${Auth.getToken()}`
      }
    })
    .then(resp => {
      this.setState({...this.state, results: resp.data.availableTutors});
      console.log("searched, state change: ", this.state);
    });
  }

  render() {
    return (
      <div className="container">
      <h1>Search by course code</h1>
      <SearchBar
        id = "filterText"
        value={this.state.searchVal}
        onChange={(newVal)=>{
          this.setState({...this.state, searchVal: newVal});
        }}
        onRequestSearch={() => this.onClickSearch()}
        style={{
          margin: '0 auto',
          maxWidth: 800
        }}
      />
      <List>
      {
        this.state.results ?
        this.state.results.map((tutorReq) => {
          return (
            <div>
            <TutorReqItem tutorReq={tutorReq} profile={false} />
            <Divider/>
            </div>
          );
        }
        ) : (
          <Card>
          <CardText>
          <CardTitle title="There are currently no tutors available for this course."/>
          <div style={{margin:'auto 20px'}}>Please check that you've entered a valid course code (e.g. csciua201)</div>
          </CardText>
          </Card>
        )
      }
      </List>

      </div>
    );
  }
}

export default withRouter(Search);
