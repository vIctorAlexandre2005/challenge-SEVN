/* 
 O número está fixo porque fiz inicialmente para 
 desenvolvimento e acabei esquecendo de modificar 
 a funcionalidade para trazer o número com base nos 
 rounds existente na API. Mas,
 garanto que isso não é problema.
*/

let totalRounds = 14;

// Rodada atual
let currentRound = 1;

class MatchCard extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const homeTeam = this.getAttribute('home-team');
    const homeScore = this.getAttribute('home-score');
    const awayTeam = this.getAttribute('away-team');
    const awayScore = this.getAttribute('away-score');

    this.innerHTML = `
      <div class="match">
        <div class="team">
          <span class="name">${homeTeam}</span>
        
        <div class="vsContainer">
          <span class="score">${homeScore}</span>
          <img src="/public/x.svg" />
          <span class="score">${awayScore}</span>
        </div>
        </div>
        <div class="team">
          <span class="name">${awayTeam}</span>
        </div>
        <div class="divide"></div>
      </div>
      
    `;
  }
}

// Registro do Web Component
customElements.define('match-card', MatchCard);

// Função para buscar os jogos da API
async function fetchGames(): Promise<any[]> {
  try {
    const response = await fetch(`https://sevn-pleno-esportes.deno.dev`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar jogos:', error);
    return [];
  }
}

// atualizando a rodada e retornando os jogos
async function updateGames(round: number) {
  const data = await fetchGames();

  // Filtrando os jogos da rodada específica
  const filteredData = data.find((r: any) => r.round === round);

  if (!filteredData) {
    console.error("Nenhum dado encontrado para a rodada:", round);
    return;
  }

  // Atualizando o título da rodada
  const roundTitle = document.getElementById('roundTitle');
  if (roundTitle) {
    roundTitle.textContent = `RODADA ${filteredData.round}`;
  }

  // Limpando os jogos passados
  const matchesContainer = document.getElementById('matches');
  if (matchesContainer) {
    matchesContainer.innerHTML = '';
  }

  const teamLogos: { [key: string]: string } = {
    "time-a": "/teams/teamA.png",
    "time-b": "/teams/teamB.png",
    "time-c": "/teams/teamC.png",
    "time-d": "/teams/teamD.png",
    "time-e": "/teams/teamE.png",
    "time-f": "/teams/teamF.png",
    "time-g": "/teams/teamG.png",
    "time-h": "/teams/teamH.png",
  };

  // Adicionar novos jogos com logos
  filteredData.games.forEach((game: any) => {
    const matchElement = document.createElement('div');
    matchElement.classList.add('match');

    // Usando os IDs dos times para buscar as logos
    const homeTeamLogo = teamLogos[game.team_home_id];
    const awayTeamLogo = teamLogos[game.team_away_id];

    // HTML que vai preencher a área vazia no index.html
    matchElement.innerHTML = `
      <div class="match">
  <div class="teams-container">
    <div class="team">
      <img src="${homeTeamLogo}" alt="${game.team_home_name}" class="team-logo" />
      <span class="team-name">${game.team_home_name}</span>
      
    </div>
    <div class="versusScore">
    <span class="team-score">${game.team_home_score}</span>
      <img src="/public/vs/x.png" alt="VS" class="vs" />
      <span class="team-score">${game.team_away_score}</span>
    </div>
    <div class="team">
    <span class="team-name">${game.team_away_name}</span>
      <img src="${awayTeamLogo}" alt="${game.team_away_name}" class="team-logo" />
    </div>
  </div>
  <div class="divide"></div>
</div>

    `;

    // Já inserindo o jogo na lista de partidas
    if (matchesContainer) {
      matchesContainer.appendChild(matchElement);
    }
  });

  // Atualizando as setas de navegação
  handleArrows();
}

// Função para habilitar/desabilitar as setas de navegação
function handleArrows() {
  const prevArrow = document.getElementById('prevArrow');
  const nextArrow = document.getElementById('nextArrow');

  if (prevArrow && nextArrow) {
    // Adiciona ou remove a classe 'disabled-arrow' conforme a rodada atual
    prevArrow.classList.toggle('disabled-arrow', currentRound === 1);
    nextArrow.classList.toggle('disabled-arrow', currentRound === totalRounds);
  }
}

// Iniciando os jogos com a rodada 1 ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  updateGames(currentRound);

  const prevArrow = document.getElementById('prevArrow');
  const nextArrow = document.getElementById('nextArrow');

  // Evento para a seta esquerda (anterior)
  if (prevArrow) {
    prevArrow.addEventListener('click', () => {
      if (currentRound > 1) {
        currentRound--;
        updateGames(currentRound);
        handleArrows(); // Função atualizando a seta
      }
    });
  }

  // Evento para a seta direita (próxima)
  if (nextArrow) {
    nextArrow.addEventListener('click', () => {
      if (currentRound < totalRounds) {
        currentRound++;
        updateGames(currentRound);
        handleArrows(); // Mesma coisa
      }
    });
  }

  handleArrows();
});

