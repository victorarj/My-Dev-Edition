public with sharing class accountService {

    public Account createAccount( String accountName, String accountNumber, String tickerSymbol ) {

      Account newAcct = new Account(
        Name = accountName,
        AccountNumber = accountNumber,
        TickerSymbol = accountNumber
      );
      
      return newAcct;
    }
  }