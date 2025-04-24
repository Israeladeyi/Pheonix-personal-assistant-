const synth = window.speechSynthesis;
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    const apiKey = 'AIzaSyD3RO_JFzn5NYh_NXjueg_kBdJbBYa3rFs';
    const cx = 'YOUR_CUSTOM_SEARCH_ENGINE_ID';
    const weatherApiKey = 'ccbee0f046cde04d99db1a20a3630353';
    const backendUrl = 'https://your-backend-domain.com'; // Replace with your deployed backend URL

    let accessToken = localStorage.getItem('spotify_access_token');

    recognition.start();

    recognition.onstart = () => {
      document.getElementById('output').innerText = "I'm listening...";
    };

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase();
      document.getElementById('output').innerText = `You said: ${command}`;
      handleCommand(command);
    };

    recognition.onerror = (event) => {
      console.error("Recognition error: ", event.error);
      document.getElementById('output').innerText = "Sorry, I didn't catch that.";
    };

    recognition.onend = () => recognition.start();

    function respond(message) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.onend = () => recognition.start();
      synth.speak(utterance);
    }

    function handleCommand(command) {
      if (command.includes("hello phoenix")) {
        respond("Hello! How can I assist you today?");
      } else if (command.includes("search")) {
        const query = command.replace("search", "").replace("google", "").trim();
        searchGoogle(query);
      } else if (command.includes("weather in") || command.includes("weather at")) {
        const location = command.replace(/weather (in|at)/, "").trim();
        getWeather(location);
      } else if (command.includes("play")) {
        const song = command.replace("play", "").trim();
        playMusic(song);
      } else if (command.includes("login to spotify")) {
        loginToSpotify();
      } else {
        respond("Try saying 'search AI tools', 'play calm music', or 'weather in Lagos'");
      }
    }

    function searchGoogle(query) {
      const encodedQuery = encodeURIComponent(query);
      fetch(`https://www.googleapis.com/customsearch/v1?q=${encodedQuery}&key=${apiKey}&cx=${cx}`)
        .then(res => res.json())
        .then(data => {
          const items = data.items;
          if (items && items.length > 0) {
            const topResult = `${items[0].title} - ${items[0].link}`;
            document.getElementById('output').innerText = topResult;
            respond(`Here's what I found for ${query}`);
            window.open(items[0].link, '_blank');
          } else {
            document.getElementById('output').innerText = "No results found.";
            respond("No results found.");
          }
        })
        .catch(err => {
          console.error(err);
          document.getElementById('output').innerText = "Search error.";
          respond("I couldn't complete the search.");
        });
    }

    function getWeather(location) {
      const encoded = encodeURIComponent(location);
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encoded}&appid=${weatherApiKey}&units=metric`)
        .then(res => res.json())
        .then(data => {
          if (data.cod === 200) {
            const weather = data.weather[0].description;
            const temp = data.main.temp;
            const response = `Weather in ${location}: ${weather}, ${temp}°C`;
            document.getElementById('output').innerText = response;
            respond(response);
          } else {
            respond(`No weather info found for ${location}`);
          }
        })
        .catch(err => {
          console.error(err);
          respond("Something went wrong getting weather info.");
        });
    }

    function loginToSpotify() {
      window.location.href = `${backendUrl}/login`;
    }

    // Called when redirected back from Spotify
    const params = new URLSearchParams(window.location.search);
    if (params.has('token')) {
      accessToken = params.get('token');
      localStorage.setItem('spotify_access_token', accessToken);
      respond("Spotify login successful!");
    }

    function playMusic(song) {
      if (!accessToken) {
        respond("Please log in to Spotify first by saying 'login to Spotify'");
        return;
      }

      fetch(`${backendUrl}/play?track=${encodeURIComponent(song)}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          respond(`Playing ${song}`);
        } else {
          respond("Could not play the song.");
        }
      })
      .catch(err => {
        console.error('Playback error:', err);
        respond("An error occurred while trying to play music.");
      });
    }