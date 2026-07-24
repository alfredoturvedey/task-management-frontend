import MainLayout from "@/components/layout/MainLayout";
import { products } from "@/components/features/Products-Category";
import { ProductCard } from "@/components/features/Product/ProductCard";

const AllProducts = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-950 mb-10 font-serif">
            Nuestros Productos
          </h2>
        </div>

        <div className="flex justify-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-950 mb-10 font-serif">
            Bebidas
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.bebidas.map((product) => (
            <ProductCard
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
            />
          ))}
        </div>

        <div className="mt-20"></div>

        <div className="flex justify-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-950 mb-10 font-serif">
            Carnes
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.carnes.map((product) => (
            <ProductCard
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
            />
          ))}
        </div>

        <div className="mt-20"></div>

        <div className="flex justify-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-950 mb-10 font-serif">
            Confituras
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.confituras.map((product) => (
            <ProductCard
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default AllProducts;
