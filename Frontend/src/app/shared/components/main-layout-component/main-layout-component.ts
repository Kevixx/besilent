import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout-component',
  imports: [NavbarComponent, RouterOutlet],
  templateUrl: './main-layout-component.html',
  styleUrl: './main-layout-component.scss',
})
export class MainLayoutComponent {}
