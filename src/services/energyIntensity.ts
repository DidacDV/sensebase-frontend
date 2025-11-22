import mockData from '@src/mockdata/formatted_output.json';
import type { TimeSeriesChartStructure } from '@src/models/chartModels.ts';
//TODO THIS SHOULD RETURN THE WHOLE CONTEXT FOR ONE provider (which inside there would be the choosen chart type with its data formatted)
class EnergyService {
// private baseUrl = 

  /**
   * Fetch energy consumption data
   * @param granularity - Time granularity: 'hourly', 'daily', or 'monthly'
   * @param startDate - Start date for the data range
   * @param endDate - End date for the data range
   */
  async getEnergyData(
  ): Promise<TimeSeriesChartStructure> {
    try {
      
      return mockData as TimeSeriesChartStructure;
    } catch (error) {
      console.error('Error fetching energy data:', error);
      throw error;
    }
  }
}

export const energyService = new EnergyService();