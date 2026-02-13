import { Controller } from '@hotwired/stimulus';
import _ from "lodash";

export default class extends Controller {
    connect() {

        document.querySelectorAll('.tag-checkbox').forEach(tag => {
            tag.addEventListener('click', () => {this.onSelected(tag)});
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

    async onSelected(tag){
        var videoid = parseInt(tag.dataset.videoid);
        var tagid = parseInt(this.element.dataset.tagid);

        try {
            spinner?.classList.replace('d-none', 'd-flex');
            const response = await fetch("http://127.0.0.1:8000/admin/tags/update-video-tag/"+tagid+"/"+videoid, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .finally((resp) => {
	            spinner.classList.replace('d-flex', 'd-none');
            });
        
            if (!response.ok) {
                throw new Error(`Error : ${response.statusText}`);
            } else {
                var msgDiv = document.createElement('div');
                msgDiv.innerHTML = `
                    <div class="alert alert-success d-flex align-items-center alert-dismissible fade show" role="alert">
                        Tag Update Successful
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `;
                document.querySelector('#header').before(msgDiv);
            }

        } catch (error) {
            console.error(`${error.message}`);
        }
    }
}