import React, { useEffect, useState } from 'react'
import axios from 'axios'
import AppLayout from '@/layouts/app-layout'
import styled from 'styled-components'
import { Head } from '@inertiajs/react'
import { theme } from '@/styles/theme'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { useToast } from '@/contexts/toast-context'

interface Product {
    id: number
    name: string
    description?: string
    price: number
    category?: string
    quantity: number
    sku: string
}

interface User {
    id: number
    name: string
    role: 'admin' | 'operator' | 'user'
}

const FilterBox = styled.div`
    background: white;
    padding: 1.5rem;
    border-radius: ${theme.borderRadius.lg};
    border: 1px solid ${theme.colors.border};
    box-shadow: ${theme.shadows.sm};
    margin-bottom: 2rem;
`

const FilterForm = styled.form`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
`

const FilterInputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
`

const FilterLabel = styled.label`
    color: ${theme.colors.text.primary};
    font-size: 0.875rem;
    font-weight: 600;
`

const FilterInput = styled.input`
    width: 100%;
    padding: 0.75rem;
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.md};
    font-size: 0.875rem;
    transition: all 0.2s ease;
    background: ${theme.colors.background};

    &:focus {
        outline: none;
        border-color: ${theme.colors.primary};
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        background: white;
    }

    &::placeholder {
        color: ${theme.colors.text.secondary}50;
    }
`

const FilterActions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    padding-top: 1.5rem;
    border-top: 1px solid ${theme.colors.border};
    margin-top: 1rem;

    @media (max-width: 640px) {
        flex-direction: column;
        
        button {
            width: 100%;
        }
    }
`

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    font-size: 0.875rem;
    font-weight: 600;
    border-radius: ${theme.borderRadius.md};
    transition: all 0.2s ease;
    border: 1px solid transparent;

    ${props => props.variant === 'primary' && `
        background: ${theme.colors.primary};
        color: white;
        
        &:hover {
            background: ${theme.colors.primaryHover};
        }
    `}

    ${props => props.variant === 'secondary' && `
        background: ${theme.colors.surface};
        border-color: ${theme.colors.border};
        color: ${theme.colors.text.primary};
        
        &:hover {
            background: ${theme.colors.background};
        }
    `}

    ${props => props.variant === 'danger' && `
        background: ${theme.colors.danger};
        color: white;
        
        &:hover {
            background: ${theme.colors.dangerHover};
        }
    `}

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`

const ProductGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
`

const ProductCard = styled.div`
    background: white;
    border-radius: ${theme.borderRadius.lg};
    border: 1px solid ${theme.colors.border};
    overflow: hidden;
    transition: all 0.2s ease;
    height: 100%;
    display: flex;
    flex-direction: column;

    &:hover {
        transform: translateY(-2px);
        box-shadow: ${theme.shadows.md};
    }
`

const ProductContent = styled.div`
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    flex: 1;
`

const ProductTitle = styled.h3`
    color: ${theme.colors.text.primary};
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
`

const ProductDescription = styled.p`
    color: ${theme.colors.text.secondary};
    font-size: 0.875rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;
    flex: 1;
`

const ProductInfo = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
    padding: 1.25rem;
    background: ${theme.colors.background};
    border-radius: ${theme.borderRadius.md};
    margin-bottom: 1.5rem;
`

const ProductDetail = styled.div`
    span {
        display: block;
        color: ${theme.colors.text.secondary};
        font-size: 0.75rem;
        margin-bottom: 0.375rem;
        font-weight: 500;
    }

    strong {
        color: ${theme.colors.text.primary};
        font-size: 1rem;
        font-weight: 600;
    }
`

const ProductActions = styled.div`
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    padding-top: 1.25rem;
    border-top: 1px solid ${theme.colors.border};
`

const TopBar = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-bottom: 2rem;
`

const TopBarActions = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
`

const EmptyState = styled.div`
    text-align: center;
    padding: 4rem 2rem;
    background: white;
    border-radius: ${theme.borderRadius.lg};
    border: 1px solid ${theme.colors.border};

    svg {
        margin: 0 auto 1.5rem;
        color: ${theme.colors.text.secondary};
        opacity: 0.5;
    }

    p {
        color: ${theme.colors.text.secondary};
        font-size: 1rem;
    }
