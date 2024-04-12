import { ObjectId } from 'bson';

function objectIdWithTimestamp(inputTimestamp) {
  // Utiliser une variable locale pour éviter la modification du paramètre directement
  let timestamp = inputTimestamp;

  // Si le timestamp est fourni sous forme de chaîne, le convertir en objet Date
  if (typeof timestamp === 'string') {
    timestamp = new Date(timestamp);
  }

  // Si la conversion ci-dessus échoue ou si le paramètre n'est pas une instance de Date,
  // créer un nouvel objet Date avec le timestamp actuel
  if (!(timestamp instanceof Date)) {
    timestamp = new Date();
  }

  // Convertir l'objet Date en secondes hexadécimales depuis l'époque Unix.
  // getTime() retourne le temps en millisecondes, donc on le divise par 1000 pour obtenir les secondes.
  const hexSeconds = Math.floor(timestamp.getTime() / 1000).toString(16);

  // Créer un ObjectId MongoDB avec le timestamp en hexadécimal.
  // L'ObjectId est un identifiant unique de 12 octets, ici on préfixe les secondes en hexadécimal
  // avec suffisamment de zéros pour remplir les 12 octets requis (8 caractères pour les secondes,
  // suivis de 16 zéros pour les autres composantes, tronqués à 24 caractères au total).
  const constructedObjectId = new ObjectId(`${hexSeconds}0000000000000000`);

  // Retourner l'ObjectId généré
  return constructedObjectId;
}

export default objectIdWithTimestamp;
