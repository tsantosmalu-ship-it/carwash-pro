const KNOWN_ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials: 'E-mail ou senha inválidos.',
  email_not_confirmed: 'Confirme seu e-mail antes de entrar (verifique sua caixa de entrada).',
  over_email_send_rate_limit:
    'Muitas tentativas de envio de e-mail. Aguarde alguns minutos e tente novamente.',
  user_already_exists: 'Já existe uma conta com este e-mail.',
  email_address_invalid: 'E-mail inválido.',
  weak_password: 'Senha muito fraca. Use pelo menos 6 caracteres.',
  '42501': 'Sem permissão para concluir esta operação (verifique as políticas de RLS).',
}

export function getErrorMessage(error: unknown): string {
  if (typeof error !== 'object' || error === null) return 'Ocorreu um erro inesperado.'

  const code = 'code' in error ? String((error as { code?: unknown }).code) : undefined
  if (code && KNOWN_ERROR_MESSAGES[code]) return KNOWN_ERROR_MESSAGES[code]

  if ('message' in error && typeof (error as { message?: unknown }).message === 'string') {
    return (error as { message: string }).message
  }

  return 'Ocorreu um erro inesperado.'
}
