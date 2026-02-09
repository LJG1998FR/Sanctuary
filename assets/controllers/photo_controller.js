import { Controller } from '@hotwired/stimulus';
import _ from "lodash";

export default class extends Controller {
    selectedCards = [];
    cards;
    positionBtns = [];
    updatePhotoInputs = [];
    deleteSelectedPhotosBtn;
    connect() {
        var cards = this.element.querySelectorAll('.card');
        this.cards = this.element.querySelectorAll('.card');
        this.positionBtns = this.element.querySelectorAll('.new-position');
        this.updatePhotoInputs = this.element.querySelectorAll('.update-photo-input');
        this.deleteSelectedPhotosBtn = document.querySelector('#deleteSelected');

        //set event listeners
        cards.forEach(card => {
            card.addEventListener('click', () => this.onSelected(card));
        });
        this.positionBtns.forEach(btn => {
            btn.addEventListener('click', () => this.updatePositions(btn));
        });
        this.updatePhotoInputs.forEach((input) => {
            input.addEventListener('change', () => this.onUpdatePhotoSubmit(input));
        });

        this.deleteSelectedPhotosBtn.addEventListener('click', () => this.onDeleteMany());
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
            this.deleteSelectedPhotosBtn.classList.add("disabled");
        } else {
            this.deleteSelectedPhotosBtn.classList.remove("disabled");
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

    async onUpdatePhotoSubmit(input){

        //create valid formData
        var formData = new FormData();
        formData.append('photos', input.files[0]);
        try {
	        spinner?.classList.replace('d-none', 'd-flex');
            const response = await fetch("http://127.0.0.1:8000/admin/photos/"+input.dataset.id+"/edit", {
                method: "POST",
                body: formData
            })
            .finally((resp) => {
	            spinner.classList.replace('d-flex', 'd-none');
            });
        
            if (!response.ok) {
                throw new Error(`Error : ${response.statusText}`);
            } else {
                var res = response.json()
                .then((output) => {
                    var photoToUpdate = this.element.querySelector('#photo_'+input.dataset.id);
                    photoToUpdate.src = "/uploads/photos/"+output.data.fullpath;
                    photoToUpdate.alt = output.data.fullpath;
                });

                var msgDiv = document.createElement('div');
                msgDiv.innerHTML = `
                    <div class="alert alert-success d-flex align-items-center alert-dismissible fade show" role="alert">
                        Photo Successfully Updated
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `;
                document.querySelector('#header').before(msgDiv);
            }

        } catch (error) {
            console.error(`${error.message}`);
        }
    }

    async onDeleteMany(){
        if(this.selectedCards.length === 0) {
            return;
        }
        //create valid formData
        var idsToDelete = this.selectedCards.map((card) => {return parseInt(card.querySelector('.rankInput').dataset.photoid); })
        try {
            const response = await fetch("http://127.0.0.1:8000/admin/photos/deleteSelected", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({idsToDelete})
            })
           .then(() => {
                var msgDiv = document.createElement('div');
                msgDiv.innerHTML = `
                    <div class="alert alert-success d-flex align-items-center alert-dismissible fade show" role="alert">
                        Photos Successfully Deleted
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `;
                document.querySelector('#header').before(msgDiv);
           })
           .catch(() => {
                throw new Error(`Error : ${response.statusText}`);
           })

        } catch (error) {
            console.error(`${error.message}`);
        }
    }

    async updatePositions(btn){
        btn.before(...this.selectedCards);
        var ids = [];
        this.element.querySelectorAll('.card').forEach(card => {
            ids.push(parseInt(card.querySelector('.rankInput').dataset.photoid));
        });

        try {

            const response = await fetch("http://127.0.0.1:8000/admin/gallery/update-ranks/"+this.element.dataset.photocollectionid, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ids })
            })

            .then(() => {
                var msgDiv = document.createElement('div');
                msgDiv.innerHTML = `
                    <div class="alert alert-success d-flex align-items-center alert-dismissible fade show" role="alert">
                        Photo Ranks Successfully Updated
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `;
                document.querySelector('#header').before(msgDiv);

                
                this.selectedCards = [];
                this.deleteSelectedPhotosBtn.classList.add("disabled");
            })

            .catch(() => {
                throw new Error(`Error : ${response.statusText}`);
            })

        } catch (error) {
            console.error(`${error.message}`);
        }
    }
}