
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { accessToken, songUri } = req.body;

  const response = await fetch('https://api.spotify.com/v1/me/player/play', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ uris: [songUri] })
  });

  if (response.status === 204) {
    res.status(200).send('Playback started');
  } else {
    const error = await response.json();
    res.status(response.status).json(error);
  }
};
