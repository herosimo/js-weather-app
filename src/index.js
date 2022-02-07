import { initApp } from "./app";
import { Api } from "./Api";

const init = () => {
  const api = new Api();
  initApp(api);
};

init();
