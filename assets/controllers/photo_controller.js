import { Controller } from '@hotwired/stimulus';
import _ from "lodash";

export default class extends Controller {
    selectedCards = [];
    cards;
    positionBtns = [];
    connect() {
        var cards = this.element.querySelectorAll('.card');
        this.cards = this.element.querySelectorAll('.card');
        this.positionBtns = this.element.querySelectorAll('.new-position');

        cards.forEach(card => {
            card.addEventListener('click', () => this.onSelected(card));
        });

        this.positionBtns.forEach(btn => {
            btn.addEventListener('click', () => this.changePhotoPositions(btn));
        });
    }

    onSelected(card){

        var photoIndex = _.indexOf(this.selectedCards, card);
        if(this.selectedCards.length === 0){
            this.element.querySelectorAll('.new-position').forEach(btn => {
                btn.classList.remove('hidden');
            });
        }

        if (photoIndex === -1) {
            this.selectedCards.push(card);
            card.classList.add('selected');
        } else {
            this.selectedCards.splice(photoIndex, 1);
            card.classList.remove('selected');
        }

        //display position btns except those around the selected cards
        if(this.selectedCards.length === 0){
            this.element.querySelectorAll('.new-position').forEach(btn => {
                btn.classList.add('hidden');
            });
        } else {
            var cardIndex = _.indexOf(this.cards, card);
            var isPreviousSelected = this.selectedCards.includes(this.cards[cardIndex-1]);
            var isNextSelected = this.selectedCards.includes(this.cards[cardIndex+1]);
            var isCurrentSelected = this.selectedCards.includes(card);
            this.displayPositionBtns(card, isCurrentSelected, isPreviousSelected, isNextSelected);
        }
    }

    displayPositionBtns(card, isCurrentSelected, isPreviousSelected, isNextSelected){
        if (isCurrentSelected === true) {
            if(card.nextElementSibling?.classList.contains('hidden') == false && !isNextSelected){card.nextElementSibling.classList.add('hidden');}
            if(card.previousElementSibling?.classList.contains('hidden') == false && !isPreviousSelected){card.previousElementSibling.classList.add('hidden');}
        } else {
            if(card.nextElementSibling?.classList.contains('hidden') == true && !isNextSelected){card.nextElementSibling?.classList.remove('hidden');}
            if(card.previousElementSibling?.classList.contains('hidden') == true && !isPreviousSelected){card.previousElementSibling?.classList.remove('hidden');}
        }
    }

    changePhotoPositions(btn){
        btn.before(...this.selectedCards);
        this.cards = this.setCards();
        this.setNewPositions(this.cards, this.element.dataset.photocollectionid);
        this.selectedCards = [];
    }

    //set new ranks
    async setNewPositions(cards, id){
        var ids = [];
        this.element.querySelectorAll('.card').forEach(card => {
            ids.push(parseInt(card.querySelector('.rankInput').dataset.photoid));
        });

        try {
	        spinner?.classList.replace('d-none', 'd-flex');
            const response = await fetch("http://127.0.0.1:8000/admin/gallery/update-ranks/"+id, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ids })
            })
            .finally((resp) => {
	            spinner.classList.replace('d-flex', 'd-none');
            })
        
            if (!response.ok) {
                throw new Error(`Error : ${response.statusText}`);
            } else {

                var main = document.getElementById('main-container');
                main.innerHTML = "";
                main.append(...cards);

                main.querySelectorAll('.new-position').forEach(btn => {
                    btn.addEventListener('click', () => this.changePhotoPositions(btn));
                })

                var msgDiv = document.createElement('div');
                msgDiv.innerHTML = `
                    <div class="alert alert-success d-flex align-items-center alert-dismissible fade show" role="alert">
                        Photo Ranks Successfully Updated
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `;
                document.querySelector('#header').before(msgDiv);

                this.resetProps();
            }

        } catch (error) {
            console.error(`${error.message}`);
        }
    }

    setCards(){
        //sort cards
        var firstPositionBtn = document.createElement('button');
        firstPositionBtn.classList = 'btn btn-dark new-position hidden';
        firstPositionBtn.innerHTML = `<i class="bi bi-plus-circle"></i>`;

        //add btns after every card
        var newcards = [];
        newcards.push(firstPositionBtn);
        _.forEach(this.element.querySelectorAll('.card'), (card, index) => {
            card.classList.remove('selected');
            card.querySelector('.rankInput').value = index+1;
            var newPositionBtn = document.createElement('button');
            newPositionBtn.classList = 'btn btn-dark new-position hidden';
            newPositionBtn.innerHTML = `<i class="bi bi-plus-circle"></i>`;
            newcards.push(card, newPositionBtn);
            return card;
        });
        return newcards;
    }

    resetProps(){
        this.cards = this.element.querySelectorAll('.card');
        this.positionBtns = this.element.querySelectorAll('.new-position');
    }
}