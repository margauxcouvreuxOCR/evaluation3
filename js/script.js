// DEBUT JQ
$(document).ready(function () {
    //Cache toutes les span d'erreur
    $(".spanErreur").hide(1000);

    /*--- V A R I A B L E S ---*/
    // Expression régulière pour vérifier que l'input est une date de naissance de 01 jan 1900 à 31 déc 2024
    const dateRegex =
        "^(0[1-9]|[12][0-9]|3[01])[\\/](0[1-9]|1[0-2])[\\/](19[0-9]{2}|20[0-2][0-4])$";

    // Expression régulière pour vérifier que l'input est un email
    const emailRegex =
        "^[a-zA-Z0-9]+[\\_\\-\\.]*[a-zA-Z0-9]*@[a-zA-Z]+\\.[a-zA-Z]{2,5}$";

    /*- - - - - L I S T E N E R S - - - - -*/

    // Ecoute les changements de l'input File, lance la fonction readUrl
    $("#inputFile").on("change", function () {
        readURL(this);
    });

    // Ecoute les ecritures de l'input Nom, transforme en majuscules, lance la fonction de verification
    $("#inputNom").on("input", function () {
        $(this).val($(this).val().toUpperCase());
        verifNomPrenom($("#inputNom"), $("#spanErreurNom"));
    });

    // Ecoute les ecritures de l'input Prenom, transforme le texte en 1maj + des min, lance la fonction de verification
    $("#inputPrenom").on("input", function () {
        let valeur = $(this).val();
        let valeurTransformee =
            valeur.charAt(0).toUpperCase() + valeur.slice(1).toLowerCase();
        $(this).val(valeurTransformee);
        verifNomPrenom($("#inputPrenom"), $("#spanErreurPrenom"));
    });

    // Ecoute les ecritures de l'input Date, lance la fonction, lance la fonction de verification
    $("#inputDate").on("input", function () {
        let inputValue = $(this).val();
        let inputValueModif = inputValue.replace(/[\.\- ]/g, "/");
        $(this).val(inputValueModif);
        verifInputEmailDate(
            dateRegex,
            $("#inputDate"),
            $("#spanErreurDate"),
            "date"
        );
    });

    // Ecoute les ecritures de l'input Email, lance la fonction, lance la fonction de verification
    $("#inputEmail").on("input", function () {
        verifInputEmailDate(
            emailRegex,
            $("#inputEmail"),
            $("#spanErreurEmail"),
            "email"
        );
    });

    // Ecoute les ecritures de l'input Email, lance la fonction, lance la fonction de verification
    $("#inputCode").on("input", function () {
        verifInputCode(
            $("#inputCode"),
            $("#spanErreurCode")
        );
    });

    /*- - - - - B O U T O N S - - - - -*/
    // Ecoute les clic du bouton Confirmer,
    $("#boutonEnvoyer").on("click", function (e) {
        e.preventDefault();

        const mesInputs = [
            {
                id: "#inputNom",
                idErreur: "#spanErreurNom",
                messageErreur: "Champ nom vide",
            },
            {
                id: "#inputPrenom",
                idErreur: "#spanErreurPrenom",
                messageErreur: "Champ prenom vide",
            },
            {
                id: "#inputDate",
                idErreur: "#spanErreurDate",
                messageErreur: "Champ Date vide",
            },
            {
                id: "#inputEmail",
                idErreur: "#spanErreurEmail",
                messageErreur: "Champ Email vide",
            },
            {
                id: "#inputCode",
                idErreur: "#spanErreurCode",
                messageErreur: "Champ Code vide",
            },
        ];

        let formValide = true;

        $(".spanErreur").hide(1000);

        mesInputs.forEach((unInput) => {
            if ($(unInput.id).val() == "") {
                $(unInput.idErreur).show(500).html("Champ vide");
                formValide = false;
            }
        });

        if (formValide) {
            let dateValide = verifInputEmailDate(dateRegex, $("#inputDate"), $("#spanErreurDate"), "date" );
            let emailValide = verifInputEmailDate(
                emailRegex,
                $("#inputEmail"),
                $("#spanErreurEmail"),
                "email"
            );
            let nomValide = verifNomPrenom($("#inputNom"), $("#spanErreurNom"));
            let prenomValide = verifNomPrenom(
                $("#inputPrenom"),
                $("#spanErreurPrenom")
            );
            let codeValide = verifInputCode($("#inputCode"), $("#spanErreurCode"));


            if (
                dateValide &&
                emailValide &&
                nomValide &&
                prenomValide &&
                codeValide
            ) {
                let confirmation = false;
                confirmation = envoiConfirmation();
                if (confirmation) {
                    return true;
                }
            }
        } else {
            $("#rangeeInfos").find("input").css("border", "red solid");
            $("#rangeeInfos").find("input").css("color", "red");
            e.preventDefault();
        }
    });

    // Ecoute les clic du bouton Annuler, recharge la page
    $("#boutonAnnuler").on("click", function () {
        location.reload();
    });

    $('#btnFermer').on('click', function() {
        // Soumet le formulaire lorsqu'on clique sur "Fermer"
        $("form").submit();
    });

    /*- - - - - F O N C T I O N S - - - - -*/

    /* Envoie un prompt de confirmation, verifie le texte si yes ou no, si Ok il envoie le formulaire
    @return { bool }
    */
    function envoiConfirmation() {
        var saisie = prompt("Confirmez-vous l’envoi des informations? (Y/N)");

        switch (saisie) {
            case "Y":
            case "y":
            // Ouvre la modale
            var confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
            confirmationModal.show();

            // Écoute la fermeture complète de la modale (s'applique aux deux boutons)
            $('#confirmationModal').on('hidden.bs.modal', function () {
                // Soumet le formulaire après la fermeture de la modale
                $("form").submit();
            });

            // Gestion du clic sur la croix en haut à droite
            $('.btn-close').on('click', function () {
                // Soumet le formulaire dès qu'on clique sur la croix
                $("form").submit();
            });

            // Gestion du clic sur le lien "Fermer" en bas de la modale
            $('#btnFermer').on('click', function () {
                // Soumet le formulaire dès qu'on clique sur le bouton "Fermer"
                $("form").submit();
            });

            // Empêche la soumission immédiate du formulaire
            return true;
            case "N":
            case "n":
                alert("Ok, tant pis...");
                return false;
            default:
                alert(
                    "Je n'ai pas compris. Entrées acceptées : Y,y (yes) ou N,n (no). \nVeuillez réessayer."
                );
                return false;
        }
    }

    /*- - - - - V E R I F S - - - - -*/

    /*  Verifie l email ou la date, adapte le message d'erreur
    @param { regex } expressionComparaison
    @param { id } monInput
    @param { id } maLegende
    @param { 'email' ou 'date' } type
    @return { bool }
    */
    function verifInputEmailDate(
        expressionComparaison,
        monInput,
        maLegende,
        type
    ) {
        let messageError;

        if (type === "date") {
            messageError = "Veuillez entrer une date valide.";
        } else if (type === "email") {
            messageError = "Veuillez entrer un email valide.";
        } else {
            messageError = "Veuillez entrer une valeur valide.";
        }

        if (monInput.val().match(expressionComparaison)) {
            monInput.css("border", "green solid");
            monInput.css("color", "green");
            maLegende.hide(1000);
            return true;
        } else {
            monInput.css("border", "red solid");
            monInput.css("color", "red");
            maLegende.text(messageError).show(500);
            return false;
        }
    }

    /*  Verifie le nom ou le prenom, adapte le message d'erreur
    @param { id } monInput
    @param { id } maLegende
    @return { bool }
    */
    function verifNomPrenom(monInput, maLegende) {
        let messageError = "Pas de caractères spéciaux.";
        let expressionComparaison = "^[a-zA-ZÀ-ÿ\\-]+$";

        if (monInput.val().match(expressionComparaison) && monInput.val() !== "") {
            monInput.css("border", "green solid");
            monInput.css("color", "green");
            maLegende.hide(1000);
            return true;
        } else if (monInput.val() === "") {
            monInput.css("border", "red solid");
            monInput.css("color", "red");
            messageError = "Champ vide";
            maLegende.text(messageError).show(500);
            return false;
        } else {
            monInput.css("border", "red solid");
            monInput.css("color", "red");
            maLegende.text(messageError).show(500);
            return false;
        }
    }

    /*  Verifie le code, envoie le message d'erreur
@param { id } monInput
@param { id } maLegende
@return { bool }
*/
    function verifInputCode(monInput, maLegende) {
        let messageError = "Pas un format code correct. ex : FR12345ABCx";
        let expressionComparaison = "^FR[\\d]{5}[A-Z\\.\\-\\_]{3}x$";

        if (monInput.val().match(expressionComparaison) && monInput.val() !== "") {
            monInput.css("border", "green solid");
            monInput.css("color", "green");
            maLegende.hide(1000);
            return true;
        } else if (monInput.val() === "") {
            monInput.css("border", "red solid");
            monInput.css("color", "red");
            messageError = "Champ vide";
            maLegende.text(messageError).show(500);
            return false;
        } else {
            monInput.css("border", "red solid");
            monInput.css("color", "red");
            maLegende.text(messageError).show(500);
            return false;
        }
    }

    //FIN JQ
});
