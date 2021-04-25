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
} from "@material-ui/core";
import { Link } from "react-router-dom";

export default function CreateRoomPage({ history }) {
  const defaultVotes = 2;
  const [room, setRoom] = useState({
    votesToSkip: defaultVotes,
    guestCanPause: true,
  });

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

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
          Create A Room
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl component="fieldset">
          <FormHelperText>
            <div align="center">Guest Control of Playback State</div>
          </FormHelperText>
          <RadioGroup
            row
            defaultValue="true"
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
            defaultValue={defaultVotes}
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
          onClick={(e) => handleRoomButtonPressed(e)}
        >
          Create A Room
        </Button>
      </Grid>
      <Grid item xs={12} align="center">
        <Button color="secondary" variant="contained" to="/" component={Link}>
          Back
        </Button>
      </Grid>
    </Grid>
  );
}
