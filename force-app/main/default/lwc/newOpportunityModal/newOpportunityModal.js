import { LightningElement, api } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class NewOpportunityModal extends LightningElement {
    @api objectApiName = 'Opportunity';
    opportunityName = '';
    stage = '';

    open() {
        this.dispatchEvent(new CustomEvent('openmodal'));
    }

    closeModal() {
        this.dispatchEvent(new CustomEvent('closemodal'));
    }

    createOpportunity() {
        const fields = {
            'Name': this.opportunityName,
            'StageName': this.stage,
        };

        const recordInput = { apiName: this.objectApiName, fields };

        createRecord(recordInput)
            .then(result => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'New Opportunity created',
                        variant: 'success'
                    })
                );
                this.closeModal();
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating Opportunity',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }
}