import winston from 'winston';
// Permite rotacionar arquivos de log por data/tamanho
import DailyRotateFile from 'winston-daily-rotate-file';

// Formato personalizado para logs
const logFormat = winston.format.combine(
  winston.format.timestamp(), // Adiciona data e hora a cada entrada
  winston.format.errors({ stack: true }), // Captura e formata stack traces de erros
  winston.format.metadata(), // Metadados adicionais
  winston.format.json() // Converte tudo para formato JSON
);

// Criação do logger
const logger = winston.createLogger({
  // Define o nível de log baseado no ambiente - menos verboso em produção
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  defaultMeta: { service: 'pokemon-service' },
  transports: [
    // Logs de erro
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '30d', // Mantém logs por 30 dias
      maxSize: '10m',  // Rotaciona quando atingir 10MB
    }),
    
    // Todos os logs
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '30d',
      maxSize: '10m',
    }),
  ]
});

// Middleware para registros de todas as requisições HTTP
const requestLogger = (req, res, next) => {
  // Captura o tempo inicial
  const start = Date.now();
  
  // Registra o evento quando a resposta for enviada
  res.on('finish', () => {

    // Tempo de rocessamento da requisição
    const duration = Date.now() - start;
    
    logger.info('HTTP Request', {
      method: req.method, // Método HTTP
      path: req.path, // Caminho da URL
      duration: `${duration}ms`, // Tempo de processamento
      status: res.statusCode, // Código de resposta
      userAgent: req.get('user-agent'), // Navegador usado
      ip: req.ip, // Endereço IP
      userId: req.session?.user?.username || 'anonymous', // Identifica o usuário se disponível
      query: req.query, // Parâmetros da query string
      body: sanitizeBody(req.body), // Corpo da requisição com dados sensíveis removidos
    });
  });

  next();
};

// Middleware para registro de erros
const errorLogger = (err, req, res, next) => {
  logger.error('Application Error', {

    error: {
      message: err.message, // Mensagem de erro
      stack: err.stack, // Stack trace completo
      ...err // Quaisquer outras propriedades do objeto de erro
    },

    request: {
      method: req.method,
      path: req.path,
      headers: req.headers,
      query: req.query,
      body: sanitizeBody(req.body),
      userId: req.session?.user?.username || 'anonymous',
    }
  });
  
  next(err);
};

// Remover dados sensíveis dos logs
const sanitizeBody = (body) => {
  if (!body) return body;
  
  const sanitized = { ...body };
  const sensitiveFields = ['password', 'token', 'secret', 'creditCard'];
  
  // Substitui cada campo sensível por um marcador
  sensitiveFields.forEach(field => {
    if (field in sanitized) {
      sanitized[field] = '[REDACTED]';
    }
  });
  
  return sanitized;
};

// Registrar eventos de autenticação
const logAuthEvent = (username, success, reason = null) => {
  logger.info('Authentication Event', {
    event: 'authentication', // Tipo de evento
    username, // Nome do usuário
    success, // Se a autenticação foi bem-sucedida
    reason, // Motivo da falha
    timestamp: new Date().toISOString() // Timestamp
  });
};

// Registrar operações de banco de dados
const logDatabaseOperation = (operation, collection, success, duration) => {
  logger.info('Database Operation', {
    event: 'database',
    operation,
    collection,
    success,
    duration: `${duration}ms`,
    timestamp: new Date().toISOString()
  });
};

export { 
  logger, 
  requestLogger, 
  errorLogger,
  logAuthEvent,
  logDatabaseOperation
};