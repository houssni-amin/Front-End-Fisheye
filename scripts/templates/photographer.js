function photographerTemplate(data) {
  const { portrait, name, city, country, tagline, price, id } = data

  const picture = `../assets/Sample Photos/Photographers ID Photos/${portrait}`

  function getUserCardDOM() {
    const article = document.createElement("article")

    const photographer = document.createElement("a")
    photographer.setAttribute("href", `photographer.html?id=${id}`)
    article.appendChild(photographer)

    const img = document.createElement("img")
    img.setAttribute("src", picture)
    img.setAttribute("alt", name)
    photographer.appendChild(img)

    const h2 = document.createElement("h2")
    h2.textContent = name
    photographer.appendChild(h2)

    const p1 = document.createElement("p")
    p1.className = "photographer-location"
    p1.textContent = `${city}, ${country}`
    photographer.appendChild(p1)

    const p2 = document.createElement("p")
    p2.className = "photographer-tagline"
    p2.textContent = tagline
    photographer.appendChild(p2)

    const p3 = document.createElement("p")
    p3.className = "photographer-price"
    p3.textContent = `${price}€/jour`
    photographer.appendChild(p3)
    return article
  }
  return { name, picture, getUserCardDOM }
}
