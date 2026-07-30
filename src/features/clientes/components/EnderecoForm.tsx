import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextField } from '@/shared/components/ui/TextField'
import { enderecoSchema, type EnderecoFormValues } from '../schemas/endereco.schema'
import type { Endereco } from '../types'

interface EnderecoFormProps {
  defaultValues?: Partial<Endereco>
  onSubmit: (values: EnderecoFormValues) => Promise<void>
  onCancel: () => void
  submitting: boolean
  errorMessage: string | null
}

export function EnderecoForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitting,
  errorMessage,
}: EnderecoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EnderecoFormValues>({
    resolver: zodResolver(enderecoSchema),
    defaultValues: {
      nome: defaultValues?.nome ?? '',
      cep: defaultValues?.cep ?? '',
      rua: defaultValues?.rua ?? '',
      numero: defaultValues?.numero ?? '',
      complemento: defaultValues?.complemento ?? '',
      bairro: defaultValues?.bairro ?? '',
      cidade: defaultValues?.cidade ?? '',
      estado: defaultValues?.estado ?? '',
      referencia: defaultValues?.referencia ?? '',
    },
  })

  return (
    <form
      className="space-y-4 rounded-xl border border-dourado-escuro/20 bg-preto-card p-4"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <TextField
        label="Nome do endereço (ex: Casa, Trabalho)"
        id="endereco_nome"
        type="text"
        error={errors.nome?.message}
        {...register('nome')}
      />

      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="CEP"
          id="cep"
          type="text"
          error={errors.cep?.message}
          {...register('cep')}
        />
        <TextField
          label="Número"
          id="numero"
          type="text"
          error={errors.numero?.message}
          {...register('numero')}
        />
      </div>

      <TextField
        label="Rua"
        id="rua"
        type="text"
        error={errors.rua?.message}
        {...register('rua')}
      />

      <TextField
        label="Complemento"
        id="complemento"
        type="text"
        error={errors.complemento?.message}
        {...register('complemento')}
      />

      <div className="grid grid-cols-3 gap-4">
        <TextField
          label="Bairro"
          id="bairro"
          type="text"
          error={errors.bairro?.message}
          {...register('bairro')}
        />
        <TextField
          label="Cidade"
          id="cidade"
          type="text"
          error={errors.cidade?.message}
          {...register('cidade')}
        />
        <TextField
          label="Estado"
          id="estado"
          type="text"
          maxLength={2}
          error={errors.estado?.message}
          {...register('estado')}
        />
      </div>

      <TextField
        label="Ponto de referência"
        id="referencia"
        type="text"
        error={errors.referencia?.message}
        {...register('referencia')}
      />

      {errorMessage && <p className="field-error">{errorMessage}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? 'Salvando...' : 'Salvar endereço'}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancelar
        </button>
      </div>
    </form>
  )
}
