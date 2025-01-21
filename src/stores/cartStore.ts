import { create } from "zustand";
import { devtools } from "zustand/middleware";
import useCartCreate, { CreateCartParams } from "../hooks/useCartCreate";
import useUpdateCartLine, { UpdateCartLineParams } from "../hooks/useUpdateCartLine";
import useCreateCartLine, { CreateCartLineParams } from "../hooks/useAddProductLine";

const ENDPOINT = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ENDPOINT || globalThis?.window.SHOPIFY_STOREFRONT_ENDPOINT;
const TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN || globalThis?.window.SHOPIFY_STOREFRONT_TOKEN;

declare global {
    interface Window {
        SHOPIFY_STOREFRONT_ENDPOINT: string;
        SHOPIFY_STOREFRONT_TOKEN: string;
    }
}

export type CartState = {
    cart: Cart | null;
    email: string;
    isCartOpen: boolean;
    setCartOpen: (open: boolean) => void;
    isLoadingLineItems: boolean;
    setLoadingLineItems: (open: boolean) => void;
    isLoadingShippingMethods: boolean;
    setLoadingShippingMethods: (open: boolean) => void;
    createCart: (params: CreateCartParams) => Promise<void>;
    createCartLine: (params: CreateCartLineParams) => Promise<void>;
    updateCartLines: (params: UpdateCartLineParams) => Promise<void>;
};

// TODO use localStorage to store the cartId between sessions!
// TODO everything multipass | one-click-checkout | insta-checkout
// TODO everything discountCode etc
const useCartStore = create<CartState>()(
    devtools((set, get, store) => ({
        cart: null,
        email: "",
        isCartOpen: false,
        setCartOpen: (open) => set({ isCartOpen: open }),
        isLoadingLineItems: false,
        setLoadingLineItems: (isLoading) => set({ isLoadingLineItems: isLoading }),
        isLoadingShippingMethods: false,
        setLoadingShippingMethods: (isLoading) => set({ isLoadingShippingMethods: isLoading }),
        createCart: async (params) => {
            const createdCart = await useCartCreate(ENDPOINT, TOKEN)(params);
            set({
                cart: createdCart,
                isCartOpen: true,
            });
        },
        createCartLine: async (params) => {
            const updatedCart = await useCreateCartLine(ENDPOINT, TOKEN)(params);
            set({
                cart: updatedCart,
                isCartOpen: true,
            });
        },
        updateCartLines: async (params) => {
            set({ isLoadingLineItems: true });
            const updatedCart = await useUpdateCartLine(ENDPOINT, TOKEN)(params);
            set({
                cart: updatedCart,
                isLoadingLineItems: false,
                isCartOpen: true,
            });
        },
    }))
);

export default useCartStore;
