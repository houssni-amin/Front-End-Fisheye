let currentMediaList = []
let currentMediaIndex = 0
let folderName = ""

// --- 1. RÉCUPÉRATION DES DONNÉES ---

// Fonctions pour aller chercher les données dans le JSON
async function getData() {
  const res = await fetch("data/photographers.json")
  const data = await res.json()
  return data
}

async function getPhotographerById(id) {
  const data = await getData()
  const photographer = data.photographers.find((p) => p.id == id)
  return photographer
}

async function getMediaByPhotographerId(id) {
  const data = await getData()
  const media = data.media.filter((m) => m.photographerId == id)
  return media
}

function getFolderName(name) {
  return name.split(" ")[0]
}

// --- 2. FONCTION PRINCIPALE (CONSTRUCTION DE LA PAGE) ---

async function init() {
  const params = new URLSearchParams(window.location.search)
  const id = params.get("id")

  const photographer = await getPhotographerById(id)
  let media = await getMediaByPhotographerId(id)

  folderName = getFolderName(photographer.name)

  const main = document.querySelector("main")

  // --- 2a. Construction du Header ---
  const picture = `assets/Sample Photos/Photographers ID Photos/${photographer.portrait}`
  const header = document.querySelector(".photograph-header")

  const headerLeft = document.createElement("div")
  headerLeft.className = "headerLeft"
  header.prepend(headerLeft)

  const h1 = document.createElement("h1")
  h1.textContent = photographer.name
  headerLeft.appendChild(h1)

  const location = document.createElement("p")
  location.className = "location"
  location.textContent = `${photographer.city}, ${photographer.country}`
  headerLeft.appendChild(location)

  const tagline = document.createElement("p")
  tagline.className = "tagline"
  tagline.textContent = photographer.tagline
  headerLeft.appendChild(tagline)

  const portrait = document.createElement("img")
  portrait.src = picture
  portrait.alt = photographer.name
  portrait.className = "photographerPortrait"
  header.appendChild(portrait)

  const headerModalLeft = document.querySelector(".header-modal-left")
  const photographerNameElement = document.createElement("p")
  photographerNameElement.textContent = photographer.name
  photographerNameElement.classList.add("photographer-name-modal")
  headerModalLeft.appendChild(photographerNameElement)

  // --- 2b. Construction du Menu de Tri ---
  const filter = document.createElement("div")
  filter.className = "filter"

  const txtFilter = document.createElement("p")
  txtFilter.textContent = "Trier par :"
  filter.appendChild(txtFilter)

  const select = document.createElement("select")
  select.id = "sort"

  const optionDate = new Option("Date", "date")
  const optionPopularity = new Option("Popularité", "popularity")
  const optionTitle = new Option("Titre", "title")

  select.append(optionDate, optionPopularity, optionTitle)
  filter.appendChild(select)
  main.appendChild(filter)

  // --- 2c. Construction de l'Encart Likes/Prix ---
  const boxInfos = document.createElement("div")
  boxInfos.className = "boxInfos"

  const totalLikesBox = document.createElement("div")
  totalLikesBox.className = "totalLikesBox"
  boxInfos.appendChild(totalLikesBox)

  const totalLikes = document.createElement("p")
  totalLikes.className = "totalLikes"
  // .reduce() "réduit" un tableau à une seule valeur. Ici, on additionne tous les likes.
  let totalLikesCount = media.reduce((acc, m) => acc + (m.likes || 0), 0)
  totalLikes.textContent = totalLikesCount.toLocaleString("fr-FR")
  totalLikesBox.appendChild(totalLikes)

  const blackHeart = document.createElement("img")
  blackHeart.src = "assets/icons/blackHeart.svg"
  blackHeart.alt = "Black heart icon"
  blackHeart.className = "blackHeartIcon"
  totalLikesBox.appendChild(blackHeart)

  const dailyPrice = document.createElement("p")
  dailyPrice.className = "dailyPrice"
  dailyPrice.textContent = `${photographer.price}€ / jour`
  boxInfos.appendChild(dailyPrice)

  main.appendChild(boxInfos)

  // Prépare la zone qui contiendra la galerie
  const gallery = document.createElement("div")
  gallery.className = "media-gallery"
  main.appendChild(gallery)

  // --- 2d. Fonction d'affichage de la Galerie  ---
  function renderGallery(mediaArray) {
    gallery.innerHTML = ""
    currentMediaList = mediaArray

    mediaArray.forEach((item, index) => {
      const mediaCard = document.createElement("div")
      mediaCard.className = "media-card"

      let mediaElement

      if (item.image) {
        const img = document.createElement("img")
        img.className = "imgMediaCard"
        img.src = `assets/Sample Photos/${folderName}/${item.image}`
        img.alt = item.title
        mediaCard.appendChild(img)
        mediaElement = img
      }
      if (item.video) {
        const video = document.createElement("video")
        video.className = "videoMediaCard"
        video.src = `assets/Sample Photos/${folderName}/${item.video}`
        mediaCard.appendChild(video)
        mediaElement = video
      }
      const mediaInfos = document.createElement("div")
      mediaInfos.className = "mediaInfos"
      mediaCard.appendChild(mediaInfos)

      const title = document.createElement("p")
      title.textContent = item.title
      mediaInfos.appendChild(title)

      const likesMediaCard = document.createElement("div")
      likesMediaCard.className = "likesMediaCard"
      mediaInfos.appendChild(likesMediaCard)

      const mediaLikes = document.createElement("p")
      mediaLikes.textContent = item.likes
      likesMediaCard.appendChild(mediaLikes)

      const redHeart = document.createElement("img")
      redHeart.src = "assets/icons/redHeart.svg"
      redHeart.alt = "like"
      redHeart.className = "redHeartIcon"
      likesMediaCard.appendChild(redHeart)

      // Logique pour le clic sur le coeur (like/unlike)
      let liked = false
      redHeart.addEventListener("click", () => {
        if (!liked) {
          item.likes++
          totalLikesCount++
          liked = true
        } else {
          item.likes--
          totalLikesCount--
          liked = false
        }
        // Met à jour les affichages
        mediaLikes.textContent = item.likes
        totalLikes.textContent = totalLikesCount.toLocaleString("fr-FR")

        redHeart.classList.add("animateHeart")
        setTimeout(() => redHeart.classList.remove("animateHeart"), 200)
      })

      // Attache le clic pour ouvrir la lightbox
      mediaElement.addEventListener("click", () => {
        openLightbox(index)
      })

      gallery.appendChild(mediaCard)
    })
  }

  // --- 2e. Fonction de Tri ---
  function sortAndRender(criteria) {
    const copy = media.slice() // Fait une copie pour ne pas modifier l'original

    if (criteria === "popularity") {
      copy.sort((a, b) => (b.likes || 0) - (a.likes || 0))
    } else if (criteria === "date") {
      copy.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    } else if (criteria === "title") {
      copy.sort((a, b) => (a.title || "").localeCompare(b.title || ""))
    }

    renderGallery(copy) // Ré-affiche la galerie avec la liste triée
  }

  // Écouteur d'événement sur le menu de tri
  select.addEventListener("change", (e) => {
    sortAndRender(e.target.value)
  })

  sortAndRender("date")
}

