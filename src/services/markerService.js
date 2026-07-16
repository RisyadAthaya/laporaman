import { collection, doc, setDoc, getDocs } from "firebase/firestore";
import { database } from "./firebaseConfig.js";

export const saveMarker = async (markerData) => {
  try {
    const docRef = doc(collection(database, "markers"));
    const cloudId = docRef.id;

    const finalMarkerData = {
      ...markerData,
      key: cloudId
    }

    await setDoc(docRef, finalMarkerData);

    return docRef.id;
  } catch (error) {
    console.error("Error adding marker to backend: ", error);
  }
};

export const fetchAllMarkers = async () => {
  try {
    const querySnapshot = await getDocs(collection(database, "markers"));

    // Transform Firebase's raw snapshot into an array
    return querySnapshot.docs.map(doc => ({
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching pinpoints from backend: ", error);
    return [];
  }
};