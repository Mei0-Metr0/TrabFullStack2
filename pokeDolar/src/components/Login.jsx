// Importa o o hook useState para gerenciar o estado local dentro do componente.
import React, { useState } from 'react';
// Importa os hooks useDispatch e useSelector do Redux para interagir com a store do Redux
import { useDispatch, useSelector } from 'react-redux';
// Importa a ação 'login' do slice de autenticação (authSlice) para ser despachada quando o formulário for submetido.
import { login } from '../slices/authSlice';

// Função componente Login, que é o componente responsável pela tela de login.
function Login() {
  // Usando o hook useState para criar o estado local 'credentials', que irá armazenar o 'username' e 'password' digitados pelo usuário.
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  // Usa o hook useDispatch para obter a função 'dispatch' do Redux, que será usada para despachar ações.
  const dispatch = useDispatch();

  // Usa o hook useSelector para acessar o estado do Redux, especificamente o estado de autenticação (auth), que contém as propriedades 'status' (estado da solicitação) e 'error' (mensagens de erro).
  const { status, error } = useSelector((state) => state.auth);

  // Função que será chamada ao submeter o formulário.
  const handleSubmit = (e) => {
    // Previne o comportamento padrão do formulário (que é enviar a requisição e recarregar a página).
    e.preventDefault();
    // Despacha a ação 'login' com as credenciais inseridas pelo usuário para realizar o login no sistema.
    dispatch(login(credentials));
  };

  return (
    <div className="container mt-5">
    {/* Div principal que centraliza e aplica margem superior ao conteúdo. */}

      <div className="row justify-content-center">
      {/* Define uma linha para centralizar o conteúdo. */}

        <div className="col-md-6">
        {/* Define uma coluna que ocupa metade da largura da tela em dispositivos médios ou maiores. */}

          <div className="card">
          {/* Componente de card do Bootstrap para estilizar o formulário. */}

            <div className="card-body">
            {/* Onde o conteúdo do formulário será colocado. */}

              <h2 className="text-center mb-4">Login</h2>
              {/* Título centralizado com margem inferior. */}

              <form onSubmit={handleSubmit}>
              {/* Formulário que chama a função handleSubmit quando o usuário submete os dados. */}

                <div className="mb-3">
                {/* Div que envolve o campo de entrada para o nome de usuário, com margem inferior. */}

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Username"
                    value={credentials.username}
                    onChange={(e) => setCredentials({
                      ...credentials,
                      username: e.target.value
                    })}
                  />
                  {
                    /* Campo de entrada para o nome de usuário, com a classe de controle de formulário do Bootstrap.
                    O valor do campo é controlado pelo estado 'credentials.username', e a função 'onChange' atualiza o valor no estado. */
                  }
                </div>
                
                <div className="mb-3">
                {/* Div que envolve o campo de entrada para a senha, com margem inferior. */}
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({
                      ...credentials,
                      password: e.target.value
                    })}
                  />
                </div>
                {/* 
                  Campo de entrada para a senha, com a classe de controle de formulário do Bootstrap.
                  O valor do campo é controlado pelo estado 'credentials.password', e a função 'onChange' atualiza o valor no estado.
                */}

                {error && <div className="alert alert-danger">{error}</div>}
                {/* Se houver um erro de login (capturado pelo Redux e armazenado no estado 'error'), exibe uma mensagem de erro. */}

                
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={status === 'loading'}
                >
                {/* Botão de envio do formulário. */}

                {status === 'loading' ? 'Logging in...' : 'Login'}
                {/* Se o status do Redux for 'loading', o texto do botão será 'Logging in...', caso contrário, será 'Login'. */}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;