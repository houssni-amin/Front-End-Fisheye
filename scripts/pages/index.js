// 1. RÉCUPÉRATION DES DONNÉES

// Récupère les données des photographes depuis le fichier JSON
async function getPhotographers() {
  try {
    const res = await fetch("data/photographers.json")

    // Vérification de la réponse du serveur
    if (!res.ok) {
      throw new Error(res.status)
    }

    const data = await res.json()
    return data
  } catch (error) {
    console.error("Erreur lors de la récupération des photographes :", error)
  }
}

// 2. FONCTIONS D'AFFICHAGE

// Affiche les cartes des photographes dans la section dédiée
async function displayData(photographers) {
  const photographersSection = document.querySelector(".photographer-section")

  photographersSection.innerHTML = ""

  photographers.forEach((photographer) => {
    // Utilisation du modèle (Template) pour créer le HTML
    const photographerModel = photographerTemplate(photographer)
    const userCardDOM = photographerModel.getUserCardDOM()

    // Ajout de la carte au DOM
    photographersSection.appendChild(userCardDOM)
  })
}

// 3. FONCTION PRINCIPALE

// Initialisation de la page d'accueil
async function init() {
  // Récupère les datas des photographes
  const { photographers } = await getPhotographers()

  // Affiche les datas
  displayData(photographers)
}

// Lancement de l'application
init()
