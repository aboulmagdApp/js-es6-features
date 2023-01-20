import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/BookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime'; //polyfill async await

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
const controlRecipe = async function () {
  try {
    console.log(recipeView);
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    //5ed6604591c37cdc054bc886
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);
    await model.loadRecipe(id);
    recipeView.render(model.state.recipe);
  } catch (error) {
    console.log(error);
    recipeView.renderError();
  }
};

const controlSearchResult = async function () {
  try {
    resultsView.renderSpinner();
    console.log(resultsView);
    const query = searchView.getQuery();
    if (!query) return;
    await model.loadSearchResult(query);
    console.log(model.state);
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
  } catch (error) {
    recipeView.renderError();
  }
};

const controlServing = function (numServings) {
  // update the recipe servings (in state)
  model.updateServings(numServings);

  // update the recipe view
  recipeView.update(model.state.recipe);
};

const controlPagination = function (goToPage) {
  // render new results
  resultsView.render(model.getSearchResultsPage(goToPage));
  // render new pagination buttons
  paginationView.render(model.state.search);
};

const controlAddBookmark = function () {
  // 1) Add/remove bookmark
  debugger;
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();
    // updload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    // render recipe
    recipeView.render(model.state.recipe);
    // render bookmark view
    bookmarksView.render(model.state.bookmarks);
    // change Url Id
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // success Message
    setTimeout(() => {
      addRecipeView.renderMessage();
    }, 1000);
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, 1000);
    // close popup form
  } catch (error) {
    /**
     * check if error
     */
    console.error('💁', error);
    addRecipeView.renderError(error.message);
  }
};

const onInit = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateRecipe(controlServing);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  console.log('welcome');
};

onInit();
