var React = require("react")

var ReactRedux = require("react-redux")
var { mapStateToProps, mapDispatchToProps } = require("./containers/UploadSCItem.jsx")

var { Marquee } = require("../UI/UI.jsx")

var UploadSCItem = React.createClass({
	propTypes: {
		synced: React.PropTypes.bool	,		// is song synced
		track: React.PropTypes.object,		// song info
		streamable: React.PropTypes.bool,		// is song streamable
		public: React.PropTypes.bool, 			// is song public

		chooseTime: React.PropTypes.func,
	},

	componentWillMount: function() {
	},

	showSyncScreen: function() {
		this.props.chooseTime(this.props.track)
	},

	showTrackStatus: function() {
		console.log(this.props.public)
		console.log(this.props.streamable)
		if(!this.props.public)
			return "private"

		if(!this.props.streamable)
			return "non stream"

		if(this.props.synced)
			return "synced"
		else
			return <img src="/static/img/MASAS_sync_off.svg" alt="sync" onClick={this.showSyncScreen} />
	},

	render: function() {
		const millisToMinutesAndSeconds = function(millis) {
			var minutes = Math.floor(millis / 60000)
			var seconds = ((millis % 60000) / 1000).toFixed(0)
			return minutes + ":" + (seconds < 10 ? '0' : '') + seconds // millisToMinutesAndSeconds(298999) =>  "4:59"
		}

		return (
			<div className={"upload-sc-item--wrapper" + (this.props.synced ? " synced" : "")}>
				<div className="artwork--wrapper">
					{ 
						this.props.track.artwork_url ?
							<img src={this.props.track.artwork_url} alt="artwork" />
						: 
							""
					}
				</div>
				<div className="song-info--wrapper">
					<div className="song-name">
						<Marquee>{this.props.track.title}</Marquee>
					</div>
					<div className="song-stats">
						<span className="number-listens">
							<img src="/static/img/MASAS_logo_tunes.svg" alt="music-not-icon" />
							1796
						</span>
						<span>{ millisToMinutesAndSeconds(this.props.track.duration) }</span>
					</div>
				</div>
				<div className="sync--wrapper">
					{ this.showTrackStatus() }
				</div>
			</div>
		)
	}
})

module.exports = ReactRedux.connect(
	mapStateToProps,
	mapDispatchToProps
)(UploadSCItem)