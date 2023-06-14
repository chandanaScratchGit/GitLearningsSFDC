@isTest
public class scheduleTest {
    @isTest
    public static void SchduleTest()
    {
        Test.StartTest();
		scheduleClass sh1 = new scheduleClass();      
 		String sch = '0 0 * * * ?';
        system.schedule('Test check1', sch, sh1);
		Test.stopTest();
    }

}