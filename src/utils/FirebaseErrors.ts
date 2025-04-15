export const getAuthErrorMessage = (code: string) => {
    switch (code) {
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/user-disabled':
        return 'Account disabled';
      case 'auth/user-not-found':
        return 'No account found with this email';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/email-already-in-use':
        return 'Email already in use';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection';
      case 'auth/too-many-requests':
        return 'Too many attempts. Try again later';
      case 'auth/operation-not-allowed':
        return 'Operation not allowed';
      case 'auth/invalid-credential':
        return 'Invalid credentials';
      default:
        return 'An error occurred. Please try again';
    }
  };
  
  export const getFirestoreError = (code: string) => {
    switch (code) {
      case 'permission-denied':
        return 'You don\'t have permission to perform this action';
      case 'unavailable':
        return 'Service unavailable. Try again later';
      case 'aborted':
        return 'Operation aborted';
      case 'data-loss':
        return 'Data loss occurred';
      default:
        return 'Database error occurred';
    }
  };