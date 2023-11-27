public with sharing class OpportunityController {
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpportunities(Id accountId) {
        return [SELECT Id, Name, Amount, Description, CloseDate, StageName, Probability, LeadSource FROM Opportunity WHERE AccountId = :accountId];
    }

    @AuraEnabled(cacheable=true)
    public static List<OpportunityLineItem> getOpportunityProducts(Id opportunityId) {
        return [SELECT Id, Name, Product2.Name, Quantity, UnitPrice, TotalPrice
                                                         FROM OpportunityLineItem
                                                         WHERE OpportunityId = :opportunityId];
    }

    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts(Id accountId) {
        System.debug('accId: ' + accountId);
        return [SELECT Id, Name, Email, Phone, Title, Birthdate, Description FROM Contact WHERE AccountId = :accountId];
    }

    @AuraEnabled(cacheable=true)
    public static List<Case> getCases(Id opportunityId) {
        return [SELECT Id, CaseNumber, Subject, Description, Status, Priority, Origin, OwnerId, Type FROM Case WHERE OpportunityId__c = :opportunityId];
    }

    @AuraEnabled
    public static String updateOpportunityAmount(Opportunity opportunity) {
        try {
            Opportunity opp = [SELECT Id, Amount FROM Opportunity WHERE Id = :opportunity.Id LIMIT 1];
            opp.Description = opportunity.Description;
            
            Database.SaveResult updateResult = Database.update(opp);
            if (updateResult.isSuccess()) {
                System.debug('Opportunity updated successfully.');
            } else {
                for (Database.Error error : updateResult.getErrors()) {
                    System.debug('Error updating record: ' + error.getStatusCode() + ' - ' + error.getMessage());
                }
            }

            return 'Opportunity updated successfully';
            
        } catch (DMLException e) {
            for (Integer i = 0; i < e.getNumDml(); i++) {
                System.debug('DML Exception: ' + e.getDmlMessage(i));
                System.debug('Fields that caused the error: ' + e.getDmlFields(i));
            }
            return 'DMLException: ' + e.getMessage();
        } catch (Exception ex) {
            System.debug('ex: ' + ex);
            return 'Error updating opportunity: ' + ex.getMessage();
        }

    @AuraEnabled
    public static List<Opportunity> getOpportunities() {
        List<Opportunity> opportunities = 
                [SELECT Id, Name, CloseDate FROM Opportunity];
        return opportunities;
    }

    @AuraEnabled
    public static Opportunity getOpportunity(Id id) {
        Opportunity opportunity = [
                SELECT Id, Account.Name, Name, CloseDate, 
                       Owner.Name, Amount, Description, StageName
            FROM Opportunity
            WHERE Id = :id
         ];

        // Perform isAccessible() check here 
        return opportunity;
    }
}