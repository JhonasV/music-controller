import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Grid, Typography } from "@material-ui/core";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";

export default function Room({ match, history, leaveRoomCallback }) {
  const [room, setRoom] = useState({
    code: "",
    votesToSkip: 2,
    guestCanPause: false,
    isHost: false,
  });

  const [song, setSong] = useState({});
  const [showSettings, setShowSettings] = useState(false);
  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
  const fetchRoom = async () => {
    const { roomCode } = match.params;

    const response = await fetch(`/api/get-room?code=${roomCode}`);
    const result = await response.json();

    if (response.ok) {
      setRoom({
        code: result.code,
        votesToSkip: result.votes_to_skip,
        guestCanPause: result.guest_can_pause,
        isHost: result.is_host,
      });

      if (result.is_host) {
        await authenticateSpotify();
      }
    } else {
      leaveRoomCallback();
      history.push("/join");
    }
  };

  const getCurrentSong = () => {
    fetch("/spotify/current-song")
      .then((response) => {
        if (!response.ok) {
          return {};
        } else {
          return response.json();
        }
      })
      .then((data) => {
        setSong(data);
      });
  };

  const authenticateSpotify = async () => {
    const response = await fetch("/spotify/is-authenticated");
    const data = await response.json();

    setSpotifyAuthenticated(data.status);

    if (!data.status) {
      const response2 = await fetch("/spotify/get-auth-url");
      const data2 = await response2.json();
      window.location.replace(data2.url);
    }
  };

  const leaveButtonPressed = async () => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
    };

    const response = await fetch("/api/leave-room", requestOptions);

    if (response.ok) {
      history.push("/");
    }
  };

  const updateCallback = (updatedData) => {
    setRoom({
      ...room,
      guestCanPause: updatedData.guest_can_pause,
      votesToSkip: updatedData.votes_to_skip,
    });
  };

  const renderSettings = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <CreateRoomPage
            update={true}
            updateRoom={room}
            updateCallback={updateCallback}
          />
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setShowSettings(false)}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    );
  };

  const renderSettingsButton = () => {
    return (
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowSettings(true)}
        >
          Settings
        </Button>
      </Grid>
    );
  };

  useEffect(() => {
    (async () => await fetchRoom())();

    let interval = setInterval(getCurrentSong, 1000);

    return function cleanup() {
      clearInterval(interval);
    };
  }, []);

  if (showSettings) {
    return renderSettings();
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Code: {room.code}
        </Typography>
      </Grid>
      <MusicPlayer song={song} />
      {room.isHost ? renderSettingsButton() : null}
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          component={Link}
          color="secondary"
          onClick={async () => await leaveButtonPressed()}
        >
          Leave Room
        </Button>
      </Grid>
    </Grid>
  );
}
