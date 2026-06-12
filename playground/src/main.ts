import { createApp } from "vue";

import App from "./App.vue";
import { router } from "./routes";
import "vue3-select-component/styles";
import "./styles.css";

const app = createApp(App);

app.use(router);
app.mount("#app");
