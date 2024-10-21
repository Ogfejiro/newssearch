const apiKey = 'e3d1b6d860634e379296c3533ab1a2ab'; // Replace with your actual API key

const searchField = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const blogContainer = document.getElementById("blog-container");

async function fetchData(query) {
  try {
    const apiUrl = query ?
      `https://newsapi.org/v2/everything?q=${query}&pageSize=10&apiKey=${apiKey}` :
      `https://newsapi.org/v2/top-headlines?country=us&pageSize=10&apiKey=${apiKey}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.articles;
  } catch (error) {
    handleError(error);
    return [];
  }
}

function handleError(error) {
  console.error("Error fetching news articles:", error);
  blogContainer.textContent = "An error occurred while fetching news. Please try again later.";
}

function displayArticles(articles) {
  blogContainer.innerHTML = "";

  if (!articles || articles.length === 0) {
    blogContainer.textContent = "No results found.";
    return;
  }

  articles.forEach((article) => {
    const blogCard = document.createElement("div");
    blogCard.classList.add("blog-card");

    const img = document.createElement("img");
    img.src = article.urlToImage;
    img.alt = article.title;

    const title = document.createElement("h1");
    title.textContent = article.title;

    const description = document.createElement("p");
    description.textContent = article.description;

    blogCard.appendChild(img);
    blogCard.appendChild(title);
    blogCard.appendChild(description);

    blogCard.addEventListener("click", () => {
      window.open(article.url, "_blank");
    });

    blogContainer.appendChild(blogCard);
  });
}

async function handleSearch() {
  const query = searchField.value.trim();
  if (query) {
    blogContainer.textContent = "Loading articles..."; // Show loading message
    const articles = await fetchData(query);
    displayArticles(articles);
  } else {
    // Handle empty search query
    blogContainer.textContent = "Please enter a search term.";
  }
}

searchButton.addEventListener("click", handleSearch);

// Initial fetch (optional)
(async () => {
  try {
    blogContainer.textContent = "Loading articles...";
    const articles = await fetchData();
    displayArticles(articles);
  } catch (error) {
    handleError(error);
  }
})();