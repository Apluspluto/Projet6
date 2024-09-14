// Variables 
const DivGallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters")

// Récupération des works
async function Works() {
    const reponse = await fetch("http://localhost:5678/api/works");
    return await reponse.json();
}

// Création des works
function creationWorks(Works) {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");
    img.src = Works.imageUrl;
    figcaption.textContent = Works.title;
    figure.appendChild(img);
    figure.appendChild(figcaption);
    DivGallery.appendChild(figure);
  }

// Affichage des works dans le dom 
async function AffichageWorks() {
    const arrayWorks = await Works();
    arrayWorks.forEach(arrayWorks => {
      creationWorks(arrayWorks);
    });
  }
  AffichageWorks();
                            
// Récupération des catégories 
async function categories() {
    const reponse = await fetch("http://localhost:5678/api/categories")
    return await reponse.json();
} 

// Création des boutons 
async function categoriesBoutons() {
    const cate = await categories();
    cate.forEach(categorie => {
        const btn = document.createElement("button")
        btn.classList.add("Btn")
        btn.textContent = categorie.name;
        btn.id = categorie.id;
        filters.appendChild(btn)
    });
}
categoriesBoutons();

//Filtrage au click 
async function Filtrage(){
    const tableau = await Works();
    const boutons = document.querySelectorAll(".filters button");
    boutons.forEach(button => {
        button.addEventListener("click", (e) => {
            DivGallery.innerHTML ="";
            btnId = e.target.id;
            if (btnId !== "0") {
                const WorksTri = tableau.filter( works => {
                    return works.categoryId == btnId;
                })
                 WorksTri.forEach(work => {
                    creationWorks(work)
                });
    
            } else {
                AffichageWorks();
            }
        })
    });
}
Filtrage()

// Variables
const loged = window.sessionStorage.getItem('loged');
const modifie = document.querySelector(".containerModifier .modifie");
const logout = document.querySelector("header nav .lien");
const containerModal = document.querySelector(".containerModal");
const croix = document.querySelector(".containerModal .fa-xmark");
const worksModal = document.querySelector(".worksModal");
const ModeEdition = document.querySelector("body .ModeEdition");
const titre = document.getElementById("title");
const FileInput = document.querySelector(".containerFile input");

// Affichage une fois connecté
if (loged) {
    ModeEdition.style.display = "flex";
    modifie.style.display = "flex";
    logout.textContent = "logout";
    logout.addEventListener("click", () => {
    window.sessionStorage.removeItem('loged')
    })
}

// Variables
const previewIMG = document.querySelector(".AjoutPhoto img");
const inputFile = document.querySelector(".containerFile input");
const labelFile = document.querySelector(".containerFile label");
const iconeFile = document.querySelector(".containerFile .fa-image");
const pFile = document.querySelector(".containerFile p")

// Affichage de la modal au click sur modifié
modifie.addEventListener("click", () => {
    titre.value = "";
    previewIMG.src = "";
    previewIMG.style.display = "none"
    labelFile.style.display = "block"
    iconeFile.style.display = "block"
    pFile.style.display = "block"
   containerModal.style.display = "flex";
});

// Fermeture de la modal au click sur la croix
croix.addEventListener("click", () => {
    containerModal.style.display = "none";
});

// Fermeture de la modal 
containerModal.addEventListener("click", (e) => {
    if (e.target.className == "containerModal") {
        containerModal.style.display = "none";
    }
})

// Affichage des photos worksmodal 
async function displayPhotoModal() {
    worksModal.innerHTML="";
    const works = await Works();
    works.forEach(photo => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const span = document.createElement("span");
        const trash = document.createElement("i");
        trash.classList.add("fa-solid", "fa-trash-can");
        trash.id = photo.id;
        img.src = photo.imageUrl;
        span.appendChild(trash);
        figure.appendChild(span);
        figure.appendChild(img);
        worksModal.appendChild(figure);
    });
    deletePhoto();
}
displayPhotoModal();

