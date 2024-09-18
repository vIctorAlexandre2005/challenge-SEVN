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
  const filteredData = data?.find((r: any) => r.round === round);

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

  // Adicionar novos jogos
  filteredData.games.forEach((game: any) => {
    const matchElement = document.createElement('div');
    matchElement.classList.add('game');

    matchElement.innerHTML = `
      <div class="team">
        <span class="team-name">${game.team_home_name}</span>
        <span class="team-score">${game.team_home_score}</span>
      </div>
      <div class="versus">VS</div>
      <div class="team">
        <span class="team-name">${game.team_away_name}</span>
        <span class="team-score">${game.team_away_score}</span>
      </div>
    `;

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