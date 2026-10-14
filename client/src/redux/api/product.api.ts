import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
    CategoriesResponse,
    DeleteProductRequest,
    FeatureProductRequest,
    MessageResponse,
    NewProductRequest,
    ProductDetailResponse,
    ProductRequest,
    ProductResponse,
    SearchProductRequest,
    SearchProductResponse,
    ToggleActiveProductRequest,
    UpdateProductRequest
} from "../../types/api-types";


export const productApi = createApi({
    reducerPath: 'productAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `/api/v1/products`,
        credentials: 'include',
        prepareHeaders: (headers) => {
            const adminToken = localStorage.getItem('adminToken');
            if (adminToken) {
                headers.set('Authorization', `Bearer ${adminToken}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Product'],
    endpoints: (builder) => ({
        latestProducts: builder.query<ProductResponse, string>({
            query: () => '/latest',
            providesTags: ['Product']
        }),
        allProducts: builder.query<ProductResponse, ProductRequest>({
            query: ({ page, limit, sortBy }) => {
                const sortParam = sortBy ? `&sortBy=${JSON.stringify(sortBy)}` : '';
                return `all?page=${page}&limit=${limit}${sortParam}`;
            },
            providesTags: ['Product'],
        }),

        categories: builder.query<CategoriesResponse, string>({
            query: () => '/categories',
            providesTags: ['Product']
        }),
        searchProducts: builder.query<SearchProductResponse, SearchProductRequest>({
            query: ({ price, search, sort, category, page }) => {
                let base = `/search?search=${search}&page=${page}`;
                if (price) base += `&price=${price}`;
                if (sort) base += `&sort=${sort}`;
                if (category) base += `&category=${category}`;
                return base;
            },
            providesTags: ['Product'],
        }),
        newProduct: builder.mutation<MessageResponse, NewProductRequest>({
            query: ({ productData }) => ({
                url: `new`,
                method: 'POST',
                body: productData,
            }),
            invalidatesTags: ['Product'],
        }),
        productDetails: builder.query<ProductDetailResponse, string>({
            query: (id) => id,
            providesTags: ['Product']
        }),
        updateProduct: builder.mutation<MessageResponse, UpdateProductRequest>({
            query: ({ formData, productId, }) => ({
                url: `${productId}`,
                method: 'PUT',
                body: formData,
            }),
            invalidatesTags: ['Product'],

        }),
        deleteProduct: builder.mutation<MessageResponse, DeleteProductRequest>({
            query: ({ productId }) => ({
                url: `${productId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Product'],
        }),
        getAllFeaturedProducts: builder.query<ProductResponse, string>({
            query: () => 'featured',
            providesTags: ['Product']
        }),
        featureProduct: builder.mutation<MessageResponse, FeatureProductRequest>({
            query: ({ productId }) => ({
                url: `feature/${productId}`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Product']
        }),
        toggleActiveProduct: builder.mutation<MessageResponse, ToggleActiveProductRequest>({
            query: ({ productId }) => ({
                url: `toggle-active/${productId}`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Product']
        }),
    }),
});

export const {
    useLatestProductsQuery,
    useAllProductsQuery,
    useCategoriesQuery,
    useSearchProductsQuery,
    useNewProductMutation,
    useProductDetailsQuery,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useGetAllFeaturedProductsQuery,
    useFeatureProductMutation,
    useToggleActiveProductMutation,
} = productApi;

