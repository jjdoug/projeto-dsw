const API_URL = 'http://200.133.17.234:5000';

async function buscarEntregas() {
    const codigo = document.getElementById('inputCodigo').value.trim().toLowerCase();
    const clienteFiltro = document.getElementById('inputCliente').value.trim().toLowerCase();
    const status = document.getElementById('inputStatus').value.trim().toLowerCase();
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = '';

    try {
        const [clientesResponse, entregasResponse] = await Promise.all([
            fetch(`${API_URL}/clientes`),
            fetch(`${API_URL}/entregas`)
        ]);
        if (!clientesResponse.ok) throw new Error('Erro ao buscar clientes');
        if (!entregasResponse.ok) throw new Error('Erro ao buscar entregas');

        const clientes = await clientesResponse.json();
        const entregas = await entregasResponse.json();

        const mapaClientes = {};
        clientes.forEach(c => {
            mapaClientes[c.id] = c.nome;
        });

        const filtradas = entregas.filter(entrega => {
            const matchCodigo = codigo && (
                (entrega.codigo_rastreamento?.toLowerCase().includes(codigo)) ||
                (entrega.id?.toLowerCase().includes(codigo))
            );

            const nomeCliente = mapaClientes[entrega.clienteId] || '';

            const matchCliente = clienteFiltro && nomeCliente.toLowerCase().includes(clienteFiltro);
            const matchStatus = status && entrega.status && entrega.status.toLowerCase().includes(status);

            return (
                (codigo && matchCodigo) ||
                (clienteFiltro && matchCliente) ||
                (status && matchStatus)
            );
        });

        if (filtradas.length === 0) {
            resultadoDiv.innerHTML = '<p>Nenhuma entrega encontrada com os filtros fornecidos.</p>';
            return;
        }

        filtradas.forEach(entrega => {
            const nomeCliente = mapaClientes[entrega.clienteId] || 'Não informado';

            let html = `
                <div class="entrega">
                    <h2>${entrega.codigo_rastreamento || entrega.id}</h2>
                    <p><strong>Cliente:</strong> ${nomeCliente}</p>
                    <p><strong>Status:</strong> ${entrega.status}</p>
                    <p><strong>Data Estimada:</strong> ${entrega.data_estimada}</p>
            `;

            if (entrega.historico && entrega.historico.length > 0) {
                html += `<h4>Histórico:</h4><ul>`;
                entrega.historico.forEach(evento => {
                    html += `<li>${new Date(evento.data).toLocaleString()} - ${evento.status} (${evento.local})</li>`;
                });
                html += `</ul>`;
            } else {
                html += `<p>Sem histórico disponível.</p>`;
            }

            html += `</div><hr>`;
            resultadoDiv.innerHTML += html;
        });

    } catch (error) {
        resultadoDiv.innerHTML = `<p>Erro na busca: ${error.message}</p>`;
    }
}
