export interface SearchResultItem {
  id: string;
  type: 'trip' | 'vehicle' | 'driver' | 'location';
  title: string;
  subtitle: string;
  url: string;
}
