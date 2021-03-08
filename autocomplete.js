// Create AutoComplete Widget

const createAutoComplete = ({
  root,
  renderOption,
  onOptionSelect,
  inputValue,
  fetchData,
}) => {
  root.innerHTML = `
    <label><b>Search</b></label>
    <input class="input" />
    <div class="dropdown">
      <div class="dropdown-menu">
        <div class="dropdown-content results"></div>
      </div>
    </div>
  `;

  // m elect Elements
  const input = root.querySelector("input");
  const dropdown = root.querySelector(".dropdown");
  const resultsWrapper = root.querySelector(".results");

  // Function onInput
  const onInput = async (event) => {
    const items = await fetchData(event.target.value);
    if (!items.length) {
      dropdown.classList.remove("is-active");
      return;
    }
    // Clear out any existing item before additional info we need to clear out our existing list
    resultsWrapper.innerHTML = "";
    // Activate the dropdown menu once input is triggered
    dropdown.classList.add("is-active");
    // iterate over movies to create a new div to display on the screen
    for (let item of items) {
      const option = document.createElement("a");

      option.classList.add("dropdown-item");
      option.innerHTML = renderOption(item);
      option.addEventListener("click", () => {
        dropdown.classList.remove("is-active");
        input.value = inputValue(item);
        onOptionSelect(item);
      });
      resultsWrapper.appendChild(option);
    }
  };
  // Add input event listener
  input.addEventListener("input", debounce(onInput, 500));
  // Handle event when user clicks outside dropdown menu
  document.addEventListener("click", (event) => {
    if (!root.contains(event.target)) {
      dropdown.classList.remove("is-active");
    }
  });
};
