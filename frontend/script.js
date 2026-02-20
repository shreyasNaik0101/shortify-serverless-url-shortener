const button = document.getElementById("shortenBtn");

button.addEventListener("click", async () => {

    const url = document.getElementById("longUrl").value;
    const resultDiv = document.getElementById("result");

    if (!url) {
        resultDiv.innerHTML = "Please enter a valid URL.";
        return;
    }

    resultDiv.innerHTML = "Generating short link...";

    try {

        const response = await fetch("https://4mi6u0plhe.execute-api.us-east-1.amazonaws.com/prod/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ url })
        });

        const data = await response.json();

        const shortLink =
            "https://4mi6u0plhe.execute-api.us-east-1.amazonaws.com/prod/" + data.shortId;

        resultDiv.innerHTML = `
            <div>
                Short URL:<br>
                <a href="${shortLink}" target="_blank">${shortLink}</a>
            </div>
        `;

    } catch (error) {
        resultDiv.innerHTML = "Something went wrong. Please try again.";
    }

});
