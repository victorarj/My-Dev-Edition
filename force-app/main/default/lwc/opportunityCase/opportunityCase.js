import { LightningElement, api, track } from 'lwc';
import getCases from '@salesforce/apex/OpportunityController.getCases';

const PAGE_SIZE = 3;

export default class OpportunityContacts extends LightningElement {
    @api oppId;
    @track displayedRecords = [];
    @track currentPage = 1;
    casesData = [];
    
    connectedCallback() {
        this.retrieveContacts();
        this.loadPage();
    }
    
    retrieveContacts() {
        getCases({ opportunityId: this.oppId })
            .then(result => {
                this.casesData = result;
                console.log('cases: ' + JSON.stringify(this.contacts));
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: error,
                        variant: 'error'
                    })
                );
            })
    }

    loadPage() {
        const start = (this.currentPage - 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE;
        this.displayedRecords = this.casesData.slice(start, end);
    }

    previousPage() {
        if (!this.isFirstPage) {
            this.currentPage -= 1;
            this.loadPage();
        }
    }

    nextPage() {
        if (!this.isLastPage) {
            this.currentPage += 1;
            this.loadPage();
        }
    }

    get isFirstPage() {
        return this.currentPage === 1;
    }

    get isLastPage() {
        return this.currentPage * PAGE_SIZE >= this.casesData.length;
    }
}