import { Header, Nav, Main, Footer } from "./components";
import * as state from "./store";

import axios from "axios";

import Navigo from "navigo";
import capitalize from "lodash";

const router = new Navigo(window.location.origin);

router.hooks({
  before: (done, params) => {
    // Because not all routes pass params we have to guard against is being undefined
    const page =
      params && Object.prototype.hasOwnProperty.call(params, "page")
        ? capitalize(params.page)
        : "Home";
    fetchDataByView(state[page]);
    done();
  },
});

router
  .on({
    "/": () => {
      render(state.Home);
    },
    ":page": (params) => {
      console.log(params);
      console.log(state[capitalize(params.page)]);
      render(state[capitalize(params.page)]);
    },
  })
  .resolve();

// import {
//   AddPicturesToGallery,
//   GalleryPictures,
//   PrintFormOnSubmit,
// } from "./lib";

function render(st = state.Home) {
  console.log(st);
  document.querySelector("#root").innerHTML = `
  ${Header(st)}
  ${Nav(state.Links)}
  ${Main(st)}
  ${Footer()}
`;
  router.updatePageLinks();
  addNavEventListeners();
  addPicOnFormSubmit(st);
}

// axios
//   .get("https://jsonplaceholder.typicode.com/posts")
//   // handle the response from the API
//   .then((response) => {
//     // for each post in the response Array,
//     response.data.forEach((post) => {
//       // add it to state.Blog.posts
//       state.Blog.posts.push(post);
//     });
//     const params = router.lastRouteResolved().params;
//     if (params) {
//       render(state[params.page]);
//     }
//   });

//axios.get(/* your API endpoint from above */).then((response) => {
//state.Home.weather.city = response.name;
//state.Home.weather.temp = response.main.temp;
//state.Home.weather.description = response.weather.main;
//});
//render(state.Home);

// populating gallery with pictures
//const gallerySection = document.querySelector("#gallery");
// using modules to populate gallery with pictures
//AddPicturesToGallery(GalleryPictures, gallerySection);

// handle form submission with PrintFormOnSubmit module
// const form = document.querySelector("form");
// PrintFormOnSubmit(form);

function addNavEventListeners() {
  // add event listeners to Nav items for navigation
  document.querySelectorAll("nav a").forEach((navLink) =>
    navLink.addEventListener("click", (event) => {
      event.preventDefault();
      console.log(event.target.title);
      console.log(event);
      console.log(event.target);
      render(state[event.target.title]);
    })
  );
  // add menu toggle to bars icon in nav bar
  document
    .querySelector(".fa-bars")
    .addEventListener("click", () =>
      document.querySelector("nav > ul").classList.toggle("hidden--mobile")
    );
}
function addPicOnFormSubmit(st) {
  if (st.page === "Form") {
    document.querySelector("form").addEventListener("submit", (event) => {
      event.preventDefault();
      // convert HTML elements to Array
      let inputList = Array.from(event.target.elements);
      // remove submit button from list
      inputList.pop();
      // construct new picture object
      let newPic = inputList.reduce((pictureObject, input) => {
        pictureObject[input.name] = input.value;
        return pictureObject;
      }, {});
      // add new picture to state.Gallery.pictures
      state.Gallery.pictures.push(newPic);
      render(state.Gallery);
    });
  }
  if (st.page === "Order") {
    document.querySelector("form").addEventListener("submit", (event) => {
      event.preventDefault();
      console.log(event);
      const inputList = event.target.elements;
      const toppings = [];
      for (let input of inputList.toppings) {
        if (input.checked) {
          toppings.push(input.value);
        }
      }
      const requestData = {
        crust: inputList.crust.value,
        cheese: inputList.cheese.value,
        sauce: inputList.sauce.value,
        toppings: toppings,
      };
      axios
        .post(`http://localhost:4040/pizzas`, requestData)
        .then((response) => {
          state.Pizza.pizzas.push(response.data);
          router.navigate("/Pizza");
        })
        .catch((error) => {
          console.log("It puked", error);
        });
    });
  }
}

function fetchDataByView(st = state.Home) {
  switch (st.page) {
    case "Pizza":
      axios
        .get(`http://localhost:4040/pizzas`)
        .then((response) => {
          state[st.page].pizzas = response.data;
          render(st);
        })
        .catch((error) => {
          console.log("It puked", error);
        });
      break;
  }
}
