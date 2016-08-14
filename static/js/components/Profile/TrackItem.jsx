var React = require("react")
var ReactDOM = require("react-dom")

var ReactRedux = require("react-redux")
var { mapStateToProps, mapDispatchToProps } = require("./containers/TrackItem.jsx")

var { Marquee, RankingInfoIcon } = require("../UI/UI.jsx")
var ChangeMoodModal = require("./ChangeMoodModal.jsx")
var RemoveSongModal = require("./RemoveSongModal.jsx")

var TrackItem = React.createClass({
	propTypes: {
		track: React.PropTypes.object,			//track SC info
		MASAS_songInfo: React.PropTypes.object,		//track MASAS info
		playNewSongFromPlaylist: React.PropTypes.func,
		loadPlaylist: React.PropTypes.func,
		userData: React.PropTypes.object,
		toogleModal: React.PropTypes.func,
		updateModalContent: React.PropTypes.func,
	},

	componentWillMount: function() {
	},

	componentDidMount: function() {
	},

	playTrack: function() {
		// console.log("======"+this.props.MASAS_songInfo.url+"======")
		// this.props.playNewSong(this.props.MASAS_songInfo.url)
		var playlist = this.props.userData.songs.map((song) => {
			return song.url
		})

		var playlistPosition = 0
		for(var i = 0; i < playlist.length; i++) {
			if(this.props.MASAS_songInfo.url === playlist[i])
				playlistPosition = i
		}

		this.props.loadPlaylist(playlist)
		this.props.playNewSongFromPlaylist(playlistPosition)
	},

	renderRadioTime: function() {
		var switchVar = this.props.MASAS_songInfo.timeInterval.substr(this.props.MASAS_songInfo.timeInterval.length - 2, 1)
		
		switch(switchVar) {
			case "1":
				return "#EarlyMorning"
			case "2":
				return "#LateMorning"
			case "3":
				return "#EarlyAfternoon"
			case "4":
				return "#LateAfternoon"
			case "5":
				return "#EarlyEvening"
			case "6":
				return "#LateEvening"
			default:
				return 
		}
	},

	renderPlayerControlButton: function() {
		if (this.props.MASAS_songInfo.url === this.props.songPlaying && this.props.isPaused === false)
			return <img src="/static/img/MASAS_player_pause.svg" alt="pause" className="artwork" onClick={this.props.pause }/>
		else
			return <img src="/static/img/MASAS_player_play.svg" alt="play" className="artwork" onClick={this.playTrack }/>
	},

	toggleOpenTray: function() {
		var el = this.refs.trackWrapper
		console.log(el.className)
		if(el.className.includes(" open")) {
			el.className = el.className.replace(" open", "")
		} else {
			el.className = el.className + " open"
		}
		console.log(el.className)
	},

	openChangeMoodModal: function() {
		this.props.updateModalContent(<ChangeMoodModal toggleModal={ this.props.toogleModal } MASAS_info={ this.props.MASAS_songInfo } SC_info={ this.props.track } />)
		this.props.toogleModal()
	},

	openRemoveSongModal: function() {
		this.props.updateModalContent(<RemoveSongModal toggleModal={ this.props.toogleModal } MASAS_info={ this.props.MASAS_songInfo } SC_info={ this.props.track } />)
		this.props.toogleModal()
	},

	render: function() {
		return (
			<div className="track--wrapper" ref="trackWrapper">
				<div className="visible-info">
					<div className="artwork--wrapper">
						<div className="artwork-div">
							{ 
								this.props.track.artwork_url ?
									<img src={this.props.track.artwork_url} alt="cover art" className="artwork" onClick={this.playTrack }/>
								:
									""
							}
						</div>
						<div className="artwork-overlay">
							{ this.renderPlayerControlButton() }
						</div>
					</div>
					<div className="song-info--wrapper" onClick={ this.toggleOpenTray }>
						<div className="song-stats-1">
							<div className="song-name">
								<div className="title">
									<Marquee>{this.props.track.title}</Marquee>
								</div>
								<div className="username">
									<Marquee>{this.props.track.user.username}</Marquee>
								</div>
							</div>
						</div>
						<div className="song-stats-2">
							<div className="time">
								{ this.renderRadioTime() }
							</div>
							<div className="plays">
								{ this.props.MASAS_songInfo.play_count } <img src="/static/img/MASAS_icon_play_count.svg" alt="play count" className="play-count-icon" />
							</div>
						</div>
					</div>
				</div>
				<div className="hidden-info">
					<div className="RankingInfoIcon--wrapper"><RankingInfoIcon ranking={ 0.5 }/></div>
					<div className="icon--wrapper">
						{ this.props.MASAS_songInfo.like_count }<img className="like-icon" src="/static/img/MASAS_liked.svg" alt="# of likes" />
						<img onClick={ this.openChangeMoodModal } className="hidden-mobile" src="/static/img/MASAS_icon_changemood.svg" alt="change mood" />
						<img onClick={ this.openRemoveSongModal } className="hidden-mobile" src="/static/img/MASAS_icon_trash.svg" alt="delete song" />
					</div>
				</div>
			</div>
		)
	}
})

module.exports = ReactRedux.connect(
	mapStateToProps,
	mapDispatchToProps
)(TrackItem)
