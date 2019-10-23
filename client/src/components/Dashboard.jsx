import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import {Route} from 'react-router-dom';
import MyProfile from './MyProfile.jsx'

const Dashboard = ({ secretData, user }) => (
  <Card className="container">
    <CardTitle
      title="Dashboard"
      subtitle="You should get access to this page only after authentication."
    />
    {secretData && <CardText style={{ fontSize: '16px', color: 'green' }}>Welcome <strong>{user.netid}</strong>!<br />{secretData}</CardText>}

    <Route path="/profile/me" component={MyProfile} user={user} />
  </Card>
);

Dashboard.propTypes = {
  secretData: PropTypes.string.isRequired
};

export default Dashboard;
