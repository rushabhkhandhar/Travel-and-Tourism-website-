import { toast } from 'react-toastify';

// Common toast messages for the application
export const toastMessages = {
  // Success messages
  success: {
    bookingConfirmed: () => toast.success('Booking confirmed! Check your email for details.'),
    bookingCancelled: () => toast.success('Booking cancelled successfully'),
    linkCopied: () => toast.success('Link copied to clipboard!'),
    contactSubmitted: () => toast.success('Thank you for your interest! We will contact you soon.'),
    loginSuccess: () => toast.success('Welcome back!'),
    registrationSuccess: () => toast.success('Account created successfully!'),
    profileUpdated: () => toast.success('Profile updated successfully'),
    favoriteAdded: () => toast.success('Added to favorites'),
    favoriteRemoved: () => toast.success('Removed from favorites')
  },

  // Error messages
  error: {
    loginRequired: () => toast.error('Please log in to continue'),
    bookingFailed: () => toast.error('Failed to create booking. Please try again.'),
    bookingCancelFailed: () => toast.error('Failed to cancel booking. Please try again.'),
    linkCopyFailed: () => toast.error('Failed to copy link'),
    networkError: () => toast.error('Network error. Please check your connection.'),
    unauthorized: () => toast.error('You are not authorized to perform this action'),
    serverError: () => toast.error('Server error. Please try again later.'),
    validationError: (message) => toast.error(message || 'Please check your input and try again'),
    favoriteError: () => toast.error('Failed to update favorites. Please try again.')
  },

  // Warning messages
  warning: {
    unsavedChanges: () => toast.warn('You have unsaved changes'),
    sessionExpiring: () => toast.warn('Your session is about to expire'),
    confirmAction: () => toast.warn('Please confirm your action')
  },

  // Info messages
  info: {
    loading: () => toast.info('Loading...'),
    processing: () => toast.info('Processing your request...'),
    redirecting: () => toast.info('Redirecting...')
  }
};

// Custom toast with specific options
export const customToast = {
  promise: (promise, messages) => {
    return toast.promise(promise, {
      pending: messages.pending || 'Processing...',
      success: messages.success || 'Success!',
      error: messages.error || 'Something went wrong!'
    });
  },

  confirm: (message, onConfirm) => {
    const toastId = toast(
      <div>
        <p>{message}</p>
        <div style={{ marginTop: '10px', textAlign: 'right' }}>
          <button
            onClick={() => {
              toast.dismiss(toastId);
              onConfirm();
            }}
            style={{
              background: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '4px',
              marginRight: '5px',
              cursor: 'pointer'
            }}
          >
            Confirm
          </button>
          <button
            onClick={() => toast.dismiss(toastId)}
            style={{
              background: '#6c757d',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        position: 'top-center',
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        draggable: false
      }
    );
  }
};

export default toastMessages;
