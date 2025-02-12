import NodeCache from 'node-cache'; // implementa cache em memória

const cache = new NodeCache({
  // Define o tempo padrão que os itens permanecerão no cache (1 hora em segundos)
  stdTTL: 3600,
  // Define o intervalo em que o cache verifica por itens expirados (a cada 2 minutos)
  checkperiod: 120, 
  // Quando false, armazena referências diretas aos objetos ao invés de fazer cópias
  useClones: false,
});

const cacheService = {
  // Recupera um valor do cache usando uma chave
  get: (key) => {
    return cache.get(key);
  },

  // Armazena um valor no cache com uma chave específica
  set: (key, data) => {
    return cache.set(key, data);
  },

  // Remove um item específico do cache
  del: (key) => {
    return cache.del(key);
  },

  // Limpa todo o cache
  flush: () => {
    return cache.flushAll();
  },

  // Tenta recuperar do cache primeiro
  // Se não encontrar, executa o callback e armazena o resultado
  getOrSet: async (key, callback, ttl = 3600) => {
    // Tenta obter o valor do cache
    const value = cache.get(key);

    // Se encontrar, retorna
    if (value) {
      return value;
    }

    // Se não encontrar, executa o callback para obter o valor
    const result = await callback();

    // Armazena o resultado no cache com o TTL especificado
    cache.set(key, result, ttl);

    return result;
  },

  // Recupera múltiplos valores do cache de uma vez
  getMultiple: (keys) => {
    return cache.mget(keys);
  }
};

export default cacheService;