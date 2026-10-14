import React, { useEffect, useState } from 'react';
import { useGetAllFeaturedProductsQuery, useFeatureProductMutation } from '../../redux/api/product.api';
import { Product } from '../../types/api-types';
import { FaStar, FaTrash } from 'react-icons/fa';

const AdminFeaturedProducts: React.FC = () => {
    const { data, isLoading } = useGetAllFeaturedProductsQuery('');
    const [featureProduct] = useFeatureProductMutation();
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        if (data && data.products) {
            setProducts(data.products);
        }
    }, [data]);

    const handleFeatureToggle = async (productId: string) => {
        try {
            await featureProduct({ productId }).unwrap();
            setProducts(products.filter(product => product._id !== productId));
        } catch (error) {
            console.error('Error updating featured status', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 font-sans">
            <div>
                <h1 className="text-2xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
                    <FaStar className="text-amber-500" /> Featured Products
                </h1>
                <p className="text-xs text-neutral-500 mt-0.5">Manage products displayed prominently on your storefront homepage.</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-2xs">
                {products.length === 0 ? (
                    <div className="text-center py-12 text-neutral-400 font-medium text-xs">No featured products currently active.</div>
                ) : (
                    <div className="overflow-x-auto rounded-2xl border border-neutral-200">
                        <table className="min-w-full divide-y divide-neutral-100 text-left">
                            <thead className="bg-neutral-50 text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
                                <tr>
                                    <th className="px-5 py-3">Photo</th>
                                    <th className="px-5 py-3">Product ID</th>
                                    <th className="px-5 py-3">Name</th>
                                    <th className="px-5 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-neutral-100 text-xs">
                                {products.map((product) => (
                                    <tr key={product._id} className="hover:bg-neutral-50/70 transition-colors">
                                        <td className="px-5 py-3.5">
                                            <img 
                                                src={product.photo || 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791904965/urvaa/logo.png'} 
                                                alt={product.name} 
                                                className="w-12 h-12 object-cover rounded-xl border border-neutral-200 shadow-2xs hover:scale-105 transition-transform duration-200" 
                                            />
                                        </td>
                                        <td className="px-5 py-3.5 font-mono text-neutral-400 text-xs">{product._id?.slice(0, 8)}...</td>
                                        <td className="px-5 py-3.5 font-semibold text-neutral-900">{product.name}</td>
                                        <td className="px-5 py-3.5">
                                            <button
                                                onClick={() => handleFeatureToggle(product._id)}
                                                className="inline-flex items-center gap-1.5 text-rose-600 border border-rose-200 hover:bg-rose-50 px-3 py-1.5 rounded-xl text-xs font-semibold transition duration-200"
                                            >
                                                <FaTrash size={10} /> Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminFeaturedProducts;

