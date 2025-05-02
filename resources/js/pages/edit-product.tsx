import React from 'react'
import AppLayout from '@/layouts/app-layout'
import ProductForm from '@/components/product-form'
import { usePage, router, Head } from '@inertiajs/react'
import { Text } from '@/components/ui/typography'

interface Product {
  id: number
  name: string
  description?: string
  category?: string
  quantity: number
  price: number
  sku: string
}

interface PageProps {
  product: {
    data: Product
  }
}

export default function EditProduct() {
  const { props } = usePage<PageProps>()
  const product = props.product.data

  return (
    <AppLayout title={`Editar Produto`}>
      <Head title={`Editar: ${product.name}`} />
      
      <div style={{ marginBottom: '2rem' }}>
        <Text variant="h2" weight="semibold" color="primary">
          {product.name}
        </Text>
        <Text variant="body1" color="secondary" style={{ marginTop: '0.5rem' }}>
          Atualize as informações do produto conforme necessário utilizando o formulário abaixo.
        </Text>
      </div>

      <ProductForm
        mode="edit"
        product={product}
        onSuccess={() => router.visit('/products')}
      />
    </AppLayout>
  )
}