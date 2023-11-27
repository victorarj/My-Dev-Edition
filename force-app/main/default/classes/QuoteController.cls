public with sharing class QuoteController {
    @AuraEnabled
    public static void createQuoteRecord() {
        // Create a new Quote record
        Account newAccount = new Account();
        newAccount.Name = 'New Account'; // Set the name (adjust as needed)
        // Add any other fields you want to set

        // Insert the new Account record
        insert newAccount;
    }
}