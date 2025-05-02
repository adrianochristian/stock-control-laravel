import React from 'react'
import AppLayout from '@/layouts/app-layout'
import ProductForm from '@/components/product-form'
import { router, Head } from '@inertiajs/react'
import { Text } from '@/components/ui/typography'

export default function CreateProduct() {
  return (
    <AppLayout title="Cadastrar Produto">
      <Head title="Novo Produto" />
      
      <div style={{ marginBottom: '2rem' }}>
        <Text variant="body1" color="secondary">
          Cadastre um novo produto no sistema preenchendo o formulário abaixo.
          Certifique-se de incluir todas as informações necessárias.
        </Text>
      </div>

      <ProductForm
        mode="create"
        onSuccess={() => router.visit('/products')}
      />
    </AppLayout>
  )
}