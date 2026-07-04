# 🟣 Calculadora de Câmbio Nubank (PTAX)

Uma ferramenta web simples, leve e sem dependências (Vanilla JS, HTML e CSS) para calcular o valor exato de compras internacionais no cartão de crédito Nubank. 

Em vez de usar o câmbio comercial flutuante, a calculadora consome a **API oficial do Banco Central do Brasil (Bacen)** para buscar a taxa **PTAX de Venda**, garantindo altíssima precisão com a sua fatura.

## 🚀 Funcionalidades
- Busca automática da última cotação PTAX de fechamento válida via API Olinda (Bacen).
- Cálculo automático das taxas fixas do Nubank: **Spread (4%)** e **IOF (2,38%)**.
- Suporte a múltiplas moedas (USD, JPY, EUR, GBP, CAD, ARS).
- Interface responsiva e otimizada para uso rápido no celular.

## 🛠️ Como usar
Não é necessário instalar nada (Node, NPM, etc). O projeto roda 100% no lado do cliente.
Basta clonar este repositório e abrir o arquivo `index.html` no seu navegador favorito.

## 🧮 A Matemática
O cálculo por trás da ferramenta segue a regra oficial da instituição financeira:
`Valor Final = (Valor da Compra * PTAX de Venda) * 1.04 (Spread) * 1.0238 (IOF)`
