async function getPhotographers() {
  try {
    const res = await fetch("../../data/photographers.json")
    if (!res.ok) {
      throw new Error(res.status)
    }

    const data = await res.json()
    console.log(data)

    return data
  } catch (error) {
    console.error(error)
  }
}

async function displayData(photographers) {
  const photographersSection = document.querySelector(".photographer-section")
  photographersSection.innerHTML = ""

  photographers.forEach((photographer) => {
    const photographerModel = photographerTemplate(photographer)
    const userCardDOM = photographerModel.getUserCardDOM()
    photographersSection.appendChild(userCardDOM)
  })
}

async function init() {
  // Récupère les datas des photographes
  const { photographers } = await getPhotographers()
  displayData(photographers)
}

init()
