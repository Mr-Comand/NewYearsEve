function updateCountdown() {
    // Set the date for the next New Year
    const nextNewYear = new Date(new Date().getFullYear() + 1, 0, 1);
  
    // Calculate the time remaining
    const now = new Date();
    const timeRemaining = nextNewYear - now;
  
    // Calculate days, hours, minutes, and seconds
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
  
    // Build the countdown string
    let countdownString = `<p>`;
    if (days > 0) countdownString += `${days} Tag${days !== 1 ? 'e' : ''} `;
    if (hours > 0) countdownString += `${hours} Stunde${hours !== 1 ? 'n' : ''} `;
    if (minutes > 0) countdownString += `${minutes} Minute${minutes !== 1 ? 'n' : ''} `;
    countdownString += `${seconds} Sekunde${seconds !== 1 ? 'n' : ''}</p>`;
  
    // Update the content of the div with the countdown
    document.getElementById('countdown').innerHTML = countdownString;
  }
  
  // Update the countdown every second
  setInterval(updateCountdown, 1000);
  
  // Initial call to set the initial countdown values
  updateCountdown();