import { closeAndEmptyMainModal, toogleIsModalOpened } from "../../../reducers/actions/App.js"
var { logout } = require("../../../MASAS_functions.jsx")

var NavSidebar = {}

NavSidebar.mapStateToProps = function(state) {
	return {
		navSiderbarOpen: state.appReducer.navSiderbarOpen,
		MASASuser: state.appReducer.MASASuser,
		userData: state.appReducer.userData,
		isModalOpened: state.appReducer.isModalOpened,
	}
}

NavSidebar.mapDispatchToProps = function(dispatch) {
	return {
		toogleSidebar: () => dispatch({type:'TOOGLE_NAV_SIDEBAR'}),
		logout: logout.bind(null,dispatch),
		closeModal: () => dispatch(closeAndEmptyMainModal()),
		updateModalContent: (modalContent, modalType) => dispatch({ type: 'CHANGE_MODAL_CONTENT', modalContent, modalType }),
		toogleModal: () => dispatch(toogleIsModalOpened()),
	}
}

module.exports = NavSidebar