init()

// --- 3. FONCTIONS DE LA LIGHTBOX ---

//Crée et ouvre la lightbox au bon index
function openLightbox(index) {
  // Ne fait rien si la lightbox est déjà ouverte
  if (document.getElementById("lightbox-modal")) return

  currentMediaIndex = index // Met à jour le "marque-page"

  const lightbox = document.createElement("div")
  lightbox.id = "lightbox-modal"
  lightbox.className = "lightbox"

  const closeBtn = document.createElement("button")
  closeBtn.className = "lightbox-close"
  closeBtn.innerHTML = "<p>x</p>"
  closeBtn.addEventListener("click", closeLightbox)
  lightbox.appendChild(closeBtn)

  const nextBtn = document.createElement("button")
  nextBtn.className = "lightbox-next"
  nextBtn.innerHTML = "<p>></p>"
  nextBtn.addEventListener("click", nextMedia)
  lightbox.appendChild(nextBtn)

  const prevBtn = document.createElement("button")
  prevBtn.className = "lightbox-prev"
  prevBtn.innerHTML = "<p><</p>"
  prevBtn.addEventListener("click", prevMedia)
  lightbox.appendChild(prevBtn)

  const container = document.createElement("div")
  container.className = "lightbox-container"

  const title = document.createElement("p")
  title.className = "lightbox-title"
  container.appendChild(title)

  lightbox.appendChild(container)

  document.body.appendChild(lightbox)

  displayCurrentMedia()
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox-modal")
  if (lightbox) {
    document.body.removeChild(lightbox)
  }
}

function displayCurrentMedia() {
  const container = document.querySelector(
    "#lightbox-modal .lightbox-container"
  )
  const title = document.querySelector("#lightbox-modal .lightbox-title")
  if (!container || !title) return // Sécurité

  // Récupère le bon objet média en utilisant la "playlist" et le "marque-page"
  const media = currentMediaList[currentMediaIndex]

  // Retire l'ancien média (s'il y en a un)
  const oldMedia =
    container.querySelector("img") || container.querySelector("video")
  if (oldMedia) {
    container.removeChild(oldMedia)
  }

  // Ajoute le nouveau média
  if (media.image) {
    const img = document.createElement("img")
    img.src = `assets/Sample Photos/${folderName}/${media.image}`
    img.alt = media.title
    img.className = "lightbox-media"
    container.prepend(img)
  } else if (media.video) {
    const video = document.createElement("video")
    video.src = `assets/Sample Photos/${folderName}/${media.video}`
    video.controls = true
    video.className = "lightbox-media"
    container.prepend(video)
  }

  // Met à jour le titre
  title.textContent = media.title
}

function nextMedia() {
  currentMediaIndex++
  if (currentMediaIndex >= currentMediaList.length) {
    currentMediaIndex = 0
  }
  displayCurrentMedia()
}

function prevMedia() {
  currentMediaIndex--
  if (currentMediaIndex < 0) {
    currentMediaIndex = currentMediaList.length - 1
  }
  displayCurrentMedia()
}
