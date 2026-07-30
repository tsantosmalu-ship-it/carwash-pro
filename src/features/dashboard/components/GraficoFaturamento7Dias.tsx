interface PontoFaturamento {
  data: string
  valor: number
}

function formatPreco(valor: number) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

function formatDiaLabel(dataStr: string) {
  const [, mes, dia] = dataStr.split('-')
  return `${dia}/${mes}`
}

export function GraficoFaturamento7Dias({ pontos }: { pontos: PontoFaturamento[] }) {
  const maximo = Math.max(...pontos.map((ponto) => ponto.valor), 1)

  return (
    <div>
      <div className="flex h-32 items-end gap-1">
        {pontos.map((ponto) => {
          const alturaPercentual = Math.max((ponto.valor / maximo) * 100, ponto.valor > 0 ? 4 : 0)
          return (
            <div key={ponto.data} className="flex flex-1 flex-col items-center justify-end gap-1">
              {ponto.valor > 0 && (
                <span className="text-[10px] text-cinza-medio">{formatPreco(ponto.valor)}</span>
              )}
              <div
                className="w-full rounded-t bg-dourado-principal"
                style={{ height: `${alturaPercentual}%` }}
                title={`${formatDiaLabel(ponto.data)}: ${formatPreco(ponto.valor)}`}
              />
            </div>
          )
        })}
      </div>
      <div className="mt-1 flex gap-1">
        {pontos.map((ponto) => (
          <span key={ponto.data} className="flex-1 text-center text-[10px] text-cinza-medio">
            {formatDiaLabel(ponto.data)}
          </span>
        ))}
      </div>
    </div>
  )
}
