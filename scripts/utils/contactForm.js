const modal = document.getElementById("contact-modal")
const openButton = document.querySelector(".photograph-header .contact-button")
const closeButton = document.querySelector("#contact-modal .modal-close-btn")
const contactForm = document.querySelector("#contact-modal form")

let focusableElements = []
let firstFocusableElement
let lastFocusableElement

function handleContactKeydown(e) {
  // Fermeture avec Echap
  if (e.key === "Escape") {
    closeModal()
  }

  // Piège de focus avec "Tab" (empêche de sortir de la modale)
  if (e.key === "Tab") {
    if (e.shiftKey) {
      // Shift + Tab : Si on est sur le premier élément, on boucle vers le dernier
      if (document.activeElement === firstFocusableElement) {
        e.preventDefault()
        lastFocusableElement.focus()
      }
    } else {
      // Tab simple : Si on est sur le dernier élément, on boucle vers le premier
      if (document.activeElement === lastFocusableElement) {
        e.preventDefault()
        firstFocusableElement.focus()
      }
    }
  }
}

function displayModal() {
  modal.style.display = "block"

  // Récupère tous les éléments interactifs de la modale
  focusableElements = Array.from(
    modal.querySelectorAll(
      'button, [href], input, textarea, [tabindex]:not([tabindex="-1"])'
    )
  )

  // Définit le premier et le dernier élément pour le piège
  firstFocusableElement = focusableElements[0] // Bouton Fermer
  lastFocusableElement = focusableElements[focusableElements.length - 1] // Bouton Envoyer

  // Place le focus sur le premier élément
  firstFocusableElement.focus()

  // Active l'écouteur clavier
  document.addEventListener("keydown", handleContactKeydown)
}

// Ferme la modale et nettoie les écouteurs

function closeModal() {
  modal.style.display = "none"
  // Désactive l'écouteur clavier pour ne pas gêner le reste du site
  document.removeEventListener("keydown", handleContactKeydown)
}

openButton.addEventListener("click", displayModal)
closeButton.addEventListener("click", closeModal)

// Soumission du formulaire
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const prenom = document.getElementById("prenom").value
    const nom = document.getElementById("nom").value
    const email = document.getElementById("email").value
    const message = document.getElementById("message").value

    console.log(`
      Prénom: ${prenom}
      Nom: ${nom}
      Email: ${email}
      Message: ${message}
      `)
    closeModal()
    alert(`Merci ${prenom} ! Votre message a été envoyé.`)
    contactForm.reset()
  })
}
