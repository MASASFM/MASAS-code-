var React = require("react")

var ReactRedux = require("react-redux")
var { mapStateToProps, mapDispatchToProps } = require("./containers/App.jsx")

var Header = require("../Header/Header.jsx")

var { Modal } = require("../UI/UI.jsx")
var Footer = require("../Footer/Footer.jsx")
var Home = require("../Home/Home.jsx")
var NavSidebar = require("../NavSidebar/NavSidebar.jsx")
var PlayerAudioTag = require("../Player/PlayerAudioTag.jsx")
var SplashScreen = require("./SplashScreen.jsx")

var SC = require('soundcloud')
var Cookie = require('js-cookie')



var App = React.createClass({
	propTypes: {
		finishProcessingAuthCookie: React.PropTypes.func,

		// redux
		children: React.PropTypes.element,
		navSiderbarOpen: React.PropTypes.bool,
		processingAuthCookie: React.PropTypes.bool,
		isModalOpened: React.PropTypes.bool,
		modalContent: React.PropTypes.element,
		modalType: React.PropTypes.number,
		MASASuser: React.PropTypes.string,
		bgFilter: React.PropTypes.object,

		toogleModal: React.PropTypes.func,
		onSetNavbar: React.PropTypes.func,
		logInWithToken: React.PropTypes.func,
		forceRender: React.PropTypes.func,
		showAppFetchingBar: React.PropTypes.func,
		hideAppFetchingBar: React.PropTypes.func,
		updateUnsplashArtist: React.PropTypes.func,
		updateModalContent: React.PropTypes.func,
		closeModal: React.PropTypes.func,
	},

	componentWillMount: function() {
		// BIND EVENTS TO AJAX REQUESTS
		// http://api.jquery.com/Ajax_Events/
		$(document).bind("ajaxStart", () => {
			this.props.showAppFetchingBar()
		}).bind("ajaxStop", () => {
			this.props.hideAppFetchingBar()
		})


		// INIT SOUNDCLOUD JS SDK
		SC.initialize({
			client_id: document.MASAS.SC.client_id,
			redirect_uri: document.MASAS.SC.redirect_uri ,
			display: 'popup'
		})

		// SIGN IN USER IF VALID MASAS AND FB TOKENs STORED IN COOKIES
		var userToken = this.getUserTokenFromCookie()

		if(userToken)
			this.props.logInWithToken(userToken, this.props.finishProcessingAuthCookie)
		else
			this.props.forceRender()	// auth cookie is done processing


		// INIT BACKGROUND WITH UNSPLASH MASAS LIKES
		var unsplashClientID = "8ad2087b753cfaaa3c601d73395a8205b727571b7491dc80b68ff4bde538ee6b"

		$.ajax({
			type: "GET",
			url: "https://api.unsplash.com/users/masas/likes/",
			data: {
				client_id: unsplashClientID,
				per_page: 30
			},
			success: (r) => {
				const likeNumber = Math.floor(Math.random() * r.length) - 1

				if(likeNumber > -1 && likeNumber < r.length) {
					const like = r[likeNumber]
					this.props.updateUnsplashArtist(like.user.name, like.user.username, like.urls.regular)
				}
			},
			error: () => {
			}
		})
	},

	componentDidMount: function() {
		document.getElementsByTagName('body')[0].style.height = window.innerHeight + 'px'
		document.getElementById('content').style.height = window.innerHeight + 'px'
		document.getElementById('mobile-safari-bug-fix--wrapper').style.height = window.innerHeight + 'px'

		window.addEventListener("resize", () => {
			document.getElementsByTagName('body')[0].style.height = window.innerHeight + 'px'
			document.getElementById('content').style.height = window.innerHeight + 'px'
			document.getElementById('mobile-safari-bug-fix--wrapper').style.height = window.innerHeight + 'px'
		})

		this.showSplashScreen()
	},

	showSplashScreen: function() {
		if(this.props.MASASuser === "") {
			this.props.toogleModal()
			this.props.updateModalContent(<SplashScreen />, 3)
		} else {
			this.props.closeModal()
		}
	},

	getUserTokenFromCookie: function() {
		return Cookie.get('MASAS_authToken')
	},

	componentDidUpdate: function(prevProps) {
		if(this.props.MASASuser !== prevProps.MASASuser) {
			this.props.closeModal()
		}
	},

	render: function() {
		var hideLoadingModalZIndex = 100
		var loadingModalAnim = "none"
		if(!this.props.processingAuthCookie) {
			hideLoadingModalZIndex = -100
			loadingModalAnim = "fadeout-loading-modal 1s linear"
		}

		return (
			<NavSidebar>
				<div style = { styles.container } id="mobile-safari-bug-fix--wrapper" >
					<div 
						className={
							"body--background"
							+ 
							( this.props.bgFilter.blurred ? " blurred " : "" )
							+ 
							( this.props.bgFilter.saturated ? " saturated " : "" )
							+ 
							( this.props.bgFilter.mobileBlurred ? " blurred-mobile " : "" )
							+ 
							( this.props.bgFilter.mobileSaturated ? " mobileSaturated " : "" )
							+ 
							( this.props.bgFilter.modalBlurred ? " modal-blurred " : "" )
							+ 
							( this.props.bgFilter.modalSaturated ? " modal-saturated " : "" )
						} 
						id="body--background">
						<div className="bg-image" id="app-bg-image"></div>
					</div>
					<Header />
						<div 
							className={ "modal-blur--wrapper" + ( this.props.isModalOpened && this.props.modalType !== 2 ? " blurred" : "" )}
							style={{
								opacity: !(this.props.isModalOpened && this.props.modalType === 4) ? 1 : 0,
							}}>
							{
								this.props.children ? 
									this.props.children
								:
									<Home />
							}
						</div>
						<div
							style={{
								position: 'fixed',
								top: 0,
								bottom: 0,
								left: 0,
								right: 0,
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								backgroundColor: 'black',
								zIndex: hideLoadingModalZIndex,
								animation: loadingModalAnim,
								color: 'white'
							}}>
							<img
								style={{
									height: '7rem',
									width: '7rem',
								}}
								src="/static/img/MASAS_logo-M.svg" 
								alt="loading" />
						</div>

					<Footer />
								
				</div>
				<PlayerAudioTag />
				<Modal 
					isOpened={ this.props.isModalOpened }
					closeModalFunc={ this.props.closeModal }
					type={ this.props.modalType }>
					{ this.props.modalContent }
				</Modal>
			</NavSidebar>
		)
		
	}
})

var styles = {
	container: {
		height: window.innerHeight + 'px',
		display: 'flex',
		flexDirection: 'column',
		backgroundColor: 'black',
	}
}


module.exports = ReactRedux.connect(
	mapStateToProps,
	mapDispatchToProps
)(App)
// module.exports = App
