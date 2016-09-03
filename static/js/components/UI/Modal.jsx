// NEEDS DIRECT PARENT WITH => position: relative, height = something, width = something

var React = require("react")
var ReactDOM = require("react-dom")

let Modal = React.createClass({
	propTypes: {
		isOpened: React.PropTypes.bool,			// is modal shown
		closeModalFunc: React.PropTypes.func, 		// what to execute when clicking on close modal area (arrow or overlay)
		type: React.PropTypes.number, 			// what type the modal is
	},

	getDefaultProps: function() {
		return {
			isOpened: false,	
			closeModalFunc: () => console.log('no closing function attached to modal'),
			type: 1,
		}
	},

	componentDidMount: function() {
	},

	componentWillUnmount: function() {
	},

	componentDidUpdate: function() {
	},

	componentWillReceiveProps: function(nextProps) {
		// update background blur on modal appear/dissapear
		if(nextProps.isOpened === false) {
			// remove background blur
			$('#body--background').removeClass('blurred')
		} else if(nextProps.isOpened === true && nextProps.type === 1) {
			// put background blur on
			$('#body--background').addClass('blurred')
		} else if(nextProps.isOpened === true && nextProps.type === 2) {
			$('#body--background').addClass('blurred')
			$('#body--background').removeClass('saturated')
		}
	},

	render: function() {
		if(this.props.type === 1)
			return (
				<div className={ "MASAS-modal" + (this.props.isOpened ? "" : " closed") } id="MASAS-modal">
					<div className="modal-overlay" onClick={ this.props.closeModalFunc }>
						
					</div>
					<div className="modal-content--wrapper">
						<img onClick={ this.props.closeModalFunc } src="/static/img/MASAS_close_icon.svg" className="close-icon" alt="close modal" />
						<div className="modal-content">
							{ this.props.children }
						</div>
					</div>
				</div>
				)
		else if(this.props.type === 2)
			return (
				<div className={ "MASAS-modal" + (this.props.isOpened ? "" : " closed") } id="MASAS-modal">
					<img onClick={ this.props.closeModalFunc } src="/static/img/MASAS_close_icon.svg" className="close-icon" alt="close modal" />
					<div className="" onClick={ this.props.closeModalFunc }>
							{ this.props.children }
					</div>
				</div>
				)
	}
})

module.exports = Modal