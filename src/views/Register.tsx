'use client'

// React Imports
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Next Imports
import Link from 'next/link'

// MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { SystemMode } from '@core/types'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'

// Styled Custom Components
const RegisterIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',
  maxBlockSize: 600,
  maxInlineSize: '100%',
  margin: theme.spacing(12),
  [theme.breakpoints.down(1536)]: {
    maxBlockSize: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxBlockSize: 450
  }
}))

const MaskImg = styled('img')({
  blockSize: 'auto',
  maxBlockSize: 345,
  inlineSize: '100%',
  position: 'absolute',
  insetBlockEnd: 0,
  zIndex: -1
})

const Register = ({ mode }: { mode: SystemMode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  const [telefone, setTelefone] = useState('')
  const [endereco, setEndereco] = useState('')
  const [numero, setNumero] = useState('')
  const [complemento, setComplemento] = useState('')
  const [bairro, setBairro] = useState('')
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('')
  const [cep, setCep] = useState('')
  const [error, setError] = useState('')

  const darkImg = '/images/pages/auth-mask-dark.png'
  const lightImg = '/images/pages/auth-mask-light.png'
  const darkIllustration = '/images/illustrations/auth/v2-register-dark.png'
  const lightIllustration = '/images/illustrations/auth/v2-register-light.png'
  const borderedDarkIllustration = '/images/illustrations/auth/v2-register-dark-border.png'
  const borderedLightIllustration = '/images/illustrations/auth/v2-register-light-border.png'

  // Hooks
  const { settings } = useSettings()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const router = useRouter()

  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration
  )

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const estadosBrasileiros = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ 
          nome, 
          email, 
          senha,
          dataNascimento,
          telefone,
          endereco,
          numero,
          complemento,
          bairro,
          cidade,
          estado,
          cep
        }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/login");
      } else {
        setError(data.error || 'Erro ao registrar');
      }
    } catch (err) {
      console.error('Erro inesperado:', err);
      setError('Erro inesperado no registro');
    }
  };

  return (
    <div className='flex bs-full justify-center'>
      <div
        className={classnames(
          'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
          {
            'border-ie': settings.skin === 'bordered'
          }
        )}
      >
        <RegisterIllustration src={characterIllustration} alt='character-illustration' />
        {!hidden && <MaskImg alt='mask' src={authBackground} />}
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[700px]'>
        <Link href={'/login'} className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
          <Logo />
        </Link>
        <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[600px] md:max-is-[unset] mbs-8 sm:mbs-11 md:mbs-0'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h4'>A aventura começa aqui! 🚀</Typography>
            <Typography>Faça seu cadastro para acessar o sistema</Typography>
          </div>
          <form onSubmit={handleRegister} className='flex flex-col gap-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <CustomTextField
                fullWidth
                label='Nome Completo'
                placeholder='Digite o seu nome completo'
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
              <CustomTextField
                fullWidth
                label='Email'
                type='email'
                placeholder='Digite o seu email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <CustomTextField
                fullWidth
                label='Senha'
                placeholder='············'
                type={isPasswordShown ? 'text' : 'password'}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={(e) => e.preventDefault()}>
                          <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <CustomTextField
                fullWidth
                label='Data de Nascimento'
                type='date'
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
              <CustomTextField
                fullWidth
                label='Telefone'
                placeholder='(00) 00000-0000'
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
              <CustomTextField
                fullWidth
                label='CEP'
                placeholder='00000-000'
                value={cep}
                onChange={(e) => setCep(e.target.value)}
              />
              <CustomTextField
                fullWidth
                label='Endereço'
                placeholder='Rua, Avenida, etc.'
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
              />
              <CustomTextField
                fullWidth
                label='Número'
                placeholder='Número'
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
              />
              <CustomTextField
                fullWidth
                label='Complemento'
                placeholder='Apartamento, bloco, etc.'
                value={complemento}
                onChange={(e) => setComplemento(e.target.value)}
              />
              <CustomTextField
                fullWidth
                label='Bairro'
                placeholder='Bairro'
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
              />
              <CustomTextField
                fullWidth
                label='Cidade'
                placeholder='Cidade'
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
              />
              <CustomTextField
                fullWidth
                select
                label='Estado'
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              >
                {estadosBrasileiros.map((estado) => (
                  <MenuItem key={estado} value={estado}>
                    {estado}
                  </MenuItem>
                ))}
              </CustomTextField>
            </div>
            
            {error && <Typography color='error'>{error}</Typography>}
            <FormControlLabel
              control={<Checkbox required />}
              label={
                <>
                  <span>Eu concordo com os </span>
                  <Link className='text-primary' href='/termos' onClick={(e) => e.preventDefault()}>
                    termos de uso e política de privacidade
                  </Link>
                </>
              }
            />
            <Button fullWidth variant='contained' type='submit' size='large'>
              Cadastrar
            </Button>
            <div className='flex justify-center items-center flex-wrap gap-2'>
              <Typography>Já possui uma conta?</Typography>
              <Typography component={Link} href='/login' color='primary.main'>
                Ir para o login
              </Typography>
            </div>
            <Divider className='gap-2'>ou</Divider>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
