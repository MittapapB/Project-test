const pokemonList = document.getElementById("pokemonList");

const fetchPokemons = async () => {
  try {
    const result = await fetch("https://pokeapi.co/api/v2/pokemon");
    const resultJson = await result.json();
    for (let i = 0; i < resultJson.results.length; i++) {
      const pokemonItem = document.createElement("div");
      pokemonItem.classList.add(
        "card",
        "bg-base-100",
        "items-center",
        "p-4",
        "shadow-md",
      );
      pokemonItem.innerHTML = `
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i + 1}.png" class="">
            <div class="card-body items-center p-2">
              <h2 class="card-title">${resultJson.results[i].name}</h2>
            </div>
      `;
      pokemonList.appendChild(pokemonItem);
    }
  } catch (error) {
    console.log("Error fetching Pokemon", error);
  }
};

fetchPokemons();
