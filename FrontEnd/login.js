// Variables
const email = document.querySelector("form #email");
const password = document.querySelector("form #password");
const form = document.querySelector("form");
const paragraphe = document.querySelector("#contact p");

// Fonction pour récupérer les données utilisateur
async function Users(emailValue, passwordValue) {
    try {
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: emailValue,
                password: passwordValue
            })
        });

        // Vérifiez si la réponse est correcte
        if (!response.ok) {
            paragraphe.innerHTML = "Identifiants incorrects, veuillez réessayer.";
            paragraphe.classList.add("Error");
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Retourner les données JSON de la réponse
        return await response.json();
    } catch (error) {
        // Log de l'erreur pour déboguer
        console.error('Erreur lors de la requête POST:', error);
        return null;
    }
}

// Connexion
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const mailValeur = email.value;
        const mdpValeur = password.value;

        // Appel de la fonction Users avec les valeurs du formulaire
        const userData = await Users(mailValeur, mdpValeur);
        console.log(userData); // Pour déboguer et voir la réponse de l'API

        if (mailValeur && userData.token) {
            // Si la connexion est réussie
            window.sessionStorage.setItem('loged', userData.token);

            // Rediriger vers la page d'accueil ou dashboard
             window.location.href = "index.html";
        } else {
        }
    });


