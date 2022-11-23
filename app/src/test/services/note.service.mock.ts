import { Observable } from "rxjs";

const TEST_NOTE = {
    id:'00000-0000-000',
    subaccountId:'000-aaaa-bbbb-cccc',
    content:'test contet'
}

export const NOTE_SERVICE_MOCK = {
    getNoteList: ()=>{
        return new Observable((observer) => {
            observer.next(
                JSON.parse(JSON.stringify({notes:[TEST_NOTE]}))
            );
            observer.complete();
            return {
                unsubscribe() { }
            };
        });
    },
    createNote: ()=>{
        return new Observable((observer) => {
            observer.next(
                JSON.parse(JSON.stringify({id:'00000-0000-000'}))
            );
            observer.complete();
            return {
                unsubscribe() { }
            };
        });
    },
    deleteNote: (noteId:string)=>{
        return new Observable((observer) => {
            observer.next();
            observer.complete();
            return {
                unsubscribe() { }
            };
        });
    }
}