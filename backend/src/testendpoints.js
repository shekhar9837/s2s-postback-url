// testEndpoints.js
import axios from "axios";

const BASE_URL = "http://localhost:4000"; // change if your server runs elsewhere

async function runTests() {
  try {
    console.log("=== Health Check ===");
    let res = await axios.get(`${BASE_URL}/health`);
    console.log(res.data);

    console.log("\n=== Create Test Affiliate + Campaign (if not exist) ===");
    // Normally you’d have seeding, but let’s assume affiliate=1, campaign=1 exist.
    // Otherwise, you can seed manually into Postgres.
    console.log("Using affiliate_id=1 and campaign_id=1");

    console.log("\n=== Log Click ===");
    res = await axios.get(
      `${BASE_URL}/click?affiliate_id=1&campaign_id=1&click_id=abc123`
    );
    console.log(res.data);

    console.log("\n=== Log Conversion via Postback ===");
    res = await axios.get(
      `${BASE_URL}/postback?affiliate_id=1&click_id=abc123&amount=100&currency=USD`
    );
    console.log(res.data);

    console.log("\n=== Fetch Affiliates ===");
    res = await axios.get(`${BASE_URL}/affiliates`);
    console.log(res.data);

    console.log("\n=== Fetch Clicks for Affiliate 1 ===");
    res = await axios.get(`${BASE_URL}/affiliates/1/clicks`);
    console.log(res.data);

    console.log("\n=== Fetch Conversions for Affiliate 1 ===");
    res = await axios.get(`${BASE_URL}/affiliates/1/conversions`);
    console.log(res.data);

    console.log("\n✅ All tests done.");
  } catch (err) {
    if (err.response) {
      console.error("❌ Error Response:", err.response.data);
    } else {
      console.error("❌ Error:", err.message);
    }
  }
}

runTests();
