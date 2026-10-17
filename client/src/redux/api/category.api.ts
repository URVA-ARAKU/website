import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CategoriesListResponse, CategoryItem, CategoryResponse, MessageResponse } from "../../types/api-types";

export const categoryApi = createApi({
    reducerPath: 'categoryAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `/api/v1`,
        credentials: 'include',
        prepareHeaders: (headers) => {
            const adminToken = localStorage.getItem('adminToken');
            if (adminToken) {
                headers.set('Authorization', `Bearer ${adminToken}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Category'],
    endpoints: (builder) => ({
        getCategories: builder.query<CategoriesListResponse, void>({
            query: () => 'categories',
            providesTags: ['Category'],
        }),

        getAdminCategories: builder.query<CategoriesListResponse, void>({
            query: () => 'admin/categories',
            providesTags: ['Category'],
        }),

        createCategory: builder.mutation<CategoryResponse, Partial<CategoryItem>>({
            query: (category) => ({
                url: 'admin/categories',
                method: 'POST',
                body: category,
            }),
            invalidatesTags: ['Category'],
        }),

        updateCategory: builder.mutation<CategoryResponse, { id: string; category: Partial<CategoryItem> }>({
            query: ({ id, category }) => ({
                url: `admin/categories/${id}`,
                method: 'PUT',
                body: category,
            }),
            invalidatesTags: ['Category'],
        }),

        deleteCategory: builder.mutation<MessageResponse, string>({
            query: (id) => ({
                url: `admin/categories/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Category'],
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useGetAdminCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categoryApi;
