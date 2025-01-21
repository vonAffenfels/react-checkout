interface Cart {
    id: string;
    lines: Array<CartLine>;
    checkoutUrl: string;
    totalQuantity: number;
    requiresShipping: boolean;
    cost: {
        totalAmount: Price;
        subtotalAmount: Price;
    };
    discountCodes: Array<DiscountCode>;
    attributes: Array<Attribute>;
}

interface CartLineCreateInput {
    merchandiseId: string;
    quantity: number;
    attributes?: Array<Attribute>;
}

type CartLineUpdateInput = CartLineCreateInput & {
    id: string;
};

interface CartLine {
    id: string;
    quantity: number;
    cost: {
        amountPerQuantity: Price;
        totalAmount: Price;
        subtotalAmount: Price;
    };
    attributes: Array<Attribute>;
    discountAllocations: {
        discountedAmount: Price;
    };
    merchandise: Merchandise;
    displayMessage: string | undefined;
}

type Merchandise = ProductVariant;

interface ProductVariant {
    id: string;
    title: string;
    sku: string;
    requiresShipping: boolean;
    priceV2: Price;
    image: {
        url: string;
        altText: string;
    };
    product: Product;
}

interface Product {
    id: string;
    title: string;
    productType: string;
}

interface Price {
    currencyCode: string;
    amount: number;
}

interface DiscountCode {
    applicable: boolean;
    code: string;
}

interface Attribute {
    key: string;
    value?: string;
}

// TODO properly make this "globally" configurable without process or window
type ReactEzCheckoutConfig = {
    uri: string; // or set in - process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ENDPOINT | window.SHOPIFY_STOREFRONT_ENDPOINT
    apiKey: string; // or set in - process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN | window.SHOPIFY_STOREFRONT_TOKEN
    multipassUri?: string;
    cartUri?: string;
};
