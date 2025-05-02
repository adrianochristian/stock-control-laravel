import React from 'react'
import styled from 'styled-components'
import { theme } from '@/styles/theme'
import { Button } from './button'
import { Text } from './typography'

interface AlertDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    description: string
    confirmLabel?: string
    cancelLabel?: string
    variant?: 'danger' | 'warning'
}

const Overlay = styled.div<{ isOpen: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: ${props => props.isOpen ? 'flex' : 'none'};
    align-items: center;
    justify-content: center;
    z-index: 50;
    padding: 1rem;
`

const Dialog = styled.div`
    background-color: ${theme.colors.surface};
    border-radius: ${theme.borderRadius.lg};
    padding: 1.5rem;
    width: 100%;
    max-width: 28rem;
    box-shadow: ${theme.shadows.lg};
`

const DialogHeader = styled.div`
    margin-bottom: 1rem;
`

const DialogFooter = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
`

export function AlertDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
    variant = 'danger'
}: AlertDialogProps) {
    if (!isOpen) return null

    return (
        <Overlay isOpen={isOpen} onClick={onClose}>
            <Dialog onClick={e => e.stopPropagation()}>
                <DialogHeader>
                    <Text variant="h3" weight="semibold" color={variant === 'danger' ? 'danger' : 'primary'}>
                        {title}
                    </Text>
                    <Text variant="body2" color="secondary" style={{ marginTop: '0.5rem' }}>
                        {description}
                    </Text>
                </DialogHeader>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        variant={variant}
                        onClick={() => {
                            onConfirm()
                            onClose()
                        }}
                    >
                        {confirmLabel}
                    </Button>
                </DialogFooter>
            </Dialog>
        </Overlay>
    )
}