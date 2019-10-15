import React, { useReducer } from 'react';
import uuid from 'uuid';
import ContactContext from './ContactContext';
import contactReducer from './ContactReducer';
import {
    ADD_CONTACT,
    DELETE_CONTACT,
    SET_CURRENT,
    CLEAR_CURRENT,
    UPDATE_CONTACT,
    FILTER_CONTACT,
    CLEAR_FILTER
} from '../types';

const ContactState = props => {
    const initialState = {
        contacts: [
            {
                id: 1,
                name: "Mickey Mouse",
                email: "mmouse@nascentpixels.io",
                phone: "01234567890",
                type: "business"  
            },
            {
                id: 2,
                name: "Donald Duck",
                email: "dduck@nascentpixels.io",
                type: "personal"  
            },
            {
                id: 3,
                name: "Minnie Mouse",
                email: "mmouse2@nascentpixels.io",
                type: "business"  
            }
        ]
    };

    const [state, dispatch] = useReducer(contactReducer, initialState);

    //Add Contact
    const addContact = contact => {
        contact.id = uuid.v4();
        dispatch({
            type: ADD_CONTACT,
            payload: contact
        });
    }
    //Delete Contact
    const deleteContact = id => {
        dispatch({
            type: DELETE_CONTACT,
            payload: id
        });
    }

    //Set Current Contact
    //Clear Current Contact
    //Update Contact
    //Filter Contacts
    //Clear Filter

    return (
        <ContactContext.Provider
            value={{
                contacts: state.contacts,
                addContact,
                deleteContact
            }}
        >
        {props.children}
        </ContactContext.Provider>
    );
}

export default ContactState;