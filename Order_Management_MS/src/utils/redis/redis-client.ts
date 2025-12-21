// Import the node-redis module
import {createClient} from 'redis';

// Create a Redis client object
export const client = createClient({
    url: ''
}); 

// Handle connection errors
client.on('error', err => console.log('Redis Client Error', err)); 

// Connect to Redis
client.connect()
  .then(() => console.log('Connected to Redis'))
  .catch(err => console.log('Failed to connect to Redis', err));