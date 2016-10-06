// NEEDS DIRECT PARENT WITH => position: relative, height = something, width = something

var React = require("react")

// exeptionally import store to retrieve 1 value (read only)
var { getState } = require("../../reducers/reducers.js")


var { closeModal } = require("../../MASAS_functions.jsx")

let Modal = React.createClass({
	propTypes: {
		isOpened: React.PropTypes.bool,			// is modal shown
		closeModalFunc: React.PropTypes.func, 		// what to execute when clicking on close modal area (arrow or overlay)
		type: React.PropTypes.number, 			// what type the modal is
		children: React.PropTypes.node,
	},

	getDefaultProps: function() {
		return {
			isOpened: false,	
			closeModalFunc: () => {},
			type: 1,
		}
	},

	componentDidMount: function() {
	},

	componentWillUnmount: function() {
	},

	componentDidUpdate: function() {
	},

	closeModal: function() {
		getState().appReducer.closeModalFunc()
		closeModal()
	},

	componentWillReceiveProps: function(nextProps) {
		// update background blur on modal appear/dissapear
		// unless we are on /upload page (it handles background blurs itself)
		if(window.location.pathname !== "/upload" && nextProps.isOpened === false) {
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
				<div 
					className={ "MASAS-modal type2" + (this.props.isOpened ? "" : " closed") }
					id="MASAS-modal"
					onClick={ this.closeModal }>
					<div className="modal-type-2--wrapper">
						<div className="tip-title">
							<img src="/static/img/tip-light-bulb.png" alt="light bulb icon" />
							Tip
						</div>
						{/* <div className="close-icon">
							<img onClick={ this.props.closeModalFunc } src="/static/img/MASAS_close_icon.svg" alt="close modal" /> 
							dismiss tips
						</div> */}
						<div className="">
								{ this.props.children }
						</div>
					</div>
				</div>
				)
		else if(this.props.type === 3)
			return (
				<div className={ "MASAS-modal type3" + (this.props.isOpened ? "" : " closed") } id="MASAS-modal">
					<div className="modal-type-3--wrapper">
						{ this.props.children }
					</div>
				</div>
				)
	}
})

module.exports = Modal
