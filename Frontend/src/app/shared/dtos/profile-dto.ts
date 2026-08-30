export interface ProfileDto {
  id: string;
  firstName: string;
  lastName: string;
  bio?: string;
  linkedInUrl?: string;
  agenda: string;
  keyWords?: string[];
  partyIds: string[];
}
