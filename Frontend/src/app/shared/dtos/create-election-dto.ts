export interface CreateElectionDto {
  title: string;
  description: string;
  startDate: string; // The HTML datetime-local input provides a string
  endDate: string;
}
