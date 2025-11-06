function displayModal() {
  const modal = document.getElementById("contact-modal")
  modal.style.display = "block"
}

function closeModal() {
  const modal = document.getElementById("contact-modal")
  modal.style.display = "none"
}

const contactForm = document.querySelector("#contact-modal form")

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const prenom = document.getElementById("prenom").value
    const nom = document.getElementById("nom").value
    const email = document.getElementById("email").value
    const message = document.getElementById("message").value

    console.log("--- Données du Formulaire ---")
    console.log("Prénom:", prenom)
    console.log("Nom:", nom)
    console.log("Email:", email)
    console.log("Message:", message)
    console.log("-----------------------------")

    closeModal()

    alert(`Merci ${prenom} ! Votre message a été envoyé.`)

    contactForm.reset()
  })
}
