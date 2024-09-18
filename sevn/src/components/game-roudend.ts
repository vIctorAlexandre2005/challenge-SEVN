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

// Função para atualizar a rodada e os jogos
async function updateGames(round: number) {
  const data = await fetchGames();

  const filteredData = {
    round: round,
    games: data.games
  };

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
  filteredData?.games?.forEach((game: any) => {
    const matchElement = document.createElement('match-card') as MatchCard;
    matchElement.setAttribute('home-team', game.team_home_name);
    matchElement.setAttribute('home-score', game.team_home_score.toString());
    matchElement.setAttribute('away-team', game.team_away_name);
    matchElement.setAttribute('away-score', game.team_away_score.toString());
    if (matchesContainer) {
      matchesContainer.appendChild(matchElement);
    }
  });

  // Chamar a função para gerenciar as setas
  handleArrows();
}

// Função para habilitar/desabilitar as setas de navegação
function handleArrows() {
  const prevArrow = document.getElementById('prevArrow') as HTMLButtonElement;
  const nextArrow = document.getElementById('nextArrow') as HTMLButtonElement;

  if (prevArrow && nextArrow) {
    // Verificar se é a primeira rodada para desabilitar a seta "esquerda"
    if (currentRound === 1) {
      prevArrow.disabled = true;
      prevArrow.classList.add('disabled'); // Adicionar classe CSS para estilo
    } else {
      prevArrow.disabled = false;
      prevArrow.classList.remove('disabled'); // Remover classe CSS
    }

    // Verificar se é a última rodada para desabilitar a seta "direita"
    if (currentRound === totalRounds) {
      nextArrow.disabled = true;
      nextArrow.classList.add('disabled'); // Adicionar classe CSS para estilo
    } else {
      nextArrow.disabled = false;
      nextArrow.classList.remove('disabled'); // Remover classe CSS
    }
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