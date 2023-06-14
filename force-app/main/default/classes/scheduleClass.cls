global class scheduleClass  implements Schedulable{
    
    
     global void execute(SchedulableContext SC)
     {
         Id BatchId = Database.executeBatch(new BatchClass(),200);
     }
    

}