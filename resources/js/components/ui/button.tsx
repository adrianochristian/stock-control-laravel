import React, { ButtonHTMLAttributes } from 'react'
import styled from 'styled-components'
import { theme } from '@/styles/theme'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'outline'
    size?: 'sm' | 'md' | 'lg'
    fullWidth?: boolean
    isLoading?: boolean
}

const StyledButton = styled.button<ButtonProps>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-weight: 500;
    border-radius: ${theme.borderRadius.sm};
    transition: ${theme.transition};
    cursor: ${props => (props.disabled || props.isLoading) ? 'not-allowed' : 'pointer'};
    opacity: ${props => (props.disabled || props.isLoading) ? 0.7 : 1};
    width: ${props => props.fullWidth ? '100%' : 'auto'};

    ${props => {
        // Size variants
        switch (props.size) {
            case 'sm':
                return `
                    padding: 0.5rem 1rem;
                    font-size: 0.875rem;
                `
            case 'lg':
                return `
                    padding: 0.75rem 1.5rem;
                    font-size: 1rem;
                `
            default: // md
                return `
                    padding: 0.625rem 1.25rem;
                    font-size: 0.875rem;
                `
        }
    }}

    ${props => {
        // Style variants
        switch (props.variant) {
            case 'secondary':
                return `
                    background-color: ${theme.colors.secondary};
                    color: ${theme.colors.text.white};
                    border: none;
                    &:hover:not(:disabled) {
                        background-color: ${theme.colors.secondaryHover};
                    }
                `
            case 'danger':
                return `
                    background-color: ${theme.colors.danger};
                    color: ${theme.colors.text.white};
                    border: none;
                    &:hover:not(:disabled) {
                        background-color: ${theme.colors.dangerHover};
                    }
                `
            case 'outline':
                return `
                    background-color: transparent;
                    color: ${theme.colors.primary};
                    border: 1px solid ${theme.colors.primary};
                    &:hover:not(:disabled) {
                        background-color: ${theme.colors.primary};
                        color: ${theme.colors.text.white};
                    }
                `
            default: // primary
                return `
                    background-color: ${theme.colors.primary};
                    color: ${theme.colors.text.white};
                    border: none;
                    &:hover:not(:disabled) {
                        background-color: ${theme.colors.primaryHover};
                    }
                `
        }
    }}
`

const LoadingSpinner = styled.div`
    border: 2px solid ${theme.colors.text.white};
    border-top: 2px solid transparent;
    border-radius: 50%;
    width: 1em;
    height: 1em;
    animation: spin 1s linear infinite;

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    isLoading = false,
    disabled = false,
    ...props
}: ButtonProps) {
    return (
        <StyledButton
            variant={variant}
            size={size}
            fullWidth={fullWidth}
            isLoading={isLoading}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? <LoadingSpinner /> : children}
        </StyledButton>
    )
}
