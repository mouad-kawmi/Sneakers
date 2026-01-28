import { createSlice } from '@reduxjs/toolkit';
import { mockBrands, mockHeroSlides } from '../../data/Product';



const initialPromoBanner = {
    title: "Avancez d'un Pas, Obtenez -50%",
    subtitle: "Offre Limitée",
    discount: 50,
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=2000&auto=format&fit=crop",
    gradient: 'linear-gradient(135deg, #FF6B00 0%, #FF8800 100%)',
    productsCount: 3,
    isActive: false,
    selectedProductIds: [] 
};

const initialSpotlight = {
    productId: null, 
    title: "Nike Air Max 97 x Off-White",
    description: "La légende revient. Avec sa bulle d'air visible sur toute la longueur et son design ondulé emblématique, la Air Max 97 x Off-White redéfinit le style urbain pour 2024.",
    highlights: ["Confort optimal", "Design translucide", "Édition limitée"],
    isActive: false
};

const contentSlice = createSlice({
    name: 'content',
    initialState: {
        heroSlides: mockHeroSlides,
        promoBanner: initialPromoBanner,
        brands: mockBrands,
        spotlight: initialSpotlight
    },
    reducers: {
        updateHeroSlide(state, action) {
            const index = state.heroSlides.findIndex(s => s.id === action.payload.id);
            if (index !== -1) {
                state.heroSlides[index] = action.payload;
            }
        },
        updatePromoBanner: (state, action) => {
            state.promoBanner = { ...state.promoBanner, ...action.payload };
        },
        updateSpotlight: (state, action) => {
            state.spotlight = { ...state.spotlight, ...action.payload };
        },
        updateBrand(state, action) {
            const index = state.brands.findIndex(b => b.name === action.payload.originalName);
            if (index !== -1) {
                state.brands[index] = action.payload.data;
            }
        },
        addBrand(state, action) {
            state.brands.push(action.payload);
        },
        deleteBrand(state, action) {
            state.brands = state.brands.filter(b => b.name !== action.payload);
        },
        setContent(state, action) {
            return { ...state, ...action.payload };
        }
    }
});

export const { updateHeroSlide, updatePromoBanner, updateSpotlight, updateBrand, addBrand, deleteBrand, setContent } = contentSlice.actions;
export default contentSlice.reducer;
