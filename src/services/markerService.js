import { collection, doc, getDoc, serverTimestamp, Timestamp, writeBatch, getDocs } from "firebase/firestore";
import { database } from "./firebaseConfig.js";

// Keep this in sync with the cooldown enforced in firestore.rules — this
// value only drives client-side UX (disabling the button, showing a
// countdown); the rule is what actually stops spammed/false reports, since
// a client could otherwise skip this file entirely and call Firestore directly.
export const REPORT_COOLDOWN_SECONDS = 60;

// Best-effort, client-side only: lets the UI show "wait Ns" without a round
// trip failure. The rateLimits doc itself is only readable by its own owner,
// so this can't be used to probe other users' report activity.
export const getReportCooldownRemaining = async (uid) => {
  if (!uid) return 0;

  try {
    const snapshot = await getDoc(doc(database, "rateLimits", uid));
    if (!snapshot.exists()) return 0;

    const lastReportAt = snapshot.data().lastReportAt;
    if (!(lastReportAt instanceof Timestamp)) return 0;

    const elapsedSeconds = (Date.now() - lastReportAt.toMillis()) / 1000;
    return Math.max(0, Math.ceil(REPORT_COOLDOWN_SECONDS - elapsedSeconds));
  } catch (error) {
    console.error("Error checking report cooldown: ", error);
    return 0;
  }
};

export const saveMarker = async (markerData, uid) => {
  try {
    const docRef = doc(collection(database, "reports"));
    const cloudId = docRef.id;

    const finalMarkerData = {
      ...markerData,
      key: cloudId
    }

    // Batched so the report and the rate-limit timestamp are written
    // atomically — see the /rateLimits and /reports rules in firestore.rules.
    const batch = writeBatch(database);
    batch.set(docRef, finalMarkerData);
    batch.set(doc(database, "rateLimits", uid), { lastReportAt: serverTimestamp() });
    await batch.commit();

    return docRef.id;
  } catch (error) {
    if (error.code === "permission-denied") {
      throw new Error(`You're reporting too fast — please wait a bit before submitting another report.`, { cause: error });
    }
    console.error("Error adding marker to backend: ", error);
    throw error;
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
    color: draftMarkerData.color,
    title: draftMarkerData.title || "Untitled Marker",
    description: draftMarkerData.description
  }
}