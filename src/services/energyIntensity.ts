import mockData from '@src/mockdata/formatted_output.json';
import { type BoardContext } from '@src/models/boardModel';

class EnergyService {
// private baseUrl = 
  /**
   * Fetch energy consumption data
   * @param granularity - Time granularity: 'hourly', 'daily', or 'monthly'
   * @param startDate - Start date for the data range
   * @param endDate - End date for the data range
   */
  async getContextData(
  ): Promise<BoardContext> {
    try {
      
      return mockData as BoardContext;
    } catch (error) {
      console.error('Error fetching energy data:', error);
      throw error;
    }
  }
}

export const energyService = new EnergyService();