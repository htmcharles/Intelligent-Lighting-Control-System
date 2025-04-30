// Display current time with smooth updates and glow effect
function updateCurrentTime() {
    const currentTimeElement = document.getElementById('currentTime');
    if (currentTimeElement) {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        const dateString = now.toLocaleDateString([], {
            weekday: 'long',
            month: 'short',
            day: 'numeric'
        });

        // Add fade and glow animation
        const timeSpan = currentTimeElement.querySelector('.time');
        const dateSpan = currentTimeElement.querySelector('.date');

        timeSpan.style.opacity = '0';
        timeSpan.style.textShadow = 'none';
        dateSpan.style.opacity = '0';

        setTimeout(() => {
            timeSpan.textContent = timeString;
            dateSpan.textContent = dateString;

            timeSpan.style.opacity = '1';
            timeSpan.style.textShadow = '0 0 10px rgba(139, 92, 246, 0.3)';
            dateSpan.style.opacity = '1';
        }, 200);
    }
}

// Update time every second
setInterval(updateCurrentTime, 1000);
updateCurrentTime();

// Form submission handling with enhanced animations
document.getElementById('schedulerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const onTime = document.getElementById('onTime').value;
    const offTime = document.getElementById('offTime').value;
    const statusDiv = document.getElementById('status');
    const submitButton = document.querySelector('.btn-save');

    // Disable button and show loading state with glow effect
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    submitButton.style.boxShadow = '0 0 20px rgba(139, 92, 246, 0.5)';
    statusDiv.className = 'status-message';
    statusDiv.style.opacity = '0';

    try {
        const ws = new WebSocket('ws://localhost:8765');

        ws.onopen = () => {
            ws.send(JSON.stringify({ onTime, offTime }));
        };

        ws.onmessage = (event) => {
            const response = JSON.parse(event.data);

            // Add success/error icon with glow effect
            const icon = response.success ?
                '<i class="fas fa-check-circle"></i>' :
                '<i class="fas fa-exclamation-circle"></i>';

            statusDiv.innerHTML = `${icon} ${response.message}`;
            statusDiv.className = `status-message ${response.success ? 'status-success' : 'status-error'}`;

            // Fade in status message with glow effect
            setTimeout(() => {
                statusDiv.style.opacity = '1';
                if (response.success) {
                    statusDiv.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.2)';
                } else {
                    statusDiv.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.2)';
                }
            }, 100);

            // Reset button state
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-save"></i> Save Schedule';
            submitButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';

            ws.close();
        };

        ws.onerror = () => {
            statusDiv.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Connection error. Please try again.';
            statusDiv.className = 'status-message status-error';
            statusDiv.style.opacity = '1';
            statusDiv.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.2)';

            // Reset button state
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-save"></i> Save Schedule';
            submitButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        };
    } catch (error) {
        statusDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Error: ${error.message}`;
        statusDiv.className = 'status-message status-error';
        statusDiv.style.opacity = '1';
        statusDiv.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.2)';

        // Reset button state
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-save"></i> Save Schedule';
        submitButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }
});

// Add input field focus effects with glow
document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('focus', () => {
        const parent = input.parentElement.parentElement;
        parent.style.transform = 'translateX(5px)';
        parent.style.boxShadow = '0 0 20px rgba(139, 92, 246, 0.3)';
        parent.style.borderColor = 'rgba(139, 92, 246, 0.3)';
    });

    input.addEventListener('blur', () => {
        const parent = input.parentElement.parentElement;
        parent.style.transform = 'translateX(0)';
        parent.style.boxShadow = 'none';
        parent.style.borderColor = 'rgba(139, 92, 246, 0.1)';
    });
});
