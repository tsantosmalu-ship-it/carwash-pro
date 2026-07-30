import { useState } from 'react'
import { useAvaliarOrdemServico } from '../hooks/useOrdemServicoMutations'
import { getErrorMessage } from '@/shared/lib/errors'

export function AvaliacaoForm({ ordemServicoId }: { ordemServicoId: string }) {
  const [nota, setNota] = useState<number | null>(null)
  const [comentario, setComentario] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [enviado, setEnviado] = useState(false)
  const avaliarMutation = useAvaliarOrdemServico(ordemServicoId)

  async function handleSubmit() {
    if (!nota) {
      setErrorMessage('Selecione uma nota de 1 a 5.')
      return
    }
    setErrorMessage(null)
    try {
      await avaliarMutation.mutateAsync({ avaliacao: nota, comentario })
      setEnviado(true)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  if (enviado) {
    return <p className="text-sm text-green-400">Obrigado pela avaliação!</p>
  }

  return (
    <div>
      <p className="field-label">Como foi o atendimento?</p>
      <div className="mt-2 flex gap-2">
        {[1, 2, 3, 4, 5].map((valor) => (
          <button
            key={valor}
            type="button"
            disabled={avaliarMutation.isPending}
            onClick={() => setNota(valor)}
            className={`rounded-lg border px-3 py-2 text-lg disabled:opacity-60 ${
              nota === valor
                ? 'border-dourado-principal bg-dourado-principal/15 text-dourado-principal'
                : 'border-dourado-escuro/40 text-branco-premium hover:bg-white/5'
            }`}
          >
            {valor}
          </button>
        ))}
      </div>

      <textarea
        value={comentario}
        onChange={(event) => setComentario(event.target.value)}
        placeholder="Quer deixar um comentário? (opcional)"
        rows={3}
        className="field-input mt-3"
      />

      {errorMessage && <p className="field-error">{errorMessage}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={avaliarMutation.isPending}
        className="btn-primary mt-3"
      >
        {avaliarMutation.isPending ? 'Enviando...' : 'Enviar avaliação'}
      </button>
    </div>
  )
}
