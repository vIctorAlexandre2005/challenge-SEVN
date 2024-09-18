class GameRound extends HTMLElement {
    private currentRound: number = 1; // Rodada atual
    private totalRounds: number = 3;  // Número total de rodadas (substitua conforme necessário)
    private gamesData: any[] = [];    // Dados dos jogos da API
  
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    // Conectando o componente à DOM e inicializando
    connectedCallback() {
      this.fetchRoundsData();
      this.render();
    }
  
    // Fetch da API para obter os dados das rodadas
    async fetchRoundsData() {
      try {
        const response = await fetch('https://sevn-pleno-esportes.deno.dev/');
        const data = await response.json();
  
        console.log('Resposta da API:', data);  // Adiciona um log para verificar a resposta
  
        if (data && data.games && Array.isArray(data.games)) {
          this.gamesData = data.games; // Extrai a lista de jogos
          this.renderGames(); // Renderiza os jogos na rodada
        } else {
          console.error('Estrutura de dados da API inválida:', data);
          this.gamesData = []; // Define um array vazio se os dados forem inválidos
        }
      } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
      }
    }
  
    // Renderiza o componente HTML inicial
    render() {
      this.shadowRoot!.innerHTML = `
        <style>
          .container { display: flex; flex-direction: column; align-items: center; }
          .game { display: flex; justify-content: space-between; width: 100%; margin: 10px 0; }
          .team { display: flex; align-items: center; }
          .team-logo { width: 50px; height: 50px; margin-right: 10px; }
          .team-name { font-weight: bold; }
          .team-score { margin-left: 5px; font-size: 18px; color: #333; }
          .navigation { margin-top: 20px; }
          .button { padding: 5px 10px; cursor: pointer; }
          .disabled { opacity: 0.5; cursor: not-allowed; }
        </style>
        <div class="container">
          <h2>Rodada ${this.currentRound}</h2>
          <div id="games-container"></div>
          <div class="navigation">
            <button id="prev-button" class="button" ${this.currentRound === 1 ? 'disabled' : ''}>Anterior</button>
            <button id="next-button" class="button" ${this.currentRound === this.totalRounds ? 'disabled' : ''}>Próxima</button>
          </div>
        </div>
      `;
      this.addEventListeners(); // Adiciona eventos aos botões de navegação
    }
  
    // Renderiza os jogos da rodada atual
    renderGames() {
      const gamesContainer = this.shadowRoot!.querySelector('#games-container')!;
  
      if (!this.gamesData || this.gamesData.length === 0) {
        gamesContainer.innerHTML = '<p>Sem jogos disponíveis para esta rodada.</p>';
        return;
      }
  
      gamesContainer.innerHTML = ''; // Limpa jogos anteriores
  
      // Mapeia os IDs dos times para caminhos de imagem
      const teamImagePaths: { [key: string]: string } = {
        "teamA": "assets/teams/teamA.png",
        "teamH": "assets/teams/teamH.png",
        "teamB": "assets/teams/teamB.png",
        "teamG": "assets/teams/teamG.png",
        "teamC": "assets/teams/teamC.png",
        "teamF": "assets/teams/teamF.png",
        "teamD": "assets/teams/teamD.png",
        "teamE": "assets/teams/teamE.png"
      };
  
      // Filtra e exibe jogos da rodada atual
      this.gamesData.map(game => {
        gamesContainer.innerHTML += `
          <div class="game">
            <div class="team">
              <img src="${teamImagePaths[game.team_home_id]}" alt="${game.team_home_name} Logo" class="team-logo">
              <span class="team-name">${game.team_home_name}</span>
              <span class="team-score">${game.team_home_score}</span>
            </div>
            <div class="team">
              <span class="team-score">${game.team_away_score}</span>
              <span class="team-name">${game.team_away_name}</span>
              <img src="${teamImagePaths[game.team_away_id]}" alt="${game.team_away_name} Logo" class="team-logo">
            </div>
          </div>
        `;
      });
    }
  
    // Eventos para navegação de rodadas
    addEventListeners() {
      const prevButton = this.shadowRoot!.querySelector('#prev-button')!;
      const nextButton = this.shadowRoot!.querySelector('#next-button')!;
  
      prevButton.addEventListener('click', () => {
        if (this.currentRound > 1) {
          this.currentRound--;
          this.updateComponent();
        }
      });
  
      nextButton.addEventListener('click', () => {
        if (this.currentRound < this.totalRounds) {
          this.currentRound++;
          this.updateComponent();
        }
      });
    }
  
    // Atualiza a renderização do componente quando a rodada é alterada
    updateComponent() {
      this.render();  // Re-renderiza o layout básico
      this.renderGames();  // Re-renderiza os jogos
    }
  }
  
  // Registra o Web Component na DOM
  customElements.define('game-round', GameRound);
  