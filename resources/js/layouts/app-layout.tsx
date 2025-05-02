import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { theme } from '@/styles/theme'
import { Link } from '@inertiajs/react'

interface AppLayoutProps {
    title?: string
    children: ReactNode
}

const LayoutContainer = styled.div`
    min-height: 100vh;
    background-color: ${theme.colors.background};
    display: flex;
    flex-direction: column;
`

const NavBar = styled.nav`
    background-color: white;
    border-bottom: 1px solid ${theme.colors.border};
    padding: 1rem ${theme.container.padding.mobile};
    position: sticky;
    top: 0;
    z-index: 10;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

    @media (min-width: 640px) {
        padding: 1rem ${theme.container.padding.desktop};
    }
`

const NavContent = styled.div`
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const Logo = styled(Link)`
    font-size: 1.5rem;
    font-weight: 700;
    color: ${theme.colors.primary};
    text-decoration: none;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &:hover {
        color: ${theme.colors.primaryHover};
    }

    svg {
        width: 24px;
        height: 24px;
    }
`

const NavMenu = styled.div`
    display: flex;
    align-items: center;
    gap: 2rem;
`

const NavLink = styled(Link)`
    color: ${theme.colors.text.secondary};
    text-decoration: none;
    font-weight: 500;
    font-size: 0.875rem;
    padding: 0.5rem;
    border-radius: ${theme.borderRadius.md};
    transition: all 0.2s ease;

    &:hover {
        color: ${theme.colors.text.primary};
        background: ${theme.colors.background};
    }

    &[aria-current="page"] {
        color: ${theme.colors.primary};
        background: ${theme.colors.primary}10;
    }
`

const LogoutButton = styled.button`
    color: ${theme.colors.danger};
    background: none;
    border: none;
    font-weight: 500;
    font-size: 0.875rem;
    padding: 0.5rem;
    border-radius: ${theme.borderRadius.md};
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        color: ${theme.colors.dangerHover};
        background: ${theme.colors.danger}10;
    }
`

const Main = styled.main`
    flex: 1;
    max-width: 1400px;
    width: 100%;
    margin: 0 auto;
    padding: 2rem ${theme.container.padding.mobile};

    @media (min-width: 640px) {
        padding: 2rem ${theme.container.padding.desktop};
    }
`

const PageHeader = styled.div`
    margin-bottom: 2rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`

const PageTitle = styled.h1`
    color: ${theme.colors.text.primary};
    font-size: 1.875rem;
    font-weight: 600;
    line-height: 1.2;
`

const PageDescription = styled.p`
    color: ${theme.colors.text.secondary};
    font-size: 0.875rem;
    max-width: 65ch;
`

export default function AppLayout({ children, title = 'Dashboard' }: AppLayoutProps) {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''
    
    const handleLogout = () => {
        localStorage.removeItem('jwt')
        window.location.href = '/login'
    }

    return (
        <LayoutContainer>
            <NavBar>
                <NavContent>
                    <Logo href="/products">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 8.5V13.5M4 8.5V13.5M4 19V21H20V19M4 5V3H20V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="1.5"/>
                        </svg>
                        Stock Control
                    </Logo>
                    <NavMenu>
                        <NavLink href="/products" aria-current={currentPath === '/products' ? 'page' : undefined}>
                            Produtos
                        </NavLink>
                        <LogoutButton onClick={handleLogout}>
                            Sair
                        </LogoutButton>
                    </NavMenu>
                </NavContent>
            </NavBar>

            <Main>
                <PageHeader>
                    <PageTitle>{title}</PageTitle>
                    {title === 'Produtos' && (
                        <PageDescription>
                            Gerencie seu inventário, adicione novos produtos, atualize quantidades e monitore seu estoque.
                        </PageDescription>
                    )}
                </PageHeader>
                {children}
            </Main>
        </LayoutContainer>
    )
}
