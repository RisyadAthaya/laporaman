import { collection, doc, setDoc, getDocs } from "firebase/firestore";
import { database } from "./firebaseConfig.js";

export const saveMarker = async (markerData) => {
  try {
    const docRef = doc(collection(database, "reports"));
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
    const querySnapshot = await getDocs(collection(database, "reports"));

    // Transform Firebase's raw snapshot into an array
    return querySnapshot.docs.map(doc => ({
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching pinpoints from backend: ", error);
    return [];
  }
};

export const createNewMarker = (draftMarkerLocation, draftMarkerData) => {
  return {
    longitude: draftMarkerLocation.longitude,
    latitude: draftMarkerLocation.latitude,
    // TODO: Use geocoder to get locationname
    locationName: "-",
    color: draftMarkerData.color,
    time: new Date().toISOString().replace('T', ' ').substring(0, 16),
    title: draftMarkerData.title || "Untitled Marker",
    description: draftMarkerData.description,
    category: "",
    dangerLevel: "",
    status: "Menunggu",
    upvotes: 0,
    comments: [
    ]
  }
}