const URL_ENCOMENDAS = 'http://localhost:5000/encomendas';

const formEncomenda = document.getElementById('formEncomenda');
const listaEncomendas = document.getElementById('listaEncomendas');
const filtroEncomenda = document.getElementById('filtroEncomenda');

async function carregarEncomendas(filtro = '') {
  try {
    const resposta = await fetch(URL_ENCOMENDAS);
    const encomendas = await resposta.json();

    const encomendasFiltradas = encomendas.filter(encomenda =>
      encomenda.tipo.includes(filtro.toLowerCase()) ||
      encomenda.peso.toString().includes(filtro)
    );

    listaEncomendas.innerHTML = '';

    encomendasFiltradas.forEach(encomenda => {
      const li = document.createElement('li');
      li.textContent = `${encomenda.id} - ${encomenda.tipo} (${encomenda.peso} kg) - ${encomenda.descricao}`;
      listaEncomendas.appendChild(li);
    });
  } catch (erro) {
    console.error('Erro ao carregar encomendas:', erro);
  }
}

formEncomenda.addEventListener('submit', async (e) => {
  e.preventDefault();

  const peso = parseFloat(document.getElementById('pesoEncomenda').value);
  const tipo = document.getElementById('tipoEncomenda').value;
  const descricao = document.getElementById('descricaoEncomenda').value.trim();
  const endereco_entrega = document.getElementById('enderecoEntrega').value.trim();

  if (!peso || !tipo || !descricao || !endereco_entrega) {
    alert('Preencha todos os campos corretamente!');
    return;
  }

  const novaEncomenda = { peso, tipo, descricao, endereco_entrega };

  try {
    const resposta = await fetch(URL_ENCOMENDAS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novaEncomenda)
    });

    if (!resposta.ok) throw new Error('Erro ao cadastrar encomenda');

    formEncomenda.reset();
    carregarEncomendas(filtroEncomenda.value);
  } catch (erro) {
    console.error('Erro ao cadastrar encomenda:', erro);
    alert('Erro ao cadastrar encomenda. Veja o console.');
  }
});

filtroEncomenda.addEventListener('input', (e) => {
  carregarEncomendas(e.target.value);
});

carregarEncomendas();
