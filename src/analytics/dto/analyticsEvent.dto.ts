export interface AnalyticsEventDto {
  userLocation: string;
  type: string;
  subType: string;
  pageLocation: string;
  args?: string[];
}
