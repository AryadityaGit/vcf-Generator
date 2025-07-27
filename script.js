document.addEventListener('DOMContentLoaded', () => {
    const vcardForm = document.getElementById('vcard-form');
    const generateBtn = document.getElementById('generate-btn');
    const resultContainer = document.getElementById('result-container');

    vcardForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Stop the form from submitting normally

        const photoFile = document.getElementById('photo').files[0];

        if (photoFile) {
            // If a photo is selected, we need to read it first
            const reader = new FileReader();
            reader.readAsDataURL(photoFile);
            reader.onload = () => {
                const base64Photo = reader.result;
                generateAndDownloadVCard(base64Photo);
            };
            reader.onerror = (error) => {
                console.error('Error reading file:', error);
                alert('Could not read the photo file. Please try another one.');
            };
        } else {
            // If no photo is selected, proceed without one
            generateAndDownloadVCard(null);
        }
    });

    function generateAndDownloadVCard(base64Photo) {
        // 1. Get data from form fields
        const fullName = document.getElementById('fullName').value;
        const company = document.getElementById('company').value;
        const title = document.getElementById('title').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const website = document.getElementById('website').value;

        // 2. Build the V-Card string
        let vCard = `BEGIN:VCARD\n`;
        vCard += `VERSION:3.0\n`;
        vCard += `FN:${fullName}\n`;
        vCard += `ORG:${company}\n`;
        vCard += `TITLE:${title}\n`;
        vCard += `TEL;TYPE=WORK,VOICE:${phone}\n`;
        vCard += `EMAIL:${email}\n`;
        vCard += `URL:${website}\n`;

        if (base64Photo) {
            // Add the photo data if it exists
            // We need to extract just the Base64 content from the data URL
            const base64Marker = 'base64,';
            const base64Data = base64Photo.substring(base64Photo.indexOf(base64Marker) + base64Marker.length);
            const photoType = photoFile.type.includes('png') ? 'PNG' : 'JPEG';
            
            vCard += `PHOTO;ENCODING=b;TYPE=${photoType}:${base64Data}\n`;
        }

        vCard += `END:VCARD`;

        // 3. Create a downloadable file in the browser
        const blob = new Blob([vCard], { type: 'text/vcard;charset=utf-8' });
        const downloadUrl = URL.createObjectURL(blob);

        // 4. Create a hidden link to trigger the download
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'contact.vcf'; // The filename for the download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl); // Clean up the temporary URL

        // 5. Show a success message
        resultContainer.classList.remove('hidden');
    }
});
