let exportVar = {}

exportVar.defaultState = {
	// profileInfo: {},						// user MASAS profile Info
	changeSongMoodValue: 0,				// (int) in [1,6], discover number on modal called when changing discover number for a song 
}
const { defaultState } = exportVar

exportVar.profileReducer = function(state = defaultState, action) {
	
	switch(action.type) {
		case "UPDATE_SONG_MOOD_MODAL_VALUE":
			var discoverNumber = action.discoverNumber

			if(discoverNumber < 1)
				discoverNumber = 1
			else if(discoverNumber > 6)
				discoverNumber = 6

			return {
				...state,
				changeSongMoodValue: action.discoverNumber
			}
		default:
			return state
	}

}


module.exports = exportVar