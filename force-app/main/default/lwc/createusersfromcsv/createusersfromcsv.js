import { LightningElement,track} from 'lwc';
import PARSER from '@salesforce/resourceUrl/PapaParse';
import { loadScript } from 'lightning/platformResourceLoader';
import { createRecord } from 'lightning/uiRecordApi';
import USER_OBJECT from '@salesforce/schema/User';
import Email_FIELD from '@salesforce/schema/User.Email';
import Alias_FIELD from '@salesforce/schema/User.Alias';
import LastName_FIELD from '@salesforce/schema/User.LastName';
import UserRoleId_FIELD from '@salesforce/schema/User.UserRoleId';
import Username_FIELD from '@salesforce/schema/User.Username';
import profileId_FIELD from '@salesforce/schema/User.ProfileId';
import LanguageLocaleKey_FIELD from '@salesforce/schema/User.LanguageLocaleKey';
import EmailEncodingKey_FIELD from '@salesforce/schema/User.EmailEncodingKey';
import LocaleSidKey_FIELD from '@salesforce/schema/User.LocaleSidKey';
import TimeZoneSidKey_FIELD from '@salesforce/schema/User.TimeZoneSidKey';
import StayInTouchSignature from '@salesforce/schema/User.StayInTouchSignature';
export default class Createusersfromcsv extends LightningElement {
    parserInitialized = false;
    @track loading = false;
    @track showbutton=false;
    @track _results;
    @track _rows;
    renderedCallback() {
        if(!this.parserInitialized){
            loadScript(this, PARSER)
                .then(() => {
                    this.parserInitialized = true;
                })
                .catch(error => console.error(error));
        }
    }
    handleInputFile(event){
        if(event.target.files.length > 0){
            const file = event.target.files[0];
            Papa.parse(file, {
                quoteChar: '"',
                header: 'true',
                skipEmptyLines: true,
                complete: (results) => {
                    this._rows = results.data;
                    this.loading = false;
                },
                error: (error) => {
                    console.error(error);
                    this.loading = false;
                }
            })
            this.loading = true;
        }
       
    }
    get rows(){
        if(this._rows){
            return this._rows.map((row, index) => {
                row.key = index;
               if(this.results[index]){
                    row.result = this.results[index].id || this.results[index].error;
                }
               
                return row;
            })
        }
        return [];
    }
    get columns(){
       
        var columns = [
            { label: 'Alias', fieldName: 'Alias' },
            { label: 'Email', fieldName: 'Email' },
            { label: 'LastName', fieldName: 'LastName' },
            { label: 'ProfileId', fieldName: 'ProfileId'},
            { label: 'Username', fieldName: 'Username' },
            { label: 'UserRoleId', fieldName: 'UserRoleId' },
            { label: 'LanguageLocaleKey', fieldName: 'LanguageLocaleKey' },
            { label: 'EmailEncodingKey', fieldName: 'EmailEncodingKey'},
            { label: 'LocaleSidKey', fieldName: 'LocaleSidKey' },
            { label: 'TimeZoneSidKey', fieldName: 'TimeZoneSidKey' },
            
          
        ];
        if(this.results.length){
            columns=[]
            columns.push({ label: 'LastName',fieldName: 'LastName' });
            columns.push({ label: 'Email',fieldName: 'Email' });
            columns.push({ label: 'Result',fieldName: 'result' });

        }
        return columns;
    }
    get results(){
        
        if(this._results){
            return this._results.map(r => {
                const result = {};
                const res = JSON.stringify(r);
                const feildLabel=res.substring(res.lastIndexOf('message')+9,res.lastIndexOf(']')-2);
                console.log(feildLabel)
               
                result.success = r.status === 'fulfilled';
                result.id = result.success ? r.value.id : undefined    
                result.error = !result.success ?feildLabel : undefined;
             
                return result;
            });
        }
        return [];
    }
    cancel(){
        this._rows = undefined;
        this._results = undefined;    
    }
    Back(){
        this._rows = undefined;
        this._results = undefined;
        this.showbutton=false;  
    }
    createUsers(){
        console.log("Hi in create")
        const usersToCreate = this.rows.map(row => {
            const fields = {};
            fields[Email_FIELD.fieldApiName] = row.Email;
            fields[Alias_FIELD.fieldApiName] = row.Alias;
            fields[LastName_FIELD.fieldApiName] = row.LastName;
            fields[UserRoleId_FIELD.fieldApiName] = row.UserRoleId;
            fields[Username_FIELD.fieldApiName] = row.Username;
            fields[profileId_FIELD.fieldApiName] = row.ProfileId;
            fields[LanguageLocaleKey_FIELD.fieldApiName] = row.LanguageLocaleKey;
            fields[EmailEncodingKey_FIELD.fieldApiName] = row.EmailEncodingKey;
            fields[LocaleSidKey_FIELD.fieldApiName] = row.LocaleSidKey;
            fields[TimeZoneSidKey_FIELD.fieldApiName] = row.TimeZoneSidKey;

            const recordInput = { apiName: USER_OBJECT.objectApiName, fields };
            return createRecord(recordInput);
        });
        if(usersToCreate.length){
            this.loading = true;
            this.showbutton=true;
            Promise.allSettled(usersToCreate)
                .then(results => this._results = results)
                .catch(error => console.error(error))
                .finally(() => this.loading = false);
           
        }
    }

}