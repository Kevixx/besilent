import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ProfileDto } from '../../dtos/profile-dto';

@Component({
  selector: 'app-candidate-card',
  standalone: true,
  imports: [],
  templateUrl: './candidate-card.html',
  styleUrls: ['./candidate-card.scss'],
})
export class CandidateCardComponent {
  @Input({ required: true }) candidate!: ProfileDto;

  // This allows the card to tell the list component to close the modal
  @Output() closeCard = new EventEmitter<void>();
}
