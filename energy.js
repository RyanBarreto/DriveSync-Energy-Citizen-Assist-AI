// DriveSync Energy — cálculo determinístico, sem dependência de IA externa.
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const ids = ['lights','light-w','sensors','sensor-w','control-w','tariff','kwp','sun','pr','invest','maint','eff'];
  const brl = x => x.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
  const num = x => x.toLocaleString('pt-BR',{maximumFractionDigits:2});
  let result;
  function compute(v) {
    const power = v.lights*v['light-w']+v.sensors*v['sensor-w']+v['control-w'];
    const consumption = power*24*30/1000;
    const gridCost = consumption*v.tariff;
    const solarGeneration = v.kwp*v.sun*30*v.pr;
    const solarUsed = Math.min(consumption,solarGeneration);
    const solarSaving = solarUsed*v.tariff;
    const solarResidual = Math.max(0,gridCost-solarSaving);
    const efficientConsumption = consumption*(1-v.eff/100);
    const efficiencySaving = (consumption-efficientConsumption)*v.tariff;
    const annualNetSaving = solarSaving*12-v.maint;
    const payback = annualNetSaving>0 ? v.invest/annualNetSaving : null;
    return {power,consumption,gridCost,solarGeneration,solarUsed,solarSaving,solarResidual,efficientConsumption,efficiencySaving,annualNetSaving,payback,v};
  }
  function render(){
    const v={}; for(const id of ids){v[id]=Number($('en-'+id).value);if(!Number.isFinite(v[id]))return;}
    if(!$('energy-form').reportValidity())return;
    result=compute(v);
    $('en-consumption').textContent=num(result.consumption)+' kWh';
    $('en-grid-cost').textContent=brl(result.gridCost);
    $('en-solar-gen').textContent=num(result.solarGeneration)+' kWh';
    $('en-saving').textContent=brl(result.solarSaving);
    $('en-eff-saving').textContent=brl(result.efficiencySaving);
    $('en-payback').textContent=result.payback===null?'Sem retorno no modelo':num(result.payback)+' anos';
    const max=Math.max(result.gridCost,1);
    for(const [key,value] of [['grid',result.gridCost],['solar',result.solarResidual],['eff',result.gridCost-result.efficiencySaving]]){
      $('en-bar-'+key).style.width=(value/max*100)+'%';$('en-bar-'+key+'-label').textContent=brl(value);
    }
    $('en-recommendation').textContent=`Com ${num(result.power)} W de potência média, o cruzamento consumiria ${num(result.consumption)} kWh em 30 dias. O sistema solar proposto geraria potencialmente ${num(result.solarGeneration)} kWh/mês e compensaria no máximo ${num(result.solarUsed)} kWh do consumo. Compare essa opção com a redução de ${v.eff}% da potência dos equipamentos, sem presumir que a economia esteja garantida.`;
  }
  function answer(question){
    const q=question.toLocaleLowerCase('pt-BR'),r=result;
    const sources='Fontes para validação: ANEEL (tarifas e regulação), CRESESB (irradiação solar), EPE (contexto energético).';
    if(/solar|fotovolta|painel|renov|payback|retorno/.test(q))return `No cenário informado, a geração fotovoltaica estimada é ${num(r.solarGeneration)} kWh/mês (potência × horas de sol pleno × 30 × fator de desempenho). A parcela aproveitada no modelo é ${num(r.solarUsed)} kWh/mês e a economia variável estimada é ${brl(r.solarSaving)}/mês. ${r.payback===null?'O retorno simples não é positivo nas hipóteses atuais.':'Retorno simples estimado: '+num(r.payback)+' anos.'} O cálculo não inclui tarifas mínimas, baterias, tributos, financiamento ou excedentes. ${sources}`;
    if(/consum|pot[eê]ncia|kwh|energia/.test(q))return `Potência total: ${num(r.power)} W. Consumo em 30 dias: ${num(r.consumption)} kWh, pela fórmula E = P × 24 × 30 / 1000. Os equipamentos foram considerados ligados continuamente e as potências são hipóteses editáveis, não medições. ${sources}`;
    if(/custo|pre[cç]o|tarifa|econom|pagar|conta/.test(q))return `Custo variável da rede: ${brl(r.gridCost)}/mês. Com geração solar aproveitada: ${brl(r.solarResidual)}/mês. Com equipamentos ${r.v.eff}% mais eficientes: ${brl(r.gridCost-r.efficiencySaving)}/mês. São cenários alternativos comparados sobre os mesmos 30 dias; custos fixos não estão incluídos. ${sources}`;
    if(/efici|led|equipamento|sensor/.test(q))return `Uma redução hipotética de ${r.v.eff}% na potência dos equipamentos economizaria ${num(r.consumption-r.efficientConsumption)} kWh/mês, equivalentes a ${brl(r.efficiencySaving)}/mês. Verifique as fichas técnicas e a compatibilidade dos equipamentos antes de adotar a alternativa. ${sources}`;
    if(/ambient|carbon|emiss|sustent/.test(q))return `Energia solar é renovável, mas painéis, inversores e baterias possuem impactos de fabricação e descarte. A economia elétrica potencial não equivale automaticamente a emissões evitadas: seria necessário um fator de emissão verificável para o período e local. ${sources}`;
    if(/fonte|refer|dado|limita|hip[oó]tese/.test(q))return `Os valores iniciais de potência, tarifa, irradiação e investimento são hipóteses didáticas editáveis. Valide tarifa na distribuidora/ANEEL, irradiação no CRESESB, potência e preço em fichas e cotações de fornecedores. Documentação e premissas estão na pasta documentacao/ do repositório. ${sources}`;
    return `Posso explicar consumo, custos, energia solar, eficiência energética, impactos ambientais e referências. Os resultados atuais indicam ${num(r.consumption)} kWh/mês e custo variável de ${brl(r.gridCost)}/mês. Pergunte, por exemplo: “Quanto economizo com energia solar?”.`;
  }
  $('energy-form').addEventListener('submit',e=>{e.preventDefault();render();});
  $('energy-chat-form').addEventListener('submit',e=>{
    e.preventDefault();const input=$('energy-question'),question=input.value.trim();if(!question)return;
    const chat=$('energy-chat');for(const [label,value] of [['Você',question],['Assistente',answer(question)]]){
      const p=document.createElement('p'),b=document.createElement('b');b.textContent=label+': ';p.appendChild(b);p.appendChild(document.createTextNode(value));chat.appendChild(p);
    }
    input.value='';chat.scrollTop=chat.scrollHeight;
  });
  render();
  // Exportação para testes automatizados em Node sem executar a interface.
  if(typeof module!=='undefined'&&module.exports)module.exports={compute};
})();
