module.exports = {
  "ci": {
    "collect": {
      "url": [
        "https://zitrono.github.io/ralph-web/"
      ],
      "startServerCommand": "npm run preview",
      "startServerReadyPattern": "Local:"
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "first-contentful-paint": [
          "error",
          {
            "maxNumericValue": 1500
          }
        ],
        "largest-contentful-paint": [
          "error",
          {
            "maxNumericValue": 2500
          }
        ],
        "first-input-delay": [
          "error",
          {
            "maxNumericValue": 100
          }
        ],
        "cumulative-layout-shift": [
          "error",
          {
            "maxNumericValue": 0.1
          }
        ],
        "total-blocking-time": [
          "error",
          {
            "maxNumericValue": 200
          }
        ],
        "speed-index": [
          "warn",
          {
            "maxNumericValue": 3000
          }
        ],
        "interactive": [
          "warn",
          {
            "maxNumericValue": 3000
          }
        ]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
};