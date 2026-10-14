export const urvaaCategories = {
  'tribal-araku-products': {
    title: 'Tribal Araku Products',
    image: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791904994/urvaa/images/categories/tribal-araku.jpg',
    description: 'Discover Araku coffee, organic turmeric, unpasteurized raw honey, and tribal millets.',
    products: [
      'Urvaa Araku Arabica Coffee Powder',
      'Organic Turmeric',
      'Urvaa Unpasteurized Raw Honey',
      'Araku Tribal Millets',
    ],
    minimumOrder: '1 kg / 1 pack',
    bulkPricing: 'Special wholesale pricing applies to orders above 10 kg.',
  },
  'mana-godavari-foods': {
    title: 'Mana Godavari Foods',
    image: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791904992/urvaa/images/categories/mana-godavari.jpg',
    description: 'Explore traditional Godavari sweets, palm jaggery, and regional foods.',
    products: [
      'Thati Bellam (Palm Jaggery)',
      'Putharekulu',
      'Palakova',
      'Godavari Traditional Sweets & Pickles',
    ],
    minimumOrder: '1 kg / 500 grams',
    bulkPricing: 'Manufacturing price applies to bulk orders.',
  },
  'eco-friendly-products': {
    title: 'Eco-Friendly Products',
    image: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791904990/urvaa/images/categories/eco-friendly.jpg',
    description: 'Browse thoughtful, eco-friendly finds for more mindful everyday living.',
    products: [
      'Siali and Modugu Leaf Plates (12-inch)',
      'Urvaa Herbal Mosquito Dhoop Sticks',
      'Aura Cleansing Bath Kit (Bath Potli)',
      'Bamboo Products',
    ],
    minimumOrder: 'Leaf plates: 1 bundle (100 pieces); dhoop sticks: 1 box.',
    bulkPricing: 'Leaf plates: ₹4.50 per piece for bulk orders; a wholesale margin applies to the rest.',
  },
  'swadesi-handlooms': {
    title: 'Swadesi Handlooms',
    image: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791904993/urvaa/images/categories/swadesi-handlooms.jpg',
    description: 'Explore traditional handlooms, cotton dress materials, fabrics, and towels.',
    products: [
      'Traditional Handloom Sarees',
      'Half-sarees',
      'Dhotis',
      'Cotton Dress Materials & Fabrics',
      'Towels',
    ],
    minimumOrder: '1 piece',
    bulkPricing: 'Special pricing is available for B2B wholesale orders.',
  },
  'kadiyam-plants': {
    title: 'Kadiyam Plants',
    image: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791904991/urvaa/images/categories/kadiyam-plants.jpg',
    description: 'Explore decorative plants, fruit and flower saplings, and gardening products.',
    products: [
      'Indoor & Outdoor Decorative Plants',
      'Fruit & Flower Saplings',
      'Gardening Products',
    ],
    minimumOrder: '5 plants',
  },
} as const;

export type UrvaaCategory = (typeof urvaaCategories)[keyof typeof urvaaCategories];
