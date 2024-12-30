# Exemplo 2
Nesse exemplo será implementado uma estrutura com Redux usando services e slices que fazem requisições a uma API, vamos adicionar uma camada de serviços para lidar com a lógica de requisição e um slice no Redux para armazenar os dados retornados e controlar o estado da requisição (como loading, error e success).

Vamos criar uma aplicação simples que busca uma lista de usuários de uma API e exibe essa lista em um componente. Usaremos a API pública `JSONPlaceholder` para simular uma lista de usuários.

## Estrutura do Projeto
```
src
├── App.js
├── components
│   └── UserCard.js
├── hooks
│   └── useFetchUsers.js
├── pages
│   └── UserPage.js
├── services
│   └── userService.js
├── slices
│   └── userSlice.js
├── store
│   └── store.js
├── utils
│   ├── api.js
│   └── requestConfig.js
└── index.js
```

## Configurando React-Redux no seu Projeto
### Instale Redux e React-Redux:
```
npm install redux react-redux @reduxjs/toolkit
```

### Instale o restante das dependências:
```
npm install axios url
```

### Configurar `api.js` e `requestConfig.js` na pasta `utils`:
Esses arquivos centralizam a URL da API e a configuração das requisições.

``` js
// src/utils/api.js
export const api = "https://jsonplaceholder.typicode.com";
```

``` js
// src/utils/requestConfig.js
export const requestConfig = (method, data = null, token = null, image = null) => {
  let config;

  if (image) {
    config = {
      method,
      body: data,
      headers: {},
    };
  } else if (method === "DELETE" || data === null) {
    config = {
      method,
      headers: {},
    };
  } else {
    config = {
      method,
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};
```

### Criar o Serviço para Usuários (`userService.js`):
Esse serviço lida com a lógica de requisição, incluindo a configuração do request.

``` js
// src/services/userService.js
import { api } from "../utils/api";
import { requestConfig } from "../utils/requestConfig";

export const fetchUsers = async () => {
  const config = requestConfig("GET");
  const response = await fetch(`${api}/users`, config);
  const data = await response.json();
  return data;
};
```

### Criar o Slice para Usuários (`userSlice.js`):
Esse slice gerencia o estado da lista de usuários e o controle da requisição assíncrona.

``` js
// src/slices/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUsers } from "../services/userService";

export const getUsers = createAsyncThunk("users/getUsers", async () => {
  const users = await fetchUsers();
  return users;
});

const userSlice = createSlice({
  name: "users",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
```

### Configurar a Store (`store.js`):
``` js
// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/userSlice";

const store = configureStore({
  reducer: {
    users: userReducer,
  },
});

export default store;
```

### Criar o Componente `UserCard.js`:
Este componente exibe um usuário individual.

``` js
// src/components/UserCard.js
import React from "react";

const UserCard = ({ user }) => {
  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", margin: "5px" }}>
      <h3>{user.name}</h3>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>
      <p>Website: {user.website}</p>
    </div>
  );
};

export default UserCard;
```

### Criar o Hook `useFetchUsers.js`: 
Esse hook permite reutilizar a lógica de requisição e estado dos usuários em diferentes partes do projeto.

``` js
// src/hooks/useFetchUsers.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../slices/userSlice";

const useFetchUsers = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  return { list, loading, error };
};

export default useFetchUsers;
```

### Criar a Página `UserPage.js`: 
Essa página utiliza o hook `useFetchUsers` para obter os usuários e exibi-los com o componente `UserCard`.

``` js
// src/pages/UserPage.js
import React from "react";
import useFetchUsers from "../hooks/useFetchUsers";
import UserCard from "../components/UserCard";

const UserPage = () => {
  const { list, loading, error } = useFetchUsers();

  if (loading) return <p>Carregando usuários...</p>;
  if (error) return <p>Erro ao carregar usuários: {error}</p>;

  return (
    <div>
      <h2>Lista de Usuários</h2>
      <div>
        {list.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default UserPage;
```

### Configurar o Componente Principal `App.js`: 
Importar e renderizar `UserPage` no `App.js`.
``` js
// src/App.js
import React from "react";
import UserPage from "./pages/UserPage";

const App = () => {
  return (
    <div>
      <h1>Exemplo de Redux com Estrutura Organizada</h1>
      <UserPage />
    </div>
  );
};

export default App;
```

### Configurar o Provider no Arquivo Principal `index.js`:
Envolva o `App` com o `Provider` para conectar a Store Redux a toda a aplicação.

``` js
// src/index.js
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from './store/store';
import App from "./App";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
```

## Diferença no uso do `reducers` x `extraReducers`:
1. Reducers:

- Os `reducers` dentro de uma slice são responsáveis por definir a lógica para ações síncronas, ou seja, aquelas que não dependem de operações assíncronas (como chamadas de API) para serem concluídas.
- Normalmente, as ações geradas pelos reducers são chamadas ações internas, pois são criadas automaticamente para cada reducer que você define dentro de uma slice.
- Essas ações podem ser diretamente utilizadas nos componentes para disparar mudanças de estado.`

2. ExtraReducers:

- `ExtraReducers` é utilizado para lidar com ações que não são definidas diretamente na slice. Esse é o caso comum de ações assíncronas, como aquelas criadas com createAsyncThunk.
- As ações em `extraReducers` permitem que você altere o estado com base em ações externas ou assíncronas que não foram definidas dentro dos reducers.
Usualmente, extraReducers gerencia três estados das operações assíncronas (pendente, concluída e rejeitada) geradas pelo `createAsyncThunk`.

### Resumo das diferenças
|Característica|reducers|extraReducers|
|---------------|----------------|----------------|
|Para que serve?|Gerenciar ações internas (síncronas)|Gerenciar ações externas (assíncronas)
|Ações geradas?|Sim, automaticamente|Não, usa ações externas, como createAsyncThunk
|Uso comum|Alterar o estado local da slice|Lidar com ações assíncronas (carregamento, sucesso, erro)
|Sintaxe|Define ações como funções na slice|Usa builder para gerenciar cada tipo de ação externa

Em resumo, `reducers` são usados para operações internas e síncronas, enquanto `extraReducers` permite que você capture e responda a ações externas, principalmente as ações assíncronas geradas por `createAsyncThunk`.

## Explicação
- `utils/api.js` e `utils/requestConfig.js`: Centralizam a URL base e as configurações das requisições, facilitando o gerenciamento e a reutilização.
- `services/userService.js`: Define as requisições à API usando o `requestConfig` para uma configuração centralizada.
- `slices/userSlice.js`: Slice Redux para gerenciar o estado dos usuários, incluindo carregamento e erros.
- `hooks/useFetchUsers.js`: Um hook personalizado para encapsular a lógica de requisição e estado dos usuários.
- `UserPage.js`: A página principal que utiliza o hook e exibe os usuários com o `UserCard`.

## Código
- [Repositório](https://github.com/Mei0-Metr0/REDUX-EXEMPLOS/tree/main/redux-exemplo2) 