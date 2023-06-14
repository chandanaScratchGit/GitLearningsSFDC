/**
 * @description       : 
 * @author            : chandana
 * @group             : 
 * @last modified on  : 06-14-2023
 * @last modified by  : chandana
 * Modifications Log
 * Ver   Date         Author     Modification
 * 1.0   06-14-2023   chandana   Initial Version
**/
global class BatchClass implements Database.Batchable<sObject> {
    global Database.QueryLocator start(Database.BatchableContext bc) {
        // collect the batches of records or objects to be passed to execute
        return null;
    }
    global void execute(Database.BatchableContext bc, List<Account> records){
        // process each batch of records
        System.debug('entered at'+system.now());
    }    
    global void finish(Database.BatchableContext bc){
        // execute any post-processing operations
    }    
}