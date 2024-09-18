// app.ts

import { RoundData } from './types';

class MatchCard extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const homeTeam = this.getAttribute('home-team') || '';
    const homeScore = this.getAttribute('home-score') || '';
    const awayTeam = this.getAttribute('away-team') || '';
    const awayScore = this.getAttribute('away-score') || '';

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
async function fetchGames(): Promise<RoundData> {
  const response = await fetch('https://sevn-pleno-esportes.deno.dev');
  const data: RoundData = await response.json();
  console.log(data);
  return data;
}

// Função para atualizar a rodada e os jogos
async function updateGames(round: number) {
  const data = await fetchGames();
  
  console.log(round)
  const filteredData = {
    round: data.round || currentRound, // Verifique se `round` existe no `data`
    games: data.games
  };

  console.log("Filtered data:", filteredData); // Verifique se o `round` está vindo corretamente

  // Atualizar o título da rodada
  const roundTitle = document.getElementById('roundTitle');
  if (roundTitle) {
    roundTitle.textContent = `Rodada ${filteredData.round || 'não disponível'}`; // Ajuste para evitar `undefined`
  }

  // Limpar os jogos anteriores
  const matchesContainer = document.getElementById('matches');
  if (matchesContainer) {
    matchesContainer.innerHTML = '';
  }

  // Adicionar novos jogos
  filteredData?.games?.forEach(game => {
    const matchElement = document.createElement('match-card') as MatchCard;
    matchElement.setAttribute('home-team', game.team_home_name);
    matchElement.setAttribute('home-score', game.team_home_score.toString());
    matchElement.setAttribute('away-team', game.team_away_name);
    matchElement.setAttribute('away-score', game.team_away_score.toString());
    if (matchesContainer) {
      matchesContainer.appendChild(matchElement);
    }
  });
}


// Carregar a rodada inicial
updateGames(1);

// Implementar a navegação entre rodadas
let currentRound = 1;

const leftArrow = document.querySelector('.arrow.left');
const rightArrow = document.querySelector('.arrow.right');

if (leftArrow) {
  leftArrow.addEventListener('click', () => {
    if (currentRound > 1) {
      currentRound--;
      updateGames(currentRound);
      console.log(currentRound);
    }
  });
}

if (rightArrow) {
  rightArrow.addEventListener('click', () => {
    currentRound++;
    updateGames(currentRound);
    console.log(currentRound);
  });
}
