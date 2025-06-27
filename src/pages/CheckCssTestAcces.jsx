import { collection, getDocs, query, where } from "firebase/firestore";
import { dbInstance } from "../firebase";

export const checkCssTestAccess = async (user) => {
  if (!user) return false;
  const qSnap = await getDocs(
    query(collection(dbInstance, "cssTestResults"), where("user", "==", user))
  );
  return !qSnap.empty;
};
