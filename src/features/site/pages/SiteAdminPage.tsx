import { useEffect, useRef, useState } from 'react'
import { useConteudoSite, useUpdateConteudoSite } from '../hooks/useConteudoSite'
import { useCriarDestaque, useGaleriaDestaques, useRemoverDestaque } from '../hooks/useGaleriaDestaques'
import { getErrorMessage } from '@/shared/lib/errors'

function SobreNosEditor() {
  const { data: texto, isLoading } = useConteudoSite('sobre_nos')
  const updateMutation = useUpdateConteudoSite('sobre_nos')
  const [valor, setValor] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [salvo, setSalvo] = useState(false)

  useEffect(() => {
    if (texto !== undefined && texto !== null) setValor(texto)
  }, [texto])

  async function handleSalvar() {
    setErrorMessage(null)
    setSalvo(false)
    try {
      await updateMutation.mutateAsync(valor)
      setSalvo(true)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  return (
    <div className="card">
      <h2 className="font-display text-lg text-branco-premium">Sobre Nós</h2>
      {isLoading ? (
        <p className="mt-2 text-sm text-cinza-medio">Carregando...</p>
      ) : (
        <>
          <textarea
            value={valor}
            onChange={(event) => setValor(event.target.value)}
            rows={5}
            className="field-input mt-3"
          />
          {errorMessage && <p className="field-error">{errorMessage}</p>}
          {salvo && <p className="mt-1 text-sm text-green-400">Salvo.</p>}
          <button
            type="button"
            onClick={handleSalvar}
            disabled={updateMutation.isPending}
            className="btn-primary mt-3"
          >
            {updateMutation.isPending ? 'Salvando...' : 'Salvar'}
          </button>
        </>
      )}
    </div>
  )
}

function GaleriaEditor() {
  const { data: destaques, isLoading } = useGaleriaDestaques()
  const criarMutation = useCriarDestaque()
  const removerMutation = useRemoverDestaque()
  const inputRef = useRef<HTMLInputElement>(null)
  const [legenda, setLegenda] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setErrorMessage(null)
    setSuccessMessage(null)
    try {
      await criarMutation.mutateAsync({ file, legenda })
      setLegenda('')
      setSuccessMessage('Foto adicionada.')
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  async function handleRemover(id: string) {
    if (!window.confirm('Remover esta foto da galeria?')) return
    setErrorMessage(null)
    setSuccessMessage(null)
    try {
      await removerMutation.mutateAsync(id)
      setSuccessMessage('Foto removida.')
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  return (
    <div className="card">
      <h2 className="font-display text-lg text-branco-premium">Galeria de destaques</h2>
      <p className="mt-1 text-sm text-cinza-medio">
        Fotos que aparecem na Início do app do cliente, em "Nossos Trabalhos".
      </p>

      {isLoading && <p className="mt-3 text-sm text-cinza-medio">Carregando...</p>}

      {destaques && destaques.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3">
          {destaques.map((destaque) => (
            <div key={destaque.id} className="relative">
              <img
                src={destaque.foto_url}
                alt={destaque.legenda ?? ''}
                className="aspect-square w-full rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemover(destaque.id)}
                className="absolute right-1 top-1 rounded-full bg-black/60 px-1.5 py-0.5 text-xs text-white hover:bg-black/80"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 space-y-2">
        <input
          type="text"
          placeholder="Legenda (opcional)"
          value={legenda}
          onChange={(event) => setLegenda(event.target.value)}
          className="field-input"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={criarMutation.isPending}
          className="btn-secondary"
        >
          {criarMutation.isPending ? 'Enviando...' : '+ Adicionar foto'}
        </button>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </div>
      {errorMessage && <p className="field-error">{errorMessage}</p>}
      {successMessage && <p className="text-sm text-green-400">{successMessage}</p>}
    </div>
  )
}

export function SiteAdminPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-xl text-branco-premium">Site</h1>
      <SobreNosEditor />
      <GaleriaEditor />
    </div>
  )
}
