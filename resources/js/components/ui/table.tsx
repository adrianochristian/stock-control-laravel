import React from 'react'
import styled from 'styled-components'
import { theme } from '@/styles/theme'

const TableContainer = styled.div`
    width: 100%;
    overflow-x: auto;
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.lg};
    background-color: ${theme.colors.surface};
`

const StyledTable = styled.table`
    width: 100%;
    border-collapse: collapse;
`

const Th = styled.th`
    padding: 0.75rem 1rem;
    text-align: left;
    font-weight: 600;
    font-size: 0.875rem;
    color: ${theme.colors.text.secondary};
    background-color: ${theme.colors.background};
    border-bottom: 1px solid ${theme.colors.border};
    white-space: nowrap;

    &:first-child {
        padding-left: 1.5rem;
    }

    &:last-child {
        padding-right: 1.5rem;
    }
`

const Td = styled.td`
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    color: ${theme.colors.text.primary};
    border-bottom: 1px solid ${theme.colors.border};
    white-space: nowrap;

    &:first-child {
        padding-left: 1.5rem;
    }

    &:last-child {
        padding-right: 1.5rem;
    }
`

const Tr = styled.tr`
    &:last-child ${Td} {
        border-bottom: none;
    }

    &:hover {
        background-color: ${theme.colors.background};
    }
`

const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1rem;
    text-align: center;
    color: ${theme.colors.text.secondary};

    svg {
        margin-bottom: 1rem;
        color: ${theme.colors.text.secondary};
    }
`

interface TableProps<T> {
    data: T[]
    columns: {
        header: string
        accessor: keyof T | ((item: T) => React.ReactNode)
    }[]
    emptyMessage?: string
}

export function Table<T>({ data, columns, emptyMessage = 'Nenhum dado encontrado' }: TableProps<T>) {
    if (data.length === 0) {
        return (
            <TableContainer>
                <EmptyState>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <p>{emptyMessage}</p>
                </EmptyState>
            </TableContainer>
        )
    }

    return (
        <TableContainer>
            <StyledTable>
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <Th key={index}>{column.header}</Th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, rowIndex) => (
                        <Tr key={rowIndex}>
                            {columns.map((column, colIndex) => (
                                <Td key={colIndex}>
                                    {typeof column.accessor === 'function'
                                        ? column.accessor(item)
                                        : String(item[column.accessor] ?? '')}
                                </Td>
                            ))}
                        </Tr>
                    ))}
                </tbody>
            </StyledTable>
        </TableContainer>
    )
}