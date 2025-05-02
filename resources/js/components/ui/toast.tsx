import React, { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { theme } from '@/styles/theme'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastProps {
    message: string
    type?: ToastType
    duration?: number
    onClose: () => void
}

const slideIn = keyframes`
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
`

const slideOut = keyframes`
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
`

const getToastColor = (type: ToastType) => {
    switch (type) {
        case 'success':
            return '#22c55e'
        case 'error':
            return theme.colors.danger
        case 'warning':
            return theme.colors.secondary
        default:
            return theme.colors.primary
    }
}

const ToastContainer = styled.div<{ type: ToastType; isExiting: boolean }>`
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    padding: 1rem;
    background: ${props => getToastColor(props.type)};
    color: white;
    border-radius: ${theme.borderRadius.md};
    box-shadow: ${theme.shadows.lg};
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-width: 300px;
    max-width: 500px;
    z-index: 100;
    animation: ${props => props.isExiting ? slideOut : slideIn} 0.3s ease-in-out forwards;
`

const IconContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`

const Message = styled.p`
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.5;
    flex: 1;
`

const CloseButton = styled.button`
    background: none;
    border: none;
    color: white;
    opacity: 0.8;
    cursor: pointer;
    padding: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: ${theme.transition};

    &:hover {
        opacity: 1;
    }
`

const ToastIcon = ({ type }: { type: ToastType }) => {
    switch (type) {
        case 'success':
            return (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 18.3333C14.6024 18.3333 18.3334 14.6024 18.3334 10C18.3334 5.39763 14.6024 1.66667 10 1.66667C5.39765 1.66667 1.66669 5.39763 1.66669 10C1.66669 14.6024 5.39765 18.3333 10 18.3333Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7.5 10L9.16667 11.6667L12.5 8.33333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            )
        case 'error':
            return (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 18.3333C14.6024 18.3333 18.3334 14.6024 18.3334 10C18.3334 5.39763 14.6024 1.66667 10 1.66667C5.39765 1.66667 1.66669 5.39763 1.66669 10C1.66669 14.6024 5.39765 18.3333 10 18.3333Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12.5 7.5L7.5 12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7.5 7.5L12.5 12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            )
        case 'warning':
            return (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 18.3333C14.6024 18.3333 18.3334 14.6024 18.3334 10C18.3334 5.39763 14.6024 1.66667 10 1.66667C5.39765 1.66667 1.66669 5.39763 1.66669 10C1.66669 14.6024 5.39765 18.3333 10 18.3333Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 6.66667V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 13.3333H10.0083" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            )
        default:
            return (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 18.3333C14.6024 18.3333 18.3334 14.6024 18.3334 10C18.3334 5.39763 14.6024 1.66667 10 1.66667C5.39765 1.66667 1.66669 5.39763 1.66669 10C1.66669 14.6024 5.39765 18.3333 10 18.3333Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 13.3333V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 6.66667H10.0083" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            )
    }
}

export function Toast({
    message,
    type = 'info',
    duration = 3000,
    onClose
}: ToastProps) {
    const [isExiting, setIsExiting] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true)
            setTimeout(onClose, 300)
        }, duration)

        return () => clearTimeout(timer)
    }, [duration, onClose])

    return (
        <ToastContainer type={type} isExiting={isExiting}>
            <IconContainer>
                <ToastIcon type={type} />
            </IconContainer>
            <Message>{message}</Message>
            <CloseButton onClick={() => {
                setIsExiting(true)
                setTimeout(onClose, 300)
            }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </CloseButton>
        </ToastContainer>
    )
}