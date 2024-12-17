# Mail

## Project Description

The Mail project is a web-based email client built with Django and JavaScript. It provides an interactive, single-page application (SPA) where users can manage their emails, including sending, reading, archiving, and replying to messages. The application uses an API built with Django to handle email operations such as fetching, sending, and updating emails in a mailbox. This project also features dynamic views, so users can interact with their emails without having to reload the page.


## Features

### 1. **Inbox Management**
   - View and navigate emails within your inbox, sent, and archived folders.
   - Emails are displayed with important details like sender, subject, and timestamp.
   - Unread emails are visually distinguished with a white background, while read emails are highlighted in gray.
   - Use JavaScript to manage dynamic views and navigation across different mailboxes without reloading the page.

### 2. **Email Composition**
   - Compose and send new emails to registered users.
   - Fill in recipients, subject, and body fields with custom input.
   - Upon successful sending, users are redirected to their "Sent" mailbox.
   - JavaScript is used to handle form submissions via the API and handle POST requests.

### 3. **View Email Details**
   - Click on any email to open its detailed view.
   - Displays the full content of the email, including sender, recipients, subject, body, and timestamp.
   - Emails marked as read are updated upon viewing.
   - A “Reply” button allows users to reply to emails directly from the view.

### 4. **Archiving and Unarchiving**
   - Emails in the inbox can be archived or unarchived.
   - Archiving removes the email from the inbox and adds it to the archive folder.
   - The status of archived emails is visually indicated.
   - This functionality is handled via the API with PUT requests to update email status.

### 5. **Reply to Emails**
   - Reply to emails directly from the email view.
   - Automatically pre-fill the composition form with the recipient, subject (prefixed with "Re:"), and the original message.
   - Users can send the reply with a single action.

### 6. **Single-Page Application**
   - The entire email interface operates as a single-page app (SPA), where JavaScript handles all routing and view management.
   - No full-page reloads occur when switching between mailboxes or composing emails.
   - The app dynamically updates content by using JavaScript functions and DOM manipulation.

### 7. **RESTful API Integration**
   - Uses Django's API to fetch, send, and modify emails.
   - API supports endpoints for loading emails by mailbox (`GET /emails/<mailbox>`), viewing single email details (`GET /emails/<email_id>`), sending emails (`POST /emails`), and updating email statuses (read, archived) via PUT requests.
   - JavaScript fetch API is utilized to handle all server requests for email operations.

### 8. **Authentication**
   - Users can register and log in to use the email client.
   - Each user's emails are securely stored and only accessible to them.
   - All interactions with the email client are bound to the authenticated user’s account.


## Technologies Used

- **Frontend:** HTML, CSS, Bootstrap, JavaScript, Fetch API
- **Backend:** Django, Python, SQLite

## Getting Started

### Prerequisites

Create a virtual environment

```bash
python3 -m venv venv
```
Activate the virtual environment:

- On macOS/Linux:

```bash
source venv/bin/activate
```

- On Windows:

```bash
venv\Scripts\activate
```

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/SoroushKeyana/Mail.git
   ```

2. Go to Mail directory:

  ```bash
  cd Mail
  ```

3. Install the dependencies:


    ```bash
    pip install -r requirements.txt
    ```

4. Create .env file: Create a file named .env in the same directory and add the following line to it. Remember to add your secret key to it.

    ```bash
    SECRET_KEY='your-generated-secret-key-here'
    ```

5. Run database migrations:

    ```bash 
    python manage.py makemigrations mail
    ```

    ```bash
    python manage.py migrate
    ```

## Running the Application
    
    python manage.py runserver

Visit http://127.0.0.1:8000/ in your browser to see the application running locally.