`

const Pagination = styled.div`
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 3rem;
`

const PaginationButton = styled.button<{ disabled?: boolean }>`
    padding: 0.75rem 1.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    border-radius: ${theme.borderRadius.md};
    transition: all 0.2s ease;
    background: white;
    border: 1px solid ${theme.colors.border};
    color: ${theme.colors.text.primary};

    &:hover:not(:disabled) {
        background: ${theme.colors.background};
        border-color: ${theme.colors.primary};
        color: ${theme.colors.primary};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`

const QuantityUpdateForm = styled.form`
    display: flex;
    gap: 0.5rem;
    align-items: center;
    margin-top: 1rem;
`

const QuantityInput = styled.input`
    width: 80px;
    padding: 0.5rem;
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.sm};
    font-size: 0.875rem;
`

export default function Products() {
    const { showToast } = useToast()
    const [user, setUser] = useState<User | null>(null)
    const [products, setProducts] = useState<Product[]>([])
    const [filters, setFilters] = useState({
        name: '',
        category: '',
        price_min: '',
        price_max: '',
    })
    const [currentPage, setCurrentPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; productId: number | null }>({
        isOpen: false,
        productId: null
    })

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('jwt')
            const { data } = await axios.get('/api/v1/products', {
                headers: { Authorization: `Bearer ${token}` },
                params: { ...filters, page: currentPage },
            })

            setProducts(data.data || [])
            setLastPage(Math.ceil(data.meta.total / data.meta.per_page) || 1)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching products:', error)
            setLoading(false)
        }
    }

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('jwt')
            const { data } = await axios.get('/api/v1/user/me/info', {
                headers: { Authorization: `Bearer ${token}` },
            })
            setUser(data.data)
        } catch (error) {
            console.error('Error fetching user:', error)
        }
    }

    const handleDelete = async (id: number) => {
        try {
            const token = localStorage.getItem('jwt')
            await axios.delete(`/api/v1/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            showToast('Produto excluído com sucesso!', 'success')
            fetchProducts()
        } catch (error) {
            console.error('Error deleting product:', error)
            showToast('Erro ao excluir o produto.', 'error')
        }
    }

    const handleUpdateQuantity = async (id: number, quantity: number) => {
        try {
            const token = localStorage.getItem('jwt')
            await axios.patch(`/api/v1/products/${id}`, { quantity }, {
                headers: { Authorization: `Bearer ${token}` },
            })
            showToast('Quantidade atualizada com sucesso!', 'success')
            fetchProducts()
        } catch (error) {
            console.error('Error updating quantity:', error)
            showToast('Erro ao atualizar a quantidade.', 'error')
        }
    }

    useEffect(() => {
        fetchProducts()
        fetchUser()
    }, [])

    useEffect(() => {
        fetchProducts()
    }, [currentPage, filters])

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault()
        setCurrentPage(1)
        fetchProducts()
    }

    const renderProductActions = (product: Product) => {
        if (!user) return null
        const isAdmin = user.role === 'admin'
        const isOperator = user.role === 'operator'

        return (
            <ProductActions>
                {(isAdmin || isOperator) && (
                    <ActionButton
                        variant="secondary"
                        onClick={() => window.location.href = `/products/edit/${product.id}`}
                    >
                        Editar
                    </ActionButton>
                )}
                
                {isAdmin && (
                    <ActionButton
                        variant="danger"
                        onClick={() => setDeleteDialog({ isOpen: true, productId: product.id })}
                    >
                        Excluir
                    </ActionButton>
                )}

                {isOperator && (
                    <QuantityUpdateForm
                        onSubmit={(e) => {
                            e.preventDefault()
                            const formData = new FormData(e.currentTarget)
                            const newQty = formData.get('qty')
                            handleUpdateQuantity(product.id, Number(newQty))
                        }}
                    >
                        <QuantityInput
                            type="number"
                            name="qty"
                            defaultValue={product.quantity}
                            min="0"
                        />
                        <ActionButton type="submit" variant="primary">
                            Atualizar
                        </ActionButton>
                    </QuantityUpdateForm>
                )}
            </ProductActions>
        )
    }

    return (
        <AppLayout title="Produtos">
            <Head title="Produtos" />

            <TopBar>
                <TopBarActions>
                    {user?.role === 'admin' && (
                        <ActionButton
                            as="a"
                            href="/products/create"
                            variant="primary"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            Novo Produto
                        </ActionButton>
                    )}
                </TopBarActions>

                <FilterBox>
                    <FilterForm onSubmit={handleFilter}>
                        <FilterInputGroup>
                            <FilterLabel htmlFor="name">Nome do Produto</FilterLabel>
                            <FilterInput
                                id="name"
                                type="text"
                                placeholder="Buscar por nome"
                                value={filters.name}
                                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                            />
                        </FilterInputGroup>

                        <FilterInputGroup>
                            <FilterLabel htmlFor="category">Categoria</FilterLabel>
                            <FilterInput
                                id="category"
                                type="text"
                                placeholder="Buscar por categoria"
                                value={filters.category}
                                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                            />
                        </FilterInputGroup>

                        <FilterInputGroup>
                            <FilterLabel htmlFor="price_min">Preço Mínimo</FilterLabel>
                            <FilterInput
                                id="price_min"
                                type="number"
                                placeholder="R$ 0,00"
                                value={filters.price_min}
                                onChange={(e) => setFilters({ ...filters, price_min: e.target.value })}
                            />
                        </FilterInputGroup>

                        <FilterInputGroup>
                            <FilterLabel htmlFor="price_max">Preço Máximo</FilterLabel>
                            <FilterInput
                                id="price_max"
                                type="number"
                                placeholder="R$ 999,99"
                                value={filters.price_max}
                                onChange={(e) => setFilters({ ...filters, price_max: e.target.value })}
                            />
                        </FilterInputGroup>
                    </FilterForm>
                    
                    <FilterActions>
                        <ActionButton
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                setFilters({
                                    name: '',
                                    category: '',
                                    price_min: '',
                                    price_max: '',
                                })
                                setCurrentPage(1)
                            }}
                        >
                            Limpar Filtros
                        </ActionButton>
                        <ActionButton
                            type="submit"
                            variant="primary"
                            onClick={handleFilter}
                        >
                            Aplicar Filtros
                        </ActionButton>
                    </FilterActions>
                </FilterBox>
            </TopBar>

            {loading ? (
                <EmptyState>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                    </svg>
                    <p>Carregando produtos...</p>
                </EmptyState>
            ) : products.length === 0 ? (
                <EmptyState>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <p>Nenhum produto encontrado com os filtros aplicados.</p>
                </EmptyState>
            ) : (
                <ProductGrid>
                    {products.map((product) => (
                        <ProductCard key={product.id}>
                            <ProductContent>
                                <ProductTitle>{product.name}</ProductTitle>
                                <ProductDescription>
                                    {product.description || 'Sem descrição'}
                                </ProductDescription>
                                
                                <ProductInfo>
                                    <ProductDetail>
                                        <span>Categoria</span>
                                        <strong>{product.category || 'N/A'}</strong>
                                    </ProductDetail>
                                    <ProductDetail>
                                        <span>Estoque</span>
                                        <strong>{product.quantity}</strong>
                                    </ProductDetail>
                                    <ProductDetail>
                                        <span>Preço</span>
                                        <strong>
                                            {new Intl.NumberFormat('pt-BR', {
                                                style: 'currency',
                                                currency: 'BRL'
                                            }).format(product.price)}
                                        </strong>
                                    </ProductDetail>
                                    <ProductDetail>
                                        <span>SKU</span>
                                        <strong>{product.sku}</strong>
                                    </ProductDetail>
                                </ProductInfo>

                                {renderProductActions(product)}
                            </ProductContent>
                        </ProductCard>
                    ))}
                </ProductGrid>
            )}

            {lastPage > 1 && (
                <Pagination>
                    <PaginationButton
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    >
                        Anterior
                    </PaginationButton>
                    <PaginationButton
                        disabled={currentPage === lastPage}
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, lastPage))}
                    >
                        Próxima
                    </PaginationButton>
                </Pagination>
            )}

            <AlertDialog
                isOpen={deleteDialog.isOpen}
                onClose={() => setDeleteDialog({ isOpen: false, productId: null })}
                onConfirm={() => {
                    if (deleteDialog.productId) {
                        handleDelete(deleteDialog.productId)
                    }
                }}
                title="Confirmar exclusão"
                description="Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita."
                confirmLabel="Excluir"
                cancelLabel="Cancelar"
                variant="danger"
            />
        </AppLayout>
    )
}