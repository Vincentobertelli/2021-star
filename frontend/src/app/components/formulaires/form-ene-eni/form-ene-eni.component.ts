import {Component, OnInit} from '@angular/core';
import {InstanceService} from "../../../services/api/instance.service";
import {Instance} from "../../../models/enum/Instance.enum";

@Component({
  selector: 'app-form-ene-eni',
  templateUrl: './form-ene-eni.component.html',
  styleUrls: ['./form-ene-eni.component.css']
})
export class FormEneEniComponent implements OnInit {

  InstanceEnum = Instance;

  instance?: Instance;

  constructor(
    private instanceService: InstanceService
  ) {
    this.instanceService.getTypeInstance().subscribe(instance => this.instance = instance);
  }

  ngOnInit(): void {
  }

}