import React from 'react';
import Divider from 'material-ui/Divider';
import {List, ListItem} from 'material-ui/List';

class TutorReqItem extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      ...this.props
    }
  }

  renderItemIf() {
    const tutorReq = this.state.tutorReq;
    const url = `/tutorreq/${tutorReq.slug}`;
    const chevronRight = (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
      <path d="M7.5 4.5L6.44 5.56 9.88 9l-3.44 3.44L7.5 13.5 12 9z"/>
      </svg>
    );
    if (this.state.profile) {
      return (
        <div>
        <ListItem
        href={url}
        key={tutorReq.slug}
        rightIcon={chevronRight}
        primaryText={tutorReq.courseCode}
        secondaryText={
          <li>
          <div>
            <span style={{color: 'black'}}>Prof. {tutorReq.professor}</span><br />
            $ {tutorReq.wage} / hr -- {tutorReq.notes}
          </div>
          </li>
        }
        secondaryTextLines={2}
        />
        <Divider/>
        </div>
      );
    } else {
      return (
        <div>
        <ListItem
        href={url}
        key={tutorReq.slug}
        rightIcon={chevronRight}
        primaryText={tutorReq.tutorId}
        secondaryText={
          <li>
          <div>
            <span style={{color: 'black'}}>Prof. {tutorReq.professor}</span><br />
            $ {tutorReq.wage} / hr -- {tutorReq.notes}
          </div>
          </li>
        }
        secondaryTextLines={2}
        />
        <Divider/>
        </div>
      );
    }

  }

  render() {
    return(
      <div>
      {this.renderItemIf()}
      </div>
    );
  }
}

export default TutorReqItem;
