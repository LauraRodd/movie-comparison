const autoCompleteConfig = {
  renderOption(movie) {
    const imgSrc = movie.Poster === "N/A" ? " " : movie.Poster;
    return `
        <img src="${imgSrc}" />
        ${movie.Title} (${movie.Year})
      `;
  },

  inputValue(movie) {
    return movie.Title;
  },
  // Define helper function to make network request
  async fetchData(searchTerm) {
    const response = await axios.get("http://www.omdbapi.com/", {
      params: {
        apikey: "e72001b4",
        s: searchTerm,
      },
    });
    // Handle error responses
    if (response.data.Error) {
      return [];
    }
    return response.data.Search;
  },
};

// Create Autocomplete Widget
createAutoComplete({
  ...autoCompleteConfig, //make a copy of everything inside that object
  root: document.querySelector("#left-autocomplete"),
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#left-summary"), "left");
  },
});
createAutoComplete({
  ...autoCompleteConfig, //make a copy of everything inside that object
  root: document.querySelector("#right-autocomplete"),
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#right-summary"), "right");
  },
});

// Compare results
let leftMovie;
let rightMovie;

// Create a helper function to handle whenever a movie is selected
const onMovieSelect = async (movie, summaryElement, side) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "e72001b4",
      i: movie.imdbID,
    },
  });
  summaryElement.innerHTML = movieTemplate(response.data);

  if (side === "left") {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }

  if (leftMovie && rightMovie) {
    runComparison();
  }
};

// Define function to run comparison
const runComparison = () => {
  const leftSideStats = document.querySelectorAll(
    "#left-summary .notification"
  );
  const rightSideStats = document.querySelectorAll(
    "#right-summary .notification"
  );

  // Iterate over each element on each side
  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];

    const leftSideValue = parseInt(leftStat.dataset.value);
    const rightSideValue = parseInt(rightStat.dataset.value);

    if (rightSideValue > leftSideValue) {
      leftStat.classList.remove("is-primary");
      leftStat.classList.add("is-warning");
    } else {
      rightStat.classList.remove("is-primary");
      rightStat.classList.add("is-warning");
    }
  });
};

// Display Movie Details on the Screen
const movieTemplate = (movieDetail) => {
  // Handle Results Values
  const metascore = parseInt(movieDetail.Metascore);
  const rating = parseFloat(movieDetail.imdbRating);
  const votes = parseInt(movieDetail.imdbVotes.replace(/,/g, ""));
  const awards = movieDetail.Awards.split(" ").reduce((prev, word) => {
    const value = parseInt(word);
    // check if value is not a number don't count, otherwise count
    if (isNaN(value)) {
      return prev;
    } else {
      return prev + value;
    }
  }, 0);

  // Handle Img Error
  const img = movieDetail.Poster === "N/A" ? " " : movieDetail.Poster;

  return `
  <article class="media">
    <figure class="media-left">
      <p class="image">
        <img src="
        ${img}" />
      </p>
    </figure>
    <div class="media=content">
      <div class="content">
        <h1>${movieDetail.Title}</h1>
        <h4>${movieDetail.Genre}</h4>
        <p>${movieDetail.Plot}</p>  
      </div>
    </div>    
  </article>
  <article data-value=${awards} class="notification is-primary">
    <p class="title">${movieDetail.Awards}</p>
    <p class="subtitle">Awards</p>
  </article>
  <article data-value=${metascore} class="notification is-primary">
    <p class="title">${movieDetail.Metascore}</p>
    <p class="subtitle">Metascore</p>
  </article>
  <article data-value=${rating} class="notification is-primary">
    <p class="title">${movieDetail.imdbRating}</p>
    <p class="subtitle">IMDB Rating</p>
  </article>
  <article data-value=${votes} class="notification is-primary">
    <p class="title">${movieDetail.imdbVotes}</p>
    <p class="subtitle">IMDB Votes</p>
  </article>
  `;
};
