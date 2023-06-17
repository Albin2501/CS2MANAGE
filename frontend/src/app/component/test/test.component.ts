import { Component, OnInit } from '@angular/core';
import { TestService } from 'src/app/service/test.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  test: Number = 0;

  constructor(private testService: TestService) { }

  ngOnInit(): void {
    this.testService.test().subscribe({
      next: val => {
        this.test = val[0];
      }
    });
  }
}
