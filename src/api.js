import { Capacitor } from "@capacitor/core";

export const API_URL = Capacitor.isNativePlatform()
  ? "http://10.0.2.2:3000"
  : "http://localhost:3000";
