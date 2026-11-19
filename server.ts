import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import connection from './src/database/database';
import tables from './src/database/tables';
import router from './src/routers';

const app = express();
const port = Number(process.env.PORT) || 4000;

// Garante que o diretório de uploads exista
const uploadsDir = path.resolve(process.cwd(), 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

// Habilita CORS para permitir conexões de Web, Emuladores e Dispositivos Móveis
app.use(cors());

// Configura body parsers com limite adequado para imagens base64 (triagem IA)
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Expõe a pasta de uploads publicamente
app.use('/uploads', express.static(uploadsDir));

// Rota raiz de healthcheck
app.get('/', (_req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'AuHelp Back-end API',
    version: '1.0.0'
  });
});

// Inicializa tabelas e migrações no banco de dados
tables.init(connection);

// Inicializa rotas
router(app);

app.listen(port, () => {
  console.log(`AuHelp Backend running at http://localhost:${port}`);
});

export default app;
