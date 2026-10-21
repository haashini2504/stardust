
import './style.css'

const app = document.querySelector('#app')

app.innerHTML = `
  <main class="container">
    <h1>🚀 NASA Explorer</h1>
    <p class="subtitle">Explore the universe, one picture at a time.</p>

    <section class="card">
      <h2>Astronomy Picture of the Day</h2>
      <p id="status">Loading today's space picture...</p>
      <div id="picture"></div>
    </section>
  </main>
`

const apiKey = import.meta.env.VITE_NASA_API_KEY
const status = document.querySelector('#status')
const picture = document.querySelector('#picture')

async function loadPicture() {
  try {
    if (!apiKey) {
      throw new Error('NASA API key is missing. Check your .env file.')
    }

    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`
    )

    if (!response.ok) {
      throw new Error(`NASA API error: ${response.status}`)
    }

    const data = await response.json()

    status.textContent = `${data.title} — ${data.date}`

    if (data.media_type === 'image') {
      const img = document.createElement('img')
      img.src = data.url
      img.alt = data.title
      img.className = 'space-image'
      picture.appendChild(img)
    } else if (data.media_type === 'video') {
      const link = document.createElement('a')
      link.href = data.url
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      link.textContent = 'Watch today’s NASA video'
      picture.appendChild(link)
    }

    const description = document.createElement('p')
    description.textContent = data.explanation
    picture.appendChild(description)
  } catch (error) {
    status.textContent = error.message
    console.error(error)
  }
}

loadPicture()
