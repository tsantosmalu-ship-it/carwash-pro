import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().min(1, 'Informe o e-mail').email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const cadastroClienteSchema = z
  .object({
    nome: z.string().min(3, 'Informe o nome completo'),
    email: z.string().min(1, 'Informe o e-mail').email('E-mail inválido'),
    telefone: z.string().min(10, 'Informe um telefone válido'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
    confirmarSenha: z.string().min(6, 'Confirme a senha'),
  })
  .refine((data) => data.password === data.confirmarSenha, {
    message: 'As senhas não coincidem',
    path: ['confirmarSenha'],
  })

export type CadastroClienteFormValues = z.infer<typeof cadastroClienteSchema>

export const novaSenhaSchema = z
  .object({
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
    confirmarSenha: z.string().min(6, 'Confirme a senha'),
  })
  .refine((data) => data.password === data.confirmarSenha, {
    message: 'As senhas não coincidem',
    path: ['confirmarSenha'],
  })

export type NovaSenhaFormValues = z.infer<typeof novaSenhaSchema>

export const esqueciSenhaSchema = z.object({
  email: z.string().min(1, 'Informe o e-mail').email('E-mail inválido'),
})

export type EsqueciSenhaFormValues = z.infer<typeof esqueciSenhaSchema>
