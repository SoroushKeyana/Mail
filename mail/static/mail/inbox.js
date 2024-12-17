document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => loadMailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => loadMailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => loadMailbox('archive'));
  document.querySelector('#compose').addEventListener('click', () => {composeEmail()});

  // Add submit event listener to the compose form.
  document.querySelector('#compose-form').addEventListener('submit', submitEmail)

  // By default, load the inbox
  loadMailbox('inbox');
});

function composeEmail(recipients = '', subject = '', body = '') {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-content-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = recipients;
  document.querySelector('#compose-subject').value = subject;
  document.querySelector('#compose-body').value = body;
}

function viewEmail(emailId) {

  // Display email's content view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-content-view').style.display = 'block';

  fetch(`/emails/${emailId}`)
  .then(response => response.json())
  .then(email => {
    
    if (!email.read) {
        fetch(`/emails/${emailId}`, {
          method: 'PUT',
          body: JSON.stringify({
            read: true
          })
        });
      }

    const emailContent = document.querySelector('#email-content-view');
    emailContent.innerHTML = '';

    let emailDiv = document.createElement('div');
    emailDiv.classList.add('card', 'mb-3', 'shadow-sm', 'border-0');

      // Add content of the email
      emailDiv.innerHTML = `
        <div class="card-header bg-dark text-white">
          <h5 class="mb-0">${email.subject}</h5>
        </div>
        <div class="card-body">
          <div class="d-flex justify-content-between">
            <div>
              <p class="mb-2"><strong>From:</strong> ${email.sender}</p>
              <p class="mb-2"><strong>To:</strong> ${email.recipients}</p>
              <p class="mb-3 text-muted"><strong>Time:</strong> ${email.timestamp}</p>
            </div>
            <div class="button-container"></div>
          </div>
          <hr>
          <p class="email-body" style="white-space: pre-wrap;">${email.body}</p>
        </div>
      `;
    emailContent.append(emailDiv);

    // create button container
    const buttonContainer = document.querySelector('.button-container');

    // Reply to email
    const replyBtn = document.createElement('button');
    replyBtn.innerHTML = `<i class="fa-solid fa-reply"></i> Reply`;
    replyBtn.classList.add('btn','btn-sm', 'btn-outline-secondary', 'm-1');
    replyBtn.addEventListener('click', () => {
    const subject = email.subject.startsWith("Re:") ? email.subject : `Re: ${email.subject}`;
    composeEmail(email.sender, subject, `On ${email.timestamp}, ${email.sender} wrote:\n\n${email.body}\n _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _\n\n\n\n\n`);});
    buttonContainer.append(replyBtn);
    
    // Add Archive/Unarchive button
    const currentMailbox = document.querySelector('#mailbox-name').textContent.split(' ')[0].toLowerCase();
    console.log(currentMailbox);
    if (currentMailbox != 'sent') {
      const archiveBtn = document.createElement('button');
      archiveBtn.innerHTML = email.archived ? `<i class="fa-solid fa-box-open"></i> Unarchive` : `<i class="fa-solid fa-box-archive"></i> Archive`;
      archiveBtn.classList.add('btn', 'btn-sm', 'm-1', email.archived ? 'btn-success' : 'btn-warning');

      // Toggle archive status on click
      archiveBtn.addEventListener('click', () => {
        fetch(`/emails/${emailId}`, {
          method: 'PUT',
          body: JSON.stringify({
            archived: !email.archived
          })
        })
        .then(() => {

          loadMailbox(currentMailbox);
        });
      });

      buttonContainer.append(archiveBtn);
    }
  
});
}

function loadMailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-content-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3 id='mailbox-name'>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Fetch emails from API
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    const emailsView = document.querySelector('#emails-view');

    if (emails.length === 0) {
    const noEmailsMessage = document.createElement('div');
    noEmailsMessage.innerHTML = `Looks like there’s nothing here! <i class="fa-solid fa-box-open"></i>`;
    noEmailsMessage.className = 'text-muted text-center mt-4 h3';
    emailsView.append(noEmailsMessage);
    return;
}
    // Show list of emails
    emails.forEach(email => {
      // Create a container for each email
      let emailDiv = document.createElement('div');
      emailDiv.classList.add('list-group-item','rounded-0');

      const currentMailbox = document.querySelector('#mailbox-name').textContent.split(' ')[0].toLowerCase();
      const recipientOrSender = currentMailbox !== 'sent' ? email.sender : email.recipients;

      // Populate the email's content
      emailDiv.innerHTML = `
        <div class="email-recepient"><strong>${recipientOrSender}</strong></div>
        <div class="email-subject">${email.subject}</div>
        <div class="email-timestamp">${formatTimestamp(email.timestamp)}</div>
      `;

      if (email.read) {
        emailDiv.classList.add('bg-light-gray');
      }else{
        emailDiv.classList.add('unread')
      }

      emailDiv.addEventListener('click', () => {
        viewEmail(email.id);
      });

      emailsView.append(emailDiv);
    });
  });

}

function submitEmail(event) {
  event.preventDefault();

  // Get and store values from the form
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  fetch('/emails', {
  method: 'POST',
  body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body
    })
  })
  .then(response => response.json())
  .then(result => {

    if (result.error) {
      // Display error alert
      const alertDiv = document.createElement('div');
      alertDiv.className = 'alert alert-danger alert-dismissible fade show';
      alertDiv.role = 'alert';
      alertDiv.innerHTML = `
        Error: ${result.error}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      `;
      const composeView = document.querySelector('#compose-view');
      composeView.insertBefore(alertDiv, composeView.firstChild);

      setTimeout(() => {
      alertDiv.classList.remove('show');
      alertDiv.addEventListener('transitionend', () => alertDiv.remove());
    }, 5000);
    } else {
        loadMailbox('sent');
    }
});
} 

function formatTimestamp(timestamp) {
  const emailDate = new Date(timestamp);
  const currentDate = new Date();

  const diffTime = currentDate - emailDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Format time as "HH:MM AM/PM" or system's locale format
  const timeOptions = { hour: 'numeric', minute: 'numeric' };
  const formattedTime = emailDate.toLocaleTimeString(undefined, timeOptions);

  if (diffDays === 0) {
    return `Today at ${formattedTime}`;
  } else if (diffDays === 1) {
    return `Yesterday at ${formattedTime}`;
  } else {
    // Format the date as "Month Day, Year at HH:MM AM/PM"
    const dateOptions = { month: "short", day: "numeric", year: "numeric" };
    const formattedDate = emailDate.toLocaleDateString(undefined, dateOptions);
    return `${formattedDate} at ${formattedTime}`;
  }
}

