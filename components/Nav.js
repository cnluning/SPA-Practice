export default (links) => `
<nav>
  <i class="fas fa-bars"></i>
  <ul class="hidden--mobile nav-links">
  ${links
    .map(
      (link) =>
        `<li><a href="/${link.title !== "Home" ? link.title : ""}" title="${
          link.title
        }" data-navigo>${link.text}</a></li>`
    )
    .join("")}
  </ul>
</nav>
`;

// import html from "html-literal";
// export default (links) => html`
//   <nav>
//     <i class="fas fa-bars"></i>
//     <ul class="hidden--mobile nav-links">
//       ${links.reduce(
//         (html, link) =>
//           html +
//           `<li><a href="#" title="${link.title}" data-navigo>${link.text}</a></li>`,
//         ``
//       )}
//     </ul>
//   </nav>
// `;

//* <li><a href="#bio">Bio</a></li>
//*<li><a href="#gallery">Gallery</a></li>
//*<li><a href="#register">Register</a></li>
// ${st.reduce((template, link) => {
//   template +
//     `<li><a href="/${link.title !== "Home" ? link.title : ""}
//   "title= "${link.title}" >${link.text}</a></li>`,
//     ``;
// })}
