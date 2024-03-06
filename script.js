var dados = [];

function gerarNumeroAleatorio(min, max, skewFactor) {
  let u = Math.random();
  let v = Math.random();
  // Creating a bias in the distribution
  let skewed = Math.pow(u, skewFactor) * (Math.sign(v - 0.5) * -1);
  // Normalizing skewed to be between 0 and 1
  let normalized = (skewed + 1) / 2;
  // Scaling the normalized value to the desired range [min, max]
  let num = normalized * (max - min) + min;
  // Rounding to 2 decimal places
  return num.toFixed(2);
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

  const lowerHalf = valores.slice(0, meioIndex);
  let upperHalf;

  if (valores.length % 2 === 0) {
    upperHalf = valores.slice(meioIndex);
  } else {
    upperHalf = valores.slice(meioIndex + 1);
  }

  // Assegurar que o cálculo use números, converter a saída de calcularMediana de volta para número, se necessário
  const q1 = parseFloat(calcularMediana(lowerHalf));
  const q3 = parseFloat(calcularMediana(upperHalf));
  const iqr = q3 - q1;
  // Agora, limiteSup e limiteInf são calculados diretamente como números
  const limiteSup = q3 + 1.5 * iqr;
  const limiteInf = q1 - 1.5 * iqr;
  // Outliers
  const outliers = dados.filter(number => number > limiteSup || number < limiteInf).sort((a,b) => +a - +b);
  console.log(outliers)

  // Aplicar toFixed apenas quando for formatar a saída final
  return { 
    iqr: iqr.toFixed(2), 
    q1: q1.toFixed(2), 
    q3: q3.toFixed(2), 
    ls: limiteSup.toFixed(2), 
    li: limiteInf.toFixed(2),
    out: outliers
  };
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
      let valor = gerarNumeroAleatorio(60, 120, 2.4);
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
    <p>Limite Superior: ${iqrValues.ls}</p>
    <p>Limite Inferior: ${iqrValues.li}</p>
    <p>Número de outliers: ${iqrValues.out.length}</p>
    <p>Valores outliers: [${iqrValues.out.join("; ")}]</p>
  `;
  document.getElementById("estatisticas").style.display = "block";
}