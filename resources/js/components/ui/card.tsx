import React from 'react'
import styled, { css } from 'styled-components'
import { theme } from '@/styles/theme'

interface CardProps {
    children: React.ReactNode
    className?: string
    variant?: 'default' | 'hover' | 'interactive'
    padding?: 'none' | 'small' | 'medium' | 'large'
}

const getPadding = (padding: CardProps['padding']) => {
    switch (padding) {
        case 'none':
            return '0'
        case 'small':
            return '1rem'
        case 'large':
            return '2rem'
        default:
            return '1.5rem'
    }
}

const StyledCard = styled.div<CardProps>`
    background-color: ${theme.colors.surface};
    border-radius: ${theme.borderRadius.lg};
    border: 1px solid ${theme.colors.border};
    overflow: hidden;
    padding: ${props => getPadding(props.padding)};

    ${props => {
        switch (props.variant) {
            case 'hover':
                return css`
                    transition: ${theme.transition};
                    &:hover {
                        transform: translateY(-4px);
                        box-shadow: ${theme.shadows.md};
                    }
                `
            case 'interactive':
                return css`
                    cursor: pointer;
                    transition: ${theme.transition};
                    &:hover {
                        transform: translateY(-2px);
                        box-shadow: ${theme.shadows.sm};
                    }
                    &:active {
                        transform: translateY(0);
                    }
                `
            default:
                return css`
                    box-shadow: ${theme.shadows.sm};
                `
        }
    }}
`

export function Card({
    children,
    className,
    variant = 'default',
    padding = 'medium',
    ...props
}: CardProps) {
    return (
        <StyledCard
            className={className}
            variant={variant}
            padding={padding}
            {...props}
        >
            {children}
        </StyledCard>
    )
}

// Subcomponentes para organização do conteúdo do Card
export const CardHeader = styled.div`
    padding-bottom: 1rem;
    border-bottom: 1px solid ${theme.colors.border};
    margin-bottom: 1rem;
`

export const CardTitle = styled.h3`
    color: ${theme.colors.text.primary};
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
`

export const CardDescription = styled.p`
    color: ${theme.colors.text.secondary};
    font-size: 0.875rem;
    margin: 0.5rem 0 0;
`

export const CardContent = styled.div`
    > * + * {
        margin-top: 1rem;
    }
`

export const CardFooter = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 1rem;
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid ${theme.colors.border};
`
