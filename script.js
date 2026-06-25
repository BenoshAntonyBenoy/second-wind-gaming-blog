const app = document.getElementById('app')
const homeLink = document.getElementById('homeLink')

function formatDate(iso) {
  const date = new Date(iso + 'T00:00:00')
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function sortedPosts() {
  return [...posts].sort((a, b) => new Date(b.date) - new Date(a.date))
}

function renderHome() {
  const all = sortedPosts()

  if (all.length === 0) {
    app.innerHTML = `
      <div class="empty-state">
        <h2>No posts yet</h2>
        <p>Check back soon. There's writing on the way.</p>
      </div>`
    return
  }

  const cards = all
    .map(
      (post) => `
        <article class="post-card" data-id="${post.id}" tabindex="0" role="link">
          <p class="post-meta">
            <span class="post-author">${post.author}</span>
            <span class="dot">&middot;</span>
            <time datetime="${post.date}">${formatDate(post.date)}</time>
          </p>
          <h2 class="post-card-title">${post.title}</h2>
          <p class="post-excerpt">${post.excerpt}</p>
          <span class="read-link">Read the full post</span>
        </article>`,
    )
    .join('')

  app.innerHTML = `
    <p class="section-label">Latest writing</p>
    <div class="post-list">${cards}</div>`
}

function renderPost(id) {
  const post = posts.find((p) => p.id === id)

  if (!post) {
    renderHome()
    return
  }

  const paragraphs = post.body.map((text) => `<p>${text}</p>`).join('')

  app.innerHTML = `
    <a class="back-link" href="#" data-home>&larr; Back to all posts</a>
    <article class="article">
      <header class="article-head">
        <h1 class="article-title">${post.title}</h1>
        <p class="post-meta">
          <span class="post-author">${post.author}</span>
          <span class="dot">&middot;</span>
          <time datetime="${post.date}">${formatDate(post.date)}</time>
        </p>
      </header>
      <div class="article-body">${paragraphs}</div>
      <a class="back-link back-link-bottom" href="#" data-home>&larr; Back to all posts</a>
    </article>`

  window.scrollTo(0, 0)
}

app.addEventListener('click', (event) => {
  const backTrigger = event.target.closest('[data-home]')
  if (backTrigger) {
    event.preventDefault()
    renderHome()
    return
  }

  const card = event.target.closest('.post-card')
  if (card) {
    renderPost(Number(card.dataset.id))
  }
})

app.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter') return
  const card = event.target.closest('.post-card')
  if (card) {
    renderPost(Number(card.dataset.id))
  }
})

homeLink.addEventListener('click', (event) => {
  event.preventDefault()
  renderHome()
})

renderHome()
