# Roteiro técnico — Citizen Assist AI: Semáforos Sustentáveis
**Duração prevista: 2min50s–3min.** Falar em ritmo natural. Mostrar o terminal, os cálculos e o repositório. Não mostrar o site DriveSync.

### 00:00–00:25 — Público e problema
“Nosso projeto Citizen Assist AI é um assistente de orientações energéticas para infraestrutura semafórica. Pensamos em cruzamentos com semáforos dinâmicos, sensores e sistemas de controle, que precisam de eletricidade para operar. O público são equipes responsáveis pela infraestrutura urbana e pessoas interessadas em sustentabilidade.”

### 00:25–00:55 — Análise de consumo
“Construímos um cenário didático com quatro conjuntos semafóricos de 30 watts, dois sensores de 25 watts e um sistema de controle de 30 watts. A potência total é de 200 watts. Funcionando 24 horas por dia durante 30 dias, o consumo estimado é de 144 quilowatts-hora. Com uma tarifa hipotética de 90 centavos por quilowatt-hora, o custo variável seria de 129 reais e 60 centavos.”

### 00:55–01:30 — Comparação de alternativas
“Comparamos a rede elétrica convencional, uma instalação solar fotovoltaica e equipamentos mais eficientes. No cenário solar de 1 quilowatt-pico, quatro horas e meia de sol pleno por dia e fator de desempenho de 75%, a geração estimada é de 101,25 quilowatts-hora mensais. Isso representaria economia variável de cerca de 91 reais por mês. Uma redução de 20% no consumo dos equipamentos economizaria 28,8 quilowatts-hora.”

### 01:30–01:55 — Custos e limitações
“A instalação solar tem investimento inicial e depende da insolação, espaço disponível e manutenção. Nosso exemplo considera investimento de 6.500 reais e manutenção anual de 150 reais, com retorno simples estimado em cerca de 6,9 anos. Todos esses valores são hipóteses, não medições reais, e devem ser validados com dados locais.”

### 01:55–02:30 — Demonstração do assistente
[ABRIR `python src/assistente.py`]
“Agora vamos testar o Citizen Assist AI. Ao perguntar ‘Quanto consome?’, o sistema explica o cálculo mensal. Ao perguntar ‘Vale a pena usar energia solar?’, informa a geração estimada e ressalta as limitações. Ele também responde sobre custos, economia e impactos ambientais com base nos mesmos dados do cenário.”

### 02:30–02:50 — Referências e testes
[MOSTRAR `documentacao/REFERENCIAS_E_LIMITACOES.md` E `testes/REGISTRO_TESTES_USUARIOS.md`]
“As fontes de consulta incluem ANEEL, CRESESB e EPE. A documentação distingue hipóteses de dados verificados e registra o protocolo de testes com usuários.” 
[Somente afirmar que testes foram realizados se realmente houver registros.]

### 02:50–03:00 — Encerramento
[MOSTRAR README]
“O código, os cálculos e as orientações estão organizados no GitHub. O objetivo é apoiar decisões energéticas mais conscientes na infraestrutura urbana.”
