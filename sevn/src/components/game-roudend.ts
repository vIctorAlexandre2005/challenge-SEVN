// Número total de rodadas (você pode ajustar isso dinamicamente a partir da API)
let totalRounds = 14; // Ou atualize dinamicamente com base na API

// Rodada atual
let currentRound = 1;

// Definição do Web Component para exibir os jogos
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
        </div>
        <div class="vsContainer">
          <span class="score">${homeScore}</span>
          <img src="/public/x.svg" />
          <span class="score">${awayScore}</span>
        </div>
        <div class="team">
          <span class="name">${awayTeam}</span>
        </div>
      </div>
      <div class="divide"></div>
    `;
  }
}

// Registrar o Web Component
customElements.define('match-card', MatchCard);

// Função para buscar os dados da API
async function fetchGames() {
  const response = await fetch(`https://sevn-pleno-esportes.deno.dev`);
  const data = await response.json();
  return data;
}

// Função para atualizar a rodada e renderizar os jogos
async function updateGames(round: number) {
  const data = await fetchGames();

  // Filtrar os jogos da rodada específica
  const filteredData = data.find((r: any) => r.round === round);

  if (!filteredData) {
    console.error("Nenhum dado encontrado para a rodada:", round);
    return;
  }

  // Atualizar o título da rodada
  const roundTitle = document.getElementById('roundTitle');
  if (roundTitle) {
    roundTitle.textContent = `Rodada ${filteredData.round}`;
  }

  // Limpar os jogos anteriores
  const matchesContainer = document.getElementById('matches');
  if (matchesContainer) {
    matchesContainer.innerHTML = '';
  }

  const teamLogos: { [key: string]: string } = {
    "time-a": "/public/teams/teamA.png",
    "time-b": "/public/teams/teamB.png",
    "time-c": "/public/teams/TeamC.png",
    "time-d": "/public/teams/TeamD.png",
    "time-e": "/public/teams/TeamE.png",
    "time-f": "/public/teams/TeamF.png",
    "time-g": "/public/teams/teamG.png",
    "time-h": "/public/teams/TeamH.png",
    // Adicione todos os times e logos correspondentes aqui
  };

  // Adicionar novos jogos com logos
  filteredData.games.forEach((game: any) => {
    const matchElement = document.createElement('div');
    matchElement.classList.add('game');

    // Usar os IDs dos times para buscar as logos
    const homeTeamLogo = teamLogos[game.team_home_id] || '/public/logos/default.png'; // Logo do time da casa
    const awayTeamLogo = teamLogos[game.team_away_id] || '/public/logos/default.png'; // Logo do time visitante

    // Log para verificar a busca das logos usando os IDs
    console.log(`Home team ID: ${game.team_home_id}, Logo: ${homeTeamLogo}`);
    console.log(`Away team ID: ${game.team_away_id}, Logo: ${awayTeamLogo}`);

    // Criar o HTML para cada jogo, com os times e suas respectivas logos
    matchElement.innerHTML = `
      <div class="team">
        <img src="${homeTeamLogo}" alt="${game.team_home_name}" class="team-logo" />
        <span class="team-name">${game.team_home_name}</span>
        <span class="team-score">${game.team_home_score}</span>
      </div>
      <div class="versus">VS</div>
      <div class="team">
        <img src="${awayTeamLogo}" alt="${game.team_away_name}" class="team-logo" />
        <span class="team-name">${game.team_away_name}</span>
        <span class="team-score">${game.team_away_score}</span>
      </div>
    `;

    // Inserir o jogo na lista de partidas
    if (matchesContainer) {
      matchesContainer.appendChild(matchElement);
    }
  });

  // Atualizar as setas de navegação
  handleArrows();
}


// Função para habilitar/desabilitar as setas de navegação
function handleArrows() {
  const prevArrow = document.getElementById('prevArrow') as HTMLButtonElement;
  const nextArrow = document.getElementById('nextArrow') as HTMLButtonElement;

  if (prevArrow && nextArrow) {
    prevArrow.disabled = currentRound === 1;
    nextArrow.disabled = currentRound === totalRounds;
  }
}

// Inicializar os jogos com a rodada 1 ao carregar a página
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
      }
    });
  }

  // Evento para a seta direita (próxima)
  if (nextArrow) {
    nextArrow.addEventListener('click', () => {
      if (currentRound < totalRounds) {
        currentRound++;
        updateGames(currentRound);
      }
    });
  }
});