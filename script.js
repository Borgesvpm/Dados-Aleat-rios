var dados = [];

function gerarNumeroAleatorio(min, max) {
  return (Math.random() * (max - min) + min).toFixed(2);
}

function calcularMedia(valores) {
  const soma = valores.reduce((acc, valor) => acc + parseFloat(valor), 0);
  return (soma / valores.length).toFixed(2);
}

function calcularModa(valores) {
  let freqMap = {};
  let maxFreq = 0;
  let modas = [];

  valores.forEach((valor) => {
    if (!freqMap[valor]) freqMap[valor] = 0;
    freqMap[valor]++;

    if (freqMap[valor] > maxFreq) {
      maxFreq = freqMap[valor];
      modas = [valor];
    } else if (freqMap[valor] === maxFreq) {
      modas.push(valor);
    }
  });

  return [...new Set(modas)];
}

function calcularIQR(valores) {
  valores = valores.map(v => parseFloat(v)).sort((a, b) => a - b);
  const meioIndex = Math.floor(valores.length / 2);

  // Divide o conjunto de dados em duas metades
  const lowerHalf = valores.slice(0, meioIndex);
  const upperHalf = valores.length % 2 === 0 ? valores.slice(meioIndex) : valores.slice(meioIndex + 1);

  // Reutiliza a função calcularMediana para calcular Q1 e Q3
  const q1 = calcularMediana(lowerHalf);
  const q3 = calcularMediana(upperHalf);
  const iqr = q3 - q1;

  return { iqr: iqr.toFixed(2), q1: q1, q3: q3 };
}

// Reutiliza a função calcularMediana existente para calcular Q1 e Q3
function calcularMediana(valores) {
  valores.sort((a, b) => a - b);
  const meio = Math.floor(valores.length / 2);

  if (valores.length % 2 === 0) {
    return ((parseFloat(valores[meio - 1]) + parseFloat(valores[meio])) / 2).toFixed(2);
  } else {
    return parseFloat(valores[meio]).toFixed(2);
  }
}


function gerarTabela() {
  dados = [];
  var linhas = parseInt(document.getElementById("linhas").value, 10);
  var colunas = parseInt(document.getElementById("colunas").value, 10);
  var tabela = "<table>";

  for (let i = 0; i < linhas; i++) {
    tabela += "<tr>";
    for (let j = 0; j < colunas; j++) {
      let valor = gerarNumeroAleatorio(60, 120);
      dados.push(valor);
      tabela += `<td>${valor}</td>`;
    }
    tabela += "</tr>";
  }
  tabela += "</table>";

  document.getElementById("tabelaGerada").innerHTML = tabela;
  document.getElementById("mostarResposta").style.display = "block"; // Mostra o botão "Mostrar estatísticas"
  document.getElementById("estatisticas").style.display = "none";
}

function mostarResposta() {
  // Calculando e mostrando estatísticas
  const estatisticasDiv = document.getElementById("estatisticas");
  const iqrValues = calcularIQR(dados);
  estatisticasDiv.innerHTML = `
    <p>Média: ${calcularMedia(dados)}</p>
    <p>Mediana: ${calcularMediana(dados)}</p>
    <p>IQR: ${iqrValues.iqr}</p>
    <p>Q1: ${iqrValues.q1}</p>
    <p>Q3: ${iqrValues.q3}</p>
    <p>Limite Superior: ${(parseFloat(calcularMediana(dados)) + 1.5 * parseFloat(iqrValues.iqr)).toFixed(2)}</p>
    <p>Limite Inferior: ${(parseFloat(calcularMediana(dados)) - 1.5 * parseFloat(iqrValues.iqr)).toFixed(2)}</p>
  `;
  document.getElementById("estatisticas").style.display = "block";
}