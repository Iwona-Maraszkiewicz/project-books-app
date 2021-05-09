{
  'use strict';

  class BooksList {
    constructor(){
      const thisBooksList = this;
      thisBooksList.initData();
      thisBooksList.getElements();
      thisBooksList.render();
      thisBooksList.initActions();
    }

    initData() {
      const thisBooksList = this;
      thisBooksList.data = dataSource.books;
      thisBooksList.favoriteBooks = [];
      thisBooksList.filters = [];
      thisBooksList.select = {
        templateOf: {
          books: '#template-book',
        },
        all: {
          booksList: '.books-list',
          filters: '.filters',
        },
        book: {
          image: '.book__image',
        },
        add: {
          favorite: 'favorite',
          hidden: 'hidden',
        }
      };
      thisBooksList.templates = {
        books: Handlebars.compile(document.querySelector(thisBooksList.select.templateOf.books).innerHTML),
      };
    }

    getElements() {
      const thisBooksList = this;
      thisBooksList.booksList = document.querySelector(thisBooksList.select.all.booksList);
      thisBooksList.formFilters = document.querySelector(thisBooksList.select.all.filters);
    }

    render(){
      const thisBooksList = this;
      let generatedHTML= '';
      let htmlDom = '';
      for(let book of thisBooksList.data){
        book.ratingBgc = thisBooksList.determineRatingBgc(book.rating);
        book.ratingWidth = book.rating * 10;
        generatedHTML = thisBooksList.templates.books(book);
        htmlDom = utils.createDOMFromHTML(generatedHTML);
        thisBooksList.booksList.appendChild(htmlDom);
      }
    }

    initActions() {
      const thisBooksList = this;
      thisBooksList.booksList.addEventListener('dblclick', function(event){
        event.preventDefault();
        const bookImage = event.target.offsetParent;
        if(bookImage.classList.contains('book__image')){
          bookImage.classList.toggle(thisBooksList.select.add.favorite);
          const id = bookImage.getAttribute('data-id');
          const favoriteBooksIndex = thisBooksList.favoriteBooks.indexOf(id);
          if(!(favoriteBooksIndex == -1)){
            thisBooksList.favoriteBooks.splice(favoriteBooksIndex,1);
          } else {
            thisBooksList.favoriteBooks.push(id);
          }
        }
      });
      thisBooksList.formFilters.addEventListener('click', function(event){
        if(event.target.tagName == 'INPUT' && event.target.getAttribute('type') == 'checkbox' && event.target.getAttribute('name') == 'filter'){
          if(event.target.checked){
            thisBooksList.filters.push(event.target.getAttribute('value'));
          } else {
            const filtersIndex = thisBooksList.filters.indexOf(event.target.getAttribute('value'));
            thisBooksList.filters.splice(filtersIndex,1);
          }
          thisBooksList.filterBooks();
        }
      });
    }

    filterBooks() {
      const thisBooksList = this;
      for(let book of thisBooksList.data){
        let shouldBeHidden = false;
        for(let filter of thisBooksList.filters){
          if((filter == 'adults' && book.details.adults) || (filter == 'nonFiction' && book.details.nonFiction)){
            shouldBeHidden = true;
            break;
          }
        }
        const bookImage = document.querySelector('.book__image[data-id="' + book.id + '"]');
        if(shouldBeHidden){
          bookImage.classList.add(thisBooksList.select.add.hidden);
        }
        else {
          bookImage.classList.remove(thisBooksList.select.add.hidden);
        }
      }
    }

    determineRatingBgc(rating) {
      let background = '';
      if(rating <= 6){
        background = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
      } else if(rating >6 && rating <=8){
        background = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
      }
      else if(rating >8 && rating <=9){
        background = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
      }
      else if(rating >9){
        background = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
      }
      return background;
    }

  }

  const app = new BooksList();
}
