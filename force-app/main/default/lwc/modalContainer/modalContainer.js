import { LightningElement, api, track, wire } from 'lwc';
import getOpportunityProducts from '@salesforce/apex/OpportunityController.getOpportunityProducts';

export default class ModalContainer extends LightningElement {
    @api oppId;
    @track productData;
    sortedBy;
    sortedDirection;

    columns = [
        { label: 'Name', fieldName: 'Name', type: 'text', sortable: true },
        { label: 'Quantity', fieldName: 'Quantity', type: 'number', sortable: true },
        { label: 'Unit Price', fieldName: 'UnitPrice', type: 'currency', sortable: true },
        { label: 'Total Price', fieldName: 'TotalPrice', type: 'currency', sortable: true }
    ];

    connectedCallback() {
        getOpportunityProducts({ opportunityId: this.oppId })
        .then(result => {
            console.log('result: ' + JSON.stringify(result));
            this.productData = result;
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

    handleSort(event) {
        this.sortedBy = event.detail.fieldName;
        this.sortedDirection = event.detail.sortDirection;
    }
    
    closeModal() {
        const closeModalEvent = new CustomEvent('closemodal');
        this.dispatchEvent(closeModalEvent);
    }
}