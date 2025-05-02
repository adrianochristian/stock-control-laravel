import React, { useState } from 'react'
import styled from 'styled-components'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { TextArea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/typography'
import { useToast } from '@/contexts/toast-context'
import { theme } from '@/styles/theme'
import axios from 'axios'

interface ProductFormProps {
  mode: 'create' | 'edit'
  product?: {
    id: number
    name: string
    description?: string
    quantity: number
    price: number
    category?: string
    sku: string
  }
  onSuccess: () => void
}

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`

const FormCard = styled(Card)`
  background: white;
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border};
  box-shadow: ${theme.shadows.sm};
`

const FormHeader = styled(CardHeader)`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid ${theme.colors.border};
`

const FormTitle = styled(CardTitle)`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${theme.colors.text.primary};
  margin-bottom: 0.5rem;
`

const FormDescription = styled(Text)`
  color: ${theme.colors.text.secondary};
  font-size: 0.875rem;
`

const FormContent = styled(CardContent)`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
  @media (max-width: 640px) {
    padding: 1.5rem;
  }
`

const FormFooter = styled(CardFooter)`
  padding: 1.5rem 2rem;
  border-top: 1px solid ${theme.colors.border};
  display: flex;
  justify-content: flex-end;
  gap: 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
    
    button {
      width: 100%;
    }
  }
`

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${theme.colors.text.primary};
`

const StyledInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: ${theme.colors.text.secondary}50;
  }
`

const StyledTextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  font-size: 0.875rem;
  min-height: 100px;
  resize: vertical;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: ${theme.colors.text.secondary}50;
  }
`

const ErrorMessage = styled.span`
  color: ${theme.colors.danger};
  font-size: 0.75rem;
  margin-top: 0.25rem;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

export default function ProductForm({ mode, product, onSuccess }: ProductFormProps) {
  const { showToast } = useToast()
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    quantity: product?.quantity || 0,
    price: product?.price || 0,
    category: product?.category || '',
    sku: product?.sku || '',
  })

  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value
    }))

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)

    try {
      const token = localStorage.getItem('jwt')
      if (mode === 'create') {
        await axios.post('/api/v1/products', form, {
          headers: { Authorization: `Bearer ${token}` },
        })
        showToast('Produto criado com sucesso!', 'success')
      } else if (mode === 'edit' && product) {
        await axios.put(`/api/v1/products/${product.id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        })
        showToast('Produto atualizado com sucesso!', 'success')
      }
      onSuccess()
    } catch (error: any) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors)
        showToast('Verifique os campos e tente novamente.', 'error')
      } else {
        console.error('Error submitting form:', error)
        showToast('Ocorreu um erro ao salvar o produto.', 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <FormContainer>
      <FormCard>
        <form onSubmit={handleSubmit}>
          <FormHeader>
            <FormTitle>
              {mode === 'create' ? 'Novo Produto' : 'Editar Produto'}
            </FormTitle>
            <FormDescription>
              {mode === 'create' 
                ? 'Preencha os dados para criar um novo produto'
                : 'Atualize os dados do produto'
              }
            </FormDescription>
          </FormHeader>

          <FormContent>
            <InputGroup>
              <Label htmlFor="name">Nome do Produto *</Label>
              <StyledInput
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Digite o nome do produto"
                required
              />
              {errors.name && <ErrorMessage>{errors.name[0]}</ErrorMessage>}
            </InputGroup>

            <InputGroup>
              <Label htmlFor="description">Descrição</Label>
              <StyledTextArea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Digite a descrição do produto"
              />
              {errors.description && <ErrorMessage>{errors.description[0]}</ErrorMessage>}
            </InputGroup>

            <InputGroup>
              <Label htmlFor="category">Categoria</Label>
              <StyledInput
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Digite a categoria do produto"
              />
              {errors.category && <ErrorMessage>{errors.category[0]}</ErrorMessage>}
            </InputGroup>

            <Grid>
              <InputGroup>
                <Label htmlFor="price">Preço *</Label>
                <StyledInput
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                />
                {errors.price && <ErrorMessage>{errors.price[0]}</ErrorMessage>}
              </InputGroup>

              <InputGroup>
                <Label htmlFor="quantity">Quantidade *</Label>
                <StyledInput
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="0"
                  required
                />
                {errors.quantity && <ErrorMessage>{errors.quantity[0]}</ErrorMessage>}
              </InputGroup>
            </Grid>

            <InputGroup>
              <Label htmlFor="sku">SKU *</Label>
              <StyledInput
                id="sku"
                name="sku"
                value={form.sku}
                onChange={handleChange}
                placeholder="Digite o SKU do produto"
                required
              />
              {errors.sku && <ErrorMessage>{errors.sku[0]}</ErrorMessage>}
            </InputGroup>
          </FormContent>

          <FormFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Salvando...' : mode === 'create' ? 'Criar Produto' : 'Salvar Alterações'}
            </Button>
          </FormFooter>
        </form>
      </FormCard>
    </FormContainer>
  )
}