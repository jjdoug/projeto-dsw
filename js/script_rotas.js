const URL_ROTAS = 'http://200.133.17.234:5000/rotas';

const formRota = document.getElementById('formRota');
const listaRotas = document.getElementById('listaRotas');
const filtroRota = document.getElementById('filtroRota');

async function carregarRotas(filtro = '') {
  try {
    const resposta = await fetch(URL_ROTAS);
    const rotas = await resposta.json();

    const rotasFiltradas = rotas.filter(rota =>
      rota.origem.toLowerCase().includes(filtro.toLowerCase()) ||
      rota.destino.toLowerCase().includes(filtro.toLowerCase())
    );

    listaRotas.innerHTML = '';

    rotasFiltradas.forEach(rota => {
      const li = document.createElement('li');
      const centros = rota.centros_intermediarios?.length > 0 ? ` - Centros: ${rota.centros_intermediarios.join(', ')}` : '';
      li.textContent = `${rota.id} - ${rota.origem} → ${rota.destino}${centros} (Distância: ${rota.distancia_km} km, Tempo: ${rota.tempo_estimado_h} h)`;
      listaRotas.appendChild(li);
    });
  } catch (erro) {
    console.error('Erro ao carregar rotas:', erro);
  }
}

formRota.addEventListener('submit', async (e) => {
  e.preventDefault();

  const origem = document.getElementById('origemRota').value.trim();
  const destino = document.getElementById('destinoRota').value.trim();
  const centrosRaw = document.getElementById('centrosIntermediarios').value.trim();
  const distancia_km = parseFloat(document.getElementById('distanciaRota').value);
  const tempo_estimado_h = parseFloat(document.getElementById('tempoEstimadoRota').value);

  const centros_intermediarios = centrosRaw ? centrosRaw.split(',').map(c => c.trim()).filter(c => c.length > 0) : [];

  if (!origem || !destino || isNaN(distancia_km) || isNaN(tempo_estimado_h)) {
    alert('Preencha todos os campos obrigatórios corretamente!');
    return;
  }

  const novaRota = {
    origem,
    destino,
    centros_intermediarios,
    distancia_km,
    tempo_estimado_h
  };

  try {
    const resposta = await fetch(URL_ROTAS, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(novaRota)
    });

    if (!resposta.ok) throw new Error('Erro ao cadastrar rota');

    formRota.reset();
    carregarRotas(filtroRota.value);
  } catch (erro) {
    console.error('Erro ao cadastrar rota:', erro);
    alert('Erro ao cadastrar rota. Veja o console.');
  }
});

filtroRota.addEventListener('input', (e) => {
  carregarRotas(e.target.value);
});

carregarRotas();
