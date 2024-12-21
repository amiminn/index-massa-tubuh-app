import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.ideal.app",
  appName: "ideal",
  webDir: "dist",
  plugins: {
    StatusBar: {
      style: "DARK", // Black text
      backgroundColor: "#FFFFFF", // White background
    },
  },
};

export default config;
