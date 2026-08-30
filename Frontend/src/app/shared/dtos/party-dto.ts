export interface PartyDto {
  name: string;
  description: string;
  agenda: string;
  keyWords: string[];
  coalition: string[] | null;
}
