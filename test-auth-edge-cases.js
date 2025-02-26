// Test script for authentication edge cases
// Run this script in the browser console to test the edge cases

// Test Case 1: User tries to sign up with Google when they already have an email/password account
async function testEmailToGoogleSignup() {
  console.log("Test Case 1: User tries to sign up with Google when they already have an email/password account");
  
  // Simulate an existing email/password user
  const email = "test@example.com";
  
  try {
    const response = await fetch(`/api/users/check-auth?email=${encodeURIComponent(email)}`);
    const data = await response.json();
    
    console.log("User check response:", data);
    
    if (data.exists && !data.user.isSocialLogin) {
      console.log("✅ Success: User exists with email/password, would show popup");
    } else if (!data.exists) {
      console.log("❌ Failure: User doesn't exist, would proceed with signup");
    } else {
      console.log("❌ Failure: User exists but with social login");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

// Test Case 2: User with Google account tries to sign up with Google again
async function testGoogleToGoogleSignup() {
  console.log("Test Case 2: User with Google account tries to sign up with Google again");
  
  // Simulate an existing Google user
  const email = "google-user@example.com";
  
  try {
    const response = await fetch(`/api/users/check-auth?email=${encodeURIComponent(email)}`);
    const data = await response.json();
    
    console.log("User check response:", data);
    
    if (data.exists && data.user.isSocialLogin && data.user.socialProvider === "google") {
      console.log("✅ Success: User exists with Google login, would show popup");
    } else if (!data.exists) {
      console.log("❌ Failure: User doesn't exist, would proceed with signup");
    } else {
      console.log("❌ Failure: User exists but not with Google login");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

// Test Case 3: User tries to login with Google without having signed up
async function testNoAccountToGoogleLogin() {
  console.log("Test Case 3: User tries to login with Google without having signed up");
  
  // Simulate a non-existing user
  const email = "new-user@example.com";
  
  try {
    const response = await fetch(`/api/users/check-auth?email=${encodeURIComponent(email)}`);
    const data = await response.json();
    
    console.log("User check response:", data);
    
    if (!data.exists) {
      console.log("✅ Success: User doesn't exist, would proceed with signup");
    } else {
      console.log("❌ Failure: User already exists");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

// Run all tests
async function runAllTests() {
  await testEmailToGoogleSignup();
  console.log("-----------------------------------");
  await testGoogleToGoogleSignup();
  console.log("-----------------------------------");
  await testNoAccountToGoogleLogin();
}

// Run the tests
runAllTests();
