
import './style.css'

const app = document.querySelector('#app')

app.innerHTML = `
  <main class="container">
    <header class="header">
      <h1>🚀 NASA Explorer</h1>
      <p>Explore the universe, one picture at a time.</p>
    </header>

    <section class="apod-card">
      <h2>Astronomy Picture of the Day</h2>
      <p id="status">Loading today's cosmic discovery...</p>
      <div id="apod-content"></div>
    </section>
  </main>
`

const status = document.querySelector('#status')
const content = document.querySelector('#apod-content')

const API_URL = 'https://science.nasa.gov/wp-json/wp/v2/apod-basic/'

async function loadPicture() {
  try {
    const response = await fetch(API_URL)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    const picture = Array.isArray(data) ? data[0] : data

    if (!picture) {
      throw new Error('No picture found')
    }

    const title = picture.title?.rendered || picture.title || 'NASA Astronomy Picture'

    const imageUrl =
      picture.image_url ||
      picture.url ||
      picture.hdurl ||
      picture.featured_image_url ||
      picture.image

    status.textContent = picture.date || 'Discover the universe!'

    content.innerHTML = `
      <h3>${escapeHTML(title)}</h3>

      ${
        imageUrl
          ? `<img class="apod-image"
                  src="${escapeHTML(imageUrl)}"
                  alt="${escapeHTML(title)}"
                  style="max-width:100%;border-radius:12px;"
                  onerror="this.style.display='none'">`
          : '<p>Image is not available in this response.</p>'
      }

      <h3>About this picture</h3>
      <p class="explanation">
        ${escapeHTML(
          picture.explanation?.rendered ||
          picture.explanation ||
          picture.caption?.rendered ||
          'Explore the wonders of space with NASA!'
        )}
      </p>

      ${
        picture.permalink || picture.link
          ? `<p><a href="${escapeHTML(picture.permalink || picture.link)}"
                target="_blank" rel="noopener noreferrer">
                Read more on NASA's website ↗
              </a></p>`
          : ''
      }
    `
  } catch (error) {
    console.error('NASA API error:', error)

    status.textContent = 'Unable to load the astronomy picture.'

    content.innerHTML = `
      <p>Please check your internet connection and try again.</p>
      <button id="retry-button" type="button">Try Again</button>
    `

    document
      .querySelector('#retry-button')
      .addEventListener('click', loadPicture)
  }
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character])
}

loadPicture()
