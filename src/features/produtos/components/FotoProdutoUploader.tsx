import { useRef, useState } from 'react'
import { useUploadFotoProduto } from '../hooks/useProdutoMutations'
import { getErrorMessage } from '@/shared/lib/errors'

export function FotoProdutoUploader({ produtoId, foto }: { produtoId: string; foto: string | null }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const uploadMutation = useUploadFotoProduto(produtoId)

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setErrorMessage(null)
    try {
      await uploadMutation.mutateAsync(file)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      <p className="field-label">Foto</p>
      <div className="mt-2 flex items-center gap-4">
        {foto ? (
          <img src={foto} alt="Produto" className="h-20 w-20 rounded-lg border border-dourado-escuro/20 object-cover" />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-dashed border-dourado-escuro/40 text-xs text-cinza-medio">
            Sem foto
          </div>
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploadMutation.isPending}
          className="btn-secondary"
        >
          {uploadMutation.isPending ? 'Enviando...' : foto ? 'Trocar foto' : 'Adicionar foto'}
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
