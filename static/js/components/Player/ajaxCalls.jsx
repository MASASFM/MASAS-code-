var { browserHistory } = require('react-router')

const { dispatch } = require('../../reducers/reducers.js')
const MASAS_functions = require('../../MASAS_functions.jsx')

var ajaxCalls = {}

// caled when state.playerReducer.songPlaying changes
ajaxCalls.playNewSong = function(newProps, addToHistory) {
	var songId = newProps.songPlaying
	
	// set loading state
	dispatch({type: 'SET_SONG_IS_FETCHING_TRUE'})

	$.ajax({
		type: "GET",
		url: newProps.songPlaying,
		headers: {
			// "Authorization": header,
		},
		success: (data) => {
			SC.get('/tracks/' + data.SC_ID).then((response) => {
				var streamURL = response.stream_url + "?client_id=e5d965905a85b11e108d064bc04430a3" 

				// reinit player with new media url
				if($("#jquery_jplayer_1").data("jPlayer") === undefined) {
					$("#jquery_jplayer_1").jPlayer({
						ready: function(	) {
							$(this).jPlayer("setMedia", {
								mp3: streamURL,
								m4a: streamURL,
								oga: streamURL
							}).jPlayer('play')
						},

						keyBindings: {
							play: {
								key: 32,
								fn: function(f) {
									if(f.status.paused) {
										f.play()
									} else {
										f.pause()
									}
								}
							}
						},
						swfPath: "http://jplayer.org/latest/dist/jplayer",
						supplied: "mp3, oga",
						wmode: "window",
						useStateClassSkin: true,
						autoBlur: false,
						smoothPlayBar: true,
						keyEnabled: true,
						remainingDuration: true,
						toggleDuration: true
					})
				} else {
					$("#jquery_jplayer_1").jPlayer( "clearMedia" )
					$("#jquery_jplayer_1").jPlayer("setMedia", { 
						mp3: streamURL,
						m4a: streamURL,
						oga: streamURL
					})
				}

				// play song and update state
				$("#jquery_jplayer_1").jPlayer('play')

				var ajaxRequest = $.ajax({
					type: 'GET',
					url: data.trackArtist,
					success: (artistInfo) => {
						dispatch({ type: "UPDATE_MASAS_SONG_INFO", songInfo: data })
						dispatch({ type: "UPDATE_SC_SONG_INFO", songInfo: response })
						dispatch({ type: "UPDATE_ARTIST_INFO", artistInfo })

						if(!newProps.isPlaylistPlaying)
							dispatch({ type: 'ADD_SONG_TO_HISTORY', MASAS_songInfo: data, SC_songInfo: response, artistInfo })

						// update song liked button based on server response (vs optimistic UI)
						ajaxCalls.updateLikeButton(data, response, newProps)

						// end loading state
						dispatch({type: 'SET_SONG_IS_FETCHING_FALSE'})
					},
					error: () => { },
				})

			}).catch((err) => {

				// end loading state
				dispatch({type: 'SET_SONG_IS_FETCHING_FALSE'})

				// stop player
				dispatch({type: 'STOP'})
			})
		},
		error: (err) => {

			// end loading state
			dispatch('SET_SONG_IS_FETCHING_FALSE')
			// stop player
			dispatch({type: 'STOP'})
		},
	})
}

ajaxCalls.updateLikeButton = function(MASAS_songInfo, SC_songInfo, props) {
	var header = "Bearer " + props.MASASuser
	$.ajax({
		type: "GET",
		url: '/api/users/'+ props.userPk+'/',	
		headers: {
			"Authorization": header,
		},
		success: (user) => {

			var isSongLiked = user.likes.filter( (like) => {
				return like.song.url === MASAS_songInfo.url
			})

			// update player state
			if (isSongLiked.length === 0)
				dispatch({type: 'UNLIKE_SONG'})
			else
				dispatch({type: 'LIKE_SONG'})
		},
		error: (err) => {
		},
	})
}

module.exports = ajaxCalls
