import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextField } from '@/shared/components/ui/TextField'
import { ordemServicoSchema, type OrdemServicoFormValues } from '../schemas/ordemServico.schema'
import { CHECKLIST_ITEMS, FORMA_PAGAMENTO_LABELS, FORMA_PAGAMENTO_OPTIONS } from '../types'
import type { OrdemServico } from '../types'

interface OrdemServicoFormProps {
  ordemServico: OrdemServico
  onSubmit: (values: OrdemServicoFormValues) => Promise<void>
  submitting: boolean
  errorMessage: string | null
}

export function OrdemServicoForm({
  ordemServico,
  onSubmit,
  submitting,
  errorMessage,
}: OrdemServicoFormProps) {
  const checklistPadrao = Object.fromEntries(
    CHECKLIST_ITEMS.map((item) => [item.key, ordemServico.checklist?.[item.key] ?? false]),
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrdemServicoFormValues>({
    resolver: zodResolver(ordemServicoSchema),
    defaultValues: {
      checklist: checklistPadrao,
      valor_final: ordemServico.valor_final !== null ? String(ordemServico.valor_final) : '',
      forma_pagamento: ordemServico.forma_pagamento ?? '',
      observacoes: ordemServico.observacoes ?? '',
    },
  })

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <span className="field-label">Checklist</span>
        <div className="mt-2 grid grid-cols-2 gap-2 rounded-lg border border-dourado-escuro/20 p-3">
          {CHECKLIST_ITEMS.map((item) => (
            <label key={item.key} className="flex items-center gap-2 text-sm text-branco-premium">
              <input type="checkbox" {...register(`checklist.${item.key}`)} />
              {item.label}
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="Valor final (R$)"
          id="valor_final"
          type="text"
          inputMode="decimal"
          error={errors.valor_final?.message}
          {...register('valor_final')}
        />
        <div>
          <label htmlFor="forma_pagamento" className="field-label">
            Forma de pagamento
          </label>
          <select id="forma_pagamento" className="field-input" {...register('forma_pagamento')}>
            <option value="">Não informado</option>
            {FORMA_PAGAMENTO_OPTIONS.map((forma) => (
              <option key={forma} value={forma}>
                {FORMA_PAGAMENTO_LABELS[forma]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="observacoes" className="field-label">
          Observações
        </label>
        <textarea id="observacoes" rows={3} className="field-input" {...register('observacoes')} />
      </div>

      {errorMessage && <p className="field-error">{errorMessage}</p>}

      <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto">
        {submitting ? 'Salvando...' : 'Salvar'}
      </button>
    </form>
  )
}
