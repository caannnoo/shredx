import { Capacitor } from "@capacitor/core";

export const API_URL = Capacitor.isNativePlatform()
  ? "http://localhost:3000"
  : "http://localhost:3000";
