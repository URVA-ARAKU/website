import React, { useState } from 'react';
import { 
  useGetAdminCategoriesQuery, 
  useCreateCategoryMutation, 
  useUpdateCategoryMutation, 
  useDeleteCategoryMutation 
} from '../../redux/api/category.api';
import { CategoryItem } from '../../types/api-types';
import { 
  FaTags, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaTimes, 
  FaCheck, 
  FaBoxes, 
  FaLayerGroup
} from 'react-icons/fa';
import { notify } from '../../utils/util';

const defaultCategoryImages = [
  'https://res.cloudinary.com/idi6k3ue/image/upload/v1792440012/urvaa/categories/tribal-araku-products.png',
  'https://res.cloudinary.com/idi6k3ue/image/upload/v1792440015/urvaa/categories/mana-godavari-foods.png',
  'https://res.cloudinary.com/idi6k3ue/image/upload/v1792440018/urvaa/categories/eco-friendly-products.png',
  'https://res.cloudinary.com/idi6k3ue/image/upload/v1792440020/urvaa/categories/swadesi-handlooms.png',
  'https://res.cloudinary.com/idi6k3ue/image/upload/v1792440023/urvaa/categories/kadiyam-plants.png',
];

const AdminCategories: React.FC = () => {
  const { data, isLoading, isError, refetch } = useGetAdminCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [minimumOrder, setMinimumOrder] = useState('');
  const [bulkPricing, setBulkPricing] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const categories: CategoryItem[] = data?.categories || [];

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setTitle('');
    setSlug('');
    setDescription('');
    setImage(defaultCategoryImages[0]);
    setMinimumOrder('');
    setBulkPricing('');
    setDisplayOrder(categories.length + 1);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setTitle(cat.title || cat.name);
    setSlug(cat.slug || cat.id);
    setDescription(cat.description || '');
    setImage(cat.image || defaultCategoryImages[0]);
    setMinimumOrder(cat.minimumOrder || '');
    setBulkPricing(cat.bulkPricing || '');
    setDisplayOrder(cat.displayOrder || 0);
    setIsActive(cat.isActive !== false);
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingCategory) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generatedSlug);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      notify('Please enter a category title', 'error');
      return;
    }

    const payload: Partial<CategoryItem> = {
      title: title.trim(),
      name: title.trim(),
      slug: (slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-')).trim(),
      description: description.trim(),
      image: image.trim() || defaultCategoryImages[0],
      minimumOrder: minimumOrder.trim(),
      bulkPricing: bulkPricing.trim(),
      displayOrder: Number(displayOrder) || 0,
      isActive,
    };

    try {
      if (editingCategory) {
        await updateCategory({ id: editingCategory.id, category: payload }).unwrap();
        notify('Category updated successfully!', 'success');
      } else {
        await createCategory(payload).unwrap();
        notify('New category added successfully!', 'success');
      }
      setIsModalOpen(false);
      refetch();
    } catch (err: any) {
      notify(err?.data?.message || 'Failed to save category', 'error');
    }
  };

  const handleDelete = async (cat: CategoryItem) => {
    if (window.confirm(`Are you sure you want to delete category "${cat.title || cat.name}"?`)) {
      try {
        await deleteCategory(cat.id).unwrap();
        notify('Category deleted', 'success');
        refetch();
      } catch {
        notify('Failed to delete category', 'error');
      }
    }
  };

  const handleToggleActive = async (cat: CategoryItem) => {
    try {
      await updateCategory({
        id: cat.id,
        category: { isActive: !cat.isActive }
      }).unwrap();
      notify(`Category ${cat.isActive ? 'deactivated' : 'activated'}`, 'success');
      refetch();
    } catch {
      notify('Failed to update category status', 'error');
    }
  };

  const filteredCategories = categories.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.title?.toLowerCase().includes(q) ||
      c.name?.toLowerCase().includes(q) ||
      c.slug?.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-[#5A3825] tracking-tight">Categories Management</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EAE5D9] text-[#5A3825] border border-[#E2D9CC]">
              {categories.length} Collections
            </span>
          </div>
          <p className="text-xs text-[#8C7364] mt-1">
            Organize regional harvests, manage product collections, and set minimum order & bulk wholesale rules.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="bg-[#FAF8F4] hover:bg-[#EAE5D9] text-[#5A3825] font-semibold px-4 py-2 rounded-xl text-xs border border-[#E2D9CC] transition"
          >
            Refresh
          </button>
          <button
            onClick={handleOpenAdd}
            className="bg-[#5A3825] hover:bg-[#8B5A2B] text-[#F4F1EA] font-semibold px-4 py-2 rounded-xl text-xs shadow-2xs transition flex items-center gap-1.5"
          >
            <FaPlus className="text-xs" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-[#FAF8F4] p-4 rounded-2xl border border-[#E2D9CC] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7364]">Total Categories</span>
            <div className="w-8 h-8 rounded-lg bg-[#F4F1EA] text-[#5A3825] flex items-center justify-center text-sm border border-[#E2D9CC]">
              <FaLayerGroup />
            </div>
          </div>
          <p className="text-2xl font-serif font-bold text-[#5A3825] mt-2 tracking-tight">{categories.length}</p>
          <p className="text-[11px] text-[#8C7364] mt-0.5">Catalog collections</p>
        </div>

        <div className="bg-[#FAF8F4] p-4 rounded-2xl border border-[#E2D9CC] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Active On Storefront</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center text-sm border border-emerald-200">
              <FaCheck />
            </div>
          </div>
          <p className="text-2xl font-serif font-bold text-emerald-800 mt-2 tracking-tight">
            {categories.filter(c => c.isActive !== false).length}
          </p>
          <p className="text-[11px] text-emerald-700 font-medium mt-0.5">Live for customers</p>
        </div>

        <div className="bg-[#FAF8F4] p-4 rounded-2xl border border-[#E2D9CC] shadow-2xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7364]">Wholesale Ready</span>
            <div className="w-8 h-8 rounded-lg bg-[#F4F1EA] text-[#8B5A2B] flex items-center justify-center text-sm border border-[#E2D9CC]">
              <FaBoxes />
            </div>
          </div>
          <p className="text-2xl font-serif font-bold text-[#8B5A2B] mt-2 tracking-tight">
            {categories.filter(c => Boolean(c.bulkPricing)).length}
          </p>
          <p className="text-[11px] text-[#8C7364] mt-0.5">With bulk guidelines</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-[#FAF8F4] p-4 rounded-2xl border border-[#E2D9CC] shadow-2xs">
        <div className="relative">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7364] text-xs" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories by name, slug or description..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2D9CC] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]/10 bg-[#F4F1EA] focus:bg-white placeholder-[#8C7364] transition text-[#5A3825]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8C7364] hover:text-[#5A3825]"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Categories Grid / Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#5A3825] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : isError ? (
        <div className="bg-[#FAF8F4] p-8 rounded-3xl border border-[#E2D9CC] text-center max-w-md mx-auto my-12">
          <p className="text-rose-700 font-semibold mb-2 text-sm">Failed to load categories.</p>
          <button
            onClick={() => refetch()}
            className="bg-[#5A3825] text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-[#8B5A2B] transition"
          >
            Retry
          </button>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="bg-[#FAF8F4] rounded-3xl border border-[#E2D9CC] p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#F4F1EA] text-[#8C7364] text-xl flex items-center justify-center mx-auto mb-3 border border-[#E2D9CC]">
            <FaTags />
          </div>
          <p className="text-[#5A3825] font-semibold text-sm">No categories found</p>
          <p className="text-xs text-[#8C7364] mt-1 max-w-sm mx-auto">
            {searchQuery ? 'No category matches your search term.' : 'Click "Add Category" above to create your first product category.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id || cat.slug}
              className="bg-[#FAF8F4] rounded-2xl border border-[#E2D9CC] overflow-hidden shadow-2xs hover:shadow-xs transition flex flex-col justify-between"
            >
              <div>
                {/* Category Cover Image */}
                <div className="relative h-44 w-full bg-[#EAE5D9] overflow-hidden">
                  <img
                    src={cat.image || defaultCategoryImages[0]}
                    alt={cat.title || cat.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-2xs ${
                        cat.isActive !== false
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-neutral-100 text-neutral-600 border-neutral-300'
                      }`}
                    >
                      {cat.isActive !== false ? 'Active' : 'Hidden'}
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-3">
                    <span className="font-mono text-[10px] bg-black/60 text-white px-2 py-0.5 rounded">
                      /{cat.slug || cat.id}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2.5">
                  <h3 className="font-serif font-bold text-base text-[#5A3825] leading-snug">
                    {cat.title || cat.name}
                  </h3>

                  <p className="text-xs text-[#8C7364] line-clamp-2 leading-relaxed">
                    {cat.description || 'No description provided.'}
                  </p>

                  {(cat.minimumOrder || cat.bulkPricing) && (
                    <div className="bg-[#F4F1EA] p-2.5 rounded-xl border border-[#E2D9CC] text-[11px] text-[#5A3825] space-y-1">
                      {cat.minimumOrder && (
                        <p>
                          <strong className="text-[#8B5A2B]">Min Order:</strong> {cat.minimumOrder}
                        </p>
                      )}
                      {cat.bulkPricing && (
                        <p>
                          <strong className="text-[#8B5A2B]">Wholesale:</strong> {cat.bulkPricing}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="px-4 py-3 bg-[#F4F1EA] border-t border-[#E2D9CC] flex items-center justify-between">
                <button
                  onClick={() => handleToggleActive(cat)}
                  className="text-xs font-semibold text-[#8C7364] hover:text-[#5A3825] transition"
                >
                  {cat.isActive !== false ? 'Hide from Store' : 'Show on Store'}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-2 rounded-lg bg-[#FAF8F4] hover:bg-[#EAE5D9] text-[#5A3825] border border-[#E2D9CC] text-xs transition"
                    title="Edit category"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(cat)}
                    className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs transition"
                    title="Delete category"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-[#FAF8F4] rounded-3xl max-w-xl w-full p-6 border border-[#E2D9CC] shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E2D9CC]">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#5A3825]">
                  {editingCategory ? 'Edit Product Category' : 'Add New Category'}
                </h3>
                <p className="text-xs text-[#8C7364] mt-0.5">
                  Set collection details, banner image, and bulk ordering terms.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F4F1EA] hover:bg-[#EAE5D9] text-[#5A3825] flex items-center justify-center transition border border-[#E2D9CC]"
              >
                <FaTimes />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#5A3825] uppercase tracking-wider mb-1.5">
                  Category Title <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Tribal Araku Products"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CC] bg-[#F4F1EA] text-[#5A3825] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]/10"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5A3825] uppercase tracking-wider mb-1.5">
                  URL Slug (Auto-generated)
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2.5 bg-[#EAE5D9] border border-r-0 border-[#E2D9CC] rounded-l-xl text-xs text-[#8C7364] font-mono">
                    /category/
                  </span>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, ''))}
                    placeholder="tribal-araku-products"
                    className="w-full px-3.5 py-2.5 rounded-r-xl border border-[#E2D9CC] bg-[#F4F1EA] text-[#5A3825] text-xs font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5A3825] uppercase tracking-wider mb-1.5">
                  Category Image URL
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://res.cloudinary.com/... or choose preset below"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CC] bg-[#F4F1EA] text-[#5A3825] text-xs focus:outline-none"
                />

                {/* Preset image selector */}
                <div className="mt-2 flex items-center gap-2 overflow-x-auto pb-1">
                  {defaultCategoryImages.map((imgUrl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setImage(imgUrl)}
                      className={`w-12 h-10 rounded-lg overflow-hidden border shrink-0 transition ${
                        image === imgUrl ? 'ring-2 ring-[#8B5A2B] border-transparent' : 'border-[#E2D9CC] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt="Preset" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5A3825] uppercase tracking-wider mb-1.5">
                  Overview & Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the regional harvest, tradition, or artisan craft of this collection..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CC] bg-[#F4F1EA] text-[#5A3825] text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5A3825] uppercase tracking-wider mb-1.5">
                    Minimum Order Guideline
                  </label>
                  <input
                    type="text"
                    value={minimumOrder}
                    onChange={(e) => setMinimumOrder(e.target.value)}
                    placeholder="e.g. 1 kg / 1 pack"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CC] bg-[#F4F1EA] text-[#5A3825] text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5A3825] uppercase tracking-wider mb-1.5">
                    Bulk / Wholesale Pricing Rule
                  </label>
                  <input
                    type="text"
                    value={bulkPricing}
                    onChange={(e) => setBulkPricing(e.target.value)}
                    placeholder="e.g. Wholesale margin applies above 10 kg"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CC] bg-[#F4F1EA] text-[#5A3825] text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#5A3825]">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-[#8B5A2B] focus:ring-[#8B5A2B]"
                  />
                  <span>Active & Visible on Storefront</span>
                </label>

                <div className="flex items-center gap-2">
                  <label className="text-xs text-[#8C7364]">Sort Order:</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-16 px-2 py-1 rounded-lg border border-[#E2D9CC] bg-[#F4F1EA] text-center text-xs text-[#5A3825]"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#E2D9CC]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#F4F1EA] hover:bg-[#EAE5D9] text-[#5A3825] text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="px-5 py-2.5 rounded-xl bg-[#5A3825] hover:bg-[#8B5A2B] text-white text-xs font-semibold shadow-2xs transition disabled:opacity-50"
                >
                  {isCreating || isUpdating ? 'Saving...' : editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
