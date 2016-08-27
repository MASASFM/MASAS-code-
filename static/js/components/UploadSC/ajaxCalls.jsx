const $ = require('jquery')
let ajaxCalls = {}

ajaxCalls.getUserTracks = (userPk, success, error) => {

		$.ajax({
			type: "GET",
			url: 'api/users/' + userPk + '/',	
			success: success,
			error: error,
		})

}

module.exports = ajaxCalls