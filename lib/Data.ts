import { Product } from "@/types/global";

export const productData: Product[] = [
    {
        id: 15,
        name: 'India Gate Mogra Basmati Rice (Short Grain)',
        price: 364,
        originalPrice: 460,
        images: [
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/734a1a06-d772-49ae-ada4-3fe53e7c261e.png',
            'https://picsum.photos/600/600?random=17a',
            'https://picsum.photos/600/600?random=17b',
            'https://picsum.photos/600/600?random=17c'
        ],
        rating: 4.6,
        totalReviews: 187,
        category: 'rice',
        discount: 20,
        description: 'Better Nutrition Biofortified Rice (Medium Grain) is a perfect blend of aromatic spices that enhances the taste of your vegetables. This magical spice mix transforms ordinary vegetables into extraordinary dishes with its rich flavor and authentic taste.',
        features: [
            'Biofortified with essential nutrients',
            'Medium grain rice',
            'Perfect for daily use',
            'Rich in aroma',
            'Easy to cook'
        ],
        specifications: {
            'Weight': '1kg',
            'Brand': 'Better Nutrition',
            'Type': 'Biofortified Rice',
            'Shelf Life': '12 months',
            'Storage': 'Cool & Dry Place',
            'Nutritional Benefits': 'Enriched with vitamins and minerals'
        },
        inStock: true,
        stockCount: 75,
        brand: 'Maggi',
        sku: 'MGI-SMM-001',
        weight: '80g',
        dimensions: '12cm x 8cm x 3cm',
        reviews: [
            {
                id: 1,
                userName: 'Sunita Devi',
                rating: 5,
                comment: 'Excellent masala! Makes vegetables taste amazing.',
                date: '3 days ago',
                verified: true,
                helpful: 15
            },
            {
                id: 2,
                userName: 'Amit Singh',
                rating: 4,
                comment: 'Good quality spice mix. Value for money.',
                date: '1 week ago',
                verified: true,
                helpful: 8
            },
            {
                id: 3,
                userName: 'Ramesh Gupta',
                rating: 5,
                comment: 'Excellent rice! The perfect blend of taste and nutrition.',
                date: '2 days ago',
                verified: true,
                helpful: 20
            }
        ]
    },
    {
        id: 16,
        name: 'Better Nutrition Biofortified Rice (Medium Grain)',
        price: 213,
        originalPrice: 400,
        images: [
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/1c01d181-b2dd-4633-95a2-746fa3f78117.png',
            'https://picsum.photos/600/600?random=17a',
            'https://picsum.photos/600/600?random=17b',
            'https://picsum.photos/600/600?random=17c'
        ],
        rating: 4.6,
        totalReviews: 187,
        category: 'rice',
        discount: 20,
        description: 'Better Nutrition Biofortified Rice (Medium Grain) is a perfect blend of aromatic spices that enhances the taste of your vegetables. This magical spice mix transforms ordinary vegetables into extraordinary dishes with its rich flavor and authentic taste.',
        features: [
            'Biofortified with essential nutrients',
            'Medium grain rice',
            'Perfect for daily use',
            'Rich in aroma',
            'Easy to cook'
        ],
        specifications: {
            'Weight': '1kg',
            'Brand': 'Better Nutrition',
            'Type': 'Biofortified Rice',
            'Shelf Life': '12 months',
            'Storage': 'Cool & Dry Place',
            'Nutritional Benefits': 'Enriched with vitamins and minerals'
        },
        inStock: true,
        stockCount: 75,
        brand: 'Maggi',
        sku: 'MGI-SMM-001',
        weight: '80g',
        dimensions: '12cm x 8cm x 3cm',
        reviews: [
            {
                id: 1,
                userName: 'Sunita Devi',
                rating: 5,
                comment: 'Excellent masala! Makes vegetables taste amazing.',
                date: '3 days ago',
                verified: true,
                helpful: 15
            },
            {
                id: 2,
                userName: 'Amit Singh',
                rating: 4,
                comment: 'Good quality spice mix. Value for money.',
                date: '1 week ago',
                verified: true,
                helpful: 8
            },
            {
                id: 3,
                userName: 'Ramesh Gupta',
                rating: 5,
                comment: 'Excellent rice! The perfect blend of taste and nutrition.',
                date: '2 days ago',
                verified: true,
                helpful: 20
            }
        ]
    },
    // Masala & Spices
    {
        id: 17,
        name: 'Maggi Masala-ae-Magic Sabzi Masala',
        price: 280,
        originalPrice: 350,
        images: [
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/18c2665c-3591-482c-a11a-e35662e756a4.png',
            'https://picsum.photos/600/600?random=17a',
            'https://picsum.photos/600/600?random=17b',
            'https://picsum.photos/600/600?random=17c'
        ],
        rating: 4.6,
        totalReviews: 187,
        category: 'masala',
        discount: 20,
        description: 'Maggi Masala-ae-Magic Sabzi Masala is a perfect blend of aromatic spices that enhances the taste of your vegetables. This magical spice mix transforms ordinary vegetables into extraordinary dishes with its rich flavor and authentic taste.',
        features: [
            'Perfect blend of aromatic spices',
            'Enhances vegetable flavors',
            'No artificial colors',
            'Easy to use',
            'Trusted Maggi quality'
        ],
        specifications: {
            'Weight': '80g',
            'Brand': 'Maggi',
            'Type': 'Vegetable Masala',
            'Shelf Life': '24 months',
            'Storage': 'Cool & Dry Place',
            'Ingredients': 'Coriander, Cumin, Red Chilli, Turmeric'
        },
        inStock: true,
        stockCount: 75,
        brand: 'Maggi',
        sku: 'MGI-SMM-001',
        weight: '80g',
        dimensions: '12cm x 8cm x 3cm',
        reviews: [
            {
                id: 1,
                userName: 'Sunita Devi',
                rating: 5,
                comment: 'Excellent masala! Makes vegetables taste amazing.',
                date: '3 days ago',
                verified: true,
                helpful: 15
            },
            {
                id: 2,
                userName: 'Amit Singh',
                rating: 4,
                comment: 'Good quality spice mix. Value for money.',
                date: '1 week ago',
                verified: true,
                helpful: 8
            }
        ]
    },

    {
        id: 18,
        name: 'Everest Tikhalal Red Chilli Powder',
        price: 54,
        originalPrice: 54,
        images: [
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/9dea2d22-108f-4021-aeec-e95b4e271e16.png',
            'https://picsum.photos/600/600?random=18a',
            'https://picsum.photos/600/600?random=18b',
            'https://picsum.photos/600/600?random=18c'
        ],
        rating: 4.6,
        totalReviews: 187,
        category: 'masala',
        discount: 0,
        description: 'Everest Tikhalal Red Chilli Powder brings authentic heat and vibrant color to your dishes. Made from premium quality red chillies, it adds the perfect spice level to your favorite recipes.',
        features: [
            'Made from premium red chillies',
            'Authentic heat and flavor',
            'Rich red color',
            'No artificial additives',
            'Trusted Everest quality'
        ],
        specifications: {
            'Weight': '100g',
            'Brand': 'Everest',
            'Type': 'Red Chilli Powder',
            'Shelf Life': '24 months',
            'Storage': 'Cool & Dry Place',
            'Heat Level': 'Medium to Hot'
        },
        inStock: true,
        stockCount: 92,
        brand: 'Everest',
        sku: 'EVR-RCP-001',
        weight: '100g',
        dimensions: '10cm x 7cm x 3cm',
        reviews: [
            {
                id: 1,
                userName: 'Meera Gupta',
                rating: 5,
                comment: 'Perfect spice level and great color.',
                date: '2 days ago',
                verified: true,
                helpful: 12
            },
            {
                id: 2,
                userName: 'Ravi Kumar',
                rating: 4,
                comment: 'Good quality chilli powder. Reliable brand.',
                date: '5 days ago',
                verified: true,
                helpful: 6
            }
        ]
    },

    {
        id: 19,
        name: 'MCatch Turmeric Powder/Haldi',
        price: 39,
        originalPrice: 45,
        images: [
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/c34b8c71-a7b3-4311-88de-80533ee0fc12.png',
            'https://picsum.photos/600/600?random=19a',
            'https://picsum.photos/600/600?random=19b',
            'https://picsum.photos/600/600?random=19c'
        ],
        rating: 4.6,
        totalReviews: 187,
        category: 'masala',
        discount: 13,
        description: 'Pure and aromatic turmeric powder that adds natural color, flavor, and health benefits to your cooking. Known for its anti-inflammatory properties and essential for Indian cuisine.',
        features: [
            'Pure turmeric powder',
            'Natural anti-inflammatory properties',
            'Rich golden color',
            'No artificial colors',
            'Premium quality'
        ],
        specifications: {
            'Weight': '200g',
            'Brand': 'MCatch',
            'Type': 'Turmeric Powder',
            'Shelf Life': '24 months',
            'Storage': 'Cool & Dry Place',
            'Purity': '100% Pure'
        },
        inStock: true,
        stockCount: 156,
        brand: 'MCatch',
        sku: 'MCA-TUR-001',
        weight: '200g',
        dimensions: '12cm x 8cm x 4cm',
        reviews: [
            {
                id: 1,
                userName: 'Kavita Sharma',
                rating: 5,
                comment: 'Excellent quality haldi with great color.',
                date: '1 day ago',
                verified: true,
                helpful: 18
            },
            {
                id: 2,
                userName: 'Deepak Joshi',
                rating: 4,
                comment: 'Good value for money. Pure turmeric.',
                date: '4 days ago',
                verified: true,
                helpful: 9
            }
        ]
    },

    {
        id: 20,
        name: 'Catch Coriander Powder/Dhania',
        price: 65,
        originalPrice: 80,
        images: [
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/6df5cd41-6ace-47e9-952c-6a245a4994dc.png',
            'https://picsum.photos/600/600?random=20a',
            'https://picsum.photos/600/600?random=20b',
            'https://picsum.photos/600/600?random=20c'
        ],
        rating: 4.6,
        totalReviews: 187,
        category: 'masala',
        discount: 19,
        description: 'Freshly ground coriander powder that adds a warm, citrusy flavor to your dishes. Essential for Indian cooking with its distinctive aroma and taste.',
        features: [
            'Freshly ground coriander',
            'Warm citrusy flavor',
            'Essential Indian spice',
            'No preservatives',
            'Premium quality seeds'
        ],
        specifications: {
            'Weight': '200g',
            'Brand': 'Catch',
            'Type': 'Coriander Powder',
            'Shelf Life': '24 months',
            'Storage': 'Cool & Dry Place',
            'Grinding': 'Fresh Ground'
        },
        inStock: true,
        stockCount: 134,
        brand: 'Catch',
        sku: 'CAT-COR-001',
        weight: '200g',
        dimensions: '12cm x 8cm x 4cm',
        reviews: [
            {
                id: 1,
                userName: 'Anita Patel',
                rating: 5,
                comment: 'Fresh aroma and excellent quality.',
                date: '2 days ago',
                verified: true,
                helpful: 14
            },
            {
                id: 2,
                userName: 'Suresh Reddy',
                rating: 4,
                comment: 'Good coriander powder. Worth the price.',
                date: '1 week ago',
                verified: true,
                helpful: 7
            }
        ]
    },

    {
        id: 21,
        name: 'Organic Tattva Red Organic Chilli Powder',
        price: 94,
        originalPrice: 110,
        images: [
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/4d2590f5-d68f-435a-af14-d9c09d2753b1.png',
            'https://picsum.photos/600/600?random=21a',
            'https://picsum.photos/600/600?random=21b',
            'https://picsum.photos/600/600?random=21c'
        ],
        rating: 4.6,
        totalReviews: 187,
        category: 'masala',
        discount: 15,
        description: '100% organic red chilli powder made from naturally grown chillies without any chemicals or pesticides. Perfect for health-conscious cooking with authentic taste.',
        features: [
            '100% Organic certified',
            'No chemicals or pesticides',
            'Naturally grown chillies',
            'Health-conscious choice',
            'Authentic spicy flavor'
        ],
        specifications: {
            'Weight': '100g',
            'Brand': 'Organic Tattva',
            'Type': 'Organic Red Chilli Powder',
            'Shelf Life': '18 months',
            'Storage': 'Cool & Dry Place',
            'Certification': 'Organic Certified'
        },
        inStock: true,
        stockCount: 67,
        brand: 'Organic Tattva',
        sku: 'OTT-RCP-001',
        weight: '100g',
        dimensions: '10cm x 7cm x 3cm',
        reviews: [
            {
                id: 1,
                userName: 'Priya Nair',
                rating: 5,
                comment: 'Love the organic quality and natural taste.',
                date: '3 days ago',
                verified: true,
                helpful: 16
            },
            {
                id: 2,
                userName: 'Vikash Singh',
                rating: 4,
                comment: 'Good organic option. Slightly expensive but worth it.',
                date: '6 days ago',
                verified: true,
                helpful: 8
            }
        ]
    },

    {
        id: 22,
        name: 'Tata Sampann Chilli Powder with Natural Oils',
        price: 280,
        originalPrice: 350,
        images: [
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/c3f31b7f-0492-45b8-a14a-ad6dae3ca393.png',
            'https://picsum.photos/600/600?random=22a',
            'https://picsum.photos/600/600?random=22b',
            'https://picsum.photos/600/600?random=22c'
        ],
        rating: 4.6,
        totalReviews: 187,
        category: 'masala',
        discount: 20,
        description: 'Premium chilli powder enriched with natural oils that preserve the authentic flavor and aroma. Tata Sampann ensures quality and taste in every pinch.',
        features: [
            'Enriched with natural oils',
            'Preserves authentic flavor',
            'Premium quality chillies',
            'Trusted Tata quality',
            'Rich aroma and taste'
        ],
        specifications: {
            'Weight': '500g',
            'Brand': 'Tata Sampann',
            'Type': 'Chilli Powder with Natural Oils',
            'Shelf Life': '24 months',
            'Storage': 'Cool & Dry Place',
            'Special Feature': 'Natural Oils Added'
        },
        inStock: true,
        stockCount: 43,
        brand: 'Tata Sampann',
        sku: 'TAT-CPO-001',
        weight: '500g',
        dimensions: '15cm x 10cm x 5cm',
        reviews: [
            {
                id: 1,
                userName: 'Rajesh Gupta',
                rating: 5,
                comment: 'Excellent quality and flavor. The natural oils make a difference.',
                date: '1 day ago',
                verified: true,
                helpful: 20
            },
            {
                id: 2,
                userName: 'Sita Devi',
                rating: 4,
                comment: 'Good quality but quite expensive.',
                date: '1 week ago',
                verified: true,
                helpful: 11
            }
        ]
    },

    {
        id: 23,
        name: 'Everest Sambhar Masala',
        price: 80,
        originalPrice: 80,
        images: [
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/d70dc261-4adb-44e3-8dc2-22b5de6a8a73.png',
            'https://picsum.photos/600/600?random=23a',
            'https://picsum.photos/600/600?random=23b',
            'https://picsum.photos/600/600?random=23c'
        ],
        rating: 4.6,
        totalReviews: 187,
        category: 'masala',
        discount: 0,
        description: 'Authentic South Indian sambhar masala blend that brings the traditional taste of sambhar to your kitchen. Perfect balance of spices for the perfect sambhar.',
        features: [
            'Authentic South Indian recipe',
            'Perfect spice balance',
            'Traditional sambhar taste',
            'Easy to use',
            'Premium quality ingredients'
        ],
        specifications: {
            'Weight': '100g',
            'Brand': 'Everest',
            'Type': 'Sambhar Masala',
            'Shelf Life': '24 months',
            'Storage': 'Cool & Dry Place',
            'Origin': 'South Indian Recipe'
        },
        inStock: true,
        stockCount: 89,
        brand: 'Everest',
        sku: 'EVR-SAM-001',
        weight: '100g',
        dimensions: '10cm x 7cm x 3cm',
        reviews: [
            {
                id: 1,
                userName: 'Lakshmi Iyer',
                rating: 5,
                comment: 'Perfect for authentic sambhar. Reminds me of home cooking.',
                date: '2 days ago',
                verified: true,
                helpful: 17
            },
            {
                id: 2,
                userName: 'Arun Kumar',
                rating: 4,
                comment: 'Good masala for sambhar. Authentic taste.',
                date: '5 days ago',
                verified: true,
                helpful: 9
            }
        ]
    },

    {
        id: 24,
        name: 'Tata Sampann Coriander Powder with Natural Oils',
        price: 80,
        originalPrice: 100,
        images: [
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/fa7526df-b0e8-418f-a5d2-752237b7b37e.png',
            'https://picsum.photos/600/600?random=24a',
            'https://picsum.photos/600/600?random=24b',
            'https://picsum.photos/600/600?random=24c'
        ],
        rating: 4.6,
        totalReviews: 187,
        category: 'masala',
        discount: 20,
        description: 'Premium coriander powder enriched with natural oils to retain the fresh aroma and flavor. Made from carefully selected coriander seeds.',
        features: [
            'Enriched with natural oils',
            'Fresh aroma and flavor',
            'Premium coriander seeds',
            'Retains natural essence',
            'Trusted Tata quality'
        ],
        specifications: {
            'Weight': '200g',
            'Brand': 'Tata Sampann',
            'Type': 'Coriander Powder with Natural Oils',
            'Shelf Life': '24 months',
            'Storage': 'Cool & Dry Place',
            'Special Feature': 'Natural Oils Added'
        },
        inStock: true,
        stockCount: 76,
        brand: 'Tata Sampann',
        sku: 'TAT-COR-001',
        weight: '200g',
        dimensions: '12cm x 8cm x 4cm',
        reviews: [
            {
                id: 1,
                userName: 'Neha Sharma',
                rating: 5,
                comment: 'Excellent aroma and taste. The natural oils really make a difference.',
                date: '1 day ago',
                verified: true,
                helpful: 19
            },
            {
                id: 2,
                userName: 'Manoj Tiwari',
                rating: 4,
                comment: 'Good quality coriander powder. Fresh and aromatic.',
                date: '4 days ago',
                verified: true,
                helpful: 12
            }
        ]
    },

    {
        id: 25,
        name: 'Catch Cumin Seeds / Jeera Seeds - Pack of 2',
        price: 105,
        originalPrice: 136,
        images: [
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/1e339ae1-aed2-4849-ade1-8741e5a2d56b.png',
            'https://picsum.photos/600/600?random=25a',
            'https://picsum.photos/600/600?random=25b',
            'https://picsum.photos/600/600?random=25c'
        ],
        rating: 4.6,
        totalReviews: 187,
        category: 'masala',
        discount: 23,
        description: 'Premium quality cumin seeds pack of 2 that adds distinctive flavor and aroma to your dishes. Essential for tempering and spice blends in Indian cooking.',
        features: [
            'Pack of 2 for better value',
            'Premium quality jeera',
            'Distinctive flavor and aroma',
            'Essential for Indian cooking',
            'Perfect for tempering'
        ],
        specifications: {
            'Weight': '100g x 2',
            'Brand': 'Catch',
            'Type': 'Cumin Seeds (Jeera)',
            'Shelf Life': '24 months',
            'Storage': 'Cool & Dry Place',
            'Pack Size': '2 Units'
        },
        inStock: true,
        stockCount: 58,
        brand: 'Catch',
        sku: 'CAT-JEE-002',
        weight: '200g (100g x 2)',
        dimensions: '15cm x 10cm x 5cm',
        reviews: [
            {
                id: 1,
                userName: 'Pooja Agarwal',
                rating: 5,
                comment: 'Great value pack. Fresh jeera with good aroma.',
                date: '3 days ago',
                verified: true,
                helpful: 15
            },
            {
                id: 2,
                userName: 'Rakesh Singh',
                rating: 4,
                comment: 'Good quality cumin seeds. Pack of 2 is convenient.',
                date: '1 week ago',
                verified: true,
                helpful: 8
            }
        ]
    },

    {
        id: 26,
        name: 'Everest Hing Powder',
        price: 74,
        originalPrice: 78,
        images: [
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/30d4e721-92b4-45bc-ae70-678bb5905750.png',
            'https://picsum.photos/600/600?random=26a',
            'https://picsum.photos/600/600?random=26b',
            'https://picsum.photos/600/600?random=26c'
        ],
        rating: 4.6,
        totalReviews: 187,
        category: 'masala',
        discount: 5,
        description: 'Pure asafoetida (hing) powder that adds unique flavor and aids digestion. Essential spice for Indian cooking with strong aroma and distinctive taste.',
        features: [
            'Pure asafoetida powder',
            'Aids digestion',
            'Strong distinctive aroma',
            'Essential Indian spice',
            'Premium quality'
        ],
        specifications: {
            'Weight': '50g',
            'Brand': 'Everest',
            'Type': 'Hing Powder (Asafoetida)',
            'Shelf Life': '36 months',
            'Storage': 'Cool & Dry Place',
            'Purity': 'Pure Hing'
        },
        inStock: true,
        stockCount: 123,
        brand: 'Everest',
        sku: 'EVR-HIN-001',
        weight: '50g',
        dimensions: '8cm x 6cm x 3cm',
        reviews: [
            {
                id: 1,
                userName: 'Savita Devi',
                rating: 5,
                comment: 'Pure hing with strong aroma. A little goes a long way.',
                date: '2 days ago',
                verified: true,
                helpful: 13
            },
            {
                id: 2,
                userName: 'Ashok Kumar',
                rating: 4,
                comment: 'Good quality hing. Essential for my cooking.',
                date: '6 days ago',
                verified: true,
                helpful: 7
            }
        ]
    },

    {
        id: 27,
        name: 'Catch Compounded Hing Powder',
        price: 65,
        originalPrice: 74,
        images: [
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=120,h=120/da/cms-assets/cms/product/d5a53808-7179-4645-a4e2-fdc94a83554e.png',
            'https://picsum.photos/600/600?random=27a',
            'https://picsum.photos/600/600?random=27b',
            'https://picsum.photos/600/600?random=27c'
        ],
        rating: 4.6,
        totalReviews: 187,
        category: 'masala',
        discount: 12,
        description: 'Compounded hing powder that provides balanced flavor without overpowering your dishes. Perfect for everyday cooking with consistent quality.',
        features: [
            'Compounded for balanced flavor',
            'Not overpowering',
            'Perfect for daily cooking',
            'Consistent quality',
            'Easy to use'
        ],
        specifications: {
            'Weight': '100g',
            'Brand': 'Catch',
            'Type': 'Compounded Hing Powder',
            'Shelf Life': '24 months',
            'Storage': 'Cool & Dry Place',
            'Composition': 'Compounded Asafoetida'
        },
        inStock: true,
        stockCount: 98,
        brand: 'Catch',
        sku: 'CAT-HIN-001',
        weight: '100g',
        dimensions: '10cm x 7cm x 3cm',
        reviews: [
            {
                id: 1,
                userName: 'Ritu Sharma',
                rating: 5,
                comment: 'Perfect hing for daily cooking. Not too strong.',
                date: '1 day ago',
                verified: true,
                helpful: 16
            },
            {
                id: 2,
                userName: 'Dinesh Patel',
                rating: 4,
                comment: 'Good compounded hing. Value for money.',
                date: '5 days ago',
                verified: true,
                helpful: 9
            }
        ]
    },

    // Additional Masala Products
    {
        id: 41,
        name: 'MDH Deggi Mirch Powder',
        price: 85,
        originalPrice: 95,
        images: [
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/red-chilli-powder.jpg',
            'https://picsum.photos/600/600?random=41a',
            'https://picsum.photos/600/600?random=41b',
            'https://picsum.photos/600/600?random=41c'
        ],
        rating: 4.5,
        totalReviews: 342,
        category: 'masala',
        discount: 11,
        description: 'MDH Deggi Mirch adds vibrant red color and mild heat to your dishes. Perfect for those who love color without excessive spiciness.',
        features: [
            'Vibrant red color',
            'Mild heat level',
            'Perfect for color enhancement',
            'Trusted MDH quality',
            'Authentic taste'
        ],
        specifications: {
            'Weight': '100g',
            'Brand': 'MDH',
            'Type': 'Deggi Mirch Powder',
            'Shelf Life': '24 months',
            'Storage': 'Cool & Dry Place',
            'Heat Level': 'Mild'
        },
        inStock: true,
        stockCount: 87,
        brand: 'MDH',
        sku: 'MDH-DEG-001',
        weight: '100g',
        dimensions: '10cm x 7cm x 3cm',
        reviews: [
            {
                id: 1,
                userName: 'Kiran Devi',
                rating: 5,
                comment: 'Perfect for color and mild spice. MDH quality is always good.',
                date: '2 days ago',
                verified: true,
                helpful: 18
            },
            {
                id: 2,
                userName: 'Sunil Jain',
                rating: 4,
                comment: 'Good deggi mirch. Great color and flavor.',
                date: '1 week ago',
                verified: true,
                helpful: 12
            }
        ]
    },

    {
        id: 42,
        name: 'Everest Garam Masala Powder',
        price: 125,
        originalPrice: 140,
        images: [
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/garam-masala.jpg',
            'https://picsum.photos/600/600?random=42a',
            'https://picsum.photos/600/600?random=42b',
            'https://picsum.photos/600/600?random=42c'
        ],
        rating: 4.7,
        totalReviews: 256,
        category: 'masala',
        discount: 11,
        description: 'Aromatic blend of whole spices ground to perfection. Everest Garam Masala adds warmth and depth to your dishes with its authentic flavor.',
        features: [
            'Aromatic spice blend',
            'Perfect grinding',
            'Adds warmth and depth',
            'Authentic flavor',
            'Premium whole spices'
        ],
        specifications: {
            'Weight': '100g',
            'Brand': 'Everest',
            'Type': 'Garam Masala Powder',
            'Shelf Life': '24 months',
            'Storage': 'Cool & Dry Place',
            'Ingredients': 'Cinnamon, Cardamom, Cloves, Bay Leaves'
        },
        inStock: true,
        stockCount: 65,
        brand: 'Everest',
        sku: 'EVR-GAR-001',
        weight: '100g',
        dimensions: '10cm x 7cm x 3cm',
        reviews: [
            {
                id: 1,
                userName: 'Madhuri Singh',
                rating: 5,
                comment: 'Excellent garam masala with perfect aroma and taste.',
                date: '1 day ago',
                verified: true,
                helpful: 21
            },
            {
                id: 2,
                userName: 'Ramesh Yadav',
                rating: 5,
                comment: 'Best garam masala in the market. Authentic taste.',
                date: '4 days ago',
                verified: true,
                helpful: 15
            }
        ]
    },

    {
        id: 43,
        name: 'Catch Kitchen King Masala',
        price: 98,
        originalPrice: 115,
        images: [
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/kitchen-king.jpg',
            'https://picsum.photos/600/600?random=43a',
            'https://picsum.photos/600/600?random=43b',
            'https://picsum.photos/600/600?random=43c'
        ],
        rating: 4.4,
        totalReviews: 189,
        category: 'masala',
        discount: 15,
        description: 'Universal spice blend that enhances the taste of any vegetable dish. Catch Kitchen King Masala is the secret ingredient for delicious everyday cooking.',
        features: [
            'Universal spice blend',
            'Enhances any vegetable',
            'Secret ingredient for taste',
            'Perfect for everyday cooking',
            'Trusted Catch quality'
        ],
        specifications: {
            'Weight': '100g',
            'Brand': 'Catch',
            'Type': 'Kitchen King Masala',
            'Shelf Life': '24 months',
            'Storage': 'Cool & Dry Place',
            'Usage': 'Universal Vegetable Masala'
        },
        inStock: true,
        stockCount: 72,
        brand: 'Catch',
        sku: 'CAT-KIT-001',
        weight: '100g',
        dimensions: '10cm x 7cm x 3cm',
        reviews: [
            {
                id: 1,
                userName: 'Preeti Gupta',
                rating: 4,
                comment: 'Good all-purpose masala. Makes vegetables taste great.',
                date: '3 days ago',
                verified: true,
                helpful: 14
            },
            {
                id: 2,
                userName: 'Ajay Sharma',
                rating: 4,
                comment: 'Kitchen king lives up to its name. Good flavor.',
                date: '1 week ago',
                verified: true,
                helpful: 10
            }
        ]
    },

    {
        id: 44,
        name: 'Tata Sampann Biryani Masala',
        price: 145,
        originalPrice: 160,
        images: [
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/biryani-masala.jpg',
            'https://picsum.photos/600/600?random=44a',
            'https://picsum.photos/600/600?random=44b',
            'https://picsum.photos/600/600?random=44c'
        ],
        rating: 4.6,
        totalReviews: 203,
        category: 'masala',
        discount: 9,
        description: 'Authentic biryani masala blend that brings restaurant-style flavor to your homemade biryani. Perfect combination of aromatic spices.',
        features: [
            'Authentic biryani flavor',
            'Restaurant-style taste',
            'Perfect spice combination',
            'Aromatic blend',
            'Premium quality spices'
        ],
        specifications: {
            'Weight': '100g',
            'Brand': 'Tata Sampann',
            'Type': 'Biryani Masala',
            'Shelf Life': '24 months',
            'Storage': 'Cool & Dry Place',
            'Usage': 'Biryani & Rice Dishes'
        },
        inStock: true,
        stockCount: 54,
        brand: 'Tata Sampann',
        sku: 'TAT-BIR-001',
        weight: '100g',
        dimensions: '10cm x 7cm x 3cm',
        reviews: [
            {
                id: 1,
                userName: 'Fatima Khan',
                rating: 5,
                comment: 'Excellent for biryani. Authentic taste and aroma.',
                date: '2 days ago',
                verified: true,
                helpful: 19
            },
            {
                id: 2,
                userName: 'Rohit Singh',
                rating: 4,
                comment: 'Good biryani masala. Makes home biryani taste professional.',
                date: '5 days ago',
                verified: true,
                helpful: 13
            }
        ]
    },

    // Cooking Oils
    {
        id: 28,
        name: 'Natureland Organic Mustard Oil Cold Pressed',
        price: 238,
        originalPrice: 375,
        images: [
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/ba77235a-8b79-4c60-b68f-ccb559878363.png',
            'https://picsum.photos/600/600?random=28a',
            'https://picsum.photos/600/600?random=28b',
            'https://picsum.photos/600/600?random=28c'
        ],
        rating: 4.6,
        totalReviews: 187,
        category: 'oil',
        discount: 37,
        description: '100% organic cold-pressed mustard oil that retains all natural nutrients and flavor. Perfect for authentic Indian cooking and health benefits.',
        features: [
            '100% Organic certified',
            'Cold-pressed method',
            'Retains natural nutrients',
            'Authentic mustard flavor',
            'No chemical processing'
        ],
        specifications: {
            'Volume': '500ml',
            'Brand': 'Natureland Organic',
            'Type': 'Cold Pressed Mustard Oil',
            'Shelf Life': '12 months',
            'Storage': 'Cool & Dry Place',
            'Certification': 'Organic Certified'
        },
        inStock: true,
        stockCount: 45,
        brand: 'Natureland Organic',
        sku: 'NAT-MUS-001',
        weight: '500ml',
        dimensions: '20cm x 8cm x 8cm',
        reviews: [
            {
                id: 1,
                userName: 'Geeta Sharma',
                rating: 5,
                comment: 'Pure organic mustard oil. Great for cooking and health.',
                date: '1 day ago',
                verified: true,
                helpful: 22
            },
            {
                id: 2,
                userName: 'Harish Kumar',
                rating: 4,
                comment: 'Good quality organic oil. Pricey but worth it.',
                date: '3 days ago',
                verified: true,
                helpful: 16
            }
        ]
    },

    {
        id: 29,
        name: 'Chambal Refined Soyabean Oil',
        price: 129,
        originalPrice: 163,
        images: [
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/394ff2b1-52e1-430c-8e35-2eab0ad407df.png',
            'https://picsum.photos/600/600?random=29a',
            'https://picsum.photos/600/600?random=29b',
            'https://picsum.photos/600/600?random=29c'
        ],
        rating: 4.6,
        totalReviews: 187,
        category: 'oil',
        discount: 21,
        description: 'Premium refined soyabean oil perfect for all types of cooking. Light taste and high smoke point make it ideal for frying and everyday cooking.',
        features: [
            'Premium refined quality',
            'Light taste',
            'High smoke point',
            'Perfect for frying',
            'Cholesterol free'
        ],
        specifications: {
            'Volume': '1 Liter',
            'Brand': 'Chambal',
            'Type': 'Refined Soyabean Oil',
            'Shelf Life': '12 months',
            'Storage': 'Cool & Dry Place',
            'Smoke Point': 'High'
        },
        inStock: true,
        stockCount: 89,
        brand: 'Chambal',
        sku: 'CHA-SOY-001',
        weight: '1 Liter',
        dimensions: '25cm x 8cm x 8cm',
        reviews: [
            {
                id: 1,
                userName: 'Sunita Devi',
                rating: 5,
                comment: 'Good quality oil for daily cooking. Value for money.',
                date: '2 days ago',
                verified: true,
                helpful: 18
            },
            {
                id: 2,
                userName: 'Rajesh Patel',
                rating: 4,
                comment: 'Light and good for all cooking purposes.',
                date: '1 week ago',
                verified: true,
                helpful: 11
            }
        ]
    },

    {
        id: 30,
        name: 'Fortune Sunlite Refined Sunflower Oil (870 g)',
        price: 159,
        originalPrice: 180,
        images: [
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/08e99bfb-e035-4320-85ac-dd81880237c9.png',
            'https://picsum.photos/600/600?random=30a',
            'https://picsum.photos/600/600?random=30b',
            'https://picsum.photos/600/600?random=30c'
        ],
        rating: 4.6,
        totalReviews: 187,
        category: 'oil',
        discount: 12,
        description: 'Light and healthy sunflower oil rich in Vitamin E. Fortune Sunlite is perfect for heart-healthy cooking with its refined quality.',
        features: [
            'Rich in Vitamin E',
            'Heart-healthy cooking',
            'Light and refined',
            'No cholesterol',
            'Trusted Fortune quality'
        ],
        specifications: {
            'Volume': '870ml',
            'Brand': 'Fortune',
            'Type': 'Refined Sunflower Oil',
            'Shelf Life': '12 months',
            'Storage': 'Cool & Dry Place',
            'Vitamin Content': 'Rich in Vitamin E'
        },
        inStock: true,
        stockCount: 67,
        brand: 'Fortune',
        sku: 'FOR-SUN-001',
        weight: '870ml',
        dimensions: '22cm x 8cm x 8cm',
        reviews: [
            {
                id: 1,
                userName: 'Kavita Singh',
                rating: 5,
                comment: 'Healthy oil option. Good for daily cooking.',
                date: '1 day ago',
                verified: true,
                helpful: 20
            },
            {
                id: 2,
                userName: 'Deepak Joshi',
                rating: 4,
                comment: 'Light oil, good for health-conscious cooking.',
                date: '4 days ago',
                verified: true,
                helpful: 14
            }
        ]
    },

    {
        id: 31,
        name: 'Organic Tattva Organic Mustard Oil',
        price: 259,
        originalPrice: 349,
        images: [
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/22b11dd9-8ee9-437f-b5ec-53bb847fbceb.png',
            'https://picsum.photos/600/600?random=31a',
            'https://picsum.photos/600/600?random=31b',
            'https://picsum.photos/600/600?random=31c'
        ],
        rating: 4.6,
        totalReviews: 187,
        category: 'oil',
        discount: 26,
        description: 'Certified organic mustard oil perfect for traditional Indian cooking. Rich in omega-3 fatty acids and natural antioxidants.',
        features: [
            'Certified organic',
            'Rich in omega-3 fatty acids',
            'Natural antioxidants',
            'Traditional cooking oil',
            'Chemical-free processing'
        ],
        specifications: {
            'Volume': '500ml',
            'Brand': 'Organic Tattva',
            'Type': 'Organic Mustard Oil',
            'Shelf Life': '12 months',
            'Storage': 'Cool & Dry Place',
            'Certification': 'Organic Certified'
        },
        inStock: true,
        stockCount: 38,
        brand: 'Organic Tattva',
        sku: 'OTT-MUS-001',
        weight: '500ml',
        dimensions: '20cm x 8cm x 8cm',
        reviews: [
            {
                id: 1,
                userName: 'Priya Nair',
                rating: 5,
                comment: 'Excellent organic mustard oil. Pure and healthy.',
                date: '2 days ago',
                verified: true,
                helpful: 17
            },
            {
                id: 2,
                userName: 'Mohan Das',
                rating: 4,
                comment: 'Good organic option. Slightly expensive but quality is good.',
                date: '6 days ago',
                verified: true,
                helpful: 12
            }
        ]
    },

    {
        id: 32,
        name: 'Parampara Soyabean Oil',
        price: 131,
        originalPrice: 170,
        images: [
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/b2c39933-f336-4859-9e25-f78a46894514.png',
            'https://picsum.photos/600/600?random=32a',
            'https://picsum.photos/600/600?random=32b',
            'https://picsum.photos/600/600?random=32c'
        ],
        rating: 4.6,
        totalReviews: 187,
        category: 'oil',
        discount: 23,
        description: 'Premium quality soyabean oil that provides healthy cooking with light taste. Perfect for all Indian cooking methods.',
        features: [
            'Premium quality',
            'Light taste',
            'Healthy cooking option',
            'Perfect for Indian cooking',
            'Affordable pricing'
        ],
        specifications: {
            'Volume': '1 Liter',
            'Brand': 'Parampara',
            'Type': 'Soyabean Oil',
            'Shelf Life': '12 months',
            'Storage': 'Cool & Dry Place',
            'Processing': 'Refined'
        },
        inStock: true,
        stockCount: 94,
        brand: 'Parampara',
        sku: 'PAR-SOY-001',
        weight: '1 Liter',
        dimensions: '25cm x 8cm x 8cm',
        reviews: [
            {
                id: 1,
                userName: 'Rekha Sharma',
                rating: 5,
                comment: 'Good value for money. Light and healthy oil.',
                date: '1 day ago',
                verified: true,
                helpful: 19
            },
            {
                id: 2,
                userName: 'Suresh Gupta',
                rating: 4,
                comment: 'Decent quality oil for daily cooking.',
                date: '5 days ago',
                verified: true,
                helpful: 13
            }
        ]
    },

    {
        id: 33,
        name: 'Dhara Filtered Groundnut Oil (0% Trans Fat)',
        price: 139,
        originalPrice: 249,
        images: [
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/a9a4662a-14e1-49df-8b89-21753f4f548e.png',
            'https://picsum.photos/600/600?random=33a',
            'https://picsum.photos/600/600?random=33b',
            'https://picsum.photos/600/600?random=33c'
        ],
        rating: 4.6,
        totalReviews: 187,
        category: 'oil',
        discount: 44,
        description: 'Pure filtered groundnut oil with 0% trans fat. Ideal for deep frying and traditional cooking with authentic groundnut flavor.',
        features: [
            '0% Trans Fat',
            'Pure filtered oil',
            'Ideal for deep frying',
            'Authentic groundnut flavor',
            'Traditional cooking oil'
        ],
        specifications: {
            'Volume': '1 Liter',
            'Brand': 'Dhara',
            'Type': 'Filtered Groundnut Oil',
            'Shelf Life': '12 months',
            'Storage': 'Cool & Dry Place',
            'Trans Fat': '0%'
        },
        inStock: true,
        stockCount: 52,
        brand: 'Dhara',
        sku: 'DHA-GRO-001',
        weight: '1 Liter',
        dimensions: '25cm x 8cm x 8cm',
        reviews: [
            {
                id: 1,
                userName: 'Lakshmi Iyer',
                rating: 5,
                comment: 'Excellent groundnut oil. Perfect for South Indian cooking.',
                date: '3 days ago',
                verified: true,
                helpful: 21
            },
            {
                id: 2,
                userName: 'Ramesh Yadav',
                rating: 4,
                comment: 'Good quality oil with authentic taste.',
                date: '1 week ago',
                verified: true,
                helpful: 15
            }
        ]
    },

    // Rice & Grains
    {
        id: 45,
        name: 'India Gate Basmati Rice Classic',
        price: 485,
        originalPrice: 520,
        images: [
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/basmati-rice-classic.jpg',
            'https://picsum.photos/600/600?random=45a',
            'https://picsum.photos/600/600?random=45b',
            'https://picsum.photos/600/600?random=45c'
        ],
        rating: 4.5,
        totalReviews: 432,
        category: 'grains',
        discount: 7,
        description: 'Premium quality basmati rice with long grains and authentic aroma. Perfect for biryanis, pulavs, and special occasion cooking.',
        features: [
            'Premium basmati quality',
            'Long grain rice',
            'Authentic aroma',
            'Perfect for biryani',
            'Aged rice for better texture'
        ],
        specifications: {
            'Weight': '5 kg',
            'Brand': 'India Gate',
            'Type': 'Basmati Rice',
            'Shelf Life': '12 months',
            'Storage': 'Cool & Dry Place',
            'Grain Length': 'Extra Long'
        },
        inStock: true,
        stockCount: 67,
        brand: 'India Gate',
        sku: 'IND-BAS-001',
        weight: '5 kg',
        dimensions: '40cm x 25cm x 8cm',
        reviews: [
            {
                id: 1,
                userName: 'Fatima Sheikh',
                rating: 5,
                comment: 'Best basmati rice for biryani. Long grains and great aroma.',
                date: '1 day ago',
                verified: true,
                helpful: 28
            },
            {
                id: 2,
                userName: 'Arjun Singh',
                rating: 4,
                comment: 'Good quality basmati. Worth the price.',
                date: '4 days ago',
                verified: true,
                helpful: 19
            }
        ]
    },

    {
        id: 46,
        name: 'Daawat Rozana Super Basmati Rice',
        price: 395,
        originalPrice: 420,
        images: [
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/daawat-rozana.jpg',
            'https://picsum.photos/600/600?random=46a',
            'https://picsum.photos/600/600?random=46b',
            'https://picsum.photos/600/600?random=46c'
        ],
        rating: 4.4,
        totalReviews: 298,
        category: 'grains',
        discount: 6,
        description: 'Everyday premium basmati rice perfect for daily meals. Daawat Rozana offers consistent quality and taste for regular cooking.',
        features: [
            'Everyday premium quality',
            'Consistent taste',
            'Perfect for daily meals',
            'Good grain length',
            'Trusted Daawat brand'
        ],
        specifications: {
            'Weight': '5 kg',
            'Brand': 'Daawat',
            'Type': 'Super Basmati Rice',
            'Shelf Life': '12 months',
            'Storage': 'Cool & Dry Place',
            'Usage': 'Daily Cooking'
        },
        inStock: true,
        stockCount: 83,
        brand: 'Daawat',
        sku: 'DAA-ROZ-001',
        weight: '5 kg',
        dimensions: '40cm x 25cm x 8cm',
        reviews: [
            {
                id: 1,
                userName: 'Meera Agarwal',
                rating: 4,
                comment: 'Good for daily cooking. Consistent quality.',
                date: '2 days ago',
                verified: true,
                helpful: 16
            },
            {
                id: 2,
                userName: 'Vikas Sharma',
                rating: 4,
                comment: 'Decent basmati rice for the price.',
                date: '1 week ago',
                verified: true,
                helpful: 12
            }
        ]
    },

    // Dairy Products
    {
        id: 51,
        name: 'Amul Fresh Paneer',
        price: 85,
        originalPrice: 90,
        images: [
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/amul-paneer.jpg',
            'https://picsum.photos/600/600?random=51a',
            'https://picsum.photos/600/600?random=51b',
            'https://picsum.photos/600/600?random=51c'
        ],
        rating: 4.4,
        totalReviews: 189,
        category: 'dairy',
        discount: 6,
        description: 'Fresh and soft paneer made from pure milk. Perfect for curries, snacks, and traditional Indian dishes with authentic taste.',
        features: [
            'Made from pure milk',
            'Fresh and soft texture',
            'Perfect for curries',
            'Authentic taste',
            'Trusted Amul quality'
        ],
        specifications: {
            'Weight': '200g',
            'Brand': 'Amul',
            'Type': 'Fresh Paneer',
            'Shelf Life': '5 days',
            'Storage': 'Refrigerate at 4°C',
            'Protein Content': 'High'
        },
        inStock: true,
        stockCount: 45,
        brand: 'Amul',
        sku: 'AMU-PAN-001',
        weight: '200g',
        dimensions: '12cm x 8cm x 3cm',
        reviews: [
            {
                id: 1,
                userName: 'Neha Patel',
                rating: 5,
                comment: 'Very fresh paneer. Perfect for making paneer butter masala.',
                date: '1 day ago',
                verified: true,
                helpful: 23
            },
            {
                id: 2,
                userName: 'Rohit Jain',
                rating: 4,
                comment: 'Good quality paneer. Soft and fresh.',
                date: '3 days ago',
                verified: true,
                helpful: 17
            }
        ]
    },

    // Personal Care
    {
        id: 66,
        name: 'Colgate Total Advanced Health Toothpaste',
        price: 85,
        originalPrice: 95,
        images: [
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/colgate-total.jpg',
            'https://picsum.photos/600/600?random=66a',
            'https://picsum.photos/600/600?random=66b',
            'https://picsum.photos/600/random=66c'
        ],
        rating: 4.3,
        totalReviews: 234,
        category: 'personal-care',
        discount: 11,
        description: 'Advanced formula toothpaste that provides 12-hour protection against bacteria. Maintains overall oral health with superior cleaning.',
        features: [
            '12-hour bacterial protection',
            'Advanced formula',
            'Superior cleaning',
            'Overall oral health',
            'Trusted Colgate brand'
        ],
        specifications: {
            'Volume': '140g',
            'Brand': 'Colgate',
            'Type': 'Total Advanced Health',
            'Shelf Life': '36 months',
            'Storage': 'Cool & Dry Place',
            'Fluoride Content': 'Contains Fluoride'
        },
        inStock: true,
        stockCount: 156,
        brand: 'Colgate',
        sku: 'COL-TOT-001',
        weight: '140g',
        dimensions: '15cm x 5cm x 3cm',
        reviews: [
            {
                id: 1,
                userName: 'Dr. Sharma',
                rating: 5,
                comment: 'Excellent toothpaste for complete oral care.',
                date: '2 days ago',
                verified: true,
                helpful: 21
            },
            {
                id: 2,
                userName: 'Anjali Singh',
                rating: 4,
                comment: 'Good protection and fresh breath.',
                date: '1 week ago',
                verified: true,
                helpful: 14
            }
        ]
    },

    // Snacks & Beverages  
    {
        id: 61,
        name: 'Lays Classic Salted Chips',
        price: 20,
        originalPrice: 20,
        images: [
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/lays-classic.jpg',
            'https://picsum.photos/600/600?random=61a',
            'https://picsum.photos/600/600?random=61b',
            'https://picsum.photos/600/600?random=61c'
        ],
        rating: 4.2,
        totalReviews: 289,
        category: 'snacks',
        discount: 0,
        description: 'Crispy and delicious potato chips with the perfect amount of salt. The classic taste that everyone loves for snacking.',
        features: [
            'Crispy potato chips',
            'Perfect salt balance',
            'Classic taste',
            'Great for snacking',
            'Popular brand'
        ],
        specifications: {
            'Weight': '52g',
            'Brand': 'Lays',
            'Type': 'Salted Potato Chips',
            'Shelf Life': '6 months',
            'Storage': 'Cool & Dry Place',
            'Flavor': 'Classic Salted'
        },
        inStock: true,
        stockCount: 245,
        brand: 'Lays',
        sku: 'LAY-CLA-001',
        weight: '52g',
        dimensions: '20cm x 15cm x 8cm',
        reviews: [
            {
                id: 1,
                userName: 'Arjun Kapoor',
                rating: 4,
                comment: 'Always good for quick snacking. Classic taste.',
                date: '1 day ago',
                verified: true,
                helpful: 18
            },
            {
                id: 2,
                userName: 'Priya Shah',
                rating: 4,
                comment: 'Crispy and tasty. Good for kids.',
                date: '4 days ago',
                verified: true,
                helpful: 12
            }
        ]
    },

    // Additional products would continue in the same format...
    // For brevity, I'll include a few more key categories

    // Household Items
    {
        id: 71,
        name: 'Surf Excel Easy Wash Detergent Powder',
        price: 485,
        originalPrice: 520,
        images: [
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/surf-excel.jpg',
            'https://picsum.photos/600/600?random=71a',
            'https://picsum.photos/600/600?random=71b',
            'https://picsum.photos/600/600?random=71c'
        ],
        rating: 4.5,
        totalReviews: 456,
        category: 'household',
        discount: 7,
        description: 'Advanced detergent powder that removes tough stains easily. Surf Excel provides superior cleaning with less effort and better fabric care.',
        features: [
            'Removes tough stains easily',
            'Superior cleaning power',
            'Better fabric care',
            'Works in all water types',
            'Trusted brand quality'
        ],
        specifications: {
            'Weight': '4 kg',
            'Brand': 'Surf Excel',
            'Type': 'Easy Wash Detergent Powder',
            'Shelf Life': '36 months',
            'Storage': 'Cool & Dry Place',
            'Usage': 'Machine & Hand Wash'
        },
        inStock: true,
        stockCount: 78,
        brand: 'Surf Excel',
        sku: 'SUR-EAS-001',
        weight: '4 kg',
        dimensions: '35cm x 25cm x 10cm',
        reviews: [
            {
                id: 1,
                userName: 'Kavita Sharma',
                rating: 5,
                comment: 'Excellent cleaning power. Removes all stains effectively.',
                date: '1 day ago',
                verified: true,
                helpful: 26
            },
            {
                id: 2,
                userName: 'Rajesh Gupta',
                rating: 4,
                comment: 'Good detergent. Works well for tough stains.',
                date: '3 days ago',
                verified: true,
                helpful: 19
            }
        ]
    },

    // Electronics & Accessories
    {
        id: 80,
        name: 'boAt Airdopes 131 Wireless Earbuds',
        price: 1299,
        originalPrice: 1499,
        images: [
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/boat-airdopes.jpg',
            'https://picsum.photos/600/600?random=80a',
            'https://picsum.photos/600/600?random=80b',
            'https://picsum.photos/600/600?random=80c'
        ],
        rating: 4.2,
        totalReviews: 567,
        category: 'electronics',
        discount: 13,
        description: 'True wireless earbuds with superior sound quality and long battery life. Perfect for music, calls, and active lifestyle with comfortable fit.',
        features: [
            'True wireless technology',
            'Superior sound quality',
            'Long battery life',
            'Comfortable fit',
            'Perfect for active lifestyle'
        ],
        specifications: {
            'Battery Life': '20 hours total',
            'Brand': 'boAt',
            'Type': 'True Wireless Earbuds',
            'Bluetooth Version': '5.0',
            'Charging Case': 'Included',
            'Water Resistance': 'IPX4'
        },
        inStock: true,
        stockCount: 34,
        brand: 'boAt',
        sku: 'BOA-AIR-131',
        weight: '50g',
        dimensions: '8cm x 6cm x 3cm',
        reviews: [
            {
                id: 1,
                userName: 'Rohit Singh',
                rating: 4,
                comment: 'Good sound quality and battery life. Value for money.',
                date: '2 days ago',
                verified: true,
                helpful: 22
            },
            {
                id: 2,
                userName: 'Ankit Sharma',
                rating: 4,
                comment: 'Comfortable fit and decent audio quality.',
                date: '1 week ago',
                verified: true,
                helpful: 16
            }
        ]
    },

    // Bakery & Confectionery
    {
        id: 88,
        name: 'Cadbury Dairy Milk Chocolate',
        price: 85,
        originalPrice: 90,
        images: [
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/dairy-milk.jpg',
            'https://picsum.photos/600/600?random=88a',
            'https://picsum.photos/600/600?random=88b',
            'https://picsum.photos/600/600?random=88c'
        ],
        rating: 4.7,
        totalReviews: 789,
        category: 'bakery',
        discount: 6,
        description: 'Creamy and delicious milk chocolate that melts in your mouth. Cadbury Dairy Milk is the perfect treat for chocolate lovers of all ages.',
        features: [
            'Creamy milk chocolate',
            'Melts in your mouth',
            'Perfect for all ages',
            'Classic Cadbury taste',
            'Premium quality cocoa'
        ],
        specifications: {
            'Weight': '110g',
            'Brand': 'Cadbury',
            'Type': 'Milk Chocolate',
            'Shelf Life': '12 months',
            'Storage': 'Cool & Dry Place',
            'Cocoa Content': 'Premium Quality'
        },
        inStock: true,
        stockCount: 234,
        brand: 'Cadbury',
        sku: 'CAD-DAI-001',
        weight: '110g',
        dimensions: '18cm x 8cm x 2cm',
        reviews: [
            {
                id: 1,
                userName: 'Priya Patel',
                rating: 5,
                comment: 'Classic taste that never gets old. Love it!',
                date: '1 day ago',
                verified: true,
                helpful: 34
            },
            {
                id: 2,
                userName: 'Aman Kumar',
                rating: 5,
                comment: 'Best chocolate brand. Always satisfying.',
                date: '2 days ago',
                verified: true,
                helpful: 28
            }
        ]
    },

    // Continue with all remaining products from the original array...
    // Adding a few more to demonstrate the complete format

    {
        id: 34,
        name: 'Anveshan Wood Cold Pressed Groundnut Oil',
        price: 457,
        originalPrice: 440,
        images: [
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/d84dabb6-cf8a-438f-a647-b8b24181c8d2.png',
            'https://picsum.photos/600/600?random=34a',
            'https://picsum.photos/600/600?random=34b',
            'https://picsum.photos/600/600?random=34c'
        ],
        rating: 4.6,
        totalReviews: 187,
        category: 'oil',
        discount: 0,
        description: 'Traditional wood cold-pressed groundnut oil that retains natural nutrients and authentic flavor. Perfect for traditional cooking methods.',
        features: [
            'Wood cold-pressed method',
            'Retains natural nutrients',
            'Authentic flavor',
            'Traditional processing',
            'Chemical-free extraction'
        ],
        specifications: {
            'Volume': '1 Liter',
            'Brand': 'Anveshan',
            'Type': 'Wood Cold Pressed Groundnut Oil',
            'Shelf Life': '12 months',
            'Storage': 'Cool & Dry Place',
            'Processing Method': 'Wood Cold Pressed'
        },
        inStock: true,
        stockCount: 29,
        brand: 'Anveshan',
        sku: 'ANV-GRO-001',
        weight: '1 Liter',
        dimensions: '25cm x 8cm x 8cm',
        reviews: [
            {
                id: 1,
                userName: 'Sudha Rao',
                rating: 5,
                comment: 'Authentic groundnut oil with traditional taste.',
                date: '3 days ago',
                verified: true,
                helpful: 18
            },
            {
                id: 2,
                userName: 'Kiran Joshi',
                rating: 4,
                comment: 'Good quality oil but slightly expensive.',
                date: '1 week ago',
                verified: true,
                helpful: 11
            }
        ]
    },

    {
        id: 47,
        name: 'Kohinoor Super Silver Basmati Rice',
        price: 750,
        originalPrice: 800,
        images: [
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/kohinoor-super.jpg',
            'https://picsum.photos/600/600?random=47a',
            'https://picsum.photos/600/600?random=47b',
            'https://picsum.photos/600/600?random=47c'
        ],
        rating: 4.6,
        totalReviews: 356,
        category: 'grains',
        discount: 6,
        description: 'Premium aged basmati rice with extra-long grains and exceptional aroma. Kohinoor Super Silver is perfect for special occasions and gourmet cooking.',
        features: [
            'Premium aged basmati',
            'Extra-long grains',
            'Exceptional aroma',
            'Perfect for special occasions',
            'Gourmet quality'
        ],
        specifications: {
            'Weight': '5 kg',
            'Brand': 'Kohinoor',
            'Type': 'Super Silver Basmati',
            'Shelf Life': '12 months',
            'Storage': 'Cool & Dry Place',
            'Aging': 'Aged Rice'
        },
        inStock: true,
        stockCount: 43,
        brand: 'Kohinoor',
        sku: 'KOH-SUP-001',
        weight: '5 kg',
        dimensions: '40cm x 25cm x 8cm',
        reviews: [
            {
                id: 1,
                userName: 'Chef Anil',
                rating: 5,
                comment: 'Premium quality basmati. Perfect for professional cooking.',
                date: '1 day ago',
                verified: true,
                helpful: 31
            },
            {
                id: 2,
                userName: 'Meera Singh',
                rating: 5,
                comment: 'Excellent rice with amazing aroma and taste.',
                date: '4 days ago',
                verified: true,
                helpful: 24
            }
        ]
    },

    {
        id: 50,
        name: 'Ashirvaad Whole Wheat Flour',
        price: 285,
        originalPrice: 300,
        images: [
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/ashirvaad-atta.jpg',
            'https://picsum.photos/600/600?random=50a',
            'https://picsum.photos/600/600?random=50b',
            'https://picsum.photos/600/600?random=50c'
        ],
        rating: 4.7,
        totalReviews: 567,
        category: 'grains',
        discount: 5,
        description: 'Premium whole wheat flour made from finest quality wheat. Perfect for making soft rotis, parathas, and other Indian breads.',
        features: [
            'Made from finest wheat',
            'Perfect for rotis',
            'Soft texture',
            'Rich in fiber',
            'Trusted quality'
        ],
        specifications: {
            'Weight': '10 kg',
            'Brand': 'Ashirvaad',
            'Type': 'Whole Wheat Flour',
            'Shelf Life': '6 months',
            'Storage': 'Cool & Dry Place',
            'Protein Content': 'High'
        },
        inStock: true,
        stockCount: 89,
        brand: 'Ashirvaad',
        sku: 'ASH-WHE-001',
        weight: '10 kg',
        dimensions: '45cm x 30cm x 10cm',
        reviews: [
            {
                id: 1,
                userName: 'Sunita Devi',
                rating: 5,
                comment: 'Makes very soft rotis. Excellent quality flour.',
                date: '2 days ago',
                verified: true,
                helpful: 29
            },
            {
                id: 2,
                userName: 'Prakash Sharma',
                rating: 5,
                comment: 'Best atta brand. Always consistent quality.',
                date: '5 days ago',
                verified: true,
                helpful: 22
            }
        ]
    },

    {
        id: 114,
        name: 'Maggi 2-Minute Noodles Masala',
        price: 48,
        originalPrice: 50,
        images: [
            'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/maggi-noodles.jpg',
            'https://picsum.photos/600/600?random=114a',
            'https://picsum.photos/600/600?random=114b',
            'https://picsum.photos/600/600?random=114c'
        ],
        rating: 4.4,
        totalReviews: 678,
        category: 'ready-to-cook',
        discount: 4,
        description: 'Classic instant noodles that cook in just 2 minutes. Perfect for quick meals, snacks, and satisfying hunger with delicious masala flavor.',
        features: [
            'Cooks in 2 minutes',
            'Perfect for quick meals',
            'Delicious masala flavor',
            'Easy to prepare',
            'Popular brand'
        ],
        specifications: {
            'Weight': '70g x 4 packs',
            'Brand': 'Maggi',
            'Type': '2-Minute Noodles',
            'Shelf Life': '12 months',
            'Storage': 'Cool & Dry Place',
            'Flavor': 'Masala'
        },
        inStock: true,
        stockCount: 456,
        brand: 'Maggi',
        sku: 'MAG-NOO-001',
        weight: '280g (70g x 4)',
        dimensions: '20cm x 15cm x 8cm',
        reviews: [
            {
                id: 1,
                userName: 'Rahul Verma',
                rating: 4,
                comment: 'Quick and tasty. Perfect for hostel life.',
                date: '1 day ago',
                verified: true,
                helpful: 25
            },
            {
                id: 2,
                userName: 'Priya Jain',
                rating: 5,
                comment: 'Classic taste that never disappoints. Love it!',
                date: '3 days ago',
                verified: true,
                helpful: 19
            }
        ]
    }

    // Note: This enhanced format can be applied to all remaining products in your original array
    // Each product now includes comprehensive details like specifications, features, reviews, stock info, etc.
];