// Constantes das taxas do banco
const IOF = 1.0238; // 2,38%
const SPREAD = 1.04; // 4%

let ptaxAtual = 0; // Guarda a cotação na memória para não floodar a API

const inputValor = document.getElementById('valor');
const selectMoeda = document.getElementById('moeda');
const spanCotacao = document.getElementById('cotacao-base');
const spanData = document.getElementById('data-ptax');
const spanTotal = document.getElementById('total');

// A API do Banco Central exige a data no formato americano (MM-DD-YYYY)
function formatarDataParaBacen(data) {
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  const ano = data.getFullYear();
  return `'${mes}-${dia}-${ano}'`;
}

// Busca a taxa oficial de fechamento (PTAX Venda) no Governo
async function buscarPTAX() {
  spanCotacao.innerText = "Buscando...";
  spanData.innerText = "...";
  spanTotal.innerText = "...";

  const moeda = selectMoeda.value;

  // Truque: Buscamos uma janela dos últimos 7 dias para evitar erros nos finais de semana e feriados
  const hoje = new Date();
  const semanaPassada = new Date();
  semanaPassada.setDate(hoje.getDate() - 7);

  // URL oficial da API Olinda do Banco Central do Brasil
  const url = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaPeriodo(moeda=@moeda,dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@moeda='${moeda}'&@dataInicial=${formatarDataParaBacen(semanaPassada)}&@dataFinalCotacao=${formatarDataParaBacen(hoje)}&$top=1&$orderby=dataHoraCotacao%20desc&$format=json&$select=cotacaoVenda,dataHoraCotacao`;

  try {
    const resposta = await fetch(url);
    const dados = await resposta.json();

    if (dados.value && dados.value.length > 0) {
      ptaxAtual = dados.value[0].cotacaoVenda;
      
      // Formata a data para ficar visualmente agradável no Brasil
      const dataDaTaxa = new Date(dados.value[0].dataHoraCotacao);
      const dataFormatada = dataDaTaxa.toLocaleDateString('pt-BR') + ' ' + dataDaTaxa.toLocaleTimeString('pt-BR');
      
