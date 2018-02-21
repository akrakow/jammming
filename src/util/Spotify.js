const clientId = '589e2479a3544e09a7308a183c3774dc';
const redirectURI = 'http://hateme.surge.sh';
let token = '';
let expiration = '';

const Spotify = {
    getAccessToken() {
        if (token) {
            return token;
        } else {
            let at = window.location.href.match(/access_token=([^&]*)/);
            let expire = window.location.href.match(/expires_in=([^&]*)/);

            if (at && expire) {
                token = at[1];
                expiration = expire[1];
                window.setTimeout(() => token = "", expiration * 1000);
                window.history.pushState("Access Token", null, "/");
            } else {
                window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
            }
        }
    },
    async search(term) {
        try {
            let response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                let jsonResponse = await response.json();
                if (jsonResponse.tracks) {
                    let results = jsonResponse.tracks.items.map(track => {
                        return {
                            id: track.id,
                            name: track.name,
                            artist: track.artists[0].name,
                            album: track.album.name,
                            uri: track.uri
                        }
                    });
                    return results;
                } else {
                    return [];
                }
            }
        } catch (error) {
            console.log(error);
        }
    },
    async savePlaylist(playlistName, tracks) {
        if (!playlistName || !tracks) {
            return;
        }

        let accessToken = token;
        let headers = { Authorization: `Bearer ${accessToken}` }
        let userId = '';
        let playlistID = '';

        try {
            let response = await fetch('https://api.spotify.com/v1/me', {
                headers: headers
            });
            if (response.ok) {
                let jsonResponse = await response.json();
                userId = jsonResponse.id
            }
        } catch (error) {
            console.log(error);
        }

        if (userId) {
            try {
                let response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    },
                    method: 'POST',
                    body: JSON.stringify({ name: playlistName })
                });
                if (response.ok) {
                    let jsonResponse = await response.json();
                    playlistID = jsonResponse.id
                }
            } catch (error) {
                console.log(error);
            }
        }

        if (userId && playlistID) {
            try {
                let response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistID}/tracks`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    method: 'POST',
                    body: JSON.stringify({ uris: tracks })
                });
                if (response.ok) {
                    let jsonResponse = await response.json();
                    console.log(jsonResponse);
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
};

export default Spotify;