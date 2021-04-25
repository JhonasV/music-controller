import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import { Button, ButtonGroup, Grid, Typography } from "@material-ui/core";

// Pages
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";

export default function HomePage() {
  const [roomCode, setRoomCode] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserRoom = async () => {
    const response = await fetch("/api/user-in-room");

    if (response.status !== 200) {
      // Manage status different if 200
    } else {
      const data = await response.json();
      setRoomCode(data.code);
    }

    setLoading(!loading);
  };

  const clearRoomCode = () => {
    setRoomCode(null);
  };

  useEffect(() => {
    (async () => await fetchUserRoom())();
  }, []);

  const renderHomePage = () => {
    if (loading) {
      return <h4>Loading...</h4>;
    }

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} align="center">
          <Typography variant="h3" compact="h3">
            House Party
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <ButtonGroup disableElevation variant="contained" color="primary">
            <Button color="primary" to="/join" component={Link}>
              Join a Room
            </Button>
            <Button color="secondary" to="/create" component={Link}>
              Create a Room
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    );
  };

  return (
    <Router>
      <Switch>
        <Route
          path="/"
          exact
          render={() => {
            return roomCode ? (
              <Redirect to={`/room/${roomCode}`} />
            ) : (
              renderHomePage()
            );
          }}
        />
        <Route path="/join" component={RoomJoinPage} />
        <Route path="/create" component={CreateRoomPage} />
        <Route
          path="/room/:roomCode"
          render={(props) => (
            <Room {...props} leaveRoomCallback={clearRoomCode} />
          )}
        />
      </Switch>
    </Router>
  );
}
