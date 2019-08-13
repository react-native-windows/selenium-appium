import { Executor } from "selenium-webdriver/lib/command";

export const MobileExtensionCommand = {
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

export function configureExecutor(executor: Executor) {
  executor.defineCommand(
    MobileExtensionCommand.GET_NETWORK_CONDITION,
    'GET',
    '/session/:sessionid/network_connection');

  executor.defineCommand(
    MobileExtensionCommand.SET_NETWORK_CONDITION,
    'POST',
    '/session/:sessionid/network_connection');
}
