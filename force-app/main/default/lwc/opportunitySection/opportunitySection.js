import { LightningElement, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

const PAGE_SIZE = 2;

export default class OpportunitySection extends NavigationMixin(LightningElement) {
    @api opportunities;
    @api childData;
    @api showSpinner;
    @track oppId;
    @track displayedRecords = [];
    @track currentPage = 1;
    @track isFilterOpen = false;
    @track filterField = '';
    @track filterValue = '';
    @track comparisonOperator = '';
    @track fieldType = '';
    @track filteredOpportunities = [];
    @track opportunityData = [];
    showButton = false;
    isModalOpen = false;
    isDisabled = true;

    connectedCallback() {
        this.showSpinner = true;
        this.filteredOpportunities = this.opportunities;
        this.loadPage();
    }

    loadPage() {
        const start = (this.currentPage - 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE;

        if (this.opportunities == this.filteredOpportunities) {
            this.displayedRecords = this.opportunities.slice(start, end);
        } else {
            this.displayedRecords = this.filteredOpportunities.slice(start, end);
        }
        this.showSpinner = false;
    }

    previousPage() {
        this.showSpinner = true;
        if (!this.isFirstPage) {
            this.currentPage -= 1;
            this.loadPage();
        }
    }

    nextPage() {
        this.showSpinner = true;
        if (!this.isLastPage) {
            this.currentPage += 1;
            this.loadPage();
        }
    }

    handleAmountChange(event) {
        this.showButton = true;
        const amountValue = event.target.value;
        const oppId = event.target.dataset.oppId;

        try { 
            const opportunitiesCopy = [...this.opportunities];
            const updatedOpp = opportunitiesCopy.find(opp => opp.Id === oppId);    
            
            if (updatedOpp) {
                const updatedOpportunity = { ...updatedOpp };
                updatedOpportunity.Description = amountValue;
                this.childData = updatedOpportunity;
            }
        } catch (error) {
            console.error('An error occurred:', error);

        }
    }

    handleSave(event) { 
        const oppId = event.target.dataset.opportunityId;

        try {
            const oppToSend = this.opportunities.find(opp => opp.Id === oppId);
            if (oppToSend) {
                const dataChangeEvent = new CustomEvent('save', {
                    detail: this.childData
                });
    
                this.dispatchEvent(dataChangeEvent);
            }
            this.showButton = true;
            
        } catch (error) {
            
        }
    }

    openFilterRecord() {
        this.isFilterOpen = true;
    }

    closeFilterRecord() {
        this.isFilterOpen = false;
    }

    handleFilter(event) {
        this.filterField = event.detail.filterField;
        this.comparisonOperator = event.detail.comparisonOperator;
        this.filterValue = event.detail.filterValue;
        this.fieldType = event.detail.fieldType;
        
        this.filteredOpportunities = this.filterOpportunities(this.filterField, this.comparisonOperator, this.filterValue, this.fieldType);
        console.log('filteredOpportunities: ' + JSON.stringify(this.filteredOpportunities));

        this.isDisabled = false;
        this.loadPage();
    }

    filterOpportunities(filterField, comparisonOperator, filterValue, fieldType) {
        const lstOppFiltered = [];
        this.opportunities.forEach(opportunity => {
            const convertedValue = this.convertValue(opportunity, filterField, fieldType, filterValue);

                if (opportunity[filterField] === undefined) {
                    return;
                }

                switch (comparisonOperator) {
                    case 'eq':
                        if (opportunity[filterField] === convertedValue) {
                            lstOppFiltered.push(opportunity);
                        }
                        break;
                    case 'ne':
                        if (opportunity[filterField] !== convertedValue) {
                            lstOppFiltered.push(opportunity);
                        }
                        break;
                    case 'gt':
                        if (opportunity[filterField] > convertedValue) {
                            lstOppFiltered.push(opportunity);
                        }
                        break;
                    case 'lt':
                        if (opportunity[filterField] < convertedValue) {
                            lstOppFiltered.push(opportunity);
                        }
                        break;
                }
            });
        return lstOppFiltered;
    }

    convertValue(opportunity, fieldName, dataType, value) {
        const fieldDataType = typeof opportunity[fieldName];
    
        switch (fieldDataType) {
            case 'string':
                if (dataType === 'number') {
                    value = parseFloat(value);
                } else if (dataType === 'boolean') {
                    value = value.toLowerCase() === 'true';
                }
                break;
            case 'number':
                if (dataType === 'string') {
                    value = value.toString();
                } else if (dataType === 'boolean') {
                    value = !!value;
                }
                break;
            case 'boolean':
                if (dataType === 'string') {
                    value = value.toString();
                } else if (dataType === 'number') {
                    value = parseFloat(value);
                }
                break;
            case 'currency':
                if (dataType === 'string') {
                    value = value.toString();
                } else if (dataType === 'number') {
                    value = parseFloat(value);
                }
            break;
        }
    
        return value;
    }  
    
    clearFilters() {
        this.filteredOpportunities = this.opportunities;
        this.loadPage();
        this.isDisabled = true;
    }

    openModal(event) {
        this.isModalOpen = true;
        this.oppId = event.target.dataset.opportunityId;
    }

    closeModal() {
        this.isModalOpen = false;
    }

    createNewOpportunity() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Opportunity',
                actionName: 'new'
            }
        });
    }

    editOpportunity(event) {
        const oppId = event.target.dataset.opportunityId;
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: oppId,
                actionName: 'edit'
            }
        });
    }

    get isFirstPage() {
        return this.currentPage === 1;
    }

    get isLastPage() {
        if (this.opportunities.length == this.filteredOpportunities.length) {
            return this.currentPage * PAGE_SIZE >= this.opportunities.length;
        } else {
            return this.currentPage * PAGE_SIZE >= this.filteredOpportunities.length;
        }
    }
}