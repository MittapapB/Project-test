const pokemonList = document.getElementById("pokemonList");

const fetchPokemons = async () => {
  try {
    const result = await fetch("https://pokeapi.co/api/v2/pokemon");
    const resultJson = await result.json();
    for (let i = 0; i < resultJson.results.length; i++) {
      const pokemonRes = await fetch(resultJson.results[i].url);
      const pokemonData = await pokemonRes.json();
      const types = pokemonData.types.map((type) => {
        return type.type.name;
      });
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
              ${types
                .map((type) => {
                  return `<span class="badge badge-sm text-center text-white bg-[#003DA5]">${type}</span>`;
                })
                .join("")}
            </div>
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
