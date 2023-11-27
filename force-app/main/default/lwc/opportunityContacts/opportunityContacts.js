import { LightningElement, api } from 'lwc';
import getContacts from '@salesforce/apex/OpportunityController.getContacts';

export default class OpportunityContacts extends LightningElement {
    @api recordId;
    contacts = [];
    
    connectedCallback() {
        this.retrieveContacts();
        console.log(this.recordId);

    }

    retrieveContacts() {
        getContacts({ accountId: this.recordId })
            .then(result => {
                console.log('resul contacts: ' + JSON.stringify(result));
                this.contacts = result;
                console.log('contacts: ' + JSON.stringify(this.contacts));
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
}