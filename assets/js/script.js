const pesosInput = document.querySelector("input");
const monedaSelect = document.getElementById("selector");
const btn = document.querySelector("button");
const resultado = document.querySelector(".resultado");
const urlBase = "https://mindicador.cl/api";
let myChart = null;
btn.addEventListener("click", async () => {
  const valorMoneda = await buscarMoneda(monedaSelect.value);
  const valorFinal = (pesosInput.value / valorMoneda).toFixed(2);
  resultado.innerHTML = `Resultado: $${valorFinal}`;
});

const buscarMoneda = async (moneda) => {
  try {
    const res = await fetch(`${urlBase}/${moneda}`);
    const data = await res.json();
    const serie = data.serie;

    const datos = createDataToChart(serie.slice(0, 10).reverse());
    if (myChart) {
      myChart.destroy();
    }

    renderGrafico(datos);
    return serie[0].valor;
  } catch (error) {
    console.log(error);
  }
};

const createDataToChart = (datos) => {
  const labels = datos.map((dat) => formatDate(dat.fecha));
  const valor = datos.map((dat) => dat.valor);

  const datasets = [
    {
      label: "Historial 10 dias",
      borderColor: "rgb(255, 99, 132)",
      data: valor,
    },
  ];
  return { labels, datasets };
};

const renderGrafico = (data) => {
  const config = {
    type: "line",
    data,
  };
  if (myChart) {
    myChart.destroy();
  }

  const canvas = document.getElementById("myChart");
  myChart = new Chart(canvas, config);
};

const formatDate = (date) => {
  date = new Date(date);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${day}/${month}/${year}`;
};
