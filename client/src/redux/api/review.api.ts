import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { NewReviewRequest, ReviewResponse, ReviewsResponse } from "../../types/api-types";

export const reviewApi = createApi({
    reducerPath: 'reviewAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `/api/v1`,
        credentials: 'include',
    }),
    tagTypes: ['Review'],
    endpoints: (builder) => ({
        getReviews: builder.query<ReviewsResponse, string | void>({
            query: (productId) => (productId ? `reviews?productId=${productId}` : 'reviews'),
            providesTags: ['Review'],
        }),

        addReview: builder.mutation<ReviewResponse, NewReviewRequest>({
            query: (reviewData) => ({
                url: 'reviews',
                method: 'POST',
                body: reviewData,
            }),
            invalidatesTags: ['Review'],
        }),

        deleteReview: builder.mutation<{ success: boolean; message: string }, string>({
            query: (reviewId) => ({
                url: `reviews/${reviewId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Review'],
        }),
    }),
});

export const {
    useGetReviewsQuery,
    useAddReviewMutation,
    useDeleteReviewMutation,
} = reviewApi;
