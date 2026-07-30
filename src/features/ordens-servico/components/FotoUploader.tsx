import { useRef, useState } from 'react'
import { useRemoverFoto, useUploadFoto } from '../hooks/useOrdemServicoMutations'
import { getErrorMessage } from '@/shared/lib/errors'

interface FotoUploaderProps {
  ordemServicoId: string
  tipo: 'antes' | 'depois'
  titulo: string
  fotos: string[]
}

export function FotoUploader({ ordemServicoId, tipo, titulo, fotos }: FotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const uploadMutation = useUploadFoto(ordemServicoId)
  const removerMutation = useRemoverFoto(ordemServicoId)

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setErrorMessage(null)
    try {
      await uploadMutation.mutateAsync({ tipo, file })
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  async function handleRemover(url: string) {
    if (!window.confirm('Remover esta foto?')) return
    try {
      await removerMutation.mutateAsync({ tipo, url })
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  return (
    <div>
      <p className="field-label">{titulo}</p>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {fotos.map((foto) => (
          <div key={foto} className="group relative aspect-square overflow-hidden rounded-lg border border-dourado-escuro/20">
            <img src={foto} alt={titulo} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemover(foto)}
              className="absolute right-1 top-1 rounded-full bg-black/60 px-1.5 py-0.5 text-xs text-branco-premium opacity-0 transition group-hover:opacity-100"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploadMutation.isPending}
          className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-dourado-escuro/40 text-xs text-cinza-medio hover:bg-white/5 disabled:opacity-60"
        >
          {uploadMutation.isPending ? 'Enviando...' : '+ Foto'}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      {errorMessage && <p className="field-error">{errorMessage}</p>}
    </div>
  )
}
