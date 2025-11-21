const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Configuração do CORS
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Conexão com MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Conectado ao MongoDB'))
  .catch(err => console.error('❌ Erro ao conectar ao MongoDB:', err.message));

// Rota inicial
app.get('/', (req, res) => {
  res.send('API do Meu F#dido Diário funcionando a todo vapor!');
});

// Importa e usa as rotas de usuários
const usuarioRoutes = require('./routes/UsuarioRoutes');
app.use('/usuarios', usuarioRoutes);

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ mensagem: 'Erro interno do servidor' });
});

// Inicializa servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});