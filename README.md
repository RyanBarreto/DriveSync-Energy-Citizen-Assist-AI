# DriveSync Energy — Citizen Assist AI

**Global Solution | Ciência da Computação — Turmas 1CC | Soluções em Energias Renováveis e Sustentáveis**

> **Status:** protótipo funcional de software com dados ilustrativos. Faltam validação dos valores locais, testes reais com usuários, nomes/RMs e publicação dos links finais.

## Equipe
- [NOME COMPLETO] — RM [PREENCHER]
- [NOME COMPLETO] — RM [PREENCHER]

## Problema e público
Gestores municipais e equipes de manutenção precisam comparar o consumo e os custos de operação de semáforos, sensores e controles, e avaliar a viabilidade de alternativas renováveis. O DriveSync Energy integra um **assistente digital de orientação energética** ao projeto DriveSync, que já possui simulação semafórica e telemetria.

## Funcionalidades
- Calculadora de potência, energia e custo variável mensal de um cruzamento.
- Comparação para a **mesma demanda e os mesmos 30 dias**: rede elétrica, rede + solar fotovoltaica e alternativa de equipamentos eficientes.
- Estimativa de geração solar, economia variável e retorno simples.
- Citizen Assist AI: assistente conversacional **baseado em regras e cálculos**, não em IA generativa; responde sobre consumo, custos, solar, eficiência, impactos e limitações.
- Referências institucionais e alertas de hipóteses.
- Preservação do site original: laboratório semafórico, dashboard, integração Supabase e função Netlify/Google Routes API.

## Como executar
1. Abra o projeto no VS Code.
2. Para testar somente o módulo de energia, sirva a pasta com `python -m http.server 8000` e acesse `http://localhost:8000`.
3. Para a telemetria Google Routes, configure `GOOGLE_MAPS_API_KEY` no ambiente Netlify e use `netlify dev` ou deploy. A função está em `netlify/functions/maps.js`.
4. O módulo de energia funciona **sem chave de API** e sem Supabase.
5. Para publicar no GitHub, crie um repositório e envie os arquivos **desta pasta na raiz**.

## Estrutura
```text
index.html / style.css / script.js / simulator.js  # DriveSync original
energy.js                                         # cálculo e assistente
netlify.toml / netlify/functions/maps.js          # Google Routes API
README.md                                         # projeto e execução
dados/premissas_exemplo.csv                       # parâmetros e origem
dados/exemplo_calculado.json                      # resultado de referência
documentacao/ANALISE_ENERGETICA.md                # fórmulas, comparação, limites e fontes
documentacao/ROTEIRO_VIDEO_3_MIN.md               # vídeo pronto para gravação
testes/PLANO_E_REGISTRO.md                        # roteiro e tabela de testes (pendentes)
entrega/ENTREGA_MODELO.txt                        # único arquivo a entregar no portal
```

## Reprodutibilidade e transparência
- Exemplo hipotético: 200 W × 720 h / 1000 = **144 kWh/mês**; tarifa R$ 0,90/kWh → **R$ 129,60/mês**.
- Fonte solar hipotética: 1 kWp × 4,5 h/dia × 30 × 0,75 = **101,25 kWh/mês**.
- Valores **não são dados reais de campo** e não podem ser apresentados como resultados observados.
- Fórmulas, alternativas, justificativas, viabilidade, impacto ambiental, referências e limites: [ANALISE_ENERGETICA.md](documentacao/ANALISE_ENERGETICA.md).
- O assistente é determinístico: perguntas fora das categorias respondem com instruções, não inventam cálculos.

## Pendências obrigatórias antes de entregar
- [ ] Preencher nomes completos e RMs.
- [ ] Validar potências com fichas técnicas, tarifa e irradiação com fontes específicas e datas.
- [ ] Registrar testes reais e ajustes no arquivo `testes/PLANO_E_REGISTRO.md`.
- [ ] Publicar o repositório no GitHub e conferir acesso.
- [ ] Gravar o vídeo não listado, com até 3 minutos, e conferir acesso.
- [ ] Preencher `entrega/ENTREGA_MODELO.txt` e enviar **somente o TXT** no portal.

## Referências institucionais
- [ANEEL](https://www.gov.br/aneel/pt-br)
- [CRESESB/CEPEL](https://cresesb.cepel.br/)
- [EPE](https://www.epe.gov.br/)

Estas instituições são referências para consulta; os valores iniciais permanecem **hipóteses didáticas** até validação.
