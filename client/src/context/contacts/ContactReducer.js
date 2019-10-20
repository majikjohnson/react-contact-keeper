import {
	ADD_CONTACT,
	DELETE_CONTACT,
	CONTACT_ERROR,
	SET_CURRENT,
	CLEAR_CURRENT,
	UPDATE_CONTACT,
	FILTER_CONTACTS,
	CLEAR_FILTER,
	GET_CONTACTS,
	CLEAR_CONTACTS,
} from '../types';

export default (state, action) => {
	switch (action.type) {
		case GET_CONTACTS:
			return {
				...state,
				contacts: action.payload,
				loading: false,
			}
		case CLEAR_CONTACTS:
			return {
				...state,
				contacts: null,
				filtered: null,
				error: null,
				current: null,
			}
		case ADD_CONTACT:
			return {
				...state,
				contacts: [...state.contacts, action.payload],
				loading: false,
			};
		case DELETE_CONTACT:
			return {
				...state,
				contacts: state.contacts.filter(
					contact => contact.id !== action.payload
				),
				loading: false,
			};
		case CONTACT_ERROR:
			return {
				...state,
				error: action.payload,
			};
		case SET_CURRENT:
			return {
				...state,
				current: action.payload,
			};
		case CLEAR_CURRENT:
			return {
				...state,
				current: null,
			};
		case UPDATE_CONTACT:
			return {
				...state,
				contacts: state.contacts.map(contact =>
					contact.id === action.payload.id ? action.payload : contact
				),
				loading: false,
			};
		case FILTER_CONTACTS:
			return {
				...state,
				filtered: state.contacts.filter(contact => {
					const regexp = new RegExp(`${action.payload}`, 'gi');
					return (
						contact.name.match(regexp) ||
						contact.email.match(regexp)
					);
				}),
			};
		case CLEAR_FILTER:
			return {
				...state,
				filtered: null,
			};
		default:
			return state;
	}
};
