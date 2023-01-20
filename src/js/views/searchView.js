class SearchView {
  _parentElemnt = document.querySelector('.search');

  getQuery() {
    const query = this._parentElemnt.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentElemnt.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    this._parentElemnt.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
