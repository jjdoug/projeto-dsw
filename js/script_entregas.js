const URL_ENTREGAS = 'http://200.133.17.234:5000/entregas';
const URL_CLIENTES_ENTREGAS = 'http://200.133.17.234:5000/clientes';
const URL_ENCOMENDAS_ENTREGAS = 'http://200.133.17.234:5000/encomendas';
const URL_ROTAS_ENTREGAS = 'http://200.133.17.234:5000/rotas';

const formEntrega = document.getElementById('formEntrega');
const listaEntregas = document.getElementById('listaEntregas');
const filtroEntrega = document.getElementById('filtroEntrega');

const selectCliente = document.getElementById('clienteEntrega');
const selectEncomenda = document.getElementById('encomendaEntrega');
const selectRota = document.getElementById('rotaEntrega');

let clientes = [];
let encomendas = [];
let rotas = [];

async function carregarClientesSelect() {
  try {
    const res = await fetch(URL_CLIENTES_ENTREGAS);
    clientes = await res.json();
    selectCliente.innerHTML = '<option value="">Selecione o cliente</option>';
    clientes.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = `${c.nome} (${c.cpfCnpj})`;
      selectCliente.appendChild(opt);
    });
  } catch (e) {
    console.error('Erro ao carregar clientes:', e);
  }
}

async function carregarEncomendasSelect() {
  try {
    const res = await fetch(URL_ENCOMENDAS_ENTREGAS);
    encomendas = await res.json();
    selectEncomenda.innerHTML = '<option value="">Selecione a encomenda</option>';
    encomendas.forEach(en => {
      const opt = document.createElement('option');
      opt.value = en.id;
      opt.textContent = `${en.tipo} - ${en.descricao}`;
      selectEncomenda.appendChild(opt);
    });
  } catch (e) {
    console.error('Erro ao carregar encomendas:', e);
  }
}

async function carregarRotasSelect() {
  try {
    const res = await fetch(URL_ROTAS_ENTREGAS);
    rotas = await res.json();
    selectRota.innerHTML = '<option value="">Selecione a rota</option>';
    rotas.forEach(r => {
      const opt = document.createElement('option');
      opt.value = r.id;
      opt.textContent = `${r.origem} → ${r.destino}`;
      selectRota.appendChild(opt);
    });
  } catch (e) {
    console.error('Erro ao carregar rotas:', e);
  }
}

async function carregarEntregas(filtro = '') {
  try {
    const res = await fetch(URL_ENTREGAS);
    const entregas = await res.json();

    const entregasFiltradas = entregas.filter(entrega => {
      const cliente = clientes.find(c => c.id === entrega.clienteId);
      const encomenda = encomendas.find(e => e.id === entrega.encomendaId);
      const rota = rotas.find(r => r.id === entrega.rotaId);

      const clienteText = cliente?.nome || '';
      const encomendaText = encomenda ? `${encomenda.tipo} - ${encomenda.descricao}` : '';
      const rotaText = rota ? `${rota.origem} → ${rota.destino}` : '';
      const statusText = entrega.status || '';
      const dataText = entrega.data_estimada || '';

      return (
        clienteText.toLowerCase().includes(filtro.toLowerCase()) ||
        encomendaText.toLowerCase().includes(filtro.toLowerCase()) ||
        rotaText.toLowerCase().includes(filtro.toLowerCase()) ||
        statusText.toLowerCase().includes(filtro.toLowerCase()) ||
        dataText.includes(filtro)
      );
    });

    listaEntregas.innerHTML = '';

    entregasFiltradas.forEach(entrega => {
      const cliente = clientes.find(c => c.id === entrega.clienteId);
      const encomenda = encomendas.find(e => e.id === entrega.encomendaId);
      const rota = rotas.find(r => r.id === entrega.rotaId);

      const li = document.createElement('li');
      li.textContent = `ID: ${entrega.id} - Cliente: ${cliente?.nome || 'Desconhecido'} - Encomenda: ${encomenda?.tipo || 'Desconhecido'} - Rota: ${rota?.origem || ''} → ${rota?.destino || ''} - Data: ${entrega.data_estimada} - Status: ${entrega.status}`;
      listaEntregas.appendChild(li);
    });
  } catch (erro) {
    console.error('Erro ao carregar entregas:', erro);
  }
}

formEntrega.addEventListener('submit', async (e) => {
  e.preventDefault();

  const clienteId = selectCliente.value;
  const encomendaId = selectEncomenda.value;
  const rotaId = selectRota.value;
  const data_estimada = document.getElementById('dataEstimadaEntrega').value;
  const status = document.getElementById('statusEntrega').value;

  if (!clienteId || !encomendaId || !rotaId || !data_estimada || !status) {
    alert('Preencha todos os campos!');
    return;
  }

  const novaEntrega = {
    clienteId: clienteId,
    encomendaId: encomendaId,
    rotaId: rotaId,
    data_estimada,
    status
  };

  try {
    const resposta = await fetch(URL_ENTREGAS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novaEntrega)
    });

    if (!resposta.ok) throw new Error('Erro ao cadastrar entrega');

    formEntrega.reset();
    carregarEntregas(filtroEntrega.value);
  } catch (erro) {
    console.error('Erro ao cadastrar entrega:', erro);
    alert('Erro ao cadastrar entrega. Veja o console.');
  }
});

filtroEntrega.addEventListener('input', (e) => {
  carregarEntregas(e.target.value);
});

async function inicializarSelects() {
  await carregarClientesSelect();
  await carregarEncomendasSelect();
  await carregarRotasSelect();
  carregarEntregas();
}

inicializarSelects();
