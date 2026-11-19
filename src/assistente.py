"""Citizen Assist AI: orientações energéticas para cruzamentos semafóricos.
Exemplo didático; todos os valores iniciais são hipóteses, não medições.
"""
import json
from pathlib import Path

BASE = Path(__file__).resolve().parents[1]
def carregar():
    return json.loads((BASE / "dados" / "cenario_hipotetico.json").read_text(encoding="utf-8"))

def calcular(d):
    p = d["conjuntos_semaforicos"] * d["potencia_por_conjunto_W"] + d["sensores"] * d["potencia_por_sensor_W"] + d["controle_W"]
    e = p * d["horas_dia"] * d["dias"] / 1000
    custo = e * d["tarifa_R_por_kWh"]
    g = d["solar_kWp"] * d["horas_sol_pleno_dia"] * d["dias"] * d["fator_desempenho"]
    aproveitada = min(e, g)
    economia = aproveitada * d["tarifa_R_por_kWh"]
    e_ef = e * (1 - d["reducao_equipamentos_pct"]/100)
    economia_ef = (e-e_ef) * d["tarifa_R_por_kWh"]
    saldo_anual = 12 * economia - d["manutencao_solar_anual_R"]
    payback = d["investimento_solar_R"]/saldo_anual if saldo_anual > 0 else None
    return dict(potencia_W=p, consumo_kWh=e, custo_rede_R=custo, geracao_solar_kWh=g,
                energia_solar_aproveitada_kWh=aproveitada, economia_solar_R=economia,
                custo_residual_R=custo-economia, consumo_eficiente_kWh=e_ef,
                economia_eficiente_R=economia_ef, payback_simples_anos=payback)

def responder(pergunta, d, r):
    q = pergunta.lower().strip()
    if any(x in q for x in ["consumo", "consome", "energia mensal", "potência", "potencia"]):
        return f"A potência média estimada é {r['potencia_W']:.0f} W e o consumo em {d['dias']} dias é {r['consumo_kWh']:.2f} kWh. Fórmula: potência (W) × horas / 1000."
    if any(x in q for x in ["solar", "renovável", "renovavel", "fotovoltaic"]):
        return f"Com {d['solar_kWp']} kWp, a geração hipotética é {r['geracao_solar_kWh']:.2f} kWh em {d['dias']} dias. Aproveitamento máximo: {r['energia_solar_aproveitada_kWh']:.2f} kWh. Exige validação de insolação, instalação e custos."
    if any(x in q for x in ["custo", "conta", "preço", "preco", "tarifa"]):
        return f"Na rede elétrica, custo variável estimado: R$ {r['custo_rede_R']:.2f} por {d['dias']} dias, à tarifa hipotética de R$ {d['tarifa_R_por_kWh']:.2f}/kWh. Não é uma conta real."
    if any(x in q for x in ["economia", "economizar", "eficiência", "eficiencia"]):
        return f"Solar: economia variável hipotética de R$ {r['economia_solar_R']:.2f}/mês. Equipamentos {d['reducao_equipamentos_pct']}% mais eficientes: R$ {r['economia_eficiente_R']:.2f}/mês. Não somar essas economias sem recalcular o cenário combinado."
    if any(x in q for x in ["retorno", "payback", "investimento", "vale a pena"]):
        t = f"{r['payback_simples_anos']:.2f} anos" if r["payback_simples_anos"] else "indeterminado"
        return f"Retorno simples estimado da alternativa solar: {t}. Depende de investimento, manutenção, insolação e tarifa; não é garantido."
    if any(x in q for x in ["impacto", "ambient", "sustent"]):
        return "A energia solar pode reduzir a compra de eletricidade da rede, mas depende do sol e tem impactos de fabricação e descarte. Sem fator de emissão validado, não estimamos CO₂ evitado."
    if any(x in q for x in ["fonte", "referência", "referencia", "limita"]):
        return "Consulte documentacao/REFERENCIAS_E_LIMITACOES.md. Todos os números do exemplo são hipóteses; verificar fichas técnicas, tarifa e dados solares locais."
    return "Posso orientar sobre consumo, custo, energia solar, economia, investimento, impacto ambiental e fontes. Não forneço recomendações garantidas."

def main():
    d=carregar(); r=calcular(d)
    print("CITIZEN ASSIST AI — SEMÁFOROS SUSTENTÁVEIS")
    print("Cenário didático hipotético. Digite 'sair' para encerrar.")
    while True:
        try: pergunta=input("\nSua pergunta: ")
        except (EOFError, KeyboardInterrupt): break
        if pergunta.strip().lower() in {"sair","exit"}: break
        print(responder(pergunta,d,r))
        print("Limite: estimativas, não medições. Fontes e premissas na documentação.")
if __name__ == "__main__": main()
