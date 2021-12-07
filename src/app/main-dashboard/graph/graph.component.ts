import {Component, OnInit} from '@angular/core';
import {GraphService} from '../../services/graph.service';
import {isArray} from 'util';

declare const charts: any;

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})

export class GraphComponent implements OnInit {
  public graphData: any;
  constructor(private graphService: GraphService) {}

  ngOnInit() {
    this.graphService.getGraphData();
    this.graphService.graphData.subscribe((res) => {
      if (res && !isArray(res)) {
        this.graphData = res;
        charts.columnChart('columnChart', this.graphData);
      }
    });
  }
}
