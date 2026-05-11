let pokemons = [];
const pokemonList = document.getElementById("pokemonList");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const renderPokemons = (filteredPokemons) => {
  pokemonList.innerHTML = "";
  for (const pokemon of filteredPokemons) {
    const pokemonItem = document.createElement("div");
    pokemonItem.classList.add(
      "card",
      "bg-[#FFF9C4]",
      "items-center",
      "p-4",
      "shadow-md",
      "border-2",
      "border-[#003DA5]",
    );
    pokemonItem.innerHTML = `
      <div class="flex justify-end w-full">
        ${pokemon.types
          .map((type) => {
            return `<span class="badge badge-sm text-center text-white bg-[#003DA5]">${type}</span>`;
          })
          .join("")}
      </div>
      <img src="${pokemon.image}" class="">
      <div class="card-body items-center p-2">
        <h2 class="card-title">${pokemon.name}</h2>
      </div>
    `;
    pokemonList.appendChild(pokemonItem);
  }
};

const fetchPokemons = async () => {
  try {
    const countRes = await fetch("https://pokeapi.co/api/v2/pokemon");
    const countJson = await countRes.json();
    const count = countJson.count;
    const result = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${count}`,
    );
    const resultJson = await result.json();
    for (let i = 0; i < resultJson.results.length; i++) {
      const pokemonRes = await fetch(resultJson.results[i].url);
      const pokemonData = await pokemonRes.json();
      const types = pokemonData.types.map((type) => {
        return type.type.name;
      });

      pokemons.push({
        name: resultJson.results[i].name,
        types: types,
        image: pokemonData.sprites.front_default,
      });
    }
    renderPokemons(pokemons.slice(0, 20));
  } catch (error) {
    console.log("Error fetching Pokemon", error);
  }
};

const searchPokemon = () => {
  const searchKey = searchInput.value.toLowerCase().trim();
  const filteredPokemons = pokemons.filter((pokemon) => {
    return pokemon.name.includes(searchKey);
  });
  renderPokemons(filteredPokemons.slice(0, 20));
};

searchBtn.addEventListener("click", searchPokemon);
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") searchPokemon();
});
fetchPokemons();
