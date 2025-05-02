import React, { useState } from 'react'
import axios from 'axios'
import { Head } from '@inertiajs/react'
import styled from 'styled-components'
import { theme } from '@/styles/theme'

const LoginContainer = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${theme.colors.background};
    padding: ${theme.container.padding.mobile};
`

const LoginCard = styled.div`
    background-color: ${theme.colors.surface};
    padding: 2rem;
    border-radius: ${theme.borderRadius.lg};
    box-shadow: ${theme.shadows.lg};
    width: 100%;
    max-width: 400px;
`

const Title = styled.h1`
    color: ${theme.colors.text.primary};
    font-size: 1.5rem;
    font-weight: 600;
    text-align: center;
    margin-bottom: 1.5rem;
`

const ErrorMessage = styled.p`
    color: ${theme.colors.danger};
    font-size: 0.875rem;
    text-align: center;
    margin-bottom: 1rem;
`

const Input = styled.input`
    width: 100%;
    padding: 0.75rem;
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.sm};
    margin-bottom: 1rem;
    transition: ${theme.transition};
    color: ${theme.colors.text.primary};

    &:focus {
        outline: none;
        border-color: ${theme.colors.primary};
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    &::placeholder {
        color: ${theme.colors.text.secondary};
    }
`

const Button = styled.button<{ disabled?: boolean }>`
    width: 100%;
    padding: 0.75rem;
    background-color: ${theme.colors.primary};
    color: ${theme.colors.text.white};
    border: none;
    border-radius: ${theme.borderRadius.sm};
    font-weight: 600;
    transition: ${theme.transition};
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    opacity: ${props => props.disabled ? 0.7 : 1};

    &:hover:not(:disabled) {
        background-color: ${theme.colors.primaryHover};
    }
`

const FormBox = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            const response = await axios.post('api/v1/login', { email, password })
            const token = response.data.meta.token

            if (token) {
                localStorage.setItem('jwt', token)
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
                axios.defaults.headers.common['Accept'] = 'application/json'
                axios.defaults.headers.common['Content-Type'] = 'application/json'
                window.location.href = '/products'
            }
        } catch (err: any) {
            setError('Email ou senha inválidos.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Head title="Login" />
            <LoginContainer>
                <LoginCard>
                    <Title>Entrar no Sistema</Title>
                    <FormBox onSubmit={handleLogin}>
                        {error && <ErrorMessage>{error}</ErrorMessage>}

                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />

                        <Input
                            type="password"
                            placeholder="Senha"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />

                        <Button type="submit" disabled={loading}>
                            {loading ? 'Entrando...' : 'Entrar'}
                        </Button>
                    </FormBox>
                </LoginCard>
            </LoginContainer>
        </>
    )
}