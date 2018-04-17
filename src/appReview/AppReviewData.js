import { AsyncStorage } from 'react-native';

const keyPrefix = '@RatingRequestData.';
const eventCountKey = keyPrefix + 'positiveEventCount';
const ratedTimestamp = keyPrefix + 'ratedTimestamp';
const declinedTimestamp = keyPrefix + 'declinedTimestamp';

/**
 * Private class that let's us interact with AsyncStorage on the device
 * @class
 */
class RatingsData {
  constructor() {
    this.initialize();
  }

  // Get current count of positive events
  async getCount() {
    try {
      const countString = await AsyncStorage.getItem(eventCountKey);
      return parseInt(countString, 10);
    } catch (error) {
      console.warn("Couldn't retrieve positive events count. Error:", error);
    }
  }

  // Increment count of positive events
  async incrementCount() {
    try {
      const currentCount = await this.getCount();
      await AsyncStorage.setItem(eventCountKey, (currentCount + 1).toString());

      return currentCount + 1;
    } catch (error) {
      console.warn('Could not increment count. Error:', error);
    }
  }

  async getActionTimestamps() {
    try {
      const timestamps = await AsyncStorage.multiGet([ratedTimestamp, declinedTimestamp]);

      return timestamps;
    } catch (error) {
      console.warn('Could not retrieve rated or declined timestamps.', error);
    }
  }

  async recordDecline() {
    try {
      await AsyncStorage.setItem(declinedTimestamp, Date.now().toString());
    } catch (error) {
      console.warn("Couldn't set declined timestamp.", error);
    }
  }

  async recordRated() {
    try {
      await AsyncStorage.setItem(ratedTimestamp, Date.now().toString());
    } catch (error) {
      console.warn("Couldn't set rated timestamp.", error);
    }
  }

  // Initialize keys, if necessary
  async initialize() {
    try {
      const keys = await AsyncStorage.getAllKeys();

      if (!keys.some(key => key === eventCountKey)) {
        console.log('Initializing blank values...');
        await AsyncStorage.setItem(eventCountKey, '0');
      }
    } catch (error) {
      // report error or maybe just initialize the values?
      console.warn('Uh oh, something went wrong initializing values!', error);
    }
  }
}

export default new RatingsData();
