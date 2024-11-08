require('dotenv').config();

(function() {

    async function authorizeUri() {
        // Generate the authUri
        const jsonBody = {
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            environment: process.env.ENVIRONMENT,
            redirectUri: process.env.REDIRECT_URL,
        };

        try {
            const response = await fetch(`/authUri?json=${encodeURIComponent(JSON.stringify(jsonBody))}`);
            const authUri = await response.text();
            console.log('The Auth Uri is: ' + authUri);

            // Launch Popup using the JS window Object
            const parameters = `location=1,width=800,height=650,left=${(screen.width - 800) / 2},top=${(screen.height - 650) / 2}`;
            const win = window.open(authUri, 'connectPopup', parameters);
            
            const pollOAuth = setInterval(() => {
                try {
                    if (win.document.URL.indexOf("code") !== -1) {
                        clearInterval(pollOAuth);
                        win.close();
                        location.reload();
                    }
                } catch (e) {
                    console.log(e);
                }
            }, 100);
        } catch (error) {
            console.error('Error fetching auth URI:', error);
        }
    }

    async function retrieveToken() {
        try {
            const response = await fetch('/retrieveToken');
            const token = await response.text();
            document.getElementById('accessToken').innerText = token || 'Please authorize using Connect to Quickbooks first!';
        } catch (error) {
            console.error('Error retrieving token:', error);
        }
    }

    async function refreshToken() {
        try {
            const response = await fetch('/refreshAccessToken');
            const token = await response.text();
            document.getElementById('accessToken').innerText = token || 'Please authorize using Connect to Quickbooks first!';
        } catch (error) {
            console.error('Error refreshing token:', error);
        }
    }

    async function makeAPICall() {
        try {
            const response = await fetch('/getCompanyInfo');
            const data = await response.json();
            document.getElementById('apiCall').innerText = JSON.stringify(data, null, 4);
        } catch (error) {
            console.error('Error making API call:', error);
        }
    }

    document.getElementById('authorizeUri').addEventListener('click', function(e) {
        e.preventDefault();
        authorizeUri();
    });

    document.getElementById('retrieveToken').addEventListener('click', function(e) {
        e.preventDefault();
        retrieveToken();
    });

    document.getElementById('refreshToken').addEventListener('click', function(e) {
        e.preventDefault();
        refreshToken();
    });

    document.getElementById('makeAPICall').addEventListener('click', function(e) {
        e.preventDefault();
        makeAPICall();
    });

})();
