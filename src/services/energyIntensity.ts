import { type TimeGranularity, type EnergyResponse} from '../types/energyIntensity.ts';
import mockData from '../mockData/BacRodaHour.json';
class EnergyService {
// private baseUrl = 

  /**
   * Fetch energy consumption data
   * @param granularity - Time granularity: 'hourly', 'daily', or 'monthly'
   * @param startDate - Start date for the data range
   * @param endDate - End date for the data range
   */
  async getEnergyData(
    granularity: TimeGranularity = 'monthly',
    startDate?: string,
    endDate?: string
  ): Promise<EnergyResponse> {
    try {
      /*
      const params = new URLSearchParams({
        granularity,
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      });
      
      const response = await fetch(`${this.baseUrl}?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
      */
      
      return mockData as EnergyResponse;
    } catch (error) {
      console.error('Error fetching energy data:', error);
      throw error;
    }
  }
}

export const energyService = new EnergyService();