# EXPLICAÇÃO GERAL SOBRE O REACT-REDUX
O `react-redux` é uma biblioteca que integra o Redux com o React para gerenciar o estado global da aplicação. Ele ajuda a centralizar o estado da aplicação em um único local, tornando mais fácil compartilhar dados entre diferentes componentes e mantendo o estado sincronizado.

## O que é Redux?
Redux é uma biblioteca para gerenciar estado em aplicações JavaScript. Ele é útil em projetos React onde você precisa compartilhar dados entre vários componentes sem precisar passá-los manualmente por todos os níveis da árvore de componentes.

### Estrutura do Redux
**Store**: Onde o estado da aplicação fica armazenado.

**Action**: São objetos que descrevem o que aconteceu. Elas dizem ao Redux que algo mudou (ex: o usuário fez login).

**Reducer**: Uma função que recebe o estado atual e uma action, e retorna o novo estado.

### Estrutura do Projeto
```
src
├── App.js
├── components
│   └── Counter.js
├── slices
│   └── counterSlice.js
├── store
│   └── store.js
└── index.js
```

### Configurando React-Redux no seu Projeto
#### Instale Redux e React-Redux:
```
npm install redux react-redux @reduxjs/toolkit
```

#### Configure a Store com o Redux Toolkit:

`O Redux Toolkit simplifica a configuração do Redux.`

Crie uma pasta chamada store e dentro dela crie um arquivo store.js.
``` js
// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice';

const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

export default store;
```

### Criar um Slice
Um slice é uma forma de organizar uma parte do estado e as actions relacionadas a ele. No Redux Toolkit, você cria slices com `createSlice`.

``` js
// src/store/slices/counterSlice.js
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {
    increment: (state) => state + 1,
    decrement: (state) => state - 1,
  },
});

export const { increment, decrement } = counterSlice.actions;
export default counterSlice.reducer;

```

Esse código cria uma fatia (slice) chamada `counter` com um estado inicial de 0 e duas actions: `increment` e `decrement`.

#### Provider
Envolva seu App com o `Provider` para dar acesso ao Redux a toda a aplicação.

``` js
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```

#### Usando Redux no Componente
``` js
// src/components/Counter.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement } from '../store/slices/counterSlice';

const Counter = () => {
  const count = useSelector((state) => state.counter); // Acessa o valor do estado global
  const dispatch = useDispatch();

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={() => dispatch(increment())}>Incrementar</button>
      <button onClick={() => dispatch(decrement())}>Decrementar</button>
    </div>
  );
};

export default Counter;
```

- `useSelector` permite acessar o valor do estado global (nesse caso, o valor do counter).
- `useDispatch` permite disparar ações para atualizar o estado.

#### Utilizar o Componente no App:
``` js
// src/App.js
import React from 'react';
import Counter from './components/Counter';

const App = () => {
  return (
    <div>
      <Counter />
    </div>
  );
};

export default App;
```

### Resumo das Funções do Redux no React
- `useSelector`: Usado para acessar o estado da Store.
- `useDispatch`: Usado para disparar ações (actions) que alteram o estado.

### Fluxo Completo
1. A Store centraliza o estado.
2. Um componente dispara uma action com `dispatch`.
3. Essa action é processada pelo reducer que altera o estado.
4. O estado atualizado fica acessível para os componentes através do `useSelector`.

### Código
- [Repositório](https://github.com/Mei0-Metr0/REDUX-EXEMPLOS/tree/main/redux-exemplo1) 