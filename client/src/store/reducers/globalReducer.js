import { createSlice } from "@reduxjs/toolkit";

const globalReducer = createSlice({
    name: 'global',
    initialState: {
        success: '',
        searchBar: false,
    },
    reducers: {
        setSuccess: (state, action) => {
            console.log(action)
            state.success = action.payload;
        },
        clearMessage: (state) => {
            state.success = "";
        },
        toggleSearchBar: (state) => {
            state.searchBar = !state.searchBar;
        },
    }
})

export const { setSuccess, clearMessage, toggleSearchBar } =globalReducer.actions;
export default globalReducer.reducer



// setSuccess: A reducer function that takes the current state and an action as arguments. 
// It sets the state.success property to the value of the action.payload. 
// This reducer is intended to update the success property in the Redux store with new values.

// clearMessage: A reducer function that takes the current state as an argument. 
// It sets the state.success property to an empty string, effectively clearing any existing success message.