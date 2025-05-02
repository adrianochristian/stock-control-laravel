import React, { TextareaHTMLAttributes } from 'react'
import styled from 'styled-components'
import { theme } from '@/styles/theme'

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    error?: string
}

const TextAreaContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`

const Label = styled.label`
    color: ${theme.colors.text.secondary};
    font-size: 0.875rem;
    font-weight: 500;
`

const StyledTextArea = styled.textarea<{ hasError?: boolean }>`
    width: 100%;
    min-height: 100px;
    padding: 0.75rem;
    border: 1px solid ${props => props.hasError ? theme.colors.danger : theme.colors.border};
    border-radius: ${theme.borderRadius.sm};
    transition: ${theme.transition};
    color: ${theme.colors.text.primary};
    background-color: ${theme.colors.surface};
    font-size: 0.875rem;
    resize: vertical;

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

export function TextArea({
    label,
    error,
    className,
    ...props
}: TextAreaProps) {
    return (
        <TextAreaContainer className={className}>
            {label && <Label>{label}</Label>}
            
            <StyledTextArea
                hasError={!!error}
                {...props}
            />

            {error && <ErrorMessage>{error}</ErrorMessage>}
        </TextAreaContainer>
    )
}