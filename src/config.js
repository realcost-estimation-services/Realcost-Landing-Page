function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set as a build-time environment variable.`);
  }
  return value;
}

export const APP_URL = requireEnv('REACT_APP_APP_URL');
export const LOGIN_URL = `${APP_URL}login`;
export const API_BASE_URL = requireEnv('REACT_APP_API_BASE_URL');
