var React = require("react")

var ReactRedux = require("react-redux")
var { mapStateToProps, mapDispatchToProps } = require("./containers/HeaderDropdown.jsx")

var { Button, Link } = require("../UI/UI.jsx")
var { browserHistory } = require('react-router')
var SplashScreen = require("../App/SplashScreen.jsx")

var MenuLink = (props) => {
	return (
		<div className="menu-link" onClick={props.onClick}>
			<img src={props.src} atl="profile pic"/>
			<Link to={props.URL}>{props.children}</Link>
		</div>
	)
}

MenuLink.PropTypes = {
	onClick: React.PropTypes.func,
	src: React.PropTypes.string,
}

var HeaderDropdown = React.createClass({
	propTypes: {
		MASASuser: React.PropTypes.string,
		userData: React.PropTypes.object,
		isModalOpened: React.PropTypes.bool,

		dispatch: React.PropTypes.func,
		logout: React.PropTypes.func,
		toogleModal: React.PropTypes.func,
		updateModalContent: React.PropTypes.func,
	},

	componentWillReceiveProps: function() {
	},

	logout: function() {
		this.props.logout()
	},

	render: function() {
		if (this.props.MASASuser !== "") {
			return (
				<div className="dropdown--wrapper">
					<div 
						onClick={ () => browserHistory.push("/profile") }
						className="username--wrapper">
						<img src={ this.props.userData.avatar_url } alt="profile picture" className="profile-picture"/>
						<span className="username" id="username-header"> {this.props.userData.name ? this.props.userData.name : this.props.userData.username}</span>
					</div>
					<div className="dropdown-content">
						<MenuLink src='/static/img/MASAS_play_number.svg' URL="/profile">My Profile</MenuLink>
						<hr />
						<MenuLink src='/static/img/MASAS_logo_world.svg' URL="/legals">Legals</MenuLink>
						<hr />
						<MenuLink src='/static/img/MASAS_settings.svg' URL="/">Account Settings</MenuLink>
						<hr />
						<MenuLink src='/static/img/MASAS_icon_log_out.svg' URL="/" onClick={this.logout}>Sign out</MenuLink>
					</div>
				</div>
			)
		} else
			return (
				<div className="dropdown--wrapper" >
					<Button
						isBigButton={ false }
						isSecondaryAction={ true }
						onClick={ () => { !this.props.isModalOpened ? this.props.toogleModal() : 0; this.props.updateModalContent(<SplashScreen startPage={ 1 } />, 3) } }>Log-in</Button>
				</div>
				)
	}
})

module.exports = ReactRedux.connect(
	mapStateToProps,
	mapDispatchToProps
)(HeaderDropdown)
