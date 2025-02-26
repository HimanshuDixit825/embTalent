// Test script for authentication linking
// Run this script in the browser console to test the linking functionality

// Test Case 1: User with email/password account tries to sign up with Google
async function testEmailToGoogleLinking() {
  console.log("Test Case 1: User with email/password account tries to sign up with Google");
  
  // Simulate an existing email/password user
  const email = "test@example.com";
  const googleUserId = "google-user-id-123";
  
  try {
    // First check if user exists
    const checkResponse = await fetch(`/api/users/check-auth?email=${encodeURIComponent(email)}`);
    const checkData = await checkResponse.json();
    
    console.log("User check response:", checkData);
    
    if (checkData.exists && !checkData.user.isSocialLogin) {
      console.log("✅ Found existing email/password account, now linking with Google");
      
      // Simulate linking with Google
      const updateResponse = await fetch("/api/users/duplicate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: checkData.user.id,
          email: email,
          name: "Test User",
          userid: googleUserId,
          is_social_login: true,
          social_provider: "email,google",
        }),
      });
      
      if (updateResponse.ok) {
        const updateData = await updateResponse.json();
        console.log("✅ Successfully linked accounts:", updateData);
      } else {
        console.log("❌ Failed to link accounts");
      }
    } else if (!checkData.exists) {
      console.log("❌ User doesn't exist, would create new account");
    } else {
      console.log("❌ User exists but not with email/password authentication");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

// Test Case 2: Check if linked account can be found by Google userid
async function testFindLinkedAccount() {
  console.log("Test Case 2: Check if linked account can be found by Google userid");
  
  // Use the same Google user ID from the previous test
  const googleUserId = "google-user-id-123";
  
  try {
    const response = await fetch(`/api/users/check-auth?userid=${encodeURIComponent(googleUserId)}`);
    const data = await response.json();
    
    console.log("User check response:", data);
    
    if (data.exists && data.user.isSocialLogin && data.user.socialProvider.includes("google")) {
      console.log("✅ Success: Found linked account with both email and Google authentication");
    } else if (!data.exists) {
      console.log("❌ Failure: Linked account not found");
    } else {
      console.log("❌ Failure: Account found but not properly linked");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

// Run all tests
async function runAllTests() {
  await testEmailToGoogleLinking();
  console.log("-----------------------------------");
  await testFindLinkedAccount();
}

// Run the tests
runAllTests();
