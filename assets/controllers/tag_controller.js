import { Controller } from '@hotwired/stimulus';
import _ from "lodash";

export default class extends Controller {
    deleteSelectedBtn;
    searchForm;
    idsToDelete = [];
    handleOnSearch;
    handleOnSearchCancel;
    connect() {

        this.deleteSelectedBtn = document.querySelector('#deleteSelected');
        this.deleteSelectedBtn.classList.add("disabled");
        this.deleteSelectedBtn.addEventListener('click', () => {this.onDeleteSelected()});

        this.searchForm = document.querySelector('#searchform');
        this.handleOnSearch = this.onSearch.bind(this);
        this.handleOnSearchCancel = this.onSearchCancel.bind(this);
        this.searchForm.addEventListener('submit', this.handleOnSearch);
        this.searchForm.addEventListener('search', this.handleOnSearchCancel);

        document.querySelectorAll('.delete-checkbox').forEach(tag => {
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

    onSelected(tag){
        var tagId = parseInt(tag.dataset.tagid);
        var tagIndex = _.indexOf(this.idsToDelete, tagId);

        if (tagIndex === -1) {
            this.idsToDelete.push(tagId);
        } else {
            this.idsToDelete.splice(tagIndex, 1);
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

        if(confirm("Are you sure you want to delete " + this.idsToDelete.length + " tags?") == true){
            try {
                const response = await fetch("http://127.0.0.1:8000/admin/tags/deleteSelected", {
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
                            Tags Successfully Deleted
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

    async onSearch(event){
        event.preventDefault();
        var inputValue = this.searchForm.querySelector('#searchbar').value;

        if(inputValue.length > 0){
           try {
                spinner?.classList.replace('d-none', 'd-flex');
                var turboFrame = document.getElementById('tags_list');
                turboFrame.src = this.searchForm.dataset.turbosrc+inputValue;

                this.searchForm.removeEventListener('submit', this.handleOnSearch);
                this.searchForm.removeEventListener('search', this.handleOnSearchCancel);

            } catch (error) {
                console.error(`${error.message}`);
            }
        }
    }

    async onSearchCancel(event){

        var turboFrame = document.getElementById('tags_list');
        if(event.target.value == "" && turboFrame.src && turboFrame.src.endsWith("search=") == false){
            turboFrame.src = this.searchForm.dataset.turbosrc;

            this.searchForm.removeEventListener('submit', this.handleOnSearch);
            this.searchForm.removeEventListener('search', this.handleOnSearchCancel);
        }
    }
}