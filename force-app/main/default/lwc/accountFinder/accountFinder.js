import { LightningElement, wire } from 'lwc';
import queryAccountsByRevenue from '@salesforce/apex/AccountListControllerLwc.queryAccountsByRevenue';
export default class AccountSearch extends LightningElement {
    annualRevenue = null;

    @wire(queryAccountsByRevenue, { annualRevenue: '$annualRevenue' })
    accounts;

    handleChange(event) {
        this.annualRevenue = event.detail.value;
    }
    reset() {
        this.annualRevenue = null;
    }
}