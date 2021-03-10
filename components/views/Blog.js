import html from "html-literal";

export default (st) => html` <section id="blog">
  ${st.posts.map((post) => {}).join()}
</section>`;
