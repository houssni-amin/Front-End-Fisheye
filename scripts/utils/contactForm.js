// --- SÉLECTEURS ---
const modal = document.getElementById("contact-modal")
const openButton = document.querySelector(".photograph-header .contact-button")
const closeButton = document.querySelector("#contact-modal .modal-close-btn") // Utilise la nouvelle classe
const contactForm = document.querySelector("#contact-modal form")

// Liste des éléments "focussables" DANS la modale
let focusableElements = []
let firstFocusableElement
let lastFocusableElement

// --- FONCTIONS ---

/**
 * Gère la navigation clavier pour la modale de contact (Escape et Focus Trap)
 */
function handleContactKeydown(e) {
  // Ferme la modale si on appuie sur "Escape"
  if (e.key === "Escape") {
    closeModal()
  }

  // Logique du PIÈGE DE FOCUS (Touche Tab)
  if (e.key === "Tab") {
    if (e.shiftKey) {
      // Si on fait Shift + Tab (navigation arrière)
      if (document.activeElement === firstFocusableElement) {
        e.preventDefault()
        lastFocusableElement.focus() // Rebondit sur le dernier
      }
    } else {
      // Si on fait Tab (navigation avant)
      if (document.activeElement === lastFocusableElement) {
        e.preventDefault()
        firstFocusableElement.focus() // Rebondit sur le premier
      }
    }
  }
}

/**
 * Ouvre la modale de contact
 */
function displayModal() {
  modal.style.display = "block"

  // 1. Trouver TOUS les éléments interactifs de la modale
  focusableElements = Array.from(
    modal.querySelectorAll(
      'button, [href], input, textarea, [tabindex]:not([tabindex="-1"])'
    )
  )
  firstFocusableElement = focusableElements[0] // Le bouton fermer
  lastFocusableElement = focusableElements[focusableElements.length - 1] // Le bouton "Envoyer"

  // 2. Mettre le focus sur le premier élément (le bouton fermer)
  // C'est ça qui manquait !
  firstFocusableElement.focus()

  // 3. Ajouter l'écouteur pour le piège de focus et "Escape"
  document.addEventListener("keydown", handleContactKeydown)
}

/**
 * Ferme la modale de contact
 */
function closeModal() {
  modal.style.display = "none"
  // 4. Retirer l'écouteur quand on ferme
  document.removeEventListener("keydown", handleContactKeydown)
}

// --- ÉCOUTEURS D'ÉVÉNEMENTS ---

// Gère l'ouverture (remplace ton onclick)
openButton.addEventListener("click", displayModal)
// Gère la fermeture (remplace ton onclick)
closeButton.addEventListener("click", closeModal)

// Gère la soumission du formulaire
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const prenom = document.getElementById("prenom").value
    const nom = document.getElementById("nom").value
    const email = document.getElementById("email").value
    const message = document.getElementById("message").value

    console.log(
      "Prénom:",
      prenom,
      "Nom:",
      nom,
      "Email:",
      email,
      "Message:",
      message
    )
    closeModal()
    alert(`Merci ${prenom} ! Votre message a été envoyé.`)
    contactForm.reset()
  })
}
