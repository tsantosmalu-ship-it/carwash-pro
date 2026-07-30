import { useRef, useState } from 'react'
import { useUploadNotaFiscal } from '../hooks/useOrdemServicoMutations'
import { getNotaFiscalSignedUrl } from '../api/ordensServico.api'
import { getErrorMessage } from '@/shared/lib/errors'

export function NotaFiscalUploader({
  ordemServicoId,
  notaFiscalUrl,
}: {
  ordemServicoId: string
  notaFiscalUrl: string | null
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [abrindo, setAbrindo] = useState(false)
  const uploadMutation = useUploadNotaFiscal(ordemServicoId)

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.type !== 'application/pdf') {
      setErrorMessage('Envie um arquivo PDF.')
      return
    }
    setErrorMessage(null)
    try {
      await uploadMutation.mutateAsync(file)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  async function handleAbrir() {
    if (!notaFiscalUrl) return
    setAbrindo(true)
    setErrorMessage(null)
    try {
      const signedUrl = await getNotaFiscalSignedUrl(notaFiscalUrl)
      window.open(signedUrl, '_blank', 'noopener,noreferrer')
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setAbrindo(false)
    }
  }

  return (
    <div>
      <p className="field-label">Nota fiscal</p>
      <div className="mt-2 flex items-center gap-3">
        {notaFiscalUrl && (
          <button type="button" onClick={handleAbrir} disabled={abrindo} className="link-accent text-sm">
            {abrindo ? 'Abrindo...' : 'Abrir PDF'}
          </button>
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploadMutation.isPending}
          className="btn-secondary"
        >
          {uploadMutation.isPending ? 'Enviando...' : notaFiscalUrl ? 'Substituir PDF' : 'Enviar PDF'}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />
      {errorMessage && <p className="field-error">{errorMessage}</p>}
    </div>
  )
}
