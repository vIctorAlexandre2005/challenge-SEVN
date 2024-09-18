// app.js

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

customElements.define('match-card', MatchCard);

// Função para buscar os dados da API
async function fetchGames(round: number) {
  const response = await fetch(`https://sevn-pleno-esportes.deno.dev`);
  const data = await response.json();
  console.log(data);
  return data;
}

// Função para atualizar a rodada e os jogos
function updateGames(round: any) {
  fetchGames(round).then(data => {
    // Atualizar o título da rodada
    const eu3 = document.getElementById('roundTitle');
    if(eu3) {
      eu3.textContent = `Rodada ${data.round}`;
    }

    // Limpar os jogos anteriores
    const matchesContainer = document.getElementById('matches');
    if(matchesContainer) {
      matchesContainer.innerHTML = '';
    }

    // Adicionar novos jogos
    data?.games?.forEach((game: any) => {
      const matchElement = document.createElement('match-card');
      matchElement.setAttribute('home-team', game.team_home_name);
      matchElement.setAttribute('home-score', game.team_home_score);
      matchElement.setAttribute('away-team', game.team_away_name);
      matchElement.setAttribute('away-score', game.team_away_score);
      if(matchesContainer) {
        matchesContainer.appendChild(matchElement);
      }
    });
  });
}

// Carregar a rodada inicial
updateGames(1);

// Implementar a navegação entre rodadas (com exemplo básico)
let currentRound = 1;

const eu = document.querySelector('.arrow.left');

if(eu) {
  eu.addEventListener('click', () => {
    if (currentRound > 1) {
      currentRound--;
      updateGames(currentRound);
    }
  });
}

const eu2 = document.querySelector('.arrow.right');

if(eu2) {
  eu2.addEventListener('click', () => {
    currentRound++;
    updateGames(currentRound);
  });
}
