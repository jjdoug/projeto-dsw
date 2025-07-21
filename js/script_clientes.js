const URL_CLIENTES = 'http://localhost:5000/clientes';

const formCliente = document.getElementById('formCliente');
const listaClientes = document.getElementById('listaClientes');
const filtroCliente = document.getElementById('filtroCliente');

async function carregarClientes(filtro = '') {
  try {
    const resposta = await fetch(URL_CLIENTES);
    const clientes = await resposta.json();

    const clientesFiltrados = clientes.filter(cliente =>
      cliente.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      cliente.cpfCnpj.includes(filtro)
    );

    listaClientes.innerHTML = '';

    clientesFiltrados.forEach(cliente => {
      const li = document.createElement('li');
      li.textContent = `${cliente.id} - ${cliente.nome} (${cliente.cpfCnpj})`;
      listaClientes.appendChild(li);
    });
  } catch (erro) {
    console.error('Erro ao carregar clientes:', erro);
  }
}

formCliente.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = document.getElementById('nomeCliente').value.trim();
  const cpfCnpj = document.getElementById('cpfCnpjCliente').value.trim();
  const email = document.getElementById('emailCliente').value.trim();
  const endereco = document.getElementById('enderecoCliente').value.trim();

  if (!nome || !cpfCnpj || !email || !endereco) {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  const novoCliente = { nome, cpfCnpj, email, endereco };

  try {
    const resposta = await fetch(URL_CLIENTES, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoCliente)
    });

    if (!resposta.ok) throw new Error('Erro ao cadastrar');

    formCliente.reset();
    carregarClientes(filtroCliente.value);
  } catch (erro) {
    console.error('Erro ao cadastrar cliente:', erro);
    alert('Erro ao cadastrar cliente. Veja o console para detalhes.');
  }
});

filtroCliente.addEventListener('input', (e) => {
  carregarClientes(e.target.value);
});

carregarClientes();
