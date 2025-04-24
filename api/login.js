
const querystring = require('querystring');

module.exports = (req, res) => {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const redirect_uri = process.env.REDIRECT_URI;

  const scope = 'user-read-private user-read-email streaming user-modify-playback-state';

  const auth_query = querystring.stringify({
    response_type: 'code',
    client_id,
    scope,
    redirect_uri
  });

  res.redirect(`https://accounts.spotify.com/authorize?${auth_query}`);
};
