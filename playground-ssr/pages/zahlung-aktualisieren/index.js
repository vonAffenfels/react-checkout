import ReactCheckout, {StandaloneStripePayment} from "react-ez-checkout/dist/index.cjs.js";

export default function StripePage() {
    return (
        <div>
            <main>
                <div>
                    <StandaloneStripePayment />
                </div>
            </main>
        </div>
    )
}
