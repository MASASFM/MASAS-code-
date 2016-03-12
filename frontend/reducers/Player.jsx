let exportVar = {}

exportVar.defaultState = {
	songPlaying: null,				// currently playing song			
	isPaused: false,			// is player paused
	playerAtTime: 0,			// time current song playing is at
	MASAS_songInfo: null,			// song info from MASAS db
	SC_songInfo: null,			// song info from soundcloud API
	isSongPlayingLiked: false,		// is currently playing song liked
}

const { defaultState } = exportVar

exportVar.playerReducer = function(state = defaultState, action) {
	
	switch(action.type) {
		case 'PLAY':
			return {
				...state,
				isPaused: false
			}
		case 'PAUSE':
			return {
				...state,
				isPaused: true,
				playerAtTime: action.pausingAtTime
			}
		case 'PLAY_NEW_SONG':
			return {
				...state,
				isPaused: false,
				playerAtTime: 0,
				songPlaying: action.song
			}
		case 'UPDATE_MASAS_SONG_INFO':
			return {
				...state,
				MASAS_songInfo: action.songInfo
			}
		case 'UPDATE_SC_SONG_INFO':
			return {
				...state,
				SC_songInfo: action.songInfo
			}
		case 'TOGGLE_SONG_LIKE':
			return {
				...state,
				isSongPlayingLiked: !state.isSongPlayingLiked
			}
		case 'LIKE_SONG':
			return {
				...state,
				isSongPlayingLiked: true
			}
		case 'UNLIKE_SONG':
			return {
				...state,
				isSongPlayingLiked: false
			}
		default:
			return state
	}
}


module.exports = exportVar