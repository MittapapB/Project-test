const pokemonList = document.getElementById("pokemonList");

const fetchPokemons = async () => {
  try {
    const result = await fetch("https://pokeapi.co/api/v2/pokemon");
    const resultJson = await result.json();
    const pokemons = resultJson.results;
    for (const pokemon of pokemons) {
      const pokemonItem = document.createElement("tr");
      pokemonItem.innerHTML = `
                  <td>${pokemon.name}</td>
              `;
      pokemonList.appendChild(pokemonItem);
    }
  } catch (error) {
    console.log("Error fetching Pokemon", error);
  }
};

fetchPokemons();
