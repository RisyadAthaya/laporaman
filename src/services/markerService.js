import { collection, doc, getDoc, increment, serverTimestamp, Timestamp, writeBatch, getDocs } from "firebase/firestore";
import { database } from "./firebaseConfig.js";

// Keep these in sync with the limits enforced in firestore.rules — these
// values only drive client-side UX (disabling the button, showing how many
// reports are left); the rules are what actually stop spammed/false reports,
// since a client could otherwise skip this file entirely and call Firestore
// directly.
export const DEFAULT_DAILY_REPORT_LIMIT = 5;
export const AUTHORITY_DAILY_REPORT_LIMIT = 20;

const isSameCalendarDay = (a, b) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

// There's no in-app way to become an authority yet — the role is set by
// hand in the Firestore console on /users/{uid}.
const getDailyReportLimit = async (uid) => {
  try {
    const snapshot = await getDoc(doc(database, "users", uid));
    return snapshot.exists() && snapshot.data().role === "authority"
      ? AUTHORITY_DAILY_REPORT_LIMIT
      : DEFAULT_DAILY_REPORT_LIMIT;
  } catch (error) {
    console.error("Error checking user role: ", error);
    return DEFAULT_DAILY_REPORT_LIMIT;
  }
};

// Best-effort, client-side only: lets the UI show "X reports left today"
// without a round trip failure. The rateLimits doc itself is only readable
// by its own owner, so this can't be used to probe other users' activity.
export const getReportsRemainingToday = async (uid) => {
  if (!uid) return 0;

  const limit = await getDailyReportLimit(uid);

  try {
    const snapshot = await getDoc(doc(database, "rateLimits", uid));
    if (!snapshot.exists()) return limit;

    const { lastReportAt, count } = snapshot.data();
    if (!(lastReportAt instanceof Timestamp) || !isSameCalendarDay(lastReportAt.toDate(), new Date())) {
      return limit;
    }

    return Math.max(0, limit - (count ?? 0));
  } catch (error) {
    console.error("Error checking remaining daily reports: ", error);
    return limit;
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

    const rateLimitRef = doc(database, "rateLimits", uid);
    const rateLimitSnapshot = await getDoc(rateLimitRef);
    const previousReportAt = rateLimitSnapshot.exists() ? rateLimitSnapshot.data().lastReportAt : null;
    const isNewDay = !(previousReportAt instanceof Timestamp) || !isSameCalendarDay(previousReportAt.toDate(), new Date());

    // Batched so the report and the rate-limit counter are written
    // atomically — see the /rateLimits and /reports rules in firestore.rules.
    const batch = writeBatch(database);
    batch.set(docRef, finalMarkerData);
    batch.set(rateLimitRef, {
      lastReportAt: serverTimestamp(),
      count: isNewDay ? 1 : increment(1)
    }, { merge: true });
    await batch.commit();

    return docRef.id;
  } catch (error) {
    if (error.code === "permission-denied") {
      throw new Error(`You've reached today's report limit — please try again tomorrow.`, { cause: error });
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
    locationName: "Indonesia",
    color: draftMarkerData.color,
    time: new Date().toISOString().replace('T', ' ').substring(0, 16),
    title: draftMarkerData.title || "Untitled Marker",
    description: draftMarkerData.description,
    category: draftMarkerData.category,
    dangerLevel: draftMarkerData.dangerLevel,
    status: "Menunggu",
    upvotes: 0,
    comments: [
    ]
  }
}