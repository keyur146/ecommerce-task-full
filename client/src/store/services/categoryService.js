import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

const categoryService = createApi({
    reducerPath: 'category',
    tagTypes: 'categories',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5000/api/',
        prepareHeaders: (headers, {getState}) => {
            const reducers = getState();
            const token = reducers?.authReducer?.adminToken;
            headers.set('authorization', token ? `Bearer ${token}` : '');
            return headers;
        }
    }),
    endpoints: (builder) => {

        return {
            create: builder.mutation({
                query: (name) => {
                    return{
                        url: 'create-category',
                        method: 'POST',
                        body: name
                    }
                },
                invalidatesTags: ['categories']
            }),
            updateCategory: builder.mutation({
                query: (data) => {
                    return {
                        url: `update-category/${data.id}`,
                        method: 'PUT',
                        body: {name: data.name}
                    }
                },
                invalidatesTags: ['categories']
            }),
            deleteCategory: builder.mutation({
                query: (id) => {
                    return {
                        url: `delete-category/${id}`,
                        method: 'DELETE'
                    }
                },
                invalidatesTags: ['categories']
            }),
            get: builder.query({
                query: (page) => {
                    return{
                        url: `categories/${page}`,
                        method: 'GET',
                    }
                },
                providesTags: ['categories']
            }),
            fetchCategory: builder.query({
                query: (id) => {
                    return{
                        url: `/fetch-category/${id}`,
                        method: 'GET'
                    }
                },
                providesTags: ['categories']
            }),
            allCategories: builder.query({
                query: () => {
                    return{
                        url: 'allcategories',
                        method: 'GET'
                    }
                },
                providesTags: ['categories']
            }),
            randomCategories: builder.query({
                query: () => {
                  return {
                    url: "random-categories",
                    method: "GET",
                  };
                },
            }),
        }
    }
});

export const {useCreateMutation, useGetQuery, useFetchCategoryQuery, 
    useUpdateCategoryMutation, useDeleteCategoryMutation, 
    useAllCategoriesQuery, useRandomCategoriesQuery} = categoryService
export default categoryService;








// This code sets up an API service using @reduxjs/toolkit/query/react to manage API endpoints 
// for category-related actions. It utilizes createApi and fetchBaseQuery from 
// @reduxjs/toolkit/query/react to simplify the process of creating and managing API queries.


// create: It defines the create endpoint as a mutation using builder.mutation(). 
// It takes a function as an argument that returns an object representing the query configuration. 
// In this case, the query configuration specifies that this endpoint is for making a POST request 
// to the URL 'http://localhost:5000/api/create-category' with the category name provided as the name parameter.


// get: It defines the get endpoint as a query using builder.query(). It takes a function as 
// an argument that returns an object representing the query configuration. In this case, 
// the query configuration specifies that this endpoint is for making a GET request to 
// the URL http://localhost:5000/api/categories/${page}, where page is a parameter passed to the query function. 
// This endpoint is likely used for fetching paginated categories.


// prepareHeaders: (headers, {getState}) => {
//     const reducers = getState();
//     const token = reducers?.authReducer?.adminToken;
//     headers.set('authorization', token ? `Bearer ${token}` : '');
//     return headers;
// }

// this function will check is the client has a valid token to create a category or not
// our token is stored in authReducer at console named as adminToken and this function will be imported to 
// Authorization.js file created at backend/services. 

// tagTypes is an inbuilt method to refetch the data when new data is added threw mutation or data is deleted or updated,
// invalidetTags, providesTags are used with tagTypes.