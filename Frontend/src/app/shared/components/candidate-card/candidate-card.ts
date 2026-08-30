import { Component, Input, Output, EventEmitter } from '@angular/core';

import { CandidateDto } from '../../dtos/candidacy-dto';

@Component({
  selector: 'app-candidate-card',
  standalone: true,
  imports: [],
  templateUrl: './candidate-card.html',
  styleUrls: ['./candidate-card.scss'],
})
export class CandidateCardComponent {
  @Input({ required: true }) candidate!: CandidateDto;

  // This allows the card to tell the list component to close the modal
  @Output() closeCard = new EventEmitter<void>();
}
