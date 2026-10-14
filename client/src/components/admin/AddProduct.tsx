import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNewProductMutation } from '../../redux/api/product.api';
import { notify } from '../../utils/util';
import { CustomError } from '../../types/api-types';
import BackButton from '../common/BackBtn';
import { uploadToCloudinary } from '../../utils/cloudinary';
import { 
  FaBoxOpen, 
  FaPlus, 
  FaTrash, 
  FaCopy, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaRupeeSign, 
  FaLayerGroup,
  FaUpload,
  FaImage
} from 'react-icons/fa';

export interface ProductVariantItem {
  id: string;
  name: string;
  label: string;
  salePrice: number;
  price?: number;
  mrp: number;
  stock: number;
  inStock: boolean;
  pack?: string;
}
export type CandleVariantItem = ProductVariantItem;

const AdminAddProduct: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: 'Tribal Araku Products',
    stock: 50,
    price: 0,
    description: '',
  });

  const [hasVariants, setHasVariants] = useState(false);
  const [variants, setVariants] = useState<ProductVariantItem[]>([]);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const [newProduct, { isError, error }] = useNewProductMutation();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPhotoPreview(reader.result);
        }
      };
    }
  };

  // Add empty variant
  const addCustomVariant = () => {
    const newVar: ProductVariantItem = {
      id: Date.now().toString(),
      name: `Variant ${variants.length + 1}`,
      label: `Option ${variants.length + 1}`,
      salePrice: Number(formData.price || 199),
      price: Number(formData.price || 199),
      mrp: Number(formData.price ? Number(formData.price) * 1.2 : 249),
      stock: 25,
      inStock: true
    };
    setVariants(prev => [...prev, newVar]);
    setHasVariants(true);
  };

  // Duplicate a variant
  const duplicateVariant = (index: number) => {
    const target = variants[index];
    const duplicated: ProductVariantItem = {
      ...target,
      id: Date.now().toString(),
      name: `${target.name} (Copy)`,
      label: `${target.label} (Copy)`,
    };
    setVariants(prev => [...prev, duplicated]);
    notify('Variant duplicated', 'success');
  };

  // Update a single variant field
  const updateVariant = (index: number, field: keyof ProductVariantItem, value: any) => {
    setVariants(prev => {
      const updated = [...prev];
      const current = { ...updated[index] };
      (current as any)[field] = value;
      if (field === 'salePrice') {
        current.price = Number(value);
      }
      if (field === 'name' && !current.label) {
        current.label = value;
      }
      updated[index] = current;
      return updated;
    });
  };

  // Remove variant
  const removeVariant = (index: number) => {
    setVariants(prev => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length === 0) setHasVariants(false);
      return updated;
    });
  };

  // Form submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      notify('Please enter a product name', 'error');
      return;
    }
    if (!photoFile) {
      notify('Please upload a product photo', 'error');
      return;
    }
    if (!formData.description.trim()) {
      notify('Please enter product description', 'error');
      return;
    }

    // Validate pricing
    let basePrice = Number(formData.price || 0);
    let totalStock = Number(formData.stock || 0);

    const formattedVariants = variants.map(v => ({
      id: v.id,
      name: v.name.trim() || v.label.trim(),
      label: v.label.trim() || v.name.trim(),
      salePrice: Number(v.salePrice || 0),
      price: Number(v.salePrice || 0),
      mrp: Number(v.mrp || v.salePrice || 0),
      stock: Number(v.stock || 0),
      inStock: v.inStock !== false,
      pack: v.pack || v.label
    }));

    if (hasVariants && formattedVariants.length > 0) {
      const prices = formattedVariants.map(v => v.salePrice);
      basePrice = Math.min(...prices);
      totalStock = formattedVariants.reduce((sum, v) => sum + (v.stock || 0), 0);
    } else if (basePrice <= 0) {
      notify('Please enter a valid base price or add variant sizes', 'error');
      return;
    }

    try {
      setUploadingImage(true);
      const { url: cloudinaryUrl } = await uploadToCloudinary(photoFile);

      const productData = {
        name: formData.name.trim(),
        category: formData.category,
        stock: totalStock,
        price: basePrice,
        description: formData.description.trim(),
        photo: cloudinaryUrl,
        variants: hasVariants && formattedVariants.length > 0 ? formattedVariants : []
      };

      await newProduct({ productData }).unwrap();
      notify('Product added successfully to catalog!', 'success');
      navigate('/admin/products');
    } catch (err: any) {
      const customError = err as CustomError;
      notify(customError?.data?.message || err?.message || 'Failed to add product', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  useEffect(() => {
    if (isError && error) {
      const customError = error as CustomError;
      notify(customError.data?.message || 'Error occurred', 'error');
    }
  }, [isError, error]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 font-sans">
      <div className="flex items-center justify-between">
        <BackButton fallback="/admin/products" />
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl border border-neutral-200 shadow-2xs space-y-6">
        <div className="border-b border-neutral-100 pb-4 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
              <FaBoxOpen className="text-neutral-700" /> Add New Product
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Fill in product details, upload Cloudinary photography, and configure sizing/pack varieties.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Product Name */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold uppercase text-neutral-600 tracking-wider">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Urvaa Araku Arabica Coffee Powder"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 bg-neutral-50 focus:bg-white font-medium text-neutral-900"
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-neutral-600 tracking-wider">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 bg-neutral-50 focus:bg-white font-medium text-neutral-900"
                required
              >
                <option value="Tribal Araku Products">Tribal Araku Products</option>
                <option value="Mana Godavari Foods">Mana Godavari Foods</option>
                <option value="Eco-Friendly Products">Eco-Friendly Products</option>
                <option value="Swadesi Handlooms">Swadesi Handlooms</option>
                <option value="Kadiyam Plants">Kadiyam Plants</option>
              </select>
            </div>

            {/* Base Pricing (only if no variants) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase text-neutral-600 tracking-wider">
                  Base Price (₹) {hasVariants && <span className="text-[10px] text-neutral-400 font-normal lowercase">(auto from variants)</span>}
                </label>
              </div>
              <div className="relative">
                <FaRupeeSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-xs" />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  disabled={hasVariants && variants.length > 0}
                  placeholder="e.g. 299"
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 bg-neutral-50 focus:bg-white font-medium disabled:opacity-50 text-neutral-900"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase text-neutral-600 tracking-wider">
              Product Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe the product, authentic origin, regional craft, or organic ingredients..."
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 bg-neutral-50 focus:bg-white text-neutral-900 resize-none"
              required
            />
          </div>

          {/* Product Photo Upload */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-neutral-600 tracking-wider block">
              Product Imagery (Cloudinary Direct) *
            </label>
            <div className="flex items-center gap-4 flex-wrap">
              {photoPreview ? (
                <div className="relative w-24 h-24 rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs shrink-0 bg-neutral-50">
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50 flex flex-col items-center justify-center text-neutral-400 text-xs shrink-0">
                  <FaImage className="text-xl mb-1 text-neutral-300" />
                  <span className="text-[10px]">No Photo</span>
                </div>
              )}
              <label className="cursor-pointer bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200 px-4 py-2.5 rounded-xl font-semibold text-xs transition shadow-2xs flex items-center gap-2">
                <FaUpload /> Choose Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-neutral-400">High-resolution JPEG or PNG. Automatically optimized on Cloudinary.</p>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* PRODUCT SIZE & VARIANTS BUILDER */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          <div className="border border-neutral-200 bg-neutral-50/50 p-5 md:p-6 rounded-3xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200/60 pb-4">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <FaLayerGroup className="text-neutral-500" /> Sizes, Weights & Pack Varieties
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Offer buyers different sizes (e.g. 250g, 500g, 1kg), packs, or combo options.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={addCustomVariant}
                  className="bg-[#111111] hover:bg-neutral-800 text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-2xs"
                >
                  <FaPlus className="text-[10px]" /> Add Size / Variant
                </button>
              </div>
            </div>

            {/* Variant Cards List */}
            {variants.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-neutral-200 p-8 text-center space-y-1.5">
                <p className="text-xs font-semibold text-neutral-700">
                  No multi-sizes added yet — product will sell as a single standard item.
                </p>
                <p className="text-[11px] text-neutral-400 max-w-sm mx-auto">
                  Click "+ Add Size / Variant" if this product is sold in distinct weights, packs, or sizes.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {variants.map((v, idx) => {
                  const discount = v.mrp > v.salePrice 
                    ? Math.round(((v.mrp - v.salePrice) / v.mrp) * 100) 
                    : 0;

                  return (
                    <div
                      key={v.id}
                      className={`bg-white rounded-2xl border p-4 transition-all duration-200 shadow-2xs space-y-3 ${
                        !v.inStock ? 'border-rose-200 bg-rose-50/20' : 'border-neutral-200'
                      }`}
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-neutral-100 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-neutral-100 text-neutral-700 font-bold flex items-center justify-center text-[10px]">
                            {idx + 1}
                          </span>
                          <span className="font-semibold text-neutral-900 text-xs">
                            {v.name || `Variant ${idx + 1}`}
                          </span>
                          {discount > 0 && (
                            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                              {discount}% OFF
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {/* In Stock toggle */}
                          <button
                            type="button"
                            onClick={() => updateVariant(idx, 'inStock', !v.inStock)}
                            className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border transition flex items-center gap-1 ${
                              v.inStock
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                            }`}
                          >
                            {v.inStock ? <FaCheckCircle /> : <FaTimesCircle />}
                            <span>{v.inStock ? 'In Stock' : 'Out of Stock'}</span>
                          </button>

                          {/* Duplicate button */}
                          <button
                            type="button"
                            onClick={() => duplicateVariant(idx)}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition"
                            title="Duplicate variant"
                          >
                            <FaCopy className="text-xs" />
                          </button>

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => removeVariant(idx)}
                            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Remove variant"
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        </div>
                      </div>

                      {/* Variant Inputs Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        {/* Variant Title */}
                        <div className="col-span-2 sm:col-span-1 space-y-1">
                          <label className="text-[10px] font-semibold uppercase text-neutral-400">
                            Size / Pack Label
                          </label>
                          <input
                            type="text"
                            value={v.name}
                            onChange={(e) => updateVariant(idx, 'name', e.target.value)}
                            placeholder="e.g. Medium (500g)"
                            className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-medium focus:outline-none focus:border-neutral-900 bg-neutral-50 focus:bg-white text-neutral-900"
                          />
                        </div>

                        {/* Sale Price */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold uppercase text-neutral-400">
                            Selling Price (₹) *
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={v.salePrice}
                            onChange={(e) => updateVariant(idx, 'salePrice', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-900 focus:outline-none focus:border-neutral-900 bg-neutral-50 focus:bg-white"
                            required
                          />
                        </div>

                        {/* MRP Price */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold uppercase text-neutral-400">
                            MRP Price (₹)
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={v.mrp}
                            onChange={(e) => updateVariant(idx, 'mrp', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-600 focus:outline-none focus:border-neutral-900 bg-neutral-50 focus:bg-white"
                          />
                        </div>

                        {/* Stock Units */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold uppercase text-neutral-400">
                            Stock Units
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={v.stock}
                            onChange={(e) => updateVariant(idx, 'stock', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-800 focus:outline-none focus:border-neutral-900 bg-neutral-50 focus:bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="px-5 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-semibold text-xs transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploadingImage}
              className="bg-[#111111] hover:bg-neutral-800 text-white px-7 py-2.5 rounded-xl font-semibold text-xs transition shadow-xs disabled:opacity-50 flex items-center gap-2"
            >
              {uploadingImage ? 'Uploading & Creating...' : 'Publish Product to Store'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddProduct;
