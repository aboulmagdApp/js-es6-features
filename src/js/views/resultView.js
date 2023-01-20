import View from './view.js';
import previewView from './PreviewView.js';

class ResultsView extends View {
  _parentElemnt = document.querySelector('.results');
  _errorMessage = 'no recipes found for your query! please try again 😀';
  _message = '';

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();
