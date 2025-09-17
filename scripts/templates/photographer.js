function photographerTemplate(data) {
  const { portrait, name, city, country, tagline, price } = data

  const picture = `../assets/Sample Photos/Photographers ID Photos/${portrait}`

  function getUserCardDOM() {
    const article = document.createElement("article")

    const img = document.createElement("img")
    img.setAttribute("src", picture)
    article.appendChild(img)

    const h2 = document.createElement("h2")
    h2.textContent = name
    article.appendChild(h2)

    const p1 = document.createElement("p")
    p1.className = "photographer-location"
    p1.textContent = `${city}, ${country}`
    article.appendChild(p1)

    const p2 = document.createElement("p")
    p2.className = "photographer-tagline"
    p2.textContent = tagline
    article.appendChild(p2)

    const p3 = document.createElement("p")
    p3.className = "photographer-price"
    p3.textContent = `${price}€/jour`
    article.appendChild(p3)
    return article
  }
  return { name, picture, getUserCardDOM }
}
