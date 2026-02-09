import { Controller } from '@hotwired/stimulus';
import _ from "lodash";

export default class extends Controller {
    deleteSelectedBtn;
    idsToDelete = [];
    connect() {
        /*this.element.querySelector('#btnradio1').addEventListener('change', () => {
            this.setLimit('2');
        });
        this.element.querySelector('#btnradio2').addEventListener('change', () => {
            this.setLimit('10');
        });
        this.element.querySelector('#btnradio3').addEventListener('change', () => {
            this.setLimit('20');
        });*/

        this.deleteSelectedBtn = document.querySelector('#deleteSelected');
        this.deleteSelectedBtn.classList.add("disabled");
        this.deleteSelectedBtn.addEventListener('click', () => {this.onDeleteSelected()});

        document.querySelectorAll('.delete-checkbox').forEach(video => {
            video.addEventListener('click', () => {this.onSelected(video)});
        });
    }

    setLimit(limit){
        window.location.href = "/admin/videos?page=1&limit="+limit;
    }

    onSelected(video){
        var videoId = parseInt(video.dataset.videoid);
        var videoIndex = _.indexOf(this.idsToDelete, videoId);

        if (videoIndex === -1) {
            this.idsToDelete.push(videoId);
        } else {
            this.idsToDelete.splice(videoIndex, 1);
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

        if(confirm("Are you sure you want to delete these videos?") == true){
            try {
                spinner?.classList.replace('d-none', 'd-flex');
                const response = await fetch("http://127.0.0.1:8000/admin/videos/deleteSelected", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({idsToDelete: this.idsToDelete})
                })
                .finally((resp) => {
                    spinner.classList.replace('d-flex', 'd-none');
                })
            
                if (!response.ok) {
                    throw new Error(`Error : ${response.statusText}`);
                } else {
                    var msgDiv = document.createElement('div');
                    msgDiv.innerHTML = `
                        <div class="alert alert-success d-flex align-items-center alert-dismissible fade show" role="alert">
                            Videos Successfully Deleted
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