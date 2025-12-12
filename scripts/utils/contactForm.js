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

  // Piège de focus
  if (e.key === "Tab") {
    if (e.shiftKey) {
      // Boucle vers le dernier
      if (document.activeElement === firstFocusableElement) {
        e.preventDefault()
        lastFocusableElement.focus()
      }
    } else {
      // Boucle vers le premier
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

  firstFocusableElement = focusableElements[0] // Bouton fermer
  lastFocusableElement = focusableElements[focusableElements.length - 1] // Bouton envoyer

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
