const POKEMONS_PER_PAGE = 20;
let currentPage = 1;

let pokemons = [];
let currentPokemonList = [];
const pokemonList = document.getElementById("pokemonList");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const typeFilter = document.getElementById("typeFilter");
const sortSelect = document.getElementById("sortSelect");
const paginationControls = document.getElementById("paginationControls");

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

const renderTypeFilter = () => {
  const types = [];
  for (const pokemon of pokemons) {
    for (const type of pokemon.types) {
      if (!types.includes(type)) {
        types.push(type);
      }
    }
  }
  types.sort();
  for (const type of types) {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    typeFilter.appendChild(option);
  }
};

const renderCurrentPage = (pokemonArray) => {
  currentPokemonList = pokemonArray;
  const startIndex = (currentPage - 1) * POKEMONS_PER_PAGE;
  const endIndex = startIndex + POKEMONS_PER_PAGE;
  const totalPages = Math.ceil(pokemonArray.length / POKEMONS_PER_PAGE);
  renderPokemons(pokemonArray.slice(startIndex, endIndex));
  renderPagination(totalPages);
};

const changePage = (page) => {
  currentPage = page;
  renderCurrentPage(currentPokemonList);
};

const renderFirstAndPreviousButtons = () => {
  return `
    <button
      class="join-item btn bg-[#003DA5] text-[#FFF9C4] border-none"
      onclick="changePage(1)"
    >
      First
    </button>
    <button
      class="join-item btn bg-[#003DA5] text-[#FFF9C4] border-none"
      ${currentPage === 1 ? "disabled" : ""}
      onclick="changePage(${currentPage - 1})"
    >
      Previous
    </button>
  `;
};

const renderPageButtons = (totalPages) => {
  let pageButtonsHTML = "";
  let startPage = currentPage;
  let endPage = currentPage + 3;
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = totalPages - 3 < 1 ? 1 : totalPages - 3;
  }
  for (let page = startPage; page <= endPage; page++) {
    pageButtonsHTML += `
      <button
        class="join-item btn border-none ${
          page === currentPage
            ? "bg-[#FFF9C4] text-[#003DA5]"
            : "bg-[#003DA5] text-[#FFF9C4]"
        }"
        onclick="changePage(${page})"
      >
        ${page}
      </button>
    `;
  }
  if (endPage < totalPages) {
    pageButtonsHTML += `
      <button class="join-item btn bg-[#003DA5] text-[#FFF9C4] border-none">
        ...
      </button>
      <button
        class="join-item btn bg-[#003DA5] text-[#FFF9C4] border-none"
        onclick="changePage(${totalPages})"
      >
        ${totalPages}
      </button>
    `;
  }
  return pageButtonsHTML;
};

const renderNextAndLastButtons = (totalPages) => {
  return `
    <button
      class="join-item btn bg-[#003DA5] text-[#FFF9C4] border-none"
      ${currentPage === totalPages ? "disabled" : ""}
      onclick="changePage(${currentPage + 1})"
    >
      Next
    </button>
    <button
      class="join-item btn bg-[#003DA5] text-[#FFF9C4] border-none"
      onclick="changePage(${totalPages})"
    >
      Last
    </button>
  `;
};

const renderPagination = (totalPages) => {
  paginationControls.innerHTML = `
    <div class="join">
      ${renderFirstAndPreviousButtons()}
      ${renderPageButtons(totalPages)}
      ${renderNextAndLastButtons(totalPages)}
    </div>
  `;
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
    renderTypeFilter();
    renderCurrentPage(pokemons);
  } catch (error) {
    console.log("Error fetching Pokemon", error);
  }
};

const updatePokemonList = () => {
  const searchKey = searchInput.value.toLowerCase().trim();
  const selectedType = typeFilter.value;
  const selectedSort = sortSelect.value;

  const filteredPokemons = pokemons.filter((pokemon) => {
    const matchesSearch = pokemon.name.includes(searchKey);
    const matchesType =
      selectedType === "all" || pokemon.types.includes(selectedType);

    return matchesSearch && matchesType;
  });

  if (selectedSort === "name-asc") {
    filteredPokemons.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  }

  if (selectedSort === "name-desc") {
    filteredPokemons.sort((a, b) => {
      return b.name.localeCompare(a.name);
    });
  }

  if (selectedSort === "type-asc") {
    filteredPokemons.sort((a, b) => {
      return a.types[0].localeCompare(b.types[0]);
    });
  }

  if (selectedSort === "type-desc") {
    filteredPokemons.sort((a, b) => {
      return b.types[0].localeCompare(a.types[0]);
    });
  }

  currentPage = 1;
  renderCurrentPage(filteredPokemons);
};

searchBtn.addEventListener("click", updatePokemonList);
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") updatePokemonList();
});

typeFilter.addEventListener("change", updatePokemonList);
sortSelect.addEventListener("change", updatePokemonList);

fetchPokemons();
