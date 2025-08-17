'use client';

import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

// ---- 1. Define device type ----
export interface DeviceData {
  id: string;
  imei: string;
  assigned: string;
  sn: string;
  osVersion: string;
  beforeBattery: number;
  afterBattery: number;
  timeIn: string;
  timeOut: string;
  status: "Active" | "Testing" | "Failed" | "Completed";
  remarks: string;
  notes: string;
  model?: string;
}

// ---- 2. Define context type ----
interface GlobalFetchContextType {
  devices: DeviceData[];   // Always an array (empty if not loaded yet)
  loading: boolean;        // Useful for UI states
}

// ---- 3. Create context ----
const GlobalFetchContext = createContext<GlobalFetchContextType | undefined>(undefined);

// ---- 4. Provider ----
export const GlobalFetchProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [devices, setDevices] = useState<DeviceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "stresstest"));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<DeviceData, 'id'>)
        }));
        setDevices(data);
      } catch (error) {
        console.error("Error fetching devices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  return (
    <GlobalFetchContext.Provider value={{ devices, loading }}>
      {children}
    </GlobalFetchContext.Provider>
  );
};

// ---- 5. Hook for consuming ----
export const useGlobalFetch = () => {
  const context = useContext(GlobalFetchContext);
  if (!context) {
    throw new Error("useGlobalFetch must be used within a GlobalFetchProvider");
  }
  return context;
};
