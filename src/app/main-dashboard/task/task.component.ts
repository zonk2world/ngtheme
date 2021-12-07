import { Component, OnInit } from '@angular/core';
import {TaskService} from '../../services/task.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  public taskData: any;
  constructor(private taskService: TaskService) { }
  ngOnInit() {
    this.taskService.getTaskData();
    this.taskService.taskData.subscribe((res) => {
      if (res && res[0]) {
        this.taskData = res;
      }
    });
  }
  public changeStatus(e, i) {
    if(e.target.checked) {
      this.taskService.updateTask('Done', i);
    } else {
      this.taskService.updateTask('In progress', i);
    }
  }
}
