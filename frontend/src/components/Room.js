import React, { useEffect, useState } from "react";

export default function Room({ match }) {
  const [room, setRoom] = useState({
    code: "",
    votes_to_skip: 2,
    guest_can_pause: false,
    is_host: false,
  });

  const fetchRoom = async () => {
    const { roomCode } = match.params;

    const response = await fetch(`/api/get-room?code=${roomCode}`);
    const result = await response.json();

    if (response.status == 400) {
    } else if (response.status == 404) {
    } else {
      console.log(result);
      setRoom(result);
    }
  };

  useEffect(() => {
    (async () => await fetchRoom())();
  }, []);

  return (
    <div>
      <h3>{room.code}</h3>
      <p>Votes: {room.votes_to_skip}</p>
      <p>Guest Can Pause: {room.guest_can_pause.toString()}</p>
      <p>Host: {room.is_host.toString()}</p>
    </div>
  );
}
