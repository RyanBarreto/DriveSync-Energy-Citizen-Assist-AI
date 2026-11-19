# Citizen Assist AI — Semáforos Sustentáveis

**Projeto independente da Global Solution — Soluções em Energias Renováveis e Sustentáveis (1CC).** Não é o site DriveSync e não depende dele.

**Integrantes:** [Nome completo — RM] / [Nome completo — RM]

## Público e problema
Público: equipes municipais responsáveis por infraestrutura semafórica e cidadãos interessados em sustentabilidade urbana. Problema: compreender consumo elétrico de conjuntos semafóricos, sensores e controle, comparando rede elétrica, geração solar e eficiência dos equipamentos.

## Funcionalidade
Assistente de perguntas e respostas em terminal, baseado em regras e cálculos determinísticos, sem modelo de IA generativa. Responde sobre consumo, tarifa, geração solar, economia, payback, impactos e limitações. Os valores iniciais são **hipóteses didáticas**, não medições.

## Como executar
Requer Python 3.9+ (sem bibliotecas externas).
```bash
python src/assistente.py
python -m unittest discover -s testes -v
```
Perguntas para demonstrar: "Quanto consome?", "Qual o custo?", "Vale a pena usar energia solar?", "Qual a economia?", "Quais os impactos ambientais?".

## Documentos
- `dados/cenario_hipotetico.json`: premissas editáveis, em unidades explícitas.
- `documentacao/ANALISE_E_COMPARACAO.md`: fórmulas, resultados, alternativas e justificativas.
- `documentacao/REFERENCIAS_E_LIMITACOES.md`: fontes institucionais para validação e ressalvas.
- `documentacao/ROTEIRO_VIDEO_3_MIN.md`: roteiro para YouTube.
- `testes/REGISTRO_TESTES_USUARIOS.md`: formulário a preencher **após testes reais**.
- `entrega/ENTREGA_MODELO.txt`: arquivo de envio ao Portal.

## Pendências antes de enviar
Validar potência e tarifas com fichas técnicas e dados locais; documentar URLs e datas; executar e registrar testes reais com usuários; adicionar integrantes/RMs; gravar vídeo não listado e preencher links no TXT. Nenhuma melhoria percentual ou economia estimada é resultado observado em campo.
