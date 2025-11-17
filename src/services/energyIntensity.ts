import { type TimeGranularity, type EnergyResponse, type ConsumptionData, type SourceData, type EnergyData  } from '../types/energyIntensity.ts';
import mockData from '../mockData/BacRodaMonth.json';
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

  /**
   * Get consumption data by source (ALL, GRID, or LOCAL), it gets everything but it divides it by source
   */
  async getConsumptionBySource(
    source: keyof ConsumptionData,
    granularity: TimeGranularity = 'monthly'
  ): Promise<SourceData> {
    const data = await this.getEnergyData(granularity);
    return data.CONSUMPTION[source];
  }

  /**
   * Get specific usage category data
   */
  async getUsageCategoryData(
    source: keyof ConsumptionData,
    category: keyof SourceData,
    granularity: TimeGranularity = 'monthly'
  ): Promise<EnergyData[]> {
    const sourceData = await this.getConsumptionBySource(source, granularity);
    return sourceData[category]["Active energy delivered"];
  }
}

export const energyService = new EnergyService();