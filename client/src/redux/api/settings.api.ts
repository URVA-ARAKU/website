import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { StoreSettings, StoreSettingsResponse } from "../../types/api-types";

export const settingsApi = createApi({
    reducerPath: 'settingsAPI',
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
    tagTypes: ['Settings'],
    endpoints: (builder) => ({
        getStoreSettings: builder.query<StoreSettingsResponse, void>({
            query: () => 'store/settings',
            providesTags: ['Settings'],
        }),

        getAdminSettings: builder.query<StoreSettingsResponse, void>({
            query: () => 'admin/settings',
            providesTags: ['Settings'],
        }),

        updateStoreSettings: builder.mutation<StoreSettingsResponse, Partial<StoreSettings>>({
            query: (settings) => ({
                url: 'admin/settings',
                method: 'PUT',
                body: settings,
            }),
            invalidatesTags: ['Settings'],
        }),
    }),
});

export const {
    useGetStoreSettingsQuery,
    useGetAdminSettingsQuery,
    useUpdateStoreSettingsMutation,
} = settingsApi;
