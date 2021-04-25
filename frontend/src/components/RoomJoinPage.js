import React, { useState } from "react";
import { TextField, Button, Grid, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

export default function RoomJoinPage({ history }) {
  const [room, setRoom] = useState({ roomCode: "", error: "" });

  const handleTextFieldChange = (e) => {
    setRoom({ ...room, roomCode: e.target.value });
  };

  const roomButtonPressed = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: room.roomCode,
      }),
    };

    const response = await fetch("/api/join-room", requestOptions);
    const data = await response.json();

    if (response.ok) {
      history.push(`/room/${room.roomCode}`);
    } else if (response.status === 400)
      setRoom({ ...room, error: data.message });
    else {
      setRoom({ ...room, error: data["Bad Request"] });
    }
  };

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Join a Room
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <TextField
          error={room.error}
          label="Code"
          placeholder="Enter a  Room Code"
          value={room.roomCode}
          helperText={room.error}
          variant="outlined"
          onChange={handleTextFieldChange}
        />
      </Grid>
      <Grid item xs={12} align="center">
        <Button variant="contained" color="primary" onClick={roomButtonPressed}>
          Enter Room
        </Button>
      </Grid>
      <Grid item xs={12} align="center">
        <Button variant="contained" color="secondary" to="/" component={Link}>
          Back
        </Button>
      </Grid>
    </Grid>
  );
}
