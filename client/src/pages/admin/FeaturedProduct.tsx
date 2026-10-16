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
                <div className="w-8 h-8 border-2 border-[#5A3825] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 font-sans">
            <div>
                <h1 className="text-2xl font-bold text-[#5A3825] tracking-tight flex items-center gap-2">
                    <FaStar className="text-[#8B5A2B]" /> Featured Products
                </h1>
                <p className="text-xs text-[#5A3825]/70 mt-0.5">Manage products displayed prominently on your storefront homepage.</p>
            </div>

            <div className="bg-[#FAF8F4] p-6 rounded-3xl border border-[#E2D9CC] shadow-2xs">
                {products.length === 0 ? (
                    <div className="text-center py-12 text-[#8B5A2B] font-medium text-xs">No featured products currently active.</div>
                ) : (
                    <div className="overflow-x-auto rounded-2xl border border-[#E2D9CC]">
                        <table className="min-w-full divide-y divide-[#E2D9CC] text-left">
                            <thead className="bg-[#F4F1EA] text-[10px] font-semibold text-[#5A3825] uppercase tracking-wider">
                                <tr>
                                    <th className="px-5 py-3">Photo</th>
                                    <th className="px-5 py-3">Product ID</th>
                                    <th className="px-5 py-3">Name</th>
                                    <th className="px-5 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-[#FAF8F4] divide-y divide-[#E2D9CC] text-xs">
                                {products.map((product) => (
                                    <tr key={product._id} className="hover:bg-[#F4F1EA]/60 transition-colors">
                                        <td className="px-5 py-3.5">
                                            <img 
                                                src={product.photo || 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791904965/urvaa/logo.png'} 
                                                alt={product.name} 
                                                className="w-12 h-12 object-cover rounded-xl border border-[#E2D9CC] shadow-2xs hover:scale-105 transition-transform duration-200" 
                                            />
                                        </td>
                                        <td className="px-5 py-3.5 font-mono text-[#8B5A2B] text-xs">{product._id?.slice(0, 8)}...</td>
                                        <td className="px-5 py-3.5 font-semibold text-[#5A3825]">{product.name}</td>
                                        <td className="px-5 py-3.5">
                                            <button
                                                onClick={() => handleFeatureToggle(product._id)}
                                                className="inline-flex items-center gap-1.5 text-rose-700 border border-rose-200 hover:bg-rose-50 px-3 py-1.5 rounded-xl text-xs font-semibold transition duration-200"
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

