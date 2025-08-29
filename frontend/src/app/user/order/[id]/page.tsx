import OrderBreadcrumb from "./components/OrderBreadcrumb";
import OrderForm from "./components/OrderForm";
import OrderSummary from "./components/OrderSummary";
import Product1 from "@/assets/image/product/product1.jpg";

const products = [
  {
    id: "1",
    title: "Màn hình Gaming LG UltraGear 45GS95QE-B",
    oldPrice: 39000000,
    price: 31199999,
    img: Product1,
  },
];

export default function OrderPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    return <p className="p-6 text-gray-500">Sản phẩm không tồn tại.</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <OrderBreadcrumb />
      <div className="flex flex-col lg:flex-row gap-8">
        <OrderForm />
        <OrderSummary product={product} />
      </div>
    </div>
  );
}
