const CLIENT_ID = '818989348789-ip1rskj4ghvpq522i2rdo18oeo0apdpr.apps.googleusercontent.com';
const API_KEY = 'AIzaSyAR_bx2Jqj9lwwIw1yeHZ2XemnObWKzXF0';
const SCOPES = 'https://www.googleapis.com/auth/drive.file';


let authButton = document.getElementById('authorize');
let uploadButton = document.getElementById('upload');
let fileInput = document.getElementById('fileInput');

authButton.onclick = () => {
    gapi.load('client:auth2', initClient);
};

function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        scope: SCOPES,
    }).then(() => {
        gapi.auth2.getAuthInstance().signIn().then(() => {
            uploadButton.disabled = false;
            alert('Authorized successfully!');
        });
    }).catch(err => {
        console.error('Error during Google API initialization:', err);
        alert('Authorization failed. Check the console for errors.');
    });
}

uploadButton.onclick = () => {
    const file = fileInput.files[0];
    if (!file) {
        alert('Please select a file first.');
        return;
    }

    const metadata = {
        name: file.name,
        mimeType: file.type,
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);

    fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token}`,
        },
        body: form,
    })
        .then(response => response.json())
        .then(data => {
            alert(`File uploaded! File ID: ${data.id}`);
        })
        .catch(error => {
            console.error('Error uploading the file:', error);
            alert('File upload failed. Check the console for details.');
        });
};
