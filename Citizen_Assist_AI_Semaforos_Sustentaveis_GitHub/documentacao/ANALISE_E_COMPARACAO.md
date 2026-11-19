# Análise de consumo e comparação de alternativas

## Público, contexto e necessidade
O Citizen Assist AI orienta equipes municipais e interessados em infraestrutura semafórica sustentável. O problema energético é a eletricidade necessária para alimentar sinalização, sensores e controle de um cruzamento. A proposta de semáforos dinâmicos é **contexto**, não uma implementação de controle de trânsito.

## Premissas (todas hipotéticas)
Quatro conjuntos semafóricos de 30 W cada, dois sensores de 25 W cada, controle e comunicação de 30 W. Operação 24 h/dia durante 30 dias; tarifa de R$ 0,90/kWh. Cenário solar: 1 kWp, 4,5 horas de sol pleno/dia, fator de desempenho 0,75, investimento R$ 6.500, manutenção anual R$ 150. Cenário de eficiência: redução hipotética de 20% da potência. Valores editáveis em `dados/cenario_hipotetico.json`.

**Atenção:** não são medições nem preços verificados. Não atribuir redução elétrica à mudança de duração do sinal verde.

## Cálculos para o mesmo período de 30 dias
- Potência total: 4 × 30 + 2 × 25 + 30 = **200 W**.
- Consumo de referência: 200 × 24 × 30 / 1000 = **144 kWh**.
- Rede elétrica: 144 × R$ 0,90 = **R$ 129,60** de custo variável.
- Geração solar potencial: 1 kWp × 4,5 h/dia × 30 × 0,75 = **101,25 kWh**.
- Energia solar aproveitada (sem valorizar excedente): min(144; 101,25) = **101,25 kWh**.
- Economia variável solar: 101,25 × 0,90 = **R$ 91,125**, ou **R$ 91,13** arredondados.
- Custo variável residual: (144 − 101,25) × 0,90 = **R$ 38,475**, ou **R$ 38,48**.
- Eficiência de equipamentos: 144 × 0,80 = **115,2 kWh**; economia = 28,8 kWh ou **R$ 25,92**.
- Payback solar simples: 6500 / (12 × 91,125 − 150) = **6,89 anos**, sob as hipóteses.

## Comparação
| Alternativa | Consumo da carga | Compra líquida de energia da rede (simplificada) | Custo variável mensal | Investimento/viabilidade | Impactos |
|---|---:|---:|---:|---|---|
| Rede convencional | 144 kWh | 144 kWh | R$ 129,60 | Se já conectada, menor investimento inicial | Depende da matriz elétrica; interrupções |
| Rede + solar fotovoltaica | 144 kWh | 42,75 kWh | R$ 38,48 | Exige área, projeto, investimento e insolação | Fonte renovável; fabricação/descarte de módulos |
| Equipamentos 20% mais eficientes | 115,2 kWh | 115,2 kWh | R$ 103,68 | Exige substituição e verificação de compatibilidade | Menor consumo, mas fabricação/descarte de novos equipamentos |

A energia solar **não reduz o consumo da carga**: reduz a compra de energia da rede no modelo. A alternativa eficiente reduz o consumo. A opção solar pode exigir rede e, para autonomia em quedas, bateria e projeto específico. O payback da eficiência não é calculado sem custo de substituição. Não somar economias de alternativas sem recalcular o cenário combinado.

## Recomendação ao usuário
Para uma instalação com rede disponível, comparar a troca por equipamentos eficientes com a adoção de fotovoltaico. Priorizar levantamento real de potência, tarifa e condições do local antes de investir. O assistente apresenta estimativas, não garantias.
