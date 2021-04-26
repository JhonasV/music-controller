import React, { useState } from "react";
import {
  Button,
  Grid,
  Typography,
  TextField,
  FormHelperText,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  Collapse,
} from "@material-ui/core";

import { Alert } from "@material-ui/lab";
import { Link } from "react-router-dom";

export default function CreateRoomPage({
  history,
  update = false,
  updateRoom,
  updateCallback,
}) {
  const defaultVotes = 2;
  const [room, setRoom] = useState({
    votesToSkip: update ? updateRoom.votesToSkip : defaultVotes,
    guestCanPause: update ? updateRoom.guestCanPause : true,
  });

  const [alert, setAlert] = useState({ message: "", success: false });

  const handleVotesChange = (e) => {
    setRoom({ ...room, votesToSkip: e.target.value });
  };

  const handleGuestCanPauseChange = (e) => {
    setRoom({
      ...room,
      guestCanPause: e.target.value === "true" ? true : false,
    });
  };

  const handleRoomButtonPressed = async (e) => {
    try {
      const payload = {
        guest_can_pause: room.guestCanPause,
        votes_to_skip: room.votesToSkip,
      };

      const requestOptions = {
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        method: "POST",
      };

      const response = await fetch("/api/create-room", requestOptions);

      const result = await response.json();

      if (response.status == 201) {
        history.push(`/room/${result.code}`);
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateButtonPressed = async () => {
    try {
      const payload = {
        guest_can_pause: room.guestCanPause,
        votes_to_skip: room.votesToSkip,
        code: updateRoom.code,
      };

      const requestOptions = {
        method: "PATCH",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await fetch("/api/update-room", requestOptions);

      const result = await response.json();

      if (response.ok) {
        setAlert({ message: "Successfully updated!", success: true });
        updateCallback(result);
      } else {
        setAlert({ message: result.message, success: false });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Collapse in={alert.message !== ""}>
          <Alert
            onClose={() => setAlert({ ...alert, message: "" })}
            severity={alert.success ? "success" : "error"}
          >
            {alert.message}
          </Alert>
        </Collapse>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
          {update ? "Update Room Settings" : "Create A Room"}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl component="fieldset">
          <FormHelperText>
            <div align="center">Guest Control of Playback State</div>
          </FormHelperText>
          <RadioGroup
            row
            defaultValue={room.guestCanPause.toString()}
            onChange={(e) => handleGuestCanPauseChange(e)}
          >
            <FormControlLabel
              value="true"
              control={<Radio color="primary" />}
              label="Play/Pause"
              labelPlacement="botton"
            />
            <FormControlLabel
              value="false"
              control={<Radio color="secondary" />}
              label="No Control"
              labelPlacement="botton"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl>
          <TextField
            required={true}
            type="number"
            defaultValue={room.votesToSkip}
            onChange={(e) => handleVotesChange(e)}
            inputProps={{
              min: 1,
              style: { textAlign: "center" },
            }}
          />
          <FormHelperText>
            <div align="center">Votes Required To Skip Song</div>
          </FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
        <Button
          color="primary"
          variant="contained"
          onClick={(e) =>
            update ? handleUpdateButtonPressed() : handleRoomButtonPressed(e)
          }
        >
          {update ? "Update Room Settings" : "Create A Room"}
        </Button>
      </Grid>

      {!update ? (
        <Grid item xs={12} align="center">
          <Button color="secondary" variant="contained" to="/" component={Link}>
            Back
          </Button>
        </Grid>
      ) : null}
    </Grid>
  );
}