// Suppression d'une image dans la modal
function deletePhoto() {
    const trashAll = document.querySelectorAll(".fa-trash-can");
    trashAll.forEach(trash => {
        trash.addEventListener("click", async (e) => {
            e.preventDefault();
            const id = trash.id;
            const token = window.sessionStorage.getItem('loged'); // Récupère le token de session
            
            const init = {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // Ajoute le token d'authentification
                }
            };

            try {
                const response = await fetch(`http://localhost:5678/api/works/${id}`, init);
                
                // Vérifie si la suppression a échoué
                if (!response.ok) {
                    console.log("La suppression a échoué avec le statut :", response.status);
                    const errorData = await response.text(); // Lire le texte d'erreur pour plus de détails
                    console.error("Détails de l'erreur :", errorData);
                    return;
                }

                // Si le serveur ne renvoie pas de contenu 
                if (response.status === 204 || response.headers.get('content-length') === '0') {
                    console.log("La suppression a réussi, aucune réponse à analyser.");
                } else {
                    // Sinon, traiter le JSON 
                    const data = await response.json();
                    console.log("La suppression a réussi, voici les données :", data);
                }

                // Vider la galerie principale avant de la recharger
                DivGallery.innerHTML = "";

                // Mettre à jour l'affichage dans la modal et sur la page principale
                await displayPhotoModal(); // Actualise les photos dans la modal
                await AffichageWorks();    // Actualise les photos dans la galerie principale
                
            } catch (error) {
                console.error("Une erreur est survenue lors de la suppression :", error);
            }
        });
    });
}
deletePhoto()

//Faire apparaitre la deuxieme modal 
const btnAjoutModal = document.querySelector(".modalWorks button");
const ModalAjoutPhoto = document.querySelector(".AjoutPhoto");
const ModalWorks = document.querySelector(".modalWorks");
const ArrowLeft = document.querySelector(".fa-arrow-left");
const croixAjout = document.querySelector(".header-icons .fa-xmark");

function displayAjoutPhoto() {
    btnAjoutModal.addEventListener("click", () => {
        ModalAjoutPhoto.style.display = "block"
        ModalWorks.style.display = "none"
    }) 
    ArrowLeft.addEventListener("click", () => {
        ModalAjoutPhoto.style.display = "none"
        ModalWorks.style.display = "flex"
    })
    croixAjout.addEventListener("click", () => {
        containerModal.style.display = "none"
    })

}
displayAjoutPhoto()

// Faire la prévisualisation de l'image
let file = null;

// Ecouter les changements sur l'input file 
inputFile.addEventListener("change", () => {
    file = inputFile.files[0]
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewIMG.src = e.target.result
            previewIMG.style.display = "block"
            labelFile.style.display = "none"
            iconeFile.style.display = "none"
            pFile.style.display = "none"
        }
        reader.readAsDataURL(file);
    }
})

// Creation liste category dans l'input select 
async function displayCategory () {
    const select = document.querySelector(".AjoutPhoto select");
    const categorys = await categories();
    categorys.forEach(category => {
        const option = document.createElement("option")
        option.value = category.id
        option.textContent = category.name
        select.appendChild(option)
    })
    
}
displayCategory();

// Faire un Post ajouter une photo
const form = document.querySelector(".AjoutPhoto form");
const title = document.querySelector(".AjoutPhoto #title");
const category = document.querySelector(".AjoutPhoto #category");

// Faire un Post ajouter une photo
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Récupérer le token depuis sessionStorage
    const token = window.sessionStorage.getItem('loged');
    if (!token) {
        console.error('Token is missing or invalid');
        return; // Arrêter le traitement si le token est manquant
    }

    // Récupérer les données du formulaire
    const formData = new FormData();

    // Ajouter explicitement les champs title et category aux données
    formData.append('title', title.value);
    let image = document.getElementById("file")
    formData.append('category', category.value);
    formData.append('image', image.files[0]);

    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            body: formData,
            headers: {
                "Authorization": `Bearer ${token}` // Inclure le token
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        // Vider la galerie avant de réafficher toutes les œuvres
        DivGallery.innerHTML = ""; // Pour éviter les doublons

        // Recharger la galerie et la modal après l'ajout
        await displayPhotoModal(); // Actualise les photos dans la modal
        await AffichageWorks();    // Actualise les photos dans la galerie principale
        
        // Réinitialiser le formulaire après l'ajout
        form.reset();

        // Réinitialiser les éléments de prévisualisation de l'image
        previewIMG.style.display = "none";
        labelFile.style.display = "block";
        iconeFile.style.display = "block";
        pFile.style.display = "block";
 
    } catch (error) {
        console.error('Error:', error);
    }
});

//Function verification input rempli 
function verification() {
    const buttonValidation = document.querySelector(".AjoutPhoto button");
    form.addEventListener("input", () => {
        if (!title.value ==""  && !category.value ==""  && !inputFile.value ==""){
            buttonValidation.classList.add("validation");
            buttonValidation.disabled = false;
        }
        else {
            buttonValidation.classList.remove("validation");
            buttonValidation.disabled = true;
        }
    })
}
verification();