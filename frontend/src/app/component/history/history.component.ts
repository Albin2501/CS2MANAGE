import { Component, OnInit } from '@angular/core';

import { HistoryEntryDTO } from 'src/app/dto/historyEntryDTO';
import { HistoryService } from 'src/app/service/history/history.service';

import { formatDate } from 'src/app/util/formatter';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  history: HistoryEntryDTO[] = [];

  constructor(private historyService: HistoryService) { }

  ngOnInit(): void {
    this.get();
  }

  get(): void {
    this.historyService.get().subscribe({
      next: history => {
        this.history = history;
      },
      error: error => {
        console.log(error);
      }
    });
  }

  delete(id: number): void {
    this.historyService.delete(id).subscribe({
      error: error => {
        console.log(error);
      },
      complete: () => {
        this.get();
      }
    });
  }

  deleteAll(): void {
    this.historyService.deleteAll().subscribe({
      error: error => {
        console.log(error);
      },
      complete: () => {
        this.get();
      }
    });
  }

  formatDate(date: Date): string {
    return formatDate(new Date(date));
  }
}
