// Check if a user exists and what type of authentication they use
export async function checkUserAuth(email) {
    try {
      const response = await fetch(`/api/users/check-auth?email=${encodeURIComponent(email)}`);
      
      if (!response.ok) {
        throw new Error('Failed to check user authentication');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error checking user auth:', error);
      throw error;
    }
  }
  