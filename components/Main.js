import html from "html-literal";

import * as views from "./views";
console.log(views);
export default (st) => `
${views[st.page](st)}
`;
