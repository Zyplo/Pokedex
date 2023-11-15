document.addEventListener('DOMContentLoaded', function () {
    getPokemonsAndRender();
});

function getPokemonsAndRender() {
    const numPokemonsInput = document.getElementById('numPokemons');
    const numPokemons = numPokemonsInput ? parseInt(numPokemonsInput.value) : 10;

    getPokemons(numPokemons)
        .then(pokemonsWithDetails => {
            renderPokemonList(pokemonsWithDetails);
        })
        .catch(error => console.error('Erro na requisição:', error));
}

function getIndexAndRender() {
    const pokemonIndexInput = document.getElementById('pokemonIndex');
    const pokemonIndex = pokemonIndexInput ? parseInt(pokemonIndexInput.value) : 1;

    getPokemonByIndex(pokemonIndex)
        .then(pokemon => {
            renderPokemonList([pokemon]);
        })
        .catch(error => console.error('Erro na requisição:', error));
}

function getPokemonByIndex(index) {
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${index}`;

    return fetch(apiUrl)
        .then(response => response.json())
        .then(pokemonSingle => ({
            nome: pokemonSingle.name,
            url: apiUrl,
            details: pokemonSingle
        }));
}

function getPokemons(numPokemons) {
    const apiUrl = `https://pokeapi.co/api/v2/pokemon?limit=${numPokemons}`;

    return fetch(apiUrl)
        .then(response => response.json())
        .then(allpokemn => {
            const pokemons = allpokemn.results.map(val => ({
                nome: val.name,
                url: val.url
            }));

            const pokemonDetailsPromises = pokemons.map(pokemon => {
                return fetch(pokemon.url)
                    .then(response => response.json())
                    .then(pokemonSingle => {
                        pokemon.details = pokemonSingle;
                        return pokemon;
                    });
            });

            return Promise.all(pokemonDetailsPromises);
        });
}

function renderPokemonList(pokemons) {
    const pokedexSection = document.getElementById('pokedex-section');
    pokedexSection.innerHTML = '';

    pokemons.forEach(pokemon => {
        const pokemonBox = document.createElement('div');
        pokemonBox.classList.add('pokemon-box');

        const img = document.createElement('img');
        img.src = pokemon.details.sprites.front_default;
        img.alt = pokemon.nome;

        const nameParagraph = document.createElement('p');
        nameParagraph.textContent = pokemon.nome;

        pokemonBox.appendChild(img);
        pokemonBox.appendChild(nameParagraph);

        pokedexSection.appendChild(pokemonBox);
    });
}
