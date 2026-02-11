import { Controller } from '@hotwired/stimulus';
import _ from "lodash";

export default class extends Controller {
    deleteSelectedBtn;
    idsToDelete = [];
    connect() {

        this.deleteSelectedBtn = document.querySelector('#deleteSelected');
        this.deleteSelectedBtn.classList.add("disabled");
        this.deleteSelectedBtn.addEventListener('click', () => {this.onDeleteSelected()});

        document.querySelectorAll('.delete-checkbox').forEach(photoCollection => {
            photoCollection.addEventListener('click', () => {this.onSelected(photoCollection)});
        });

        document.querySelectorAll('.pagination-option').forEach(option => {
            option.addEventListener('click', () => this.onOptionSelectLimit(parseInt(option.dataset.limit)));
        })
    }

    onOptionSelectLimit(limit){

        document.querySelectorAll('.pagination-option').forEach(option => {
            if(parseInt(option.dataset.limit) === limit){
                option.classList.add("disabled");
            } else {
                option.classList.remove("disabled");
            }
        })
    }

    onSelected(photoCollection){
        var photoCollectionId = parseInt(photoCollection.dataset.photocollectionid);
        var photoCollectionIndex = _.indexOf(this.idsToDelete, photoCollectionId);

        if (photoCollectionIndex === -1) {
            this.idsToDelete.push(photoCollectionId);
        } else {
            this.idsToDelete.splice(photoCollectionIndex, 1);
        }

        if(this.idsToDelete.length === 0){
            this.deleteSelectedBtn.classList.add("disabled");
        } else {
            this.deleteSelectedBtn.classList.remove("disabled");
        }
    }

    async onDeleteSelected(){
        if(this.idsToDelete.length === 0) {
            return;
        }

        if(confirm("Are you sure you want to delete these collections?") == true){
            try {
                const response = await fetch("http://127.0.0.1:8000/admin/gallery/deleteSelected", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({idsToDelete: this.idsToDelete})
                })
            
                if (!response.ok) {
                    throw new Error(`Error : ${response.statusText}`);
                } else {
                    var msgDiv = document.createElement('div');
                    msgDiv.innerHTML = `
                        <div class="alert alert-success d-flex align-items-center alert-dismissible fade show" role="alert">
                            Collections Successfully Deleted
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                    `;
                    document.querySelector('#title').before(msgDiv);
                }

            } catch (error) {
                console.error(`${error.message}`);
            }
        }
    }
}