import React, { InputHTMLAttributes } from 'react'
import styled from 'styled-components'
import { theme } from '@/styles/theme'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    icon?: React.ReactNode
}

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`

const Label = styled.label`
    color: ${theme.colors.text.secondary};
    font-size: 0.875rem;
    font-weight: 500;
`

const InputWrapper = styled.div<{ hasError?: boolean }>`
    position: relative;
    display: flex;
    align-items: center;

    svg {
        position: absolute;
        left: 0.75rem;
        color: ${theme.colors.text.secondary};
        width: 1.25rem;
        height: 1.25rem;
    }
`

const StyledInput = styled.input<{ hasIcon?: boolean; hasError?: boolean }>`
    width: 100%;
    padding: 0.75rem;
    padding-left: ${props => props.hasIcon ? '2.5rem' : '0.75rem'};
    border: 1px solid ${props => props.hasError ? theme.colors.danger : theme.colors.border};
    border-radius: ${theme.borderRadius.sm};
    transition: ${theme.transition};
    color: ${theme.colors.text.primary};
    background-color: ${theme.colors.surface};
    font-size: 0.875rem;

    &::placeholder {
        color: ${theme.colors.text.secondary};
    }

    &:focus {
        outline: none;
        border-color: ${props => props.hasError ? theme.colors.danger : theme.colors.primary};
        box-shadow: 0 0 0 3px ${props => 
            props.hasError 
                ? 'rgba(239, 68, 68, 0.1)' 
                : 'rgba(59, 130, 246, 0.1)'
        };
    }

    &:disabled {
        background-color: ${theme.colors.background};
        cursor: not-allowed;
    }
`

const ErrorMessage = styled.span`
    color: ${theme.colors.danger};
    font-size: 0.75rem;
`

export function Input({
    label,
    error,
    icon,
    className,
    ...props
}: InputProps) {
    return (
        <InputContainer className={className}>
            {label && <Label>{label}</Label>}
            
            <InputWrapper hasError={!!error}>
                {icon}
                <StyledInput
                    hasIcon={!!icon}
                    hasError={!!error}
                    {...props}
                />
            </InputWrapper>

            {error && <ErrorMessage>{error}</ErrorMessage>}
        </InputContainer>
    )
}
