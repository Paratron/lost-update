const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// In-memory storage for the checkbox state
let checkboxStates = new Map();
let requestCounterState = 0; // Counter to keep track of request numbers

// Middleware to parse JSON bodies and enable CORS
app.use(express.json());
app.use(cors());

// API endpoint to receive and store checkbox state with conditional delay
app.post('/api/:userId/checkbox-state', (req, res) => {
  const userId = req.params.userId;
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }
  if (!req.body) {
    return res.status(400).json({ message: 'State is required' });
  }
  const requestCounter = requestCounterState++;

  // Determine if this request should be delayed
  const s = requestCounter % 2 === 0;
  // add a random delay to simulate network latency
  const mockNetworkDelay = requestCounter % 2 === 0 ? Math.floor(Math.random() * 500) : 0;
  // add a random delay to simulate database latency
  const mockDatabaseDelay = requestCounter % 3 === 0 ? Math.floor(Math.random() * 500) : 0;

  // Log the incoming request and whether it will be delayed
  console.log(`REQ ${requestCounter} Received checkbox state for user ${userId}:`, req.body);

  setTimeout(() => {
    const userCheckboxState = checkboxStates.get(userId);
    const newVersion = userCheckboxState !== undefined ? userCheckboxState.version + 1 : 0;

    // Simulate processing delay if necessary
    setTimeout(() => {
      // Optimistic concurrency control
      let currentCheckboxState = checkboxStates.get(userId);
      if (currentCheckboxState) {
        console.log(`REQ ${requestCounter} Current state:`, currentCheckboxState);
        if (newVersion - 1 !== currentCheckboxState.version) {
          console.log(
            `REQ ${requestCounter} Conflict detected. Version mismatch. NewVersion ${newVersion}, CurrentVersion ${currentCheckboxState.version}`,
          );
          return res.status(409).json({
            message: `REQ ${requestCounter} Conflict detected. Version mismatch. NewVersion ${newVersion}, CurrentVersion ${currentCheckboxState.version}.`,
          });
        }
      }
      let newCheckboxState = { version: newVersion, state: req.body };

      checkboxStates.set(userId, newCheckboxState);
      console.log(`REQ ${requestCounter} Checkbox state stored successfully: `, newCheckboxState);

      res.status(200).json({
        message: `REQ ${requestCounter} Checkbox state stored successfully`,
      });
    }, mockDatabaseDelay);
  }, mockNetworkDelay);
});

// API endpoint to retrieve the current checkbox state
app.get('/api/:userId/checkbox-state', (req, res) => {
  const userId = req.params.userId;
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }
  const state = checkboxStates.get(userId);
  if (state === undefined) {
    return res.status(404).json({ message: 'No state found for the given user ID' });
  }
  res.status(200).json(state.state);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
