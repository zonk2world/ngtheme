import {Injectable} from '@angular/core';
import * as firebase from 'firebase';

import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';

@Injectable()
export class TaskService {
  public task;
  public taskData = new BehaviorSubject<any[]>([]);

  constructor() {}
  public getTaskData() {
    let ref = firebase.database().ref('task');
    this.task = ref.once('value').then((snapshot) => {
      this.taskData.next(snapshot.val());
    });
  }
  public updateTask(status, id) {
    let ref = firebase.database().ref(`task/${id}`);
    ref.update({ status: status });
    this.getTaskData();
  }
}
