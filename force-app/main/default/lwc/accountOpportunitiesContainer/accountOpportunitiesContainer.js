import { LightningElement, wire, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getOpportunities from '@salesforce/apex/OpportunityController.getOpportunities';
import updateOpportunityAmount from '@salesforce/apex/OpportunityController.updateOpportunityAmount';


export default class AccountOpportunitiesContainer extends LightningElement {
    @api recordId;
    @track contacts = [];
    @track opportunities = [];
    @track showSpinner = false;
    parentData;

    connectedCallback() {
        this.handleShowSpinner();
        this.fetchDataFromServer();
    }

    handleSave(event) {
        this.parentData = event.detail;
        this.handleShowSpinner();

        updateOpportunityAmount({ opportunity : this.parentData })
            .then(result => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: result,
                        variant: 'success'
                    })
                );
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
            .finally(() => {
                this.handleHideSpinner();
            });
    }

    fetchDataFromServer() {
        getOpportunities({ accountId: this.recordId })
            .then(result => {
                console.log('result: ' + JSON.stringify(result));
                this.opportunities = result;
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
            .finally(() => {
                this.handleHideSpinner(); 
            });
    }

    handleShowSpinner() {
        this.showSpinner = true;
    }

    handleHideSpinner() {
        this.showSpinner = false;
    }
}