document.addEventListener("DOMContentLoaded", function () {
  // Get all search forms
  const searchForms = document.querySelectorAll(".search_widget_form form");

  // Process each search form
  searchForms.forEach((searchForm) => {
    const searchInput = searchForm.querySelector("input[type='text']");
    const searchWrapper = searchForm.closest(".search_widget_form"); // Get the wrapper div

    let suggestionsContainer = null;
    let loadingIndicator = null;

    function createSuggestionsContainer() {
      if (!suggestionsContainer) {
        suggestionsContainer = document.createElement("div");
        suggestionsContainer.className = "search-suggestions";
        searchWrapper.appendChild(suggestionsContainer);

        loadingIndicator = document.createElement("div");
        loadingIndicator.className = "search-loading";
        loadingIndicator.innerHTML = `<span><i class="fa fa-spinner fa-spin"></i> Loading...</span>`;
        suggestionsContainer.appendChild(loadingIndicator);
        loadingIndicator.style.display = "none";
      }
    }

    function removeSuggestionsContainer() {
      if (suggestionsContainer) {
        suggestionsContainer.remove();
        suggestionsContainer = null;
      }
    }

    async function fetchSearchResults(query) {
      if (query.length < 2) {
        removeSuggestionsContainer();
        return;
      }

      createSuggestionsContainer();
      loadingIndicator.style.display = "block";

      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}`
        );
        const results = await response.json();

        loadingIndicator.style.display = "none";

        suggestionsContainer.innerHTML = results.length
          ? results
              .map(
                (product) =>
                  `<div class="suggestion-item">
                                    <a href="/product/${
                                      product._id
                                    }" class="suggestion-link">
                                        <img src="${
                                          product.images?.[0]?.url ||
                                          "/img/placeholder.jpg"
                                        }" 
                                            alt="${product.name}" 
                                            class="suggestion-img">
                                        <span class="suggestion-name">${
                                          product.name
                                        }</span>
                                        <span class="suggestion-price">£${
                                          product.price?.toFixed(2) || "0.00"
                                        }</span>
                                    </a>
                                </div>`
              )
              .join("")
          : `<div class="suggestion-item no-results">No results found</div>`;
      } catch (error) {
        console.error("Error fetching search results:", error);
        suggestionsContainer.innerHTML =
          '<div class="suggestion-item error">Error loading results</div>';
      }
    }

    // Handle input events with debounce
    let debounceTimer;
    searchInput.addEventListener("input", function () {
      clearTimeout(debounceTimer);
      if (this.value.trim() === "") {
        removeSuggestionsContainer();
      } else {
        debounceTimer = setTimeout(() => {
          fetchSearchResults(this.value);
        }, 300);
      }
    });

    // Handle form submission
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (searchInput.value.trim()) {
        window.location.href = `/search?q=${encodeURIComponent(
          searchInput.value
        )}`;
      }
    });

    // Close suggestions when clicking outside
    document.addEventListener("click", (e) => {
      if (!searchWrapper.contains(e.target)) {
        removeSuggestionsContainer();
      }
    });

    // Keyboard navigation for suggestions
    searchInput.addEventListener("keydown", function (e) {
      if (!suggestionsContainer) return;

      const items = suggestionsContainer.querySelectorAll(".suggestion-item");
      if (!items.length) return;

      let currentIndex = -1;
      items.forEach((item, index) => {
        if (item.classList.contains("active")) {
          currentIndex = index;
          item.classList.remove("active");
        }
      });

      if (e.key === "ArrowDown") {
        e.preventDefault();
        currentIndex = (currentIndex + 1) % items.length;
        items[currentIndex].classList.add("active");
        items[currentIndex].scrollIntoView({ block: "nearest" });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        items[currentIndex].classList.add("active");
        items[currentIndex].scrollIntoView({ block: "nearest" });
      } else if (e.key === "Enter" && currentIndex >= 0) {
        e.preventDefault();
        items[currentIndex].querySelector("a").click();
      }
    });
  });
});
