# DriveSync Energy — Citizen Assist AI

**Global Solution | Ciência da Computação — Turmas 1CCA | Soluções em Energias Renováveis e Sustentáveis**

## Equipe
- Ryan Barreto Carlos Dias - RM: 574126
- Fernando Henrique Lembo - RM: 570228
## Problema e público
Gestores municipais e equipes de manutenção precisam comparar o consumo e os custos de operação de semáforos, sensores e controles, e avaliar a viabilidade de alternativas renováveis. O DriveSync Energy integra um **assistente digital de orientação energética** ao projeto DriveSync, que já possui simulação semafórica e telemetria.

## Funcionalidades
- Calculadora de potência, energia e custo variável mensal de um cruzamento.
- Comparação para a **mesma demanda e os mesmos 30 dias**: rede elétrica, rede + solar fotovoltaica e alternativa de equipamentos eficientes.
- Estimativa de geração solar, economia variável e retorno simples.
- Citizen Assist AI: assistente conversacional **baseado em regras e cálculos**, não em IA generativa; responde sobre consumo, custos, solar, eficiência, impactos e limitações.
- Referências institucionais e alertas de hipóteses.
- Preservação do site original: laboratório semafórico, dashboard, integração Supabase e função Netlify/Google Routes API.

## Reprodutibilidade e transparência
- Exemplo hipotético: 200 W × 720 h / 1000 = **144 kWh/mês**; tarifa R$ 0,90/kWh → **R$ 129,60/mês**.
- Fonte solar hipotética: 1 kWp × 4,5 h/dia × 30 × 0,75 = **101,25 kWh/mês**.
- Valores **não são dados reais de campo** e não podem ser apresentados como resultados observados.
- Fórmulas, alternativas, justificativas, viabilidade, impacto ambiental, referências e limites: [ANALISE_ENERGETICA.md](documentacao/ANALISE_ENERGETICA.md).
- O assistente é determinístico: perguntas fora das categorias respondem com instruções, não inventam cálculos.
- 

## Referências institucionais
- [ANEEL](https://www.gov.br/aneel/pt-br)
- [CRESESB/CEPEL](https://cresesb.cepel.br/)
- [EPE](https://www.epe.gov.br/)

Estas instituições são referências para consulta; os valores iniciais permanecem **hipóteses didáticas** até validação.
