// Import des modules nécessaires
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc, collection, query, where, getDocs, setDoc } from 'firebase/firestore';
import { Html5QrcodeScanner } from "html5-qrcode";


// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAd4-LlGsIDg3MrGNiQwGwH9ZuYe-rqpoU",
    authDomain: "charlyticket-12c27.firebaseapp.com",
    projectId: "charlyticket-12c27",
    storageBucket: "charlyticket-12c27.appspot.com",
    messagingSenderId: "539395668161",
    appId: "1:539395668161:web:0d9137ea5f3d8e10acbc40",
    measurementId: "G-942R2Y5F7G"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fonction appelée lorsque le scanner de QR Code est chargé
window.onload = function() {
    if (window.location.pathname.endsWith('scanner.html')) {
        const scanner = new Html5QrcodeScanner("scanner-container", { fps: 10, qrbox: 250 });
        scanner.render(scanSuccessHandler, scanErrorHandler);
    }
};


// Gestionnaire de succès du scan
async function scanSuccessHandler(decodedText) {
    try {
        const ticketData = parseTicketData(decodedText);
        if (!ticketData) {
            showPopup("Format du QR Code invalide", "red");
            return;
        }
        const ticketRef = doc(db, "tickets", ticketData.ticketId);
        const docSnap = await getDoc(ticketRef);

        if (docSnap.exists() && validateTicket(docSnap.data())) {
            await updateDoc(ticketRef, { validated: true });
            await setDoc(doc(db, "tickets valider", ticketData.ticketId), docSnap.data());
            showPopup("Ticket validé avec succès", "green");
        } else {
            showPopup("Ticket déjà validé ou non valide", "red");
        }
    } catch (error) {
        console.error("Erreur lors de la gestion du ticket:", error);
        showPopup("Erreur de base de données", "red");
    }
}

// Fonction pour parser les données du QR Code
function parseTicketData(decodedText) {
    const pattern = /^(\w+)-(\w+)-(\d+)-(\w+)$/;
    const match = decodedText.match(pattern);
    if (match) {
        return {
            ticketId: match[1],
            firstName: match[2],
            phoneNumber: match[3],
            gender: match[4]
        };
    }
    return null;
}

// Fonction de validation du ticket
function validateTicket(ticketData) {
    return !ticketData.validated;
}

// Fonction pour afficher les popups
function showPopup(message, className) {
    const popupContainer = document.getElementById("popup-container");
    popupContainer.innerHTML = `<div class="popup ${className}"><div class="popup-content">${message}</div></div>`;
    const popup = popupContainer.firstChild;
    popup.classList.add("show");
    setTimeout(() => popup.classList.remove("show"), 5000);
}

// Gestionnaire d'erreur du scan
function scanErrorHandler(error) {
    if (error !== "QR code parse error, error = NotFoundException: No MultiFormat Readers were able to detect the code."
    ) {
        showPopup(`Erreur de scan: ${error}`, "red");
}}

// Fonction pour afficher les informations du ticket
function displayTicketInfo(ticket) {
    document.getElementById("ticketId").textContent = ticket.id;
    document.getElementById("firstName").textContent = ticket.firstName;
    document.getElementById("gender").textContent = ticket.gender;
    document.getElementById("phoneNumber").textContent = ticket.phoneNumber;
    document.getElementById("validation-popup").classList.add("show");
}

// Plus de fonctions pour gérer la validation des tickets...
window.scanSuccessHandler = scanSuccessHandler;
window.scanErrorHandler = scanErrorHandler;
window.displayTicketInfo = displayTicketInfo;
window.showPopup = showPopup;
window.validateTicket = validateTicket;
window.parseTicketData = parseTicketData;
