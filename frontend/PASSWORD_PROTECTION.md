# Password Protection for HUVTSP Alumni Network

## Overview
The HUVTSP Alumni Network is now password-protected and restricted to HUVTSP 2025 alumni only.

## How it Works
- Users must enter the correct password to access the application
- Once authenticated, users remain logged in until they click the logout button
- Authentication status is stored in localStorage
- The password protection wraps the entire application

## Default Password
The default password is: `HUVTSP2025`

## Features
- **Secure Login**: Password field with show/hide toggle
- **Session Persistence**: Users stay logged in across browser sessions
- **Logout Functionality**: Users can logout using the button in the top-right corner
- **Error Handling**: Clear error messages for incorrect passwords
- **Responsive Design**: Works on all device sizes

## Security Notes
- This is a frontend-only implementation for demonstration purposes
- In production, password validation should be handled server-side
- Consider implementing additional security measures like:
  - Rate limiting
  - Server-side session management
  - HTTPS enforcement
  - Two-factor authentication

## Customization
To change the password, edit the `correctPassword` variable in `frontend/app/components/PasswordProtection.tsx`.

## Pages Protected
- Home page (`/`)
- Smart Search (`/smart-search`)
- Filter Search (`/filter-search`)
- Analytics (`/analytics`)
- All other pages in the application 