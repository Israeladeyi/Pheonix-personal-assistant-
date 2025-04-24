
const fetch = require('node-fetch');
const querystring = require('querystring');

module.exports = async (req, res) => {
  const code = req.query.code;
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirect_uri = process.env.REDIRECT_URI;

  const token_res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: querystring.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri,
      client_id,
      client_secret,
    })
  });

  const token_data = await token_res.json();
  res.json(token_data);
};
