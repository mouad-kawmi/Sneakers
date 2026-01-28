

const defaultSizes = [
    { size: 38, stock: 5 },
    { size: 39, stock: 2 },
    { size: 40, stock: 10 },
    { size: 41, stock: 0 },
    { size: 42, stock: 8 },
    { size: 43, stock: 4 },
    { size: 44, stock: 0 },
    { size: 45, stock: 3 }
];

export const mockProducts = [
    {
        id: 1,
        name: 'Nike Air Max 270',
        brand: 'Nike',
        category: 'Men',
        price: 1599,
        image: 'assets/Nike Air max 270 (1).png',
        images: [
            'assets/Nike Air max 270 (1).png',
            'assets/Nike Air max 270 (2).png',
            'assets/Nike Air max 270 (3).png'
        ],
        sizes: defaultSizes
    },

    {
        id: 2, name: 'Adidas Ultraboost 22', brand: 'Adidas', category: 'Men', price: 1899, image: "assets/Adidas Ultraboost 22 (1).png", images: [
            "assets/Adidas Ultraboost 22 (1).png",
            "assets/Adidas Ultraboost 22 (2).png",
            "assets/Adidas Ultraboost 22 (3).png",
        ], sizes: defaultSizes
    },
    {
        id: 3,
        name: 'Jordan 1 Retro High',
        brand: 'Nike',
        category: 'Men',
        price: 2200,
        image: "assets/Jordan 1 Retro High (1).png",
        images: [
            "assets/Jordan 1 Retro High (1).png",
            "assets/Jordan 1 Retro High (2).png",
            "assets/Jordan 1 Retro High (3).png",
        ],
        sizes: defaultSizes
    },
    {
        id: 4,
        name: 'New Balance 550',
        brand: 'New Balance',
        category: 'Men',
        price: 1200,
        image: 'assets/Nike Air Force 1 (1).png',
        images: [
            'assets/Nike Air Force 1 (1).png',
            'assets/Nike Air Force 1 (1).png'
        ],
        sizes: defaultSizes
    },
    { id: 5, name: 'Puma RS-X Bold', brand: 'Puma', category: 'Women', price: 950, image: 'assets/Puma RS-X Bold (1).png', images: ["assets/Puma RS-X Bold (1).png", "assets/Puma RS-X Bold (2).png", "assets/Puma RS-X Bold (3).png"], sizes: defaultSizes },
    { id: 6, name: '530 BUNGEE LACE', brand: 'New Balance', category: 'Kids', price: 750, image: 'assets/530 BUNGEE LACE (1).png', images: ["assets/530 BUNGEE LACE (1).png", "assets/530 BUNGEE LACE (2).png", "assets/530 BUNGEE LACE (3).png"], sizes: defaultSizes },
    {
        id: 7,
        name: 'CHAUSSURE DE RUNNING SUPERNOVA EASE 2 W',
        brand: 'Adidas',
        category: 'Women',
        price: 2100,
        image: 'assets/CHAUSSURE  SUPERNOVA (1).png',
        images: [
            'assets/CHAUSSURE  SUPERNOVA (1).png',
            'assets/CHAUSSURE  SUPERNOVA (2).png',
            'assets/CHAUSSURE  SUPERNOVA (3).png'
        ],
        sizes: defaultSizes
    },
    { id: 8, name: 'Chaussure à scratch Tensaur', brand: 'Adidas', category: 'Kids', price: 750, image: 'assets/Chaussure à scratch Tensaur (1).png', images: ["assets/Chaussure à scratch Tensaur (1).png", "assets/Chaussure à scratch Tensaur (2).png", "assets/Chaussure à scratch Tensaur (3).png"], sizes: defaultSizes },
    { id: 9, name: 'PUMA Rebound V6', brand: 'Puma', category: 'Kids', price: 750, image: 'assets/PUMA Rebound V6 (1).png', images: ["assets/PUMA Rebound V6 (1).png", "assets/PUMA Rebound V6 (2).png", "assets/PUMA Rebound V6 (3).png"], sizes: defaultSizes },
    { id: 10, name: 'Palermo Alpino Unisexe', brand: 'Puma', category: 'Men', price: 1100, image: 'assets/Palermo Alpino Unisexe (1).png', images: ["assets/Palermo Alpino Unisexe (1).png", "assets/Palermo Alpino Unisexe (2).png", "assets/Palermo Alpino Unisexe (3).png"], sizes: defaultSizes },
    { id: 11, name: 'Nike Flex Runner 4', brand: 'Nike', category: 'Kids', price: 1100, image: 'assets/Nike Flex Runner 4 (1).png', images: ["assets/Nike Flex Runner 4 (1).png", "assets/Nike Flex Runner 4 (2).png", "assets/Nike Flex Runner 4 (3).png"], sizes: defaultSizes },
    { id: 12, name: '9060Z chaussures', brand: 'New Balance', category: 'Men', price: 1100, image: 'assets/9060Z chaussures (1).png', images: ["assets/9060Z chaussures (1).png", "assets/9060Z chaussures (2).png", "assets/9060Z chaussures (3).png"], sizes: defaultSizes },
    { id: 13, name: 'Coco Delray chaussures', brand: 'New Balance', category: 'Women', price: 1100, image: 'assets/Coco Delray chaussures (1).png', images: ["assets/Coco Delray chaussures (1).png", "assets/Coco Delray chaussures (2).png", "assets/Coco Delray chaussures (3).png"], sizes: defaultSizes },
    { id: 14, name: 'Air Jordan 1 Mid', brand: 'Nike', category: 'Women', price: 1100, image: 'assets/Air Jordan 1 Mid (1).png', images: ["assets/Air Jordan 1 Mid (1).png", "assets/Air Jordan 1 Mid (2).png", "assets/Air Jordan 1 Mid (3).png"], sizes: defaultSizes },
    { id: 15, name: 'Nike Air Max 270', brand: 'Nike', category: 'Men', price: 1100, image: 'assets/Nike Vomero 18 (1).png', images: ["assets/Nike Vomero 18 (1).png", "assets/Nike Vomero 18 (2).png", "assets/Nike Vomero 18 (3).png"], sizes: defaultSizes },
];

