import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class SharedService {
    private _stream$ = new BehaviorSubject(0);
    public stream$ = this._stream$.asObservable();

    send(msg : number) {
      this._stream$.next(msg);
    }
}