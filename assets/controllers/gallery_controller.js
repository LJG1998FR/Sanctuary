import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    connect() {
        this.element.querySelector('#btnradio1').addEventListener('change', () => {
            this.setLimit('5');
        });
        this.element.querySelector('#btnradio2').addEventListener('change', () => {
            this.setLimit('10');
        });
        this.element.querySelector('#btnradio3').addEventListener('change', () => {
            this.setLimit('20');
        });
    }

    setLimit(limit){
        window.location.href = "/admin/gallery?page=1&limit="+limit;
    }
}