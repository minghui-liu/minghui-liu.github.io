(() => {
  const endpoint = "https://literal.club/graphql/";
  const page = document.querySelector(".reading-page");
  const profileId = page?.dataset.literalProfileId;

  const shelves = [
    { status: "IS_READING", listId: "current-books", countId: "current-count", empty: "Nothing listed right now." },
    { status: "FINISHED", listId: "finished-books", countId: "finished-count", empty: "No finished books listed yet." }
  ];

  const escapeHtml = (value) => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const bookCard = (book) => {
    const title = escapeHtml(book.title || "Untitled");
    const authors = escapeHtml((book.authors || []).map((author) => author.name).join(", ") || "Unknown author");
    const href = `https://literal.club/book/${encodeURIComponent(book.slug)}`;
    const cover = book.cover
      ? `<img src="${escapeHtml(book.cover)}" alt="Cover of ${title}" loading="lazy" />`
      : `<span class="book-cover__fallback" aria-hidden="true">${title.charAt(0)}</span>`;

    return `
      <article class="book-card">
        <a class="book-cover" href="${href}" aria-label="View ${title} on Literal">${cover}</a>
        <div class="book-card__text">
          <h3><a href="${href}">${title}</a></h3>
          <p>${authors}</p>
        </div>
      </article>`;
  };

  const loadShelf = async ({ status, listId, countId, empty }) => {
    const list = document.getElementById(listId);
    const count = document.getElementById(countId);
    const query = `query {
      booksByReadingStateAndProfile(
        profileId: "${profileId}",
        readingStatus: ${status},
        limit: 100,
        offset: 0
      ) {
        id
        slug
        title
        cover
        authors { name }
      }
    }`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });
      if (!response.ok) throw new Error(`Literal returned ${response.status}`);

      const result = await response.json();
      if (result.errors) throw new Error(result.errors[0]?.message || "Literal query failed");

      const books = result.data?.booksByReadingStateAndProfile || [];
      count.textContent = `${books.length} ${books.length === 1 ? "book" : "books"}`;
      list.innerHTML = books.length
        ? books.map(bookCard).join("")
        : `<p class="reading-status">${empty}</p>`;
    } catch (error) {
      console.error("Could not load Literal shelf:", error);
      list.innerHTML = `<p class="reading-status reading-status--error">The reading list could not be loaded. You can still view it on <a href="https://literal.club/minghuiliu">Literal</a>.</p>`;
    } finally {
      list.setAttribute("aria-busy", "false");
    }
  };

  if (profileId) {
    shelves.forEach(loadShelf);
  }
})();
