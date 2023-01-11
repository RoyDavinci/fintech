import serverConfig from "./server";
import serviceConfig from "./service";

const config = { ...serviceConfig, ...serverConfig };

export default config;
