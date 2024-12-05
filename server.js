// Importa o framework Express para criar o servidor
const express = require('express');

// Importa o módulo 'fs' para manipular arquivos no sistema
const fs = require('fs');

// Inicializa a aplicação Express
const app = express();

// Define a porta em que o servidor irá rodar
const PORT = 3001;

// Middleware para parsear o corpo da requisição como JSON
// Permite que o servidor leia e processe o corpo das requisições no formato JSON
app.use(express.json());

// Função para ler os clientes do arquivo JSON
const lerClientes = () => {
    const data = fs.readFileSync('clientes.json', 'utf-8'); // Lê o arquivo 'clientes.json' como texto
    return JSON.parse(data); // Converte o texto lido em um objeto/array JavaScript
};

// Função para escrever os clientes de volta no arquivo JSON
const escreverClientes = (clientes) => {
    // Escreve o array de clientes no arquivo, formatado com indentação
    fs.writeFileSync('clientes.json', JSON.stringify(clientes, null, 2));
};

// Rota para listar todos os clientes
app.get('/clientes', (req, res) => {
    try {
        const clientes = lerClientes();  // Lê os clientes do arquivo JSON
        res.json(clientes);  // Retorna os clientes como resposta em formato JSON
    } catch (error) {
        res.status(500).json({ error: 'Erro ao carregar os clientes' }); // Retorna erro se a leitura falhar
    }
});

// Rota para obter um cliente específico pelo ID
app.get('/clientes/:id', (req, res) => {
    try {
        const { id } = req.params; // Obtém o ID passado na URL
        const clientes = lerClientes(); // Lê os clientes do arquivo JSON
        const cliente = clientes.find(c => c.cliente_id === parseInt(id)); // Busca o cliente pelo ID

        if (!cliente) { // Verifica se o cliente não foi encontrado
            return res.status(404).json({ error: 'Cliente não encontrado' }); // Retorna erro 404
        }

        res.json(cliente); // Retorna o cliente encontrado
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar o cliente' }); // Retorna erro se algo falhar
    }
});

// Rota para criar um novo cliente
app.post('/clientes', (req, res) => {
    try {
        const { nome, endereco, cep, data_nascimento, telefone } = req.body; // Obtém os dados do corpo da requisição
        const clientes = lerClientes(); // Lê os clientes existentes

        const novoCliente = {
            cliente_id: clientes.length + 1,  // Gera um novo ID baseado no tamanho atual do array
            nome,
            endereco,
            cep,
            data_nascimento,
            telefone
        };

        clientes.push(novoCliente); // Adiciona o novo cliente ao array
        escreverClientes(clientes); // Salva o array atualizado no arquivo JSON

        res.status(201).json(novoCliente); // Retorna o cliente criado com status 201
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar cliente' }); // Retorna erro se algo falhar
    }
});

// Rota para editar um cliente existente
app.put('/clientes/:id', (req, res) => {
    try {
        const { id } = req.params; // Obtém o ID do cliente na URL
        const { nome, endereco, cep, data_nascimento, telefone } = req.body; // Obtém os dados do corpo da requisição
        const clientes = lerClientes(); // Lê os clientes existentes

        const clienteIndex = clientes.findIndex(c => c.cliente_id === parseInt(id)); // Encontra o índice do cliente pelo ID

        if (clienteIndex === -1) { // Verifica se o cliente não foi encontrado
            return res.status(404).json({ error: 'Cliente não encontrado' }); // Retorna erro 404
        }

        // Atualiza os dados do cliente no array
        clientes[clienteIndex] = {
            cliente_id: parseInt(id), // Garante que o ID permanece o mesmo
            nome,
            endereco,
            cep,
            data_nascimento,
            telefone
        };

        escreverClientes(clientes); // Salva o array atualizado no arquivo JSON

        res.json(clientes[clienteIndex]); // Retorna o cliente atualizado
    } catch (error) {
        res.status(500).json({ error: 'Erro ao editar cliente' }); // Retorna erro se algo falhar
    }
});

// Rota para excluir um cliente
app.delete('/clientes/:id', (req, res) => {
    try {
        const { id } = req.params; // Obtém o ID do cliente na URL
        const clientes = lerClientes(); // Lê os clientes existentes

        const clienteIndex = clientes.findIndex(c => c.cliente_id === parseInt(id)); // Encontra o índice do cliente pelo ID

        if (clienteIndex === -1) { // Verifica se o cliente não foi encontrado
            return res.status(404).json({ error: 'Cliente não encontrado' }); // Retorna erro 404
        }

        clientes.splice(clienteIndex, 1); // Remove o cliente do array
        escreverClientes(clientes); // Salva o array atualizado no arquivo JSON

        res.status(204).send(); // Retorna sucesso sem corpo (204 No Content)
    } catch (error) {
        res.status(500).json({ error: 'Erro ao excluir cliente' }); // Retorna erro se algo falhar
    }
});

// Inicia o servidor e exibe uma mensagem de inicialização
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
