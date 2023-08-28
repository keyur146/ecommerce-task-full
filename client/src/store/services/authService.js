import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

const authService = createApi({
    reducerPath: 'auth',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5000/api/'
    }),
    endpoints: (builder) => {

        return {
            authLogin: builder.mutation({
                query: (LoginData) => {
                    return{
                        url: 'login',
                        method: 'POST',
                        body: LoginData
                    }
                }
            }),
            userRegister: builder.mutation({
                query: data => {
                    return {
                        url: '/register',
                        method: 'POST',
                        body: data
                    }
                }
            }),
            userLogin: builder.mutation({
                query: (LoginData) => {
                    return{
                        url: '/login',
                        method: 'POST',
                        body: LoginData
                    }
                }
            })
        }
    }
});

export const {useAuthLoginMutation, useUserRegisterMutation, useUserLoginMutation } = authService
export default authService;