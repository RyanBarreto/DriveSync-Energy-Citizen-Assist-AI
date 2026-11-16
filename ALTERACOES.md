# DriveSync — painel analítico

## O que foi alterado
- Mantido o site e a integração Netlify/Google Routes API.
- Corrigidos os nomes dos campos enviados ao Supabase: `tempo_verde_ja` e `fluxo_status` (conforme captura de tela enviada).
- Adicionado painel com filtros por período e via, KPIs, histórico gráfico e ranking de atrasos, lendo até 1.000 registros recentes da tabela `telemetria`.
- Adicionado comparativo de cenário hipotético, com controle de redução estimada entre 0% e 40%. **Não é uma melhoria real comprovada.**
- Adicionado seletor de incidentes para simular ajustes do tempo verde. A Routes API não oferece um feed completo de acidentes.

## Publicação
1. Configure `GOOGLE_MAPS_API_KEY` nas variáveis de ambiente do Netlify.
2. Faça o deploy dos arquivos deste pacote.
3. Confira se sua tabela pública se chama `telemetria` e tem os campos `rua`, `velocidade`, `atraso`, `tempo_verde_ja`, `fluxo_status`, `coordenadas`, `created_at`.
4. Garanta políticas RLS adequadas para INSERT e SELECT, limitadas ao seu caso de uso. Não desabilite RLS. Para produção, evite INSERT/SELECT irrestritos: autentique usuários ou mova a escrita para uma função segura no servidor.
5. Teste uma consulta de endereço, confira se o registro foi inserido e atualize o painel.

## Limitações técnicas
- A rota atual tem destino fixo: Avenida Paulista, 2000. Métricas são da rota, não do cruzamento pesquisado.
- Velocidade é estimada por distância/duração, não obtida de sensor local.
- Atraso é `duration - staticDuration` do Google Routes.
- A simulação de tempo verde não prevê impacto real em tempo de viagem. Para provar melhorias, são necessários dados antes/depois de intervenções reais ou um simulador de tráfego calibrado.
- Dados existentes são armazenados como `text`, o que exige conversão no navegador. Para produção, prefira colunas numéricas com unidades definidas.
- Consultas são limitadas a 1.000 registros recentes, sem paginação.
- O gráfico histórico usa escalas independentes por série; compare tendências, não alturas absolutas entre unidades distintas.
- Para incidentes reais, será necessário um provedor de incidentes, registros de operadores ou integração com fontes municipais.
