import { Controller } from '@hotwired/stimulus';
import _ from "lodash";

export default class extends Controller {
    connect() {
        document.querySelector('#update-ranks-btn').addEventListener('click', async () => {
            var rankInputs = this.element.querySelectorAll('.rankInput');
            var data = [];
            var main = document.getElementById('main-container');
            var cards = this.element.querySelectorAll('.card');
            rankInputs.forEach(rank => {
                if(rank.dataset.photorank != rank.value){
                    data.push({id: parseInt(rank.dataset.photoid), rank: parseInt(rank.value)});
                }
            });
            if(data.length == 0){
                console.log("No ranks to update");
                return;
            }
            try {
                const response = await fetch("http://127.0.0.1:8000/admin/gallery/update-ranks", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ data })
                });
            
                if (!response.ok) {
                    throw new Error(`Error : ${response.statusText}`);
                } else {
                    var newcards = _.sortBy(cards, card => {return parseInt(card.querySelector('.rankInput').value)});
                    _.forEach(newcards, card => {
                        var rankInput = card.querySelector('.rankInput');
                        rankInput.dataset.photorank = rankInput.value;
                    });
                    main.innerHTML = "";
                    main.append(...newcards);

                    console.log("ranks updated successfully");

                    var msgDiv = document.createElement('div');
                    msgDiv.innerHTML = `
                        <div class="alert alert-success d-flex align-items-center alert-dismissible fade show" role="alert">
                            Photo Ranks Successfully Updated
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                    `;
                    document.querySelector('#header').before(msgDiv);
                }

            } catch (error) {
                console.error(`${error.message}`);
            }
        });
    }
}