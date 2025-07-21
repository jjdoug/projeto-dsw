const API_URL = 'http://localhost:5000'; // Usa o IP externo

async function buscarEntrega() {
    const codigo = document.getElementById('inputCodigo').value.trim();
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = '';

    if (!codigo) {
        alert('Por favor, digite um código de rastreamento.');
        return;
    }

    try {
        // Busca todas as entregas
        const response = await fetch(`${API_URL}/entregas`);
        if (!response.ok) throw new Error('Erro ao buscar entregas');
        const entregas = await response.json();

        // Filtra pela propriedade codigo_rastreamento
        const entrega = entregas.find(e => e.codigo_rastreamento === codigo);

        if (!entrega) {
            resultadoDiv.innerHTML = `<p>Entrega não encontrada para o código: <strong>${codigo}</strong></p>`;
            return;
        }

        // Exibe dados básicos da entrega
        let html = `
            <h2>Dados da Entrega</h2>
            <p><strong>Código de Rastreamento:</strong> ${entrega.codigo_rastreamento}</p>
            <p><strong>Status Atual:</strong> ${entrega.status}</p>
            <p><strong>Data Estimada:</strong> ${entrega.data_estimada}</p>
        `;

        // Exibe histórico de movimentações
        if (entrega.historico && entrega.historico.length > 0) {
            html += `<h3>Histórico de Movimentações:</h3><ul>`;
            entrega.historico.forEach(evento => {
                html += `<li>${new Date(evento.data).toLocaleString()} - ${evento.status} (${evento.local})</li>`;
            });
            html += `</ul>`;
        } else {
            html += `<p>Sem histórico disponível.</p>`;
        }

        resultadoDiv.innerHTML = html;

    } catch (error) {
        resultadoDiv.innerHTML = `<p>Erro na busca: ${error.message}</p>`;
    }
}
