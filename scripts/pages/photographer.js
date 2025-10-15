async function getData() {
  const res = await fetch("../../data/photographers.json")
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

async function init() {
  // --- Récupération de l'ID depuis l'URL ---
  const params = new URLSearchParams(window.location.search)
  const id = params.get("id")

  // --- Chargement des données ---
  const photographer = await getPhotographerById(id)
  let media = await getMediaByPhotographerId(id)

  // --- Sélection du <main> principal ---
  const main = document.querySelector("main")

  // --- Construction du header ---
  const picture = `../../assets/Sample Photos/Photographers ID Photos/${photographer.portrait}`
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

  // --- Création du menu de tri ---
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

  // --- Création du bloc total likes + prix ---
  const boxInfos = document.createElement("div")
  boxInfos.className = "boxInfos"

  const totalLikesBox = document.createElement("div")
  totalLikesBox.className = "totalLikesBox"
  boxInfos.appendChild(totalLikesBox)

  const totalLikes = document.createElement("p")
  totalLikes.className = "totalLikes"
  let totalLikesCount = media.reduce((acc, m) => acc + (m.likes || 0), 0)
  totalLikes.textContent = totalLikesCount.toLocaleString("fr-FR")
  totalLikesBox.appendChild(totalLikes)

  const blackHeart = document.createElement("img")
  blackHeart.src = "../../assets/icons/blackHeart.svg"
  blackHeart.alt = "Black heart icon"
  blackHeart.className = "blackHeartIcon"
  totalLikesBox.appendChild(blackHeart)

  const dailyPrice = document.createElement("p")
  dailyPrice.className = "dailyPrice"
  dailyPrice.textContent = `${photographer.price}€ / jour`
  boxInfos.appendChild(dailyPrice)

  main.appendChild(boxInfos)

  // --- Création de la galerie ---
  const gallery = document.createElement("div")
  gallery.className = "media-gallery"
  main.appendChild(gallery)

  const folderName = getFolderName(photographer.name)

  // --- Fonction d'affichage des médias ---
  function renderGallery(mediaArray) {
    gallery.innerHTML = ""

    mediaArray.forEach((item) => {
      const mediaCard = document.createElement("div")
      mediaCard.className = "media-card"

      if (item.image) {
        const img = document.createElement("img")
        img.className = "imgMediaCard"
        img.src = `../../assets/Sample Photos/${folderName}/${item.image}`
        img.alt = item.title
        mediaCard.appendChild(img)
      }
      if (item.video) {
        const video = document.createElement("video")
        video.className = "videoMediaCard"
        video.src = `../../assets/Sample Photos/${folderName}/${item.video}`
        mediaCard.appendChild(video)
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
      redHeart.src = "../../assets/icons/redHeart.svg"
      redHeart.alt = "like"
      redHeart.className = "redHeartIcon"
      likesMediaCard.appendChild(redHeart)

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
        mediaLikes.textContent = item.likes
        totalLikes.textContent = totalLikesCount.toLocaleString("fr-FR")

        // --- Animation du cœur ---
        redHeart.classList.add("animateHeart")
        setTimeout(() => redHeart.classList.remove("animateHeart"), 200)
      })

      gallery.appendChild(mediaCard)
    })
  }

  // --- Fonction de tri ---
  function sortAndRender(criteria) {
    const copy = media.slice()

    if (criteria === "popularity") {
      copy.sort((a, b) => (b.likes || 0) - (a.likes || 0))
    } else if (criteria === "date") {
      copy.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    } else if (criteria === "title") {
      copy.sort((a, b) => (a.title || "").localeCompare(b.title || ""))
    }

    renderGallery(copy)
  }

  // --- Quand on change le tri ---
  select.addEventListener("change", (e) => {
    sortAndRender(e.target.value)
  })

  // --- Premier affichage (par popularité) ---
  sortAndRender("date")
}

init()
