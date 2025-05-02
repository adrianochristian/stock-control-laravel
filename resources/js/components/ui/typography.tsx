import React from 'react'
import styled, { css } from 'styled-components'
import { theme } from '@/styles/theme'

type TextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'body1' | 'body2' | 'caption'
type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold'
type TextColor = 'primary' | 'secondary' | 'white' | 'danger'

interface TextProps {
    variant?: TextVariant
    weight?: TextWeight
    color?: TextColor
    align?: 'left' | 'center' | 'right'
    className?: string
    children: React.ReactNode
}

const getTextStyles = (variant: TextVariant) => {
    switch (variant) {
        case 'h1':
            return css`
                font-size: 2rem;
                line-height: 1.2;
            `
        case 'h2':
            return css`
                font-size: 1.5rem;
                line-height: 1.3;
            `
        case 'h3':
            return css`
                font-size: 1.25rem;
                line-height: 1.4;
            `
        case 'h4':
            return css`
                font-size: 1.125rem;
                line-height: 1.4;
            `
        case 'body1':
            return css`
                font-size: 1rem;
                line-height: 1.5;
            `
        case 'body2':
            return css`
                font-size: 0.875rem;
                line-height: 1.5;
            `
        case 'caption':
            return css`
                font-size: 0.75rem;
                line-height: 1.5;
            `
    }
}

const getTextWeight = (weight: TextWeight) => {
    switch (weight) {
        case 'regular':
            return 400
        case 'medium':
            return 500
        case 'semibold':
            return 600
        case 'bold':
            return 700
    }
}

const getTextColor = (color: TextColor) => {
    switch (color) {
        case 'primary':
            return theme.colors.text.primary
        case 'secondary':
            return theme.colors.text.secondary
        case 'white':
            return theme.colors.text.white
        case 'danger':
            return theme.colors.danger
    }
}

const StyledText = styled.p<TextProps>`
    margin: 0;
    ${({ variant = 'body1' }) => getTextStyles(variant)}
    ${({ weight = 'regular' }) => css`font-weight: ${getTextWeight(weight)};`}
    ${({ color = 'primary' }) => css`color: ${getTextColor(color)};`}
    ${({ align }) => align && css`text-align: ${align};`}
`

export function Text({
    variant = 'body1',
    weight = 'regular',
    color = 'primary',
    align,
    className,
    children,
    ...props
}: TextProps) {
    const Component = variant.startsWith('h') ? variant : 'p'

    return (
        <StyledText
            as={Component}
            variant={variant}
            weight={weight}
            color={color}
            align={align}
            className={className}
            {...props}
        >
            {children}
        </StyledText>
    )
}