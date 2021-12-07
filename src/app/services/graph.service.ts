import {Injectable, OnInit} from '@angular/core';
import * as firebase from 'firebase';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';

@Injectable()
export class GraphService {
  public graph;
  public graphData = new BehaviorSubject<any[]>([]);

  constructor() {}

  public getGraphData() {
    let ref = firebase.database().ref('chart');
    this.graph = ref.once('value').then((snapshot) => {
      this.graphData.next(snapshot.val());
    });
  }
}
