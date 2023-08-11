import { format } from 'date-fns';

import prismadb from '@/lib/prismadb';
import { formatter } from '@/lib/utils';

import { ProductsClient } from './components/client';
import { ProductColumn } from './components/columns';

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      category: true,
      size: true,
      color: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    category: item.category.name,
    name: item.name,
    price: formatter.format(item.price.toNumber()),
    size: item.size.name,
    colorValue: item.color.value,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    createdAt: format(item.createdAt, 'MMMM do, yyyy')
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductsClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
