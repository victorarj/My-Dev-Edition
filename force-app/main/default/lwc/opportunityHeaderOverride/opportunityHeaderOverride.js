// opportunityHeaderOverride.js
import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';
import OPPORTUNITY_NAME_FIELD from '@salesforce/schema/Opportunity.Name';

export default class OpportunityHeaderOverride extends NavigationMixin(LightningElement) {
    @api recordId;
    opportunityName;

    @wire(getRecord, { recordId: '$recordId', fields: [OPPORTUNITY_NAME_FIELD] })
    wiredOpportunity({ error, data }) {
        if (data) {
            this.opportunityName = getFieldValue(data, OPPORTUNITY_NAME_FIELD);
        } else if (error) {
            // Handle error
        }
    }

    connectedCallback() {
        // Incrementing function to check the opportunity name
        this.checkOpportunityName();
    }

    checkOpportunityName() {
        if (this.opportunityName) {
            // Do something with the opportunity name
            console.log('Opportunity Name:', this.opportunityName);
        }
    }

    createQuote() {
        // Add logic to create a quote related to the current opportunity
        // You can use Apex to create the quote record and handle the association

        // Redirect to the "quoteConfigurator" Lightning page
        this[NavigationMixin.Navigate]({
            type: 'standard__component',
            attributes: {
                componentName: 'c__MyLWCTab'
            }
        });
    }
}