export const mockBrands = [
    { name: 'Nike', count: '124 Products', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', logo: 'assets/nikee.png' },
    { name: 'Adidas', count: '98 Products', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', logo: 'assets/Adidas.png' },
    { name: 'New Balance', count: '45 Products', gradient: 'linear-gradient(135deg, #FF4B4B 0%, #FF9068 100%)', logo: 'assets/newBalence.png' },
    { name: 'Puma', count: '67 Products', gradient: 'linear-gradient(135deg, #FF6B00 0%, #FF8800 100%)', logo: 'assets/puma.png' },
];

export const mockReviews = [
    {
        id: 1,
        productId: 1,
        userName: "Omar B.",
        rating: 5,
        comment: "Had l-paba hiya top! Livraison kant f l-we9t w l-ghda dyalha merye7 b7al kantal walking on clouds.",
        date: "2024-01-10",
        isFeatured: true
    },
    {
        id: 2,
        productId: 2,
        userName: "Yassine K.",
        rating: 4,
        comment: "Style wa3er bezaf, ghi houwa l-pointure jatni chwiya sghira. Men ghir hadchi, kolsi nadi.",
        date: "2024-01-12",
        isFeatured: true
    },
    {
        id: 3,
        productId: 3,
        userName: "Sanaa M.",
        rating: 5,
        comment: "Excellent service après-vente. J'avais un petit souci avec la couleur et ils me l'ont changée rapidement.",
        date: "2024-01-14",
        isFeatured: true
    },
    {
        id: 4,
        productId: 4,
        userName: "Hamza T.",
        rating: 5,
        comment: "Original 100%. Te9der t-tiyeh fihom 3inيك mghmda. Sberdila dima top.",
        date: "2024-01-15",
        isFeatured: false
    }
];


export const mockOrders = [
    {
        id: 'SN-DEMO-01',
        date: new Date().toISOString(),
        status: 'Delivered',
        total: 1599,
        paymentMethod: 'cash',
        items: [
            { 
                id: 1,  
                name: 'Nike Air Max 270', 
                size: 42,  
                quantity: 1, 
                price: 1599,
                image: 'assets/Nike Air max 270 (1).png'  
            }
        ],
        customer: { 
            fullName: 'Ahmed Bennani',
            name: 'Ahmed Bennani', 
            email: 'ahmed.bennani@gmail.com',
            phone: '0612345678',
            address: '123 Rue Mohammed V',
            city: 'Casablanca',
            postalCode: '20000'
        },
        history: [
            {
                status: 'Pending',
                date: new Date(Date.now() - 172800000).toISOString()
            },
            {
                status: 'Processing',
                date: new Date(Date.now() - 86400000).toISOString()
            },
            {
                status: 'Shipped',
                date: new Date(Date.now() - 43200000).toISOString()
            },
            {
                status: 'Delivered',
                date: new Date().toISOString()
            }
        ]
    },
    {
        id: 'SN-DEMO-02',
        date: new Date(Date.now() - 86400000).toISOString(), 
        status: 'Pending',
        total: 1899,
        paymentMethod: 'card',
        items: [
            { 
                id: 2,
                name: 'Adidas Ultraboost 22', 
                size: 40,
                quantity: 1, 
                price: 1899,
                image: 'assets/Adidas Ultraboost 22 (1).png'
            }
        ],
        customer: { 
            fullName: 'Fatima Zahra El Amrani',
            name: 'Fatima Z.', 
            email: 'fatima.zamrani@gmail.com',
            phone: '0698765432',
            address: '45 Boulevard Zerktouni',
            city: 'Rabat',
            postalCode: '10000'
        },
        history: [
            {
                status: 'Pending',
                date: new Date(Date.now() - 86400000).toISOString()
            }
        ]
    },
    {
        id: 'SN-DEMO-03',
        date: new Date(Date.now() - 172800000).toISOString(), 
        status: 'Shipped',
        total: 4300,
        paymentMethod: 'cash',
        items: [
            { 
                id: 3,
                name: 'Jordan 1 Retro High', 
                size: 43,
                quantity: 1, 
                price: 2200,
                image: 'assets/Jordan 1 Retro High (1).png'
            },
            { 
                id: 7,
                name: 'CHAUSSURE DE RUNNING SUPERNOVA EASE 2 W', 
                size: 38,
                quantity: 1, 
                price: 2100,
                image: 'assets/CHAUSSURE  SUPERNOVA (1).png'
            }
        ],
        customer: { 
            fullName: 'Youssef Alaoui',
            name: 'Youssef A.', 
            email: 'youssef.alaoui@outlook.com',
            phone: '0677889900',
            address: '78 Avenue Hassan II',
            city: 'Marrakech',
            postalCode: '40000'
        },
        history: [
            {
                status: 'Pending',
                date: new Date(Date.now() - 259200000).toISOString()
            },
            {
                status: 'Processing',
                date: new Date(Date.now() - 172800000).toISOString()
            },
            {
                status: 'Shipped',
                date: new Date(Date.now() - 86400000).toISOString()
            }
        ]
    }
];

export const mockHeroSlides = [
    {
        id: 1,
        name: 'SUPERNOVA',
        tagline: 'VITESSE & LÉGÈRETÉ',
        description: 'Conçue pour les sprinteurs. Une semelle aérodynamique qui vous propulse vers l\'avant.',
        image: 'assets/hero1.png',
        color: '#38d74dff',
        accent: '#319e3dff'
    },
    {
        id: 2,
        name: 'Palermo',
        tagline: 'STABILITÉ TOTALE',
        description: 'Adhérence maximale sur tous les terrains. Dominez la piste avec assurance.',
        image: 'assets/hero2.png',
        color: '#151b20ff',
        accent: '#e5e7dbff'
    },
    {
        id: 3,
        name: '9060Z',
        tagline: 'CONFORT ABSOLU',
        description: 'Comme marcher sur un nuage. Amorti supérieur pour les longues distances.',
        image: 'assets/hero3.png',
        color: '#2478cdff',
        accent: '#3279cfff'
    }
];