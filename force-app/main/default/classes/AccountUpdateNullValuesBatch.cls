global class AccountUpdateNullValuesBatch implements Database.Batchable<sObject> {

    global Database.QueryLocator start(Database.BatchableContext BC)
    {
        System.debug('Inside Start method');

        String query='select id,BillingCity, AccountNumber, BillingCountry, BillingStreet, BillingState from Account where AccountNumber=null or BillingStreet =null or BillingCity =null or BillingState =null or BillingCountry=null';
        return Database.getQueryLocator( query);
    }
    global void execute (Database.BatchableContext BC,List<Account> accList)
    {
        System.debug('Inside Execute method');
        for(Account acc:accList)
        {
            if(String.isBlank(acc.AccountNumber))
            {
                acc.AccountNumber='XXXX';
            }
            if(String.isBlank(acc.billingCity))
            {
                acc.billingCity='Mumbai';
                    
            }
             if(String.isBlank(acc.billingCountry))
            {
                acc.billingCountry='India';
                    
            }
             if(String.isBlank(acc.billingState))
            {
                acc.billingState='Maharastra';
                    
            }
        }
       update accList;
    }
    global void finish(Database.BatchableContext BC)
    {
        System.debug('Inside Finish Method');
    }
    
}