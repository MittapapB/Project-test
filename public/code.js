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
const clearFiltersBtn = document.getElementById("clearFiltersBtn");

const adminPC = document.getElementById("adminPC");
const adminBox = document.getElementById("adminBox");
const usersList = document.getElementById("usersList");

const renderPokemons = (filteredPokemons) => {
  pokemonList.innerHTML = "";
  for (const pokemon of filteredPokemons) {
    const pokemonItem = document.createElement("div");
    pokemonItem.classList.add(
      "card",
      "w-40",
      "h-52",
      "bg-[#FFF9C4]",
      "items-center",
      "justify-between",
      "p-4",
      "shadow-md",
      "border-2",
      "border-[#003DA5]",
      "transition",
      "duration-300",
      "ease-in-out",
      "hover:scale-110",
      "hover:shadow-xl",
      "cursor-pointer",
    );
    pokemonItem.innerHTML = `
      <div class="flex justify-end w-full">
        ${pokemon.types
        .map((type) => {
          return `<span class="badge badge-sm text-center text-white bg-[#003DA5]">${type}</span>`;
        })
        .join("")}
      </div>
      <img src="${pokemon.image}" class="h-20 w-20">
      <div class="card-body items-center p-2 max-h-fit">
        <h2 class="card-title text-center">${pokemon.name}</h2>
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
      class="join-item btn bg-[#003DA5] text-[#FFF9C4] border-none hover:bg-[#FFF9C4] hover:text-[#003DA5]"
      onclick="changePage(1)"
    >
      First
    </button>
    <button
      class="join-item btn bg-[#003DA5] text-[#FFF9C4] border-none hover:bg-[#FFF9C4] hover:text-[#003DA5] ${currentPage === 1 ? "hidden" : ""
    }"
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
        class="join-item btn border-none hover:bg-[#FFF9C4] hover:text-[#003DA5] ${page === currentPage
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
        class="join-item btn bg-[#003DA5] text-[#FFF9C4] border-none hover:bg-[#FFF9C4] hover:text-[#003DA5]"
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
      class="join-item btn bg-[#003DA5] text-[#FFF9C4] border-none hover:bg-[#FFF9C4] hover:text-[#003DA5] ${currentPage === totalPages ? "hidden" : ""
    }"
      onclick="changePage(${currentPage + 1})"
    >
      Next
    </button>
    <button
      class="join-item btn bg-[#003DA5] text-[#FFF9C4] border-none hover:bg-[#FFF9C4] hover:text-[#003DA5]"
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

const renderLoadingSpinner = () => {
  pokemonList.innerHTML = `
    <div class="col-span-full flex flex-col items-center">
      <div class="sk-fading-circle">
        <div class="sk-circle1 sk-circle"></div>
        <div class="sk-circle2 sk-circle"></div>
        <div class="sk-circle3 sk-circle"></div>
        <div class="sk-circle4 sk-circle"></div>
        <div class="sk-circle5 sk-circle"></div>
        <div class="sk-circle6 sk-circle"></div>
        <div class="sk-circle7 sk-circle"></div>
        <div class="sk-circle8 sk-circle"></div>
        <div class="sk-circle9 sk-circle"></div>
        <div class="sk-circle10 sk-circle"></div>
        <div class="sk-circle11 sk-circle"></div>
        <div class="sk-circle12 sk-circle"></div>
      </div>
      <p class="text-[#003DA5] font-semibold mt-4">
        Loading Pokémon...
      </p>
    </div>
  `;
  paginationControls.innerHTML = "";
};

const fetchPokemonDetail = async (pokemon) => {
  const pokemonRes = await fetch(pokemon.url);
  const pokemonData = await pokemonRes.json();
  const types = pokemonData.types.map((type) => {
    return type.type.name;
  });
  return {
    name: pokemon.name,
    types: types,
    image: pokemonData.sprites.front_default,
  };
};

const fetchPokemons = async () => {
  try {
    renderLoadingSpinner();
    const countRes = await fetch("https://pokeapi.co/api/v2/pokemon");
    const countJson = await countRes.json();
    const count = countJson.count;
    const result = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${count}`,
    );
    const resultJson = await result.json();
    const pokemonDetail = [];
    for (let i = 0; i < resultJson.results.length; i++) {
      pokemonDetail.push(fetchPokemonDetail(resultJson.results[i]));
    }
    pokemons = await Promise.all(pokemonDetail);
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

const clearFilters = () => {
  searchInput.value = "";
  typeFilter.value = "all";
  sortSelect.value = "name-asc";
  currentPage = 1;
  updatePokemonList();
};

const setAdminBoxVisibility = (isAdmin) => {
  if (isAdmin) {
    adminPC.classList.remove("hidden");
  } else {
    adminPC.classList.add("hidden");
  }
};

const fetchAdminStatus = async () => {
  try {
    const userRes = await fetch("/auth/me");
    if (userRes.ok) {
      const userData = await userRes.json();
      return userData.user?.role === "admin";
    }
  } catch (error) {
    console.error("Error fetching admin status:", error);
    return false;
  }
};

const fetchUsers = async () => {
  try {
    const usersRes = await fetch("/admin/users");
    if (usersRes.ok) {
      const usersData = await usersRes.json();
      console.log("Fetched users:", usersData);
      return usersData.users;
    } else {
      console.error("Failed to fetch users:", usersRes.statusText);
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

const updateUser = async (username) => {
  const newUsername = prompt("Enter new username (leave blank to keep current):");
  const newRole = prompt("Enter new role (admin/user, leave blank to keep current):");
  if (!newUsername && !newRole) {
    return;
  }
  try {
    await fetch(`/admin/updateUser/${username}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: newUsername,
        role: newRole,
        password: null
      }),
    });
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

const deleteUser = async (username) => {
  if (!confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
    return;
  }
  try {
    await fetch(`/admin/deleteUser/${username}`, {
      method: "POST"
    });
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

const renderAdminBox = (users) => {
  if (!users || users.length === 0) {
    usersList.innerHTML = "<p class='text-center'>No users found.</p>";
    return;
  }

  for (const user of users) {
    const userItem = document.createElement("div");
    userItem.classList.add(
      "card",
      "w-40",
      "h-fit",
      "bg-[#FFF9C4]",
      "items-center",
      "justify-between",
      "p-4",
      "shadow-md",
      "border-2",
      "border-[#003DA5]",
      "transition",
      "duration-300",
      "ease-in-out",
      "hover:scale-110",
      "hover:shadow-xl",
      "cursor-pointer",
    );
    userItem.innerHTML = `
    <div class="card-body flex items-center p-2 max-h-fit">
      <h2 class="card-title text-center">${user.username}</h2>
      <span class="badge text-[#FFF9C4] bg-[${user.role === 'admin' ? '#811E09' : '#003DA5'}]">${user.role}</span>
    </div>

    <div class="card-actions justify-start">
      <button class="btn btn-sm bg-[#003DA5] text-[#FFF9C4] border-2 hover:bg-[#FFF9C4] hover:border-[#003DA5] hover:text-[#003DA5] transition duration-300"
        onclick="updateUser('${user.username}')">
        Edit
      </button>
      <button class="btn btn-sm bg-[#C31F27] text-[#FFF9C4] border-2  hover:bg-[#FFF9C4] hover:border-[#811E09] hover:text-[#C31F27]"
        onclick="deleteUser('${user.username}')">
        Delete
      </button>
    </div>
    
    `;
    console.log("Rendering user:", user);
    usersList.appendChild(userItem);
  }
};
const renderAdminPC = async () => {
  await fetch("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "Red",
      password: "secureme123",
      rememberMe: false
    })
  });
  setAdminBoxVisibility(await fetchAdminStatus());
  renderAdminBox(await fetchUsers());
};

searchBtn.addEventListener("click", updatePokemonList);
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") updatePokemonList();
});

typeFilter.addEventListener("change", updatePokemonList);
sortSelect.addEventListener("change", updatePokemonList);
clearFiltersBtn.addEventListener("click", clearFilters);

renderAdminPC();
fetchPokemons();
