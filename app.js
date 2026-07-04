// Constantes das taxas do banco 
const IOF = 1.0238; // 2,38%
const SPREAD = 1.04; // 4%

// Capturando elementos
const inputValor = document.getElementById('valor');
const selectMoeda = document.getElementById('moeda');
const btnCalcular = document.getElementById('btn-calcular');
const caixaResultado = document.getElementById('caixa-resultado');
const spanCotacao = document.getElementById('cotacao-base');
const spanData = document.getElementById('data-ptax');
const spanTotal = document.getElementById('total');

// Formata data para a API
function formatarDataParaBacen(data) {
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  const ano = data.getFullYear();
  return `'${mes}-${dia}-${ano}'`;
}

// Função principal disparada pelo botão
async function realizarCalculo() {
  const valor = parseFloat(inputValor.value);
  
  // Validação: impede o cálculo se o campo estiver vazio
  if (isNaN(valor) || valor <= 0) {
    alert("Por favor, insira um valor válido na compra.");
    return;
  }

  // Prepara a tela para o carregamento
  caixaResultado.style.display = 'block';
  btnCalcular.innerText = "Calculando...";
  btnCalcular.disabled = true;
  spanCotacao.innerText = "Buscando...";
  spanData.innerText = "...";
  spanTotal.innerText = "...";

  const moeda = selectMoeda.value;
  const hoje = new Date();
  const semanaPassada = new Date();
  semanaPassada.setDate(hoje.getDate() - 7);

  const url = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaPeriodo(moeda=@moeda,dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@moeda='${moeda}'&@dataInicial=${formatarDataParaBacen(semanaPassada)}&@dataFinalCotacao=${formatarDataParaBacen(hoje)}&$top=1&$orderby=dataHoraCotacao%20desc&$format=json&$select=cotacaoVenda,dataHoraCotacao`;

  try {
    const resposta = await fetch(url);
    const dados = await resposta.json();

    if (dados.value && dados.value.length > 0) {
      const ptaxAtual = dados.value[0].cotacaoVenda;
      
      const dataDaTaxa = new Date(dados.value[0].dataHoraCotacao);
      const dataFormatada = dataDaTaxa.toLocaleDateString('pt-BR') + ' ' + dataDaTaxa.toLocaleTimeString('pt-BR');
      
      const calculoBase = valor * ptaxAtual;
      const totalComTaxas = calculoBase * SPREAD * IOF;
      
      spanData.innerText = dataFormatada;
      spanCotacao.innerText = ptaxAtual.toFixed(4).replace('.', ',');
      spanTotal.innerText = totalComTaxas.toFixed(2).replace('.', ',');
    } else {
      spanCotacao.innerText = "Erro: Sem dados do Bacen";
      spanTotal.innerText = "Erro";
    }
  } catch (erro) {
    spanCotacao.innerText = "Erro de conexão";
    spanTotal.innerText = "Erro";
    console.error(erro);
  } finally {
    // Restaura o botão ao estado normal
    btnCalcular.innerText = "Calcular Câmbio";
    btnCalcular.disabled = false;
  }
}

// Ouve o clique do botão
btnCalcular.addEventListener('click', realizarCalculo);
