const config = require('../config.json');
const axios = require('axios');

let creds = {
    token: null,
    lastRefresh: null
}

/*
    Requests a twitch token.
*/
function requestTwitchToken() {
    return new Promise((resolve, reject) => {
        axios.post(`https://id.twitch.tv/oauth2/token?client_id=${config.twitch.clientId}&client_secret=${config.twitch.clientSecret}&grant_type=client_credentials`)
        .then(function(response) {
            creds.token = response.data.access_token;
            creds.lastRefresh = Date.now();
            resolve(response.data.access_token);
        })
        .catch(function(error) {
            console.log(error);

            setTimeout(function() {
                resolve(requestTwitchToken());
            }, 10000);
        });
    });
}

/* 
    Checks if the current twitch token is valid, and if not it requests a new one.
*/
function getTwitchToken() {
    return new Promise((resolve, reject) => {
        if (creds.token) {
            if((creds.lastRefresh + 60 * 60 * 1000) < Date.now()) {
                axios.get("https://id.twitch.tv/oauth2/validate", {
                    headers: {
                        "Authorization": `Bearer ${creds.token}`
                    }
                })
                .then(function(response) {
                    creds.token = response.data.access_token;
                    creds.lastRefresh = Date.now();
                    resolve(creds.token);
                })
                .catch(function(error) {
                    resolve(requestTwitchToken());
                })
            } else {
                resolve(creds.token);
            }
        } else {
            resolve(requestTwitchToken());
        }
    });
}

/*
    Fetches stream data from a twitch user id.
*/
module.exports.getStreamData = async (userId) => {
    return new Promise((resolve, reject) => {
        getTwitchToken().then(async function(token) {
            axios.get(`https://api.twitch.tv/helix/streams?user_id=${userId}`, {
                headers: {
                    "Client-ID": config.twitch.clientId,
                    "Authorization": `Bearer ${token}`
                }
            }).then(function(response) {
                resolve(response.data);
            }).catch(function(error) {
                reject(`Error caught: ${error}`);
            })
        });
    });
}

/*
    Gets a twitch user id from a username.
*/
module.exports.getIdFromUsername = (username) => {
    return new Promise((resolve, reject) => {
        getTwitchToken().then(function(token) {
            axios.get("https://api.twitch.tv/helix/users?login=" + username, {
                headers: {
                    "Client-ID": config.twitch.clientId,
                    "Authorization": `Bearer ${token}`
                }
            })
            .then(function(response) {
                resolve(response.data.data[0].id);
            })
            .catch(function(error) {
                reject(`Error when getting userId: ${error}`);
            })
        });
    });
}

/*
    Gets a game id from a game name
*/
module.exports.getIdFromGame = (gameName) => {
    return new Promise((resolve, reject) => {
        getTwitchToken().then(function(token) {
            axios.get("https://api.twitch.tv/helix/games?name=" + gameName, {
                headers: {
                    "Client-ID": config.twitch.clientId,
                    "Authorization": `Bearer ${token}`
                }
            })
            .then(function(response) {
                resolve(response.data.data[0]);
            })
            .catch(function(error) {
                reject(`Error when getting gameId: ${error}`);
            })
        });
    });
}