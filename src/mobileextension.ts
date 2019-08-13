import { Executor } from "selenium-webdriver/lib/command";

export const MobileJSONWireCommand = {
  GET_NETWORK_CONDITION: 'getNetworkConnection',
  SET_NETWORK_CONDITION: 'setNetworkConnection',
};

export enum NetworkConnectionType {
  AirplaneMode = 1,
  AllNetworkOn = 6,
  DataOnly = 4,
  WifiOnly = 2,
  None = 0
}

export type NetworkConnectionParam = {
  type: NetworkConnectionType
}

export function configureMobileJSONWireExtension(executor: Executor) {
  executor.defineCommand(
    MobileJSONWireCommand.GET_NETWORK_CONDITION,
    'GET',
    '/session/:sessionId/network_connection');

  executor.defineCommand(
    MobileJSONWireCommand.SET_NETWORK_CONDITION,
    'POST',
    '/session/:sessionId/network_connection');
}